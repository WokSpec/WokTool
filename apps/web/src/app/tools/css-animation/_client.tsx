'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

interface Keyframe {
  id: string;
  stop: number;
  translateX: number;
  translateY: number;
  rotate: number;
  scale: number;
  opacity: number;
  bgColor: string;
}

interface AnimConfig {
  name: string;
  duration: number;
  timingFn: string;
  delay: number;
  iterationCount: string;
  direction: string;
  fillMode: string;
  keyframes: Keyframe[];
}

const PRESETS: Record<string, Partial<AnimConfig>> = {
  'fade-in': { duration: 0.6, timingFn: 'ease', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 0, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
  'slide-in': { duration: 0.5, timingFn: 'ease-out', keyframes: [
    { id: '0', stop: 0, translateX: -60, translateY: 0, rotate: 0, scale: 1, opacity: 0, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
  'bounce': { duration: 0.8, timingFn: 'ease', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '1', stop: 40, translateX: 0, translateY: -30, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '2', stop: 60, translateX: 0, translateY: -15, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '3', stop: 100, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
  'spin': { duration: 1, timingFn: 'linear', iterationCount: 'infinite', keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 0, rotate: 360, scale: 1, opacity: 1, bgColor: '#818cf8' },
  ]},
};

const DEFAULT_CONFIG: AnimConfig = {
  name: 'my-animation',
  duration: 1,
  timingFn: 'ease',
  delay: 0,
  iterationCount: 'infinite',
  direction: 'normal',
  fillMode: 'none',
  keyframes: [
    { id: '0', stop: 0, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' },
    { id: '1', stop: 100, translateX: 0, translateY: 20, rotate: 0, scale: 1, opacity: 0, bgColor: '#818cf8' },
  ],
};

function generateCss(config: AnimConfig): string {
  const kfLines = [...config.keyframes]
    .sort((a, b) => a.stop - b.stop)
    .map(kf => {
      const transforms: string[] = [];
      if (kf.translateX || kf.translateY) transforms.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
      if (kf.rotate) transforms.push(`rotate(${kf.rotate}deg)`);
      if (kf.scale !== 1) transforms.push(`scale(${kf.scale})`);
      const rules: string[] = [];
      if (transforms.length) rules.push(`  transform: ${transforms.join(' ')};`);
      if (kf.opacity !== 1) rules.push(`  opacity: ${kf.opacity};`);
      rules.push(`  background-color: ${kf.bgColor};`);
      return `  ${kf.stop}% {\n${rules.join('\n')}\n  }`;
    })
    .join('\n');

  const animProp = [
    `${config.duration}s`,
    config.timingFn,
    config.delay ? `${config.delay}s` : '',
    config.iterationCount,
    config.direction !== 'normal' ? config.direction : '',
    config.fillMode !== 'none' ? config.fillMode : '',
  ].filter(Boolean).join(' ');

  return `@keyframes ${config.name} {\n${kfLines}\n}\n\n.animated-element {\n  animation: ${config.name} ${animProp};\n}`;
}

export default function CssAnimationClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [config, setConfig] = useState<AnimConfig>(DEFAULT_CONFIG);
  const [animKey, setAnimKey] = useState(0);

  const css = useMemo(() => generateCss(config), [config]);

  const update = (patch: Partial<AnimConfig>) => setConfig(c => ({ ...c, ...patch }));
  const updateKf = (id: string, patch: Partial<Keyframe>) => {
    setConfig(c => ({ ...c, keyframes: c.keyframes.map(k => k.id === id ? { ...k, ...patch } : k) }));
  };

  const addKf = () => {
    setConfig(c => ({ ...c, keyframes: [...c.keyframes, { id: crypto.randomUUID(), stop: 50, translateX: 0, translateY: 0, rotate: 0, scale: 1, opacity: 1, bgColor: '#818cf8' }] }));
  };

  const applyPreset = (name: string) => {
    const p = PRESETS[name];
    if (!p) return;
    setConfig(c => ({ ...c, ...p, keyframes: p.keyframes!.map((k, i) => ({ ...k, id: String(i) })) }));
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    const styleId = 'css-anim-preview-style';
    const animStyle = `
      @keyframes ${config.name} {
        ${[...config.keyframes].sort((a,b) => a.stop - b.stop).map(kf => {
          const transforms: string[] = [];
          if (kf.translateX || kf.translateY) transforms.push(`translate(${kf.translateX}px, ${kf.translateY}px)`);
          if (kf.rotate) transforms.push(`rotate(${kf.rotate}deg)`);
          if (kf.scale !== 1) transforms.push(`scale(${kf.scale})`);
          return `${kf.stop}% { ${transforms.length ? `transform: ${transforms.join(' ')};` : ''} opacity: ${kf.opacity}; background-color: ${kf.bgColor}; }`;
        }).join(' ')}
      }
    `;
    let el = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!el) { el = document.createElement('style'); el.id = styleId; document.head.appendChild(el); }
    el.textContent = animStyle;
  }, [config]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Settings */}
        <div className="space-y-6">
            <Card title="Core Settings">
                <div className="space-y-4">
                    <Input label="Animation Name" value={config.name} onChange={e => update({ name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Duration (s)" type="number" step={0.1} value={config.duration} onChange={e => update({ duration: Number(e.target.value) })} />
                        <Input label="Delay (s)" type="number" step={0.1} value={config.delay} onChange={e => update({ delay: Number(e.target.value) })} />
                    </div>
                    <Select 
                        label="Timing Function" 
                        value={config.timingFn} 
                        onChange={e => update({ timingFn: e.target.value })}
                        options={['ease','linear','ease-in','ease-out','ease-in-out'].map(t => ({ value: t, label: t }))}
                    />
                    <Input label="Iterations" value={config.iterationCount} onChange={e => update({ iterationCount: e.target.value })} placeholder="1 or infinite" />
                </div>
            </Card>

            <Card title="Quick Presets">
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(PRESETS).map(p => (
                        <Button key={p} variant="secondary" size="sm" onClick={() => applyPreset(p)} className="capitalize">
                            {p.replace('-', ' ')}
                        </Button>
                    ))}
                </div>
            </Card>
        </div>

        {/* Middle: Timeline */}
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Keyframe Timeline</h3>
                <Button variant="ghost" size="sm" onClick={addKf} className="h-7 text-[10px]">+ Add Stop</Button>
            </div>
            
            <div className="space-y-4">
                {[...config.keyframes].sort((a,b) => a.stop - b.stop).map((kf, i) => (
                    <Card key={kf.id} className="p-4 relative group">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <div className="col-span-2 flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-[10px] font-black text-accent uppercase">Stop {i + 1}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-white/20">{kf.stop}%</span>
                                    {config.keyframes.length > 2 && (
                                        <button onClick={() => setConfig(c => ({...c, keyframes: c.keyframes.filter(k => k.id !== kf.id)}))} className="text-white/20 hover:text-danger">✕</button>
                                    )}
                                </div>
                            </div>
                            <Slider label="Offset %" min={0} max={100} value={kf.stop} onChange={v => updateKf(kf.id, { stop: v })} />
                            <Slider label="Rotate" min={-360} max={360} value={kf.rotate} onChange={v => updateKf(kf.id, { rotate: v })} unit="°" />
                            <Slider label="Translate X" min={-100} max={100} value={kf.translateX} onChange={v => updateKf(kf.id, { translateX: v })} unit="px" />
                            <Slider label="Translate Y" min={-100} max={100} value={kf.translateY} onChange={v => updateKf(kf.id, { translateY: v })} unit="px" />
                            <Slider label="Scale" min={0} max={3} step={0.1} value={kf.scale} onChange={v => updateKf(kf.id, { scale: v })} />
                            <Slider label="Opacity" min={0} max={1} step={0.1} value={kf.opacity} onChange={v => updateKf(kf.id, { opacity: v })} />
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Live Preview</h3>
            <div className="sticky top-8 space-y-6">
                <div className="relative aspect-square rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                            backgroundSize: '24px 24px'
                        }} 
                    />
                    
                    <div 
                        key={animKey}
                        className="w-24 h-24 rounded-2xl shadow-xl"
                        style={{
                            animationName: config.name,
                            animationDuration: `${config.duration}s`,
                            animationTimingFunction: config.timingFn,
                            animationDelay: `${config.delay}s`,
                            animationIterationCount: config.iterationCount,
                            animationDirection: config.direction,
                            animationFillMode: config.fillMode,
                            backgroundColor: config.keyframes[0].bgColor
                        }}
                    />
                    <Button variant="ghost" size="sm" className="absolute bottom-4 right-4" onClick={() => setAnimKey(k => k + 1)}>Replay</Button>
                </div>

                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">CSS Output</h3>
                    <CodeBlock code={css} language="css" maxHeight="300px" />
                    <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(css)}>Copy CSS</Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
