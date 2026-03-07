'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

type Shape = 'flat' | 'concave' | 'convex' | 'pressed';

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return [r, g, b];
}

function adjustBrightness(r: number, g: number, b: number, factor: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return `rgb(${clamp(r*factor)}, ${clamp(g*factor)}, ${clamp(b*factor)})`;
}

export default function NeumorphismClient() {
  const [bgColor, setBgColor] = useState('#e0e5ec');
  const [size, setSize] = useState(200);
  const [radius, setRadius] = useState(40);
  const [distance, setDistance] = useState(20);
  const [blur, setBlur] = useState(40);
  const [intensity, setIntensity] = useState(0.15);
  const [shape, setShape] = useState<Shape>('flat');
  const [darkMode, setDarkMode] = useState(false);

  const currentBg = darkMode ? '#1a1a1a' : bgColor;

  const result = useMemo(() => {
    const [r, g, b] = hexToRgb(currentBg);
    const lightFactor = 1 + intensity;
    const darkFactor  = 1 - intensity;
    const lightColor = adjustBrightness(r, g, b, lightFactor);
    const darkColor  = adjustBrightness(r, g, b, darkFactor);

    let boxShadow: string;
    let gradientCSS = '';

    if (shape === 'pressed') {
      boxShadow = `inset ${distance}px ${distance}px ${blur}px ${darkColor}, inset -${distance}px -${distance}px ${blur}px ${lightColor}`;
    } else {
      boxShadow = `${distance}px ${distance}px ${blur}px ${darkColor}, -${distance}px -${distance}px ${blur}px ${lightColor}`;
    }

    if (shape === 'concave') {
      gradientCSS = `background: linear-gradient(145deg, ${darkColor}, ${lightColor});`;
    } else if (shape === 'convex') {
      gradientCSS = `background: linear-gradient(145deg, ${lightColor}, ${darkColor});`;
    } else {
      gradientCSS = `background: ${currentBg};`;
    }

    const radiusPx = `${radius}px`;
    const css = `.neumorphic-card {
  width: ${size}px;
  height: ${size}px;
  border-radius: ${radiusPx};
  ${gradientCSS}
  box-shadow: ${boxShadow};
}`;

    return { css, lightColor, darkColor, gradientCSS, boxShadow, radiusPx };
  }, [currentBg, size, radius, distance, blur, intensity, shape]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
            <Card title="Surface Config">
                <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg border border-white/10" style={{ background: currentBg }} />
                            <span className="text-sm font-bold text-white/70">Base Color</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase text-white/20">Dark Mode</span>
                            <Switch checked={darkMode} onChange={setDarkMode} />
                        </div>
                    </div>

                    {!darkMode && (
                        <div className="flex gap-2">
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-full h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer p-1" />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Shape</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['flat','concave','convex','pressed'] as Shape[]).map(s => (
                                <button key={s} onClick={() => setShape(s)} className={`py-2 px-4 rounded-xl text-xs font-bold border transition-all capitalize ${shape === s ? 'bg-accent border-accent text-white shadow-lg' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white'}`}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Physical Attributes">
                <div className="space-y-6">
                    <Slider label="Intensity" min={0.05} max={0.6} step={0.01} value={intensity} onChange={setIntensity} unit="" />
                    <Slider label="Distance" min={1} max={50} value={distance} onChange={setDistance} unit="px" />
                    <Slider label="Blur" min={1} max={100} value={blur} onChange={setBlur} unit="px" />
                    <Slider label="Radius" min={0} max={100} value={radius} onChange={setRadius} unit="px" />
                </div>
            </Card>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Live Rendering</h3>
            <div className="relative aspect-square rounded-3xl border border-white/10 flex items-center justify-center p-12 transition-colors duration-500 shadow-2xl overflow-hidden" style={{ background: currentBg }}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                <div className="transition-all duration-300 flex items-center justify-center text-[10px] font-black uppercase text-white/10 tracking-[0.2em]" 
                    style={{
                        width: size,
                        height: size,
                        borderRadius: result.radiusPx,
                        boxShadow: result.boxShadow,
                        background: (shape === 'concave' || shape === 'convex') ? result.gradientCSS.match(/linear-gradient\(.+?\)/)?.[0] : currentBg
                    }}
                >
                    {shape}
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
