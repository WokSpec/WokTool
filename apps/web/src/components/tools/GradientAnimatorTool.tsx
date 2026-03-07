'use client';

import { useState, useEffect, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

interface Stop { id: string; color: string; position: number }

export default function GradientAnimatorTool() {
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', color: '#8b5cf6', position: 0 },
    { id: '2', color: '#06b6d4', position: 50 },
    { id: '3', color: '#f59e0b', position: 100 },
  ]);
  const [angle, setAngle] = useState(135);
  const [speed, setSpeed] = useState(4);
  const [playing, setPlaying] = useState(true);

  const stopStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
  const shifted = [...stops.map(s => ({ ...s, position: (s.position + 50) % 100 }))].sort((a, b) => a.position - b.position);
  const shiftedStr = shifted.map(s => `${s.color} ${s.position}%`).join(', ');

  const animName = 'wg-grad-anim';
  const keyframes = `@keyframes ${animName} {
  0%   { background: linear-gradient(${angle}deg, ${stopStr}); }
  50%  { background: linear-gradient(${angle + 180}deg, ${shiftedStr}); }
  100% { background: linear-gradient(${angle}deg, ${stopStr}); }
}`;

  const cssOutput = `${keyframes}

.animated-gradient {
  animation: ${animName} ${speed}s ease infinite;
}`;

  const updateStop = (id: string, key: keyof Stop, val: string | number) =>
    setStops(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));

  const addStop = () =>
    setStops(prev => [...prev, { id: crypto.randomUUID(), color: '#ec4899', position: 75 }]);

  const removeStop = (id: string) => {
    setStops(prev => prev.length <= 2 ? prev : prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="space-y-6">
            <Card title="Animation Config">
                <div className="space-y-6">
                    <Slider label="Angle" min={0} max={360} value={angle} onChange={setAngle} unit="°" />
                    <Slider label="Speed" min={1} max={20} step={0.5} value={speed} onChange={setSpeed} unit="s" />
                    <Button 
                        variant={playing ? 'secondary' : 'primary'} 
                        className="w-full" 
                        onClick={() => setPlaying(!playing)}
                    >
                        {playing ? 'Pause Animation' : 'Play Animation'}
                    </Button>
                </div>
            </Card>

            <Card title="Color Stops">
                <div className="space-y-4">
                    {stops.map((s, i) => (
                        <div key={s.id} className="flex gap-3 items-center p-2 rounded-xl bg-white/[0.02] border border-white/5">
                            <input type="color" value={s.color} onChange={e => updateStop(s.id, 'color', e.target.value)} className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 shrink-0 cursor-pointer" />
                            <div className="flex-1">
                                <Slider min={0} max={100} value={s.position} onChange={v => updateStop(s.id, 'position', v)} unit="%" />
                            </div>
                            {stops.length > 2 && <button onClick={() => removeStop(s.id)} className="text-white/20 hover:text-danger p-1">✕</button>}
                        </div>
                    ))}
                    {stops.length < 6 && <Button variant="ghost" size="sm" className="w-full" onClick={addStop}>+ Add Color Stop</Button>}
                </div>
            </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0a]">
                <div 
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(${angle}deg, ${stopStr})`,
                        animation: playing ? `${animName} ${speed}s ease infinite` : 'none'
                    }}
                />
                
                {/* Inject dynamic styles */}
                <style>{keyframes}</style>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-white font-bold shadow-xl">
                        Preview
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated CSS</h3>
                <CodeBlock code={cssOutput} language="css" maxHeight="300px" />
                <Button variant="primary" className="w-full" onClick={() => navigator.clipboard.writeText(cssOutput)}>
                    Copy CSS Code
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
