'use client';

import { useState } from 'react';
import Tabs from '@/components/ui/Tabs';
import Slider from '@/components/ui/Slider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

interface Shadow {
  id: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

type ShadowMode = 'box' | 'text';

const createDefaultShadow = (): Shadow => ({
  id: Math.random().toString(36).substring(7),
  offsetX: 8,
  offsetY: 8,
  blur: 16,
  spread: 0,
  color: '#000000',
  opacity: 20,
  inset: false,
});

function hexToRgba(hex: string, opacity: number): string {
  let r = 0, g = 0, b = 0;
  try {
    const cleanHex = hex.replace('#', '');
    r = parseInt(cleanHex.slice(0, 2), 16);
    g = parseInt(cleanHex.slice(2, 4), 16);
    b = parseInt(cleanHex.slice(4, 6), 16);
  } catch (e) {}
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

function shadowToCss(s: Shadow, mode: ShadowMode): string {
  const rgba = hexToRgba(s.color, s.opacity);
  if (mode === 'text') return `${s.offsetX}px ${s.offsetY}px ${s.blur}px ${rgba}`;
  return `${s.inset ? 'inset ' : ''}${s.offsetX}px ${s.offsetY}px ${s.blur}px ${s.spread}px ${rgba}`;
}

export default function ShadowGeneratorTool() {
  const [mode, setMode] = useState<ShadowMode>('box');
  const [shadows, setShadows] = useState<Shadow[]>([createDefaultShadow()]);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateShadow = (index: number, updates: Partial<Shadow>) => {
    setShadows(prev => prev.map((s, i) => i === index ? { ...s, ...updates } : s));
  };

  const addShadow = () => {
    if (shadows.length >= 5) return;
    const newShadow = createDefaultShadow();
    setShadows(prev => [...prev, newShadow]);
    setActiveIndex(shadows.length);
  };

  const removeShadow = (index: number) => {
    if (shadows.length <= 1) return;
    setShadows(prev => prev.filter((_, i) => i !== index));
    setActiveIndex(Math.max(0, index - 1));
  };

  const currentShadow = shadows[activeIndex] || shadows[0];
  const allCss = shadows.map(s => shadowToCss(s, mode)).join(',\n  ');
  const cssValue = `${mode === 'box' ? 'box-shadow' : 'text-shadow'}: ${allCss};`;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={mode}
            onChange={(id) => setMode(id as ShadowMode)}
            tabs={[
                { id: 'box', label: 'Box Shadow', icon: '⬜' },
                { id: 'text', label: 'Text Shadow', icon: 'Aa' },
            ]}
            className="w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Layers</h3>
                    {shadows.length < 5 && (
                        <Button variant="ghost" size="sm" onClick={addShadow} className="h-7 text-[10px]">+ Add Layer</Button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    {shadows.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`
                                px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                                ${activeIndex === i 
                                    ? 'bg-accent border-accent text-white shadow-lg' 
                                    : 'bg-surface-raised border-white/5 text-white/40 hover:text-white hover:border-white/10'
                                }
                            `}
                        >
                            Layer {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            <Card title={`Layer ${activeIndex + 1} Settings`}>
                <div className="space-y-6">
                    <Slider label="Offset X" min={-100} max={100} value={currentShadow.offsetX} onChange={v => updateShadow(activeIndex, { offsetX: v })} unit="px" />
                    <Slider label="Offset Y" min={-100} max={100} value={currentShadow.offsetY} onChange={v => updateShadow(activeIndex, { offsetY: v })} unit="px" />
                    <Slider label="Blur" min={0} max={100} value={currentShadow.blur} onChange={v => updateShadow(activeIndex, { blur: v })} unit="px" />
                    {mode === 'box' && (
                        <Slider label="Spread" min={-50} max={50} value={currentShadow.spread} onChange={v => updateShadow(activeIndex, { spread: v })} unit="px" />
                    )}
                    <Slider label="Opacity" min={0} max={100} value={currentShadow.opacity} onChange={v => updateShadow(activeIndex, { opacity: v })} unit="%" />
                    
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                <input 
                                    type="color" 
                                    value={currentShadow.color} 
                                    onChange={e => updateShadow(activeIndex, { color: e.target.value })}
                                    className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer"
                                />
                            </div>
                            <span className="text-xs font-bold text-white/60 uppercase">{currentShadow.color}</span>
                        </div>
                        
                        {mode === 'box' && (
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-white/40 uppercase">Inset</span>
                                <Switch checked={currentShadow.inset} onChange={v => updateShadow(activeIndex, { inset: v })} />
                            </div>
                        )}
                    </div>

                    {shadows.length > 1 && (
                        <div className="pt-4 border-t border-white/5">
                            <Button variant="danger" size="sm" className="w-full" onClick={() => removeShadow(activeIndex)}>
                                Delete Layer {activeIndex + 1}
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>

        {/* Preview & Result */}
        <div className="lg:col-span-2 space-y-8">
            <div className="relative w-full min-h-[300px] rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-10" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                {mode === 'box' ? (
                    <div 
                        className="w-32 h-32 rounded-2xl bg-[#161616] border border-white/5 transition-all duration-300"
                        style={{ boxShadow: shadows.map(s => shadowToCss(s, 'box')).join(', ') }}
                    />
                ) : (
                    <h2 
                        className="text-6xl font-black text-white tracking-tighter transition-all duration-300"
                        style={{ textShadow: shadows.map(s => shadowToCss(s, 'text')).join(', ') }}
                    >
                        SHADOW
                    </h2>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">CSS Result</h3>
                <CodeBlock code={cssValue} language="css" />
                <Button variant="primary" size="lg" className="w-full" onClick={() => navigator.clipboard.writeText(cssValue)}>
                    Copy CSS Code
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
