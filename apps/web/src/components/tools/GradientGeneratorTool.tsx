'use client';

import { useState } from 'react';
import Select from '@/components/ui/Select';
import Slider from '@/components/ui/Slider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type GradientType = 'linear' | 'radial' | 'conic';
interface Stop { color: string; position: number }

const GRADIENT_TYPES = [
    { value: 'linear', label: 'Linear' },
    { value: 'radial', label: 'Radial' },
    { value: 'conic', label: 'Conic' },
];

export default function GradientGeneratorTool() {
  const [type, setType] = useState<GradientType>('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: '#818cf8', position: 0 },
    { color: '#c084fc', position: 100 },
  ]);

  const stopStr = stops.map(s => `${s.color} ${s.position}%`).join(', ');
  const getGradient = () => {
    if (type === 'linear') return `linear-gradient(${angle}deg, ${stopStr})`;
    if (type === 'radial') return `radial-gradient(circle, ${stopStr})`;
    return `conic-gradient(from ${angle}deg, ${stopStr})`;
  };
  
  const cssValue = `background: ${getGradient()};`;

  const updateStop = (i: number, key: keyof Stop, val: string | number) =>
    setStops(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  const addStop = () => {
    if (stops.length >= 6) return;
    const lastPos = stops[stops.length - 1].position;
    const newPos = Math.min(100, lastPos + 10);
    setStops(prev => [...prev, { color: '#fb923c', position: newPos }]);
  };

  const removeStop = (i: number) => {
    if (stops.length <= 2) return;
    setStops(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
            <Card title="Configuration">
                <div className="space-y-6">
                    <Select 
                        label="Gradient Type"
                        value={type}
                        onChange={(e) => setType(e.target.value as GradientType)}
                        options={GRADIENT_TYPES}
                    />

                    {type !== 'radial' && (
                        <Slider 
                            label="Angle"
                            min={0} max={360}
                            value={angle}
                            onChange={setAngle}
                            unit="°"
                        />
                    )}
                </div>
            </Card>

            <Card title="Color Stops">
                <div className="space-y-5">
                    {stops.map((s, i) => (
                        <div key={i} className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5 group">
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                    <input 
                                        type="color" 
                                        value={s.color} 
                                        onChange={e => updateStop(i, 'color', e.target.value)}
                                        className="absolute inset-[-50%] w-[200%] h-[200%] cursor-pointer"
                                    />
                                </div>
                                <code className="text-[10px] font-bold text-white/40 uppercase flex-1">{s.color}</code>
                                {stops.length > 2 && (
                                    <button 
                                        onClick={() => removeStop(i)}
                                        className="p-1 text-white/20 hover:text-danger hover:bg-danger/10 rounded transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <Slider 
                                min={0} max={100}
                                value={s.position}
                                onChange={v => updateStop(i, 'position', v)}
                                unit="%"
                            />
                        </div>
                    ))}
                    
                    {stops.length < 6 && (
                        <Button variant="secondary" size="sm" className="w-full" onClick={addStop}>
                            + Add Color Stop
                        </Button>
                    )}
                </div>
            </Card>
        </div>

        {/* Preview & Code */}
        <div className="lg:col-span-2 space-y-6">
            <div 
                className="relative w-full aspect-video rounded-3xl shadow-2xl border border-white/10 overflow-hidden group"
                style={{ background: getGradient() }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                    <p className="text-white font-bold text-lg drop-shadow-md">Gradient Preview</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">CSS Output</h3>
                <CodeBlock 
                    code={cssValue} 
                    language="css"
                />
                <div className="flex gap-3">
                    <Button 
                        variant="primary" 
                        className="flex-1" 
                        onClick={() => navigator.clipboard.writeText(cssValue)}
                    >
                        Copy Styles
                    </Button>
                    <Button 
                        variant="secondary"
                        onClick={() => {
                            setStops([
                                { color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'), position: 0 },
                                { color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'), position: 100 },
                            ]);
                        }}
                    >
                        Randomize
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
