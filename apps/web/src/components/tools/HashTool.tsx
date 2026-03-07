'use client';

import { useState, useRef, useCallback } from 'react';
import Tabs from '@/components/ui/Tabs';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Input from '@/components/ui/Input';

type HashAlgo = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';
const ALGOS: HashAlgo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function computeHash(algo: HashAlgo, data: string | File): Promise<string> {
  let buf: ArrayBuffer;
  if (typeof data === 'string') {
    buf = new TextEncoder().encode(data);
  } else {
    buf = await data.arrayBuffer();
  }
  const hash = await crypto.subtle.digest(algo, buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function HashTool() {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [inputText, setInputText] = useState('');
  const [results, setResult] = useState<Partial<Record<HashAlgo, string>>>({});
  const [loading, setLoading] = useState(false);
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyAlgo, setVerifyAlgo] = useState<HashAlgo>('SHA-256');
  const [filename, setFilename] = useState('');

  const generateHashes = useCallback(async (data: string | File) => {
    setLoading(true);
    const out: Partial<Record<HashAlgo, string>> = {};
    for (const a of ALGOS) {
      try {
        out[a] = await computeHash(a, data);
      } catch (e) {
        out[a] = 'Error computing hash';
      }
    }
    setResult(out);
    setLoading(false);
  }, []);

  const handleFile = (file: File) => {
    setFilename(file.name);
    generateHashes(file);
  };

  const handleTextRun = () => {
    if (!inputText.trim()) return;
    generateHashes(inputText);
  };

  const verifyStatus = verifyHash && results[verifyAlgo]
    ? results[verifyAlgo]?.toLowerCase() === verifyHash.toLowerCase().trim()
      ? 'match'
      : 'mismatch'
    : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={mode}
            onChange={id => { setMode(id as any); setResult({}); setFilename(''); }}
            tabs={[
                { id: 'text', label: 'Text Hash', icon: '✍️' },
                { id: 'file', label: 'File Checksum', icon: '📄' },
            ]}
            className="w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            {mode === 'text' ? (
                <Card title="Input Text">
                    <div className="space-y-4">
                        <Textarea 
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            placeholder="Enter text to generate cryptographic hashes..."
                            className="min-h-[200px] font-mono text-sm"
                        />
                        <Button onClick={handleTextRun} className="w-full" size="lg" loading={loading} disabled={!inputText.trim()}>
                            Generate Hashes
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card title="Upload File">
                    <Dropzone 
                        onFileSelect={handleFile}
                        loading={loading}
                        label={filename || "Drop file to checksum"}
                        description="Processing happens entirely in your browser"
                        className="h-64"
                    />
                </Card>
            )}

            {Object.keys(results).length > 0 && (
                <Card title="Verification" description="Compare a known hash with the generated results.">
                    <div className="space-y-4">
                        <div className="flex gap-2 p-1 bg-surface-raised rounded-lg border border-white/5">
                            {ALGOS.map(a => (
                                <button
                                    key={a}
                                    onClick={() => setVerifyAlgo(a)}
                                    className={`flex-1 py-1 text-[10px] font-bold rounded-md transition-all ${
                                        verifyAlgo === a ? 'bg-accent text-white shadow-sm' : 'text-white/30 hover:text-white/60'
                                    }`}
                                >
                                    {a.split('-')[1] || a}
                                </button>
                            ))}
                        </div>
                        <Input 
                            value={verifyHash}
                            onChange={e => setVerifyHash(e.target.value)}
                            placeholder={`Paste ${verifyAlgo} hash to compare...`}
                            className="font-mono text-xs"
                            error={verifyStatus === 'mismatch' ? 'Hashes do not match' : ''}
                        />
                        {verifyStatus === 'match' && (
                            <div className="p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                Verified! The hashes match perfectly.
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Hash Results</h3>
            {Object.keys(results).length > 0 ? (
                <div className="grid gap-4 animate-in slide-in-from-right-4 duration-500">
                    {ALGOS.map(a => (
                        <div key={a} className="group relative p-4 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{a}</span>
                                <button 
                                    onClick={() => navigator.clipboard.writeText(results[a] || '')}
                                    className="p-1.5 rounded-lg bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                </button>
                            </div>
                            <code className="text-xs font-bold text-white/80 break-all leading-relaxed font-mono">
                                {results[a]}
                            </code>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <p className="text-sm">Run generator to see results</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
