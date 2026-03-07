'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface FaviconEntry {
  url: string;
  rel: string;
  sizes?: string;
  type?: string;
}

export default function FaviconExtractorTool() {
  const [input, setInput] = useState('');
  const [favicons, setFavicons] = useState<FaviconEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const extract = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setFavicons([]); setDone(false);
    try {
      const res = await fetch('/api/tools/favicon-extractor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to extract favicons.'); return; }
      setFavicons(json.favicons ?? []);
      setDone(true);
    } catch { setError('Network error. Could not connect to the extraction service.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Extract Domain Icons" description="Pull all available favicon variants, including Apple Touch Icons and Manifest icons, from any URL.">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
                placeholder="https://github.com"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && extract()}
                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>
          <Button onClick={extract} loading={loading} disabled={!input.trim()}>
            {loading ? 'Fetching...' : 'Extract Icons'}
          </Button>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium animate-in slide-in-from-top-2">
                {error}
            </div>
        )}
      </Card>

      {done && favicons.length === 0 && !loading && (
        <div className="h-48 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 opacity-20">
          <p className="text-sm">No icons found. The site might not have standard favicon meta tags.</p>
        </div>
      )}

      {favicons.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 px-1">
            <span className="w-2 h-5 bg-accent rounded-full" />
            Extracted Assets ({favicons.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favicons.map((fav, i) => (
              <Card key={i} className="p-0 overflow-hidden border-white/10 group flex flex-col">
                <div className="p-8 flex-1 bg-[#0a0a0a] flex items-center justify-center border-b border-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fav.url}
                        alt={fav.rel}
                        className="w-12 h-12 object-contain shadow-2xl group-hover:scale-110 transition-transform duration-500"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                </div>
                <div className="p-4 space-y-3">
                    <div className="min-h-[40px]">
                        <div className="text-[10px] font-black text-accent uppercase tracking-tighter mb-0.5">{fav.sizes || 'Auto Size'}</div>
                        <div className="text-[10px] font-medium text-white/40 truncate" title={fav.rel}>{fav.rel}</div>
                    </div>
                    <Button 
                        href={fav.url || ''} 
                        download=""
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                        icon={<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                    >
                        Save Asset
                    </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
