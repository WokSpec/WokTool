'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

const BACKGROUNDS = [
  { label: 'Deep Space',  css: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
  { label: 'Sunset Glow', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: 'Ocean Breeze',css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: 'Neon Forest', css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { label: 'Lava Flow',   css: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: 'Aurora',      css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
];

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export default function GlassmorphismClient() {
  const [blur, setBlur] = useState(12);
  const [transparency, setTransparency] = useState(0.1);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [radius, setRadius] = useState(24);
  const [color, setColor] = useState('#ffffff');
  const [bg, setBg] = useState(BACKGROUNDS[0].css);

  const result = useMemo(() => {
    const bgRgba = hexToRgba(color, transparency);
    const borderRgba = hexToRgba(color, borderOpacity);
    const css = `.glass-card {
  background: ${bgRgba};
  backdrop-filter: blur(${blur}px);
  -webkit-backdrop-filter: blur(${blur}px);
  border-radius: ${radius}px;
  border: 1px solid ${borderRgba};
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}`;
    return { css, bgRgba, borderRgba };
  }, [blur, transparency, borderOpacity, radius, color]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
            <Card title="Glass Aesthetics">
                <div className="space-y-6">
                    <Slider label="Blur Intensity" min={0} max={40} step={0.5} value={blur} onChange={setBlur} unit="px" />
                    <Slider label="Fill Opacity" min={0} max={1} step={0.01} value={transparency} onChange={setTransparency} />
                    <Slider label="Border Opacity" min={0} max={1} step={0.01} value={borderOpacity} onChange={setBorderOpacity} />
                    <Slider label="Edge Rounding" min={0} max={64} value={radius} onChange={setRadius} unit="px" />
                    
                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Glass Tint</label>
                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer p-1" />
                    </div>
                </div>
            </Card>

            <Card title="Preview Environment">
                <div className="grid grid-cols-2 gap-2">
                    {BACKGROUNDS.map(b => (
                        <button 
                            key={b.label} 
                            onClick={() => setBg(b.css)}
                            className={`h-12 rounded-xl border transition-all ${bg === b.css ? 'border-white/40 ring-2 ring-white/10' : 'border-white/5 opacity-60 hover:opacity-100'}`}
                            style={{ background: b.css }}
                            title={b.label}
                        />
                    ))}
                </div>
            </Card>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Live Rendering</h3>
            <div className="relative aspect-square rounded-3xl border border-white/10 flex items-center justify-center p-12 transition-all duration-500 shadow-2xl overflow-hidden" style={{ background: bg }}>
                {/* Background Blobs */}
                <div className="absolute top-[10%] left-[10%] w-32 h-32 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-[10%] right-[10%] w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                
                <div 
                    className="w-full max-w-[280px] p-8 shadow-2xl transition-all duration-300 relative z-10"
                    style={{
                        background: result.bgRgba,
                        backdropFilter: `blur(${blur}px)`,
                        WebkitBackdropFilter: `blur(${blur}px)`,
                        borderRadius: `${radius}px`,
                        border: `1px solid ${result.borderRgba}`
                    }}
                >
                    <div className="w-12 h-12 rounded-full bg-white/20 mb-6" />
                    <div className="h-4 w-3/4 bg-white/30 rounded-full mb-3" />
                    <div className="h-3 w-1/2 bg-white/10 rounded-full" />
                    
                    <div className="mt-8 flex gap-2">
                        <div className="h-8 flex-1 bg-white/10 rounded-lg" />
                        <div className="h-8 flex-1 bg-white/20 rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">CSS Output</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result.css)} className="h-7 text-[10px]">Copy Styles</Button>
                </div>
                <CodeBlock code={result.css} language="css" maxHeight="200px" />
            </div>
        </div>
      </div>
    </div>
  );
}
