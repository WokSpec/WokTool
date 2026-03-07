'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';

export default function WebsitePaletteTool() {
  const [input, setInput] = useState('');
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const extract = async () => {
    if (!input.trim()) return;
    setLoading(true); setError(''); setColors([]); setDone(false);
    try {
      const res = await fetch('/api/tools/website-palette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input.trim() }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Failed to extract colors.'); return; }
      setColors(json.colors ?? []);
      setDone(true);
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  const copyAll = () => {
    navigator.clipboard.writeText(colors.join('\n'));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Extract Colors from Website" description="Enter a URL to scan its styles and images for a complete color palette.">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
                placeholder="https://example.com"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && extract()}
                leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>
          <Button onClick={extract} loading={loading} disabled={!input.trim()}>
            {loading ? 'Analyzing...' : 'Extract Palette'}
          </Button>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium animate-in slide-in-from-top-2">
                {error}
            </div>
        )}
      </Card>

      {done && colors.length === 0 && !loading && (
        <div className="h-48 rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 opacity-20">
          <p className="text-sm">No colors could be automatically detected on this site.</p>
        </div>
      )}

      {colors.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-5 bg-accent rounded-full" />
              Detected Palette ({colors.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={copyAll} className="h-7 text-[10px]">Copy All HEX</Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {colors.map((hex) => (
              <ColorSwatch key={hex} color={hex} />
            ))}
          </div>
        </div>
      )}

      {!done && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">01. Scan Styles</div>
                <p className="text-xs text-white/40">We analyze CSS variables and static styles to find the brand identity.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">02. Extract Images</div>
                <p className="text-xs text-white/40">Dominant colors are pulled from logos and key visual assets.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">03. Local Dev</div>
                <p className="text-xs text-white/40">Perfect for reverse-engineering styles or inspiration for your own project.</p>
            </div>
        </div>
      )}
    </div>
  );
}
