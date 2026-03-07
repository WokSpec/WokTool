'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';

const WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
const WEIGHT_NAMES: Record<number, string> = {
  100: 'Thin',
  200: 'ExtraLight',
  300: 'Light',
  400: 'Regular',
  500: 'Medium',
  600: 'SemiBold',
  700: 'Bold',
  800: 'ExtraBold',
  900: 'Black',
};

export default function FontWeightTool() {
  const [fontName, setFontName] = useState('Inter');
  const [inputFont, setInputFont] = useState('Inter');
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog');
  const [fontSize, setFontSize] = useState(32);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const loadFont = (name: string) => {
    if (!name.trim()) return;
    const weights = WEIGHTS.join(';');
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:wght@${weights}&display=swap`;
    const existing = document.getElementById('font-wt-link');
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = 'font-wt-link';
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => setLoaded(true);
    document.head.appendChild(link);
    setFontName(name);
    setLoaded(false);
    setTimeout(() => setLoaded(true), 1000);
  };

  useEffect(() => {
    loadFont('Inter');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyDecl = (weight: number) => {
    const css = `font-family: '${fontName}', sans-serif;\nfont-weight: ${weight};`;
    navigator.clipboard.writeText(css);
    setCopied(weight);
    setTimeout(() => setCopied(null), 2000);
  };

  const importUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@${WEIGHTS.join(';')}&display=swap`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
            <Card title="Font Selection">
                <div className="space-y-6">
                    <div className="flex gap-2">
                        <Input 
                            value={inputFont} 
                            onChange={e => setInputFont(e.target.value)} 
                            onKeyDown={e => e.key === 'Enter' && loadFont(inputFont)}
                            placeholder="Google Font Name" 
                        />
                        <Button onClick={() => loadFont(inputFont)}>Load</Button>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <Input 
                            label="Sample Text"
                            value={sampleText}
                            onChange={e => setSampleText(e.target.value)}
                        />
                        <Slider 
                            label="Preview Size"
                            min={12} max={96}
                            value={fontSize}
                            onChange={setFontSize}
                            unit="px"
                        />
                    </div>
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest">Import URL</h4>
                <code className="block text-[10px] font-mono text-accent bg-black/20 p-3 rounded-lg break-all border border-white/5">
                    @import url('{importUrl}');
                </code>
                <Button variant="secondary" size="sm" className="w-full" onClick={() => navigator.clipboard.writeText(`@import url('${importUrl}');`)}>
                    Copy Import
                </Button>
            </div>
        </div>

        {/* Right: Preview List */}
        <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Weight Spectrum</h3>
            {!loaded ? (
                <div className="py-20 text-center text-white/20 animate-pulse">Loading font assets...</div>
            ) : (
                <div className="grid gap-3">
                    {WEIGHTS.map(w => (
                        <div key={w} className="group flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-6 overflow-hidden">
                                <div className="w-20 shrink-0">
                                    <div className="text-lg font-black text-white">{w}</div>
                                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{WEIGHT_NAMES[w]}</div>
                                </div>
                                <div 
                                    className="truncate text-white transition-all"
                                    style={{ fontFamily: `'${fontName}', sans-serif`, fontWeight: w, fontSize: fontSize }}
                                >
                                    {sampleText}
                                </div>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => copyDecl(w)}
                                className={`opacity-0 group-hover:opacity-100 transition-opacity ${copied === w ? 'text-success' : ''}`}
                            >
                                {copied === w ? 'Copied' : 'Copy CSS'}
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
