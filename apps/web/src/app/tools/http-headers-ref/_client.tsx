'use client';

import { useState, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type HeaderType = 'Request' | 'Response' | 'Both';
type HeaderCategory = 'Caching' | 'Security' | 'Content' | 'Auth' | 'CORS' | 'Connection' | 'Redirect' | 'Request Info' | 'Response Info' | 'Cookie' | 'Encoding';

interface HttpHeader {
  name: string;
  type: HeaderType;
  category: HeaderCategory;
  description: string;
  example: string;
}

const HEADERS: HttpHeader[] = [
  { name: 'Cache-Control', type: 'Both', category: 'Caching', description: 'Directives for caching mechanisms in both requests and responses. Controls how long a response is cached.', example: 'Cache-Control: max-age=3600, public' },
  { name: 'ETag', type: 'Response', category: 'Caching', description: 'Identifier for a specific version of a resource. Enables cache validation.', example: 'ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"' },
  { name: 'Content-Security-Policy', type: 'Response', category: 'Security', description: 'Controls which resources the browser is allowed to load. Helps prevent XSS attacks.', example: "Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com" },
  { name: 'Strict-Transport-Security', type: 'Response', category: 'Security', description: 'Forces clients to use HTTPS. Browsers should only access the server via HTTPS for the specified max-age period.', example: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' },
  { name: 'X-Frame-Options', type: 'Response', category: 'Security', description: 'Controls if the browser should be allowed to render a page in a frame/iframe. Prevents clickjacking.', example: 'X-Frame-Options: DENY' },
  { name: 'Content-Type', type: 'Both', category: 'Content', description: 'Indicates the media type of the resource, including charset for text types.', example: 'Content-Type: application/json; charset=utf-8' },
  { name: 'Authorization', type: 'Request', category: 'Auth', description: 'Contains the credentials to authenticate a user agent with a server.', example: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  { name: 'Access-Control-Allow-Origin', type: 'Response', category: 'CORS', description: 'Indicates whether the response can be shared with requesting code from the given origin.', example: 'Access-Control-Allow-Origin: https://example.com' },
  { name: 'User-Agent', type: 'Request', category: 'Request Info', description: 'String identifying the client software (browser, bot, etc.).', example: 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  { name: 'Location', type: 'Response', category: 'Redirect', description: 'Indicates the URL to redirect to. Used with 3xx or 201 responses.', example: 'Location: https://example.com/new-page' },
  { name: 'Set-Cookie', type: 'Response', category: 'Cookie', description: 'Sends cookies from the server to the user agent. Supports Secure, HttpOnly, SameSite attributes.', example: 'Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Strict' },
];

const CATEGORIES = ['All', ...Array.from(new Set(HEADERS.map(h => h.category))).sort()];
const TYPES = ['All', 'Request', 'Response', 'Both'];

const TYPE_COLORS: Record<HeaderType, string> = {
  Request: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Response: 'text-success bg-success/10 border-success/20',
  Both: 'text-warning bg-warning/10 border-warning/20',
};

export default function HttpHeadersRefClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return HEADERS.filter(h => {
      const matchT = typeFilter === 'All' || h.type === typeFilter;
      const matchC = categoryFilter === 'All' || h.category === categoryFilter;
      const matchQ = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.description.toLowerCase().includes(search.toLowerCase());
      return matchT && matchC && matchQ;
    });
  }, [search, typeFilter, categoryFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-2">
            <Input 
                placeholder="Search headers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
        </div>
        <Select 
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            options={TYPES.map(t => ({ value: t, label: t }))}
        />
        <Select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
        />
      </div>

      <div className="space-y-3">
        {filtered.map((h) => {
            const isExp = expanded === h.name;
            return (
                <div 
                    key={h.name} 
                    onClick={() => setExpanded(isExp ? null : h.name)}
                    className={`group cursor-pointer rounded-2xl border transition-all duration-200 overflow-hidden ${isExp ? 'bg-accent/5 border-accent/40 shadow-xl' : 'bg-surface-raised border-white/5 hover:border-white/10'}`}
                >
                    <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <code className={`text-sm font-bold transition-colors ${isExp ? 'text-accent' : 'text-white/80'}`}>{h.name}</code>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${TYPE_COLORS[h.type]}`}>{h.type}</span>
                            <span className="text-[10px] font-bold uppercase text-white/20 tracking-widest hidden md:block">{h.category}</span>
                        </div>
                        <div className="flex items-center gap-4 flex-1 justify-end">
                            {!isExp && <p className="text-xs text-white/40 truncate max-w-[300px] hidden lg:block">{h.description}</p>}
                            <svg className={`w-4 h-4 text-white/20 transition-transform ${isExp ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                    
                    {isExp && (
                        <div className="px-5 pb-6 space-y-6 animate-in slide-in-from-top-2">
                            <p className="text-sm text-white/70 leading-relaxed max-w-2xl">{h.description}</p>
                            <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Example Usage</h4>
                                <CodeBlock code={h.example} language="http" />
                            </div>
                            <div className="flex justify-end">
                                <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(h.name); }}>Copy Header Name</Button>
                            </div>
                        </div>
                    )}
                </div>
            );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center opacity-20">
            <div className="text-4xl mb-4">📡</div>
            <p className="text-sm font-medium">No headers match your filters.</p>
        </div>
      )}
    </div>
  );
}
