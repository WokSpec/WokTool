'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface LinkResult {
  url: string;
  status: number | string;
  ok: boolean;
  type: string;
}

export default function LinkCheckerTool() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<LinkResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkLinks = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const res = await fetch('/api/tools/link-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check links');
      setResults(data.links || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const broken = results.filter(r => !r.ok);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Page Link Auditor" description="Crawl a webpage and identify all broken, redirected, or valid links. Useful for SEO and health checks.">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
                placeholder="https://example.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && checkLinks()}
                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
            />
          </div>
          <Button onClick={checkLinks} loading={loading} disabled={!url.trim()}>
            Start Audit
          </Button>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                {error}
            </div>
        )}
      </Card>

      {results.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                    <div className="text-[10px] font-black uppercase text-white/20 mb-1">Total Links</div>
                    <div className="text-2xl font-black text-white">{results.length}</div>
                </Card>
                <Card className="p-4 text-center border-success/20 bg-success/5">
                    <div className="text-[10px] font-black uppercase text-success/40 mb-1">Healthy</div>
                    <div className="text-2xl font-black text-success">{results.length - broken.length}</div>
                </Card>
                <Card className={`p-4 text-center ${broken.length > 0 ? 'border-danger/40 bg-danger/10 animate-pulse' : 'border-white/5 bg-white/[0.01]'}`}>
                    <div className="text-[10px] font-black uppercase text-danger/40 mb-1">Broken</div>
                    <div className={`text-2xl font-black ${broken.length > 0 ? 'text-danger' : 'text-white/20'}`}>{broken.length}</div>
                </Card>
            </div>

            <Card title="Detailed Report" className="p-0 overflow-hidden border-white/10">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.03]">
                                <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Status</th>
                                <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">URL</th>
                                <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Type</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {results.map((r, i) => (
                                <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${r.ok ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <code className="text-xs font-mono text-white/60 truncate max-w-[400px]">{r.url}</code>
                                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-all">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                            </a>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">{r.type}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-20">
            <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl mb-4">✅</div>
            <p className="text-sm font-medium">Results will appear here after analysis</p>
        </div>
      )}
    </div>
  );
}
