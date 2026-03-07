'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import Switch from '@/components/ui/Switch';
import Input from '@/components/ui/Input';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type Tab = 'gradient' | 'shadow' | 'glass' | 'border';

export default function CssGeneratorTool() {
  const [activeTab, setActiveTab] = useState<Tab>('gradient');

  // ── Gradient ──────────────────────────────────────────────────────────────
  const [gType, setGType] = useState<'linear' | 'radial' | 'conic'>('linear');
  const [gAngle, setGAngle] = useState(135);
  const [gStops, setGStops] = useState([{ id: '1', color: '#818cf8', pos: 0 }, { id: '2', color: '#c084fc', pos: 100 }]);

  // ── Shadow ────────────────────────────────────────────────────────────────
  const [shX, setShX] = useState(0);
  const [shY, setShY] = useState(12);
  const [shBlur, setShBlur] = useState(24);
  const [shSpread, setShSpread] = useState(-4);
  const [shColor, setShColor] = useState('#000000');
  const [shOpacity, setShOpacity] = useState(40);
  const [shInset, setShInset] = useState(false);

  // ── Glass ─────────────────────────────────────────────────────────────────
  const [glBlur, setGlBlur] = useState(12);
  const [glOpacity, setGlOpacity] = useState(0.1);
  const [glSaturation, setGlSat] = useState(150);

  // ── Border ────────────────────────────────────────────────────────────────
  const [brTl, setBrTl] = useState(24);
  const [brTr, setBrTr] = useState(24);
  const [brBl, setBrBl] = useState(24);
  const [brBr, setBrBr] = useState(24);
  const [brLink, setBrLink] = useState(true);

  const css = useMemo(() => {
    switch (activeTab) {
      case 'gradient': {
        const stops = gStops.map(s => `${s.color} ${s.pos}%`).join(', ');
        const val = gType === 'linear' ? `linear-gradient(${gAngle}deg, ${stops})` : gType === 'radial' ? `radial-gradient(circle, ${stops})` : `conic-gradient(from ${gAngle}deg, ${stops})`;
        return `background: ${val};`;
      }
      case 'shadow': {
        const rgba = `rgba(0, 0, 0, ${(shOpacity/100).toFixed(2)})`;
        return `box-shadow: ${shInset ? 'inset ' : ''}${shX}px ${shY}px ${shBlur}px ${shSpread}px ${rgba};`;
      }
      case 'glass':
        return `background: rgba(255, 255, 255, ${glOpacity.toFixed(2)});\nbackdrop-filter: blur(${glBlur}px) saturate(${glSaturation}%);\n-webkit-backdrop-filter: blur(${glBlur}px) saturate(${glSaturation}%);\nborder: 1px solid rgba(255, 255, 255, 0.1);\nborder-radius: 24px;`;
      case 'border':
        return `border-radius: ${brTl}px ${brTr}px ${brBr}px ${brBl}px;`;
    }
  }, [activeTab, gType, gAngle, gStops, shX, shY, shBlur, shSpread, shOpacity, shInset, glBlur, glOpacity, glSaturation, brTl, brTr, brBr, brBl]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as Tab)}
            tabs={[
                { id: 'gradient', label: 'Gradient', icon: '🌈' },
                { id: 'shadow', label: 'Shadow', icon: '🌑' },
                { id: 'glass', label: 'Glass', icon: '🪟' },
                { id: 'border', label: 'Radius', icon: '⬜' },
            ]}
            className="w-full max-w-xl"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            {activeTab === 'gradient' && (
                <Card title="Gradient Config">
                    <div className="space-y-6">
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            {(['linear','radial','conic'] as const).map(t => (
                                <button key={t} onClick={() => setGType(t)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${gType === t ? 'bg-accent text-white shadow-md' : 'text-white/30 hover:text-white/60'}`}>{t}</button>
                            ))}
                        </div>
                        {gType !== 'radial' && <Slider label="Angle" min={0} max={360} value={gAngle} onChange={setGAngle} unit="°" />}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            {gStops.map((s, i) => (
                                <div key={s.id} className="flex gap-3 items-center">
                                    <input type="color" value={s.color} onChange={e => setGStops(p => p.map(x => x.id === s.id ? {...x, color: e.target.value} : x))} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 shrink-0 cursor-pointer" />
                                    <div className="flex-1">
                                        <Slider min={0} max={100} value={s.pos} onChange={v => setGStops(p => p.map(x => x.id === s.id ? {...x, pos: v} : x))} />
                                    </div>
                                    {gStops.length > 2 && <button onClick={() => setGStops(p => p.filter(x => x.id !== s.id))} className="text-white/20 hover:text-danger">✕</button>}
                                </div>
                            ))}
                            {gStops.length < 5 && <Button variant="ghost" size="sm" className="w-full" onClick={() => setGStops([...gStops, { id: crypto.randomUUID(), color: '#ffffff', pos: 100 }])}>+ Add Color Stop</Button>}
                        </div>
                    </div>
                </Card>
            )}

            {activeTab === 'shadow' && (
                <Card title="Shadow Attributes">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <Slider label="Offset X" min={-50} max={50} value={shX} onChange={setShX} unit="px" />
                            <Slider label="Offset Y" min={-50} max={50} value={shY} onChange={setShY} unit="px" />
                        </div>
                        <Slider label="Blur" min={0} max={100} value={shBlur} onChange={setShBlur} unit="px" />
                        <Slider label="Spread" min={-50} max={50} value={shSpread} onChange={setShSpread} unit="px" />
                        <Slider label="Opacity" min={0} max={100} value={shOpacity} onChange={setShOpacity} unit="%" />
                        <Switch label="Inset Shadow" checked={shInset} onChange={setShInset} />
                    </div>
                </Card>
            )}

            {activeTab === 'glass' && (
                <Card title="Glass Properties">
                    <div className="space-y-6">
                        <Slider label="Blur" min={0} max={40} step={0.5} value={glBlur} onChange={setGlBlur} unit="px" />
                        <Slider label="Fill Opacity" min={0} max={1} step={0.01} value={glOpacity} onChange={setGlOpacity} />
                        <Slider label="Saturation" min={50} max={300} value={glSaturation} onChange={setGlSat} unit="%" />
                    </div>
                </Card>
            )}

            {activeTab === 'border' && (
                <Card title="Rounding">
                    <div className="space-y-6">
                        <Switch label="Link Corners" checked={brLink} onChange={setBrLink} />
                        <Slider label="Top Left" min={0} max={200} value={brTl} onChange={v => { setBrTl(v); if(brLink) { setBrTr(v); setBrBr(v); setBrBl(v); } }} unit="px" />
                        {!brLink && (
                            <div className="space-y-6 pt-4">
                                <Slider label="Top Right" min={0} max={200} value={brTr} onChange={setBrTr} unit="px" />
                                <Slider label="Bottom Right" min={0} max={200} value={brBr} onChange={setBrBr} unit="px" />
                                <Slider label="Bottom Left" min={0} max={200} value={brBl} onChange={setBrBl} unit="px" />
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>

        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Live Preview</h3>
            <div className={`relative aspect-square rounded-3xl border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl transition-all duration-500 bg-[#0a0a0a]`}>
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                {activeTab === 'gradient' && <div className="w-48 h-48 rounded-2xl shadow-xl transition-all border border-white/10" style={{ background: css.split(': ')[1].slice(0, -1) }} />}
                {activeTab === 'shadow' && <div className="w-32 h-32 rounded-2xl bg-surface-raised border border-white/5 transition-all" style={{ boxShadow: css.split(': ')[1].slice(0, -1) }} />}
                {activeTab === 'glass' && (
                    <div className="w-full h-full relative flex items-center justify-center">
                        <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-accent/30 rounded-full blur-3xl animate-pulse" />
                        <div className="w-64 h-40 shadow-2xl border border-white/10 relative z-10" style={{
                            background: `rgba(255, 255, 255, ${glOpacity})`,
                            backdropFilter: `blur(${glBlur}px) saturate(${glSaturation}%)`,
                            WebkitBackdropFilter: `blur(${glBlur}px) saturate(${glSaturation}%)`,
                            borderRadius: '24px'
                        }}>
                            <div className="p-6">
                                <div className="w-10 h-10 rounded-lg bg-white/10 mb-4" />
                                <div className="h-2 w-3/4 bg-white/20 rounded-full mb-2" />
                                <div className="h-2 w-1/2 bg-white/10 rounded-full" />
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'border' && <div className="w-40 h-40 bg-accent rounded-2xl shadow-xl border border-white/20" style={{ borderRadius: `${brTl}px ${brTr}px ${brBr}px ${brBl}px` }} />}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">CSS Result</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(css)} className="h-7 text-[10px]">Copy Code</Button>
                </div>
                <CodeBlock code={css} language="css" maxHeight="200px" />
            </div>
        </div>
      </div>
    </div>
  );
}
