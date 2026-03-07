'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';

function hexToRgb(hex: string): [number,number,number] | null {
  const clean = hex.replace('#','');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const m = full.match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return [parseInt(m[1],16), parseInt(m[2],16), parseInt(m[3],16)];
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('').toLowerCase();
}

function rgbToHsl(r: number, g: number, b: number): [number,number,number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
}

function hslToRgb(h: number, s: number, l: number): [number,number,number] {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1-l);
  const f = (n: number) => {
    const k = (n + h/30) % 12;
    return l - a * Math.max(Math.min(k-3,9-k,1),-1);
  };
  return [Math.round(f(0)*255), Math.round(f(8)*255), Math.round(f(4)*255)];
}

function luminance(r: number, g: number, b: number) {
  const srgb = [r,g,b].map(c => {
    c /= 255;
    return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4);
  });
  return 0.2126*srgb[0] + 0.7152*srgb[1] + 0.0722*srgb[2];
}

function contrast(r1:number,g1:number,b1:number,r2:number,g2:number,b2:number) {
  const l1 = luminance(r1,g1,b1), l2 = luminance(r2,g2,b2);
  return (Math.max(l1,l2) + 0.05) / (Math.min(l1,l2) + 0.05);
}

function harmonies(h: number, s: number, l: number) {
  return {
    complementary: [[(h+180)%360, s, l]],
    triadic:       [[(h+120)%360, s, l],[(h+240)%360, s, l]],
    analogous:     [[(h+30)%360, s, l],[(h-30+360)%360, s, l]],
    tetradic:      [[(h+90)%360, s, l],[(h+180)%360, s, l],[(h+270)%360, s, l]],
  };
}

export default function ColorTool() {
  const [hex, setHex] = useState('#818cf8');
  const [bgHex, setBgHex] = useState('#ffffff');
  const [activeTab, setActiveTab] = useState<'convert' | 'contrast' | 'harmonies'>('convert');

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => rgb ? rgbToHsl(...rgb) : null, [rgb]);
  const bgRgb = useMemo(() => hexToRgb(bgHex), [bgHex]);

  const contrastRatio = useMemo(() => {
    if (!rgb || !bgRgb) return null;
    return contrast(...rgb, ...bgRgb);
  }, [rgb, bgRgb]);

  const harmColors = useMemo(() => {
    if (!hsl) return null;
    const h = harmonies(...hsl);
    return Object.entries(h).map(([key, vals]) => ({
      key,
      colors: (vals as [number,number,number][]).map(([hh,ss,ll]) => {
        const norm = ((hh % 360) + 360) % 360;
        const [r,g,b] = hslToRgb(norm,ss,ll);
        return rgbToHex(r,g,b);
      }),
    }));
  }, [hsl]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as any)}
            tabs={[
                { id: 'convert', label: 'Info & Conversion', icon: 'ℹ️' },
                { id: 'contrast', label: 'Contrast Check', icon: '👁️' },
                { id: 'harmonies', label: 'Color Harmonies', icon: '🎨' },
            ]}
            className="w-full max-w-xl"
        />
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'convert' && rgb && hsl && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
                <Card title="Quick Picker">
                    <div className="space-y-6">
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 rounded-2xl border border-white/10 shadow-2xl shrink-0 transition-transform hover:scale-110" style={{ background: hex }} />
                            <Input value={hex} onChange={e => setHex(e.target.value)} className="font-mono text-lg font-black uppercase" maxLength={7} />
                        </div>
                        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-full h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer p-1" />
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-3">
                    {[
                        { l: 'RGB', v: `rgb(${rgb.join(', ')})` },
                        { l: 'HSL', v: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
                        { l: 'Luminance', v: luminance(...rgb).toFixed(4) },
                    ].map(f => (
                        <div key={f.l} className="group flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 transition-all">
                            <div>
                                <div className="text-[10px] font-black uppercase text-white/20 tracking-widest">{f.l}</div>
                                <code className="text-sm font-bold text-white/80">{f.v}</code>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(f.v)} className="opacity-0 group-hover:opacity-100">Copy</Button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {activeTab === 'contrast' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Foreground">
                        <div className="flex gap-4 items-center mb-4">
                            <div className="w-10 h-10 rounded-xl border border-white/5" style={{ background: hex }} />
                            <Input value={hex} onChange={e => setHex(e.target.value)} className="font-mono" maxLength={7} />
                        </div>
                        <input type="color" value={hex} onChange={e => setHex(e.target.value)} className="w-full h-8 rounded-lg bg-white/5 cursor-pointer border-none" />
                    </Card>
                    <Card title="Background">
                        <div className="flex gap-4 items-center mb-4">
                            <div className="w-10 h-10 rounded-xl border border-white/5" style={{ background: bgHex }} />
                            <Input value={bgHex} onChange={e => setBgHex(e.target.value)} className="font-mono" maxLength={7} />
                        </div>
                        <input type="color" value={bgHex} onChange={e => setBgHex(e.target.value)} className="w-full h-8 rounded-lg bg-white/5 cursor-pointer border-none" />
                    </Card>
                </div>

                {contrastRatio && (
                    <div className="space-y-6">
                        <div 
                            className="h-48 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl transition-all border border-white/10"
                            style={{ background: bgHex, color: hex }}
                        >
                            Aa Preview
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 rounded-3xl bg-surface-raised border border-white/5 shadow-xl">
                            <div className="text-center md:text-left">
                                <div className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">Contrast Ratio</div>
                                <div className="text-5xl font-black text-white font-mono">{contrastRatio.toFixed(2)}</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { l: 'AA Normal', ok: contrastRatio >= 4.5 },
                                    { l: 'AA Large', ok: contrastRatio >= 3.0 },
                                    { l: 'AAA Normal', ok: contrastRatio >= 7.0 },
                                    { l: 'AAA Large', ok: contrastRatio >= 4.5 },
                                ].map(b => (
                                    <div key={b.l} className={`px-4 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest text-center ${b.ok ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'}`}>
                                        {b.ok ? 'Pass' : 'Fail'} {b.l}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'harmonies' && harmColors && (
            <div className="space-y-8 animate-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {harmColors.map(h => (
                        <Card key={h.key} title={h.key.charAt(0).toUpperCase() + h.key.slice(1)}>
                            <div className="flex items-center gap-2 mb-4 h-16">
                                <div className="flex-1 h-full rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer border border-white/10" style={{ background: hex }} onClick={() => navigator.clipboard.writeText(hex)} />
                                {h.colors.map(c => (
                                    <div key={c} className="flex-1 h-full rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer border border-white/10" style={{ background: c }} onClick={() => navigator.clipboard.writeText(c)} />
                                ))}
                            </div>
                            <div className="flex justify-between font-mono text-[10px] font-bold text-white/30 uppercase px-1">
                                <span>{hex}</span>
                                {h.colors.map(c => <span key={c}>{c}</span>)}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
