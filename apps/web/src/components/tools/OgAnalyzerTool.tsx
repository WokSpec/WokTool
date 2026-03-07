'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface OgData {
  tags: Record<string, string>;
  url: string;
}

export default function OgAnalyzerTool() {
  const [input, setInput] = useState('');
  const [data, setData] = useState<OgData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setLoading(true); setError(''); setData(null);
    try {
      const res = await fetch('/api/tools/og-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to fetch tags.'); return; }
      setData(json);
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const tags = data?.tags ?? {};
  const title = tags['og:title'] || tags['_title'] || '—';
  const desc = tags['og:description'] || tags['twitter:description'] || '';
  const image = tags['og:image'] || tags['twitter:image'] || '';
  const siteName = tags['og:site_name'] || '';

  const ogEntries = Object.entries(tags).filter(([k]) => k.startsWith('og:') || k.startsWith('twitter:') || k === '_title');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Analyze Social Metadata" description="Fetch any URL to inspect its Open Graph, Twitter Cards, and SEO meta tags.">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
                placeholder="https://wokspec.org"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && analyze()}
                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>
          <Button onClick={analyze} loading={loading} disabled={!input.trim()}>
            Inspect URL
          </Button>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                {error}
            </div>
        )}
      </Card>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Preview */}
            <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Social Preview</h3>
                <div className="max-w-md w-full rounded-3xl bg-[#0d0d0d] border border-white/10 overflow-hidden shadow-2xl">
                    <div className="aspect-[1200/630] bg-white/[0.03] flex items-center justify-center relative">
                        {image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={image} alt="OG" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-white/10 text-4xl">🖼️</div>
                        )}
                    </div>
                    <div className="p-6 space-y-2">
                        {siteName && <div className="text-[10px] font-black uppercase text-accent tracking-widest">{siteName}</div>}
                        <h4 className="text-lg font-bold text-white leading-tight">{title}</h4>
                        <p className="text-xs text-white/40 leading-relaxed line-clamp-3">{desc || 'No description provided.'}</p>
                    </div>
                </div>
            </div>

            {/* Tags Table */}
            <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Meta Tags ({ogEntries.length})</h3>
                <Card className="p-0 overflow-hidden border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.03]">
                                    <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Property</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {ogEntries.map(([key, value]) => (
                                    <tr key={key} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="p-4 align-top">
                                            <code className="text-[10px] font-bold text-accent px-1.5 py-0.5 rounded bg-accent/5 border border-accent/10 whitespace-nowrap">{key === '_title' ? 'title' : key}</code>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-xs text-white/60 font-medium break-all">{value}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
      )}

      {!data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Check Previews</div>
                <p className="text-xs text-white/40">Ensure your site looks professional when shared on Discord, Slack, or Twitter.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Inspect Tags</div>
                <p className="text-xs text-white/40">Audit your metadata to find missing descriptions or incorrect image paths.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">SEO Audit</div>
                <p className="text-xs text-white/40">Validate primary title and description tags for optimal search engine performance.</p>
            </div>
        </div>
      )}
    </div>
  );
}
