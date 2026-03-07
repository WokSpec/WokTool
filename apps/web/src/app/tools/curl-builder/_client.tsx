'use client';

import { useState, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Textarea from '@/components/ui/Textarea';
import Switch from '@/components/ui/Switch';

interface Header { id: string; key: string; value: string; }

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const AUTH_MODES = [
    { value: 'none', label: 'No Auth' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
];

function buildCurl(opts: any): string {
  const { url, method, headers, body, auth, bearerToken, basicUser, basicPass, followRedirects, verbose, insecure } = opts;
  const parts: string[] = ['curl'];
  
  if (verbose) parts.push('-v');
  if (insecure) parts.push('-k');
  if (followRedirects) parts.push('-L');
  if (method !== 'GET') parts.push(`-X ${method}`);

  if (auth === 'bearer' && bearerToken) {
    parts.push(`-H "Authorization: Bearer ${bearerToken}"`);
  } else if (auth === 'basic' && (basicUser || basicPass)) {
    parts.push(`-u "${basicUser}:${basicPass}"`);
  }

  headers.forEach((h: Header) => {
    if (h.key.trim()) parts.push(`-H "${h.key.trim()}: ${h.value.trim()}"`);
  });

  if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
    const escaped = body.replace(/"/g, '\\"').replace(/\n/g, '');
    parts.push(`-d "${escaped}"`);
  }

  parts.push(`"${url || 'https://example.com'}"`);
  return parts.join(' \\\n  ');
}

export default function CurlBuilderClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [url, setUrl] = useState('https://api.example.com/v1/resource');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState<Header[]>([{id: '1', key: 'Accept', value: 'application/json'}]);
  const [body, setBody] = useState('{\n  "name": "WokTool",\n  "status": "active"\n}');
  const [auth, setAuth] = useState('none');
  const [bearerToken, setBearerToken] = useState('');
  const [basicUser, setBasicUser] = useState('');
  const [basicPass, setBasicPass] = useState('');
  const [followRedirects, setFollowRedirects] = useState(false);
  const [verbose, setVerbose] = useState(false);
  const [insecure, setInsecure] = useState(false);

  const curlCmd = useMemo(() => buildCurl({
    url, method, headers, body, auth, bearerToken, basicUser, basicPass, followRedirects, verbose, insecure
  }), [url, method, headers, body, auth, bearerToken, basicUser, basicPass, followRedirects, verbose, insecure]);

  const addHeader = () => setHeaders([...headers, { id: crypto.randomUUID(), key: '', value: '' }]);
  const removeHeader = (id: string) => setHeaders(headers.filter(h => h.id !== id));
  const updateHeader = (id: string, k: string, v: string) => setHeaders(headers.map(h => h.id === id ? { ...h, key: k, value: v } : h));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Settings */}
        <div className="space-y-6">
            <Card title="Request Details">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                            <Select 
                                label="Method"
                                value={method}
                                onChange={e => setMethod(e.target.value)}
                                options={METHODS.map(m => ({ value: m, label: m }))}
                            />
                        </div>
                        <div className="md:col-span-3">
                            <Input 
                                label="Endpoint URL"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="https://api.example.com"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <Select 
                            label="Authentication"
                            value={auth}
                            onChange={e => setAuth(e.target.value)}
                            options={AUTH_MODES}
                        />
                        {auth === 'bearer' && (
                            <div className="mt-3 animate-in slide-in-from-top-2">
                                <Input placeholder="Token..." value={bearerToken} onChange={e => setBearerToken(e.target.value)} />
                            </div>
                        )}
                        {auth === 'basic' && (
                            <div className="mt-3 grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
                                <Input placeholder="User" value={basicUser} onChange={e => setBasicUser(e.target.value)} />
                                <Input placeholder="Pass" type="password" value={basicPass} onChange={e => setBasicPass(e.target.value)} />
                            </div>
                        )}
                    </div>
                </div>
            </Card>

            <Card title="Headers">
                <div className="space-y-3">
                    {headers.map((h) => (
                        <div key={h.id} className="flex gap-2 items-center">
                            <Input placeholder="Key" value={h.key} onChange={e => updateHeader(h.id, e.target.value, h.value)} className="flex-1" />
                            <Input placeholder="Value" value={h.value} onChange={e => updateHeader(h.id, h.key, e.target.value)} className="flex-1" />
                            <button onClick={() => removeHeader(h.id)} className="p-2 text-white/20 hover:text-danger transition-colors">✕</button>
                        </div>
                    ))}
                    <Button variant="ghost" size="sm" className="w-full mt-2" onClick={addHeader}>+ Add Header</Button>
                </div>
            </Card>

            {['POST', 'PUT', 'PATCH'].includes(method) && (
                <Card title="Request Body">
                    <Textarea 
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        className="font-mono text-xs min-h-[120px]"
                        spellCheck={false}
                    />
                </Card>
            )}

            <Card title="Advanced Options">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Switch label="Follow Redirects" checked={followRedirects} onChange={setFollowRedirects} />
                    <Switch label="Verbose Output" checked={verbose} onChange={setVerbose} />
                    <Switch label="Insecure (No SSL Check)" checked={insecure} onChange={setInsecure} />
                </div>
            </Card>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated Command</h3>
            <div className="sticky top-8 space-y-6">
                <CodeBlock code={curlCmd} language="bash" maxHeight="400px" />
                <Button variant="primary" size="lg" className="w-full" onClick={() => navigator.clipboard.writeText(curlCmd)}>
                    Copy to Clipboard
                </Button>
                
                <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white/90 mb-1">What is cURL?</h4>
                        <p className="text-xs text-white/40 leading-relaxed">
                            cURL is a command-line tool for transferring data using various network protocols. It is the industry standard for testing APIs and making HTTP requests from the terminal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
