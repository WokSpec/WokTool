'use client';

import { useState, useMemo } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface StandardRatio { label: string; w: number; h: number }
interface SocialPreset { label: string; w: number; h: number; platform: string }

const STD_RATIOS: StandardRatio[] = [
  { label: '16:9', w: 16, h: 9 },
  { label: '4:3', w: 4, h: 3 },
  { label: '1:1', w: 1, h: 1 },
  { label: '9:16', w: 9, h: 16 },
  { label: '21:9', w: 21, h: 9 },
  { label: '3:2', w: 3, h: 2 },
  { label: '2:3', w: 2, h: 3 },
  { label: '5:4', w: 5, h: 4 },
];

const SOCIAL_PRESETS: SocialPreset[] = [
  { platform: 'YouTube', label: 'Cover', w: 1920, h: 1080 },
  { platform: 'Instagram', label: 'Post', w: 1080, h: 1080 },
  { platform: 'Instagram', label: 'Story', w: 1080, h: 1920 },
  { platform: 'Twitter/X', label: 'Post', w: 1600, h: 900 },
  { platform: 'Facebook', label: 'Post', w: 1200, h: 630 },
  { platform: 'LinkedIn', label: 'Post', w: 1200, h: 627 },
  { platform: 'TikTok', label: 'Video', w: 1080, h: 1920 },
  { platform: 'OG Image', label: 'Default', w: 1200, h: 630 },
];

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function simplify(w: number, h: number): string {
  if (!w || !h) return '?:?';
  const d = gcd(Math.round(w), Math.round(h));
  return `${Math.round(w) / d}:${Math.round(h) / d}`;
}

export default function AspectRatioTool() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockWidth, setLockWidth] = useState(1920);
  const [lockHeight, setLockHeight] = useState(1080);

  const ratio = useMemo(() => (width && height ? width / height : 1), [width, height]);
  const simplified = useMemo(() => simplify(width, height), [width, height]);

  const derivedHeight = useMemo(() => Math.round(lockWidth / ratio), [lockWidth, ratio]);
  const derivedWidth = useMemo(() => Math.round(lockHeight * ratio), [lockHeight, ratio]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
            <Card title="Base Dimensions" description="Set your reference size to define the ratio.">
                <div className="grid grid-cols-2 gap-4">
                    <Input 
                        label="Width (px)"
                        type="number"
                        value={width}
                        onChange={e => setWidth(Number(e.target.value))}
                        min={1}
                    />
                    <Input 
                        label="Height (px)"
                        type="number"
                        value={height}
                        onChange={e => setHeight(Number(e.target.value))}
                        min={1}
                    />
                </div>
            </Card>

            <Card title="Standards">
                <div className="grid grid-cols-2 gap-2">
                    {STD_RATIOS.map(r => (
                        <button
                            key={r.label}
                            onClick={() => {
                                setWidth(r.w * 100);
                                setHeight(r.h * 100);
                            }}
                            className={`
                                py-2 px-3 rounded-lg text-xs font-bold border transition-all
                                ${simplified === r.label 
                                    ? 'bg-accent border-accent text-white shadow-md' 
                                    : 'bg-surface-raised border-white/5 text-white/40 hover:text-white hover:border-white/10'
                                }
                            `}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </Card>

            <Card title="Calculator" description="Calculate new sizes while preserving the ratio.">
                <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                        <Input 
                            label="If Width is..."
                            type="number"
                            value={lockWidth}
                            onChange={e => setLockWidth(Number(e.target.value))}
                            min={1}
                            rightIcon={<span className="text-[10px] font-bold text-white/20 uppercase">PX</span>}
                        />
                        <div className="flex justify-between items-center px-2 py-3 bg-white/[0.03] rounded-xl border border-white/5">
                            <span className="text-xs text-white/40 font-medium">Resulting Height</span>
                            <span className="text-sm font-bold text-accent">{derivedHeight}px</span>
                        </div>
                    </div>

                    <div className="h-px bg-white/5 mx-2" />

                    <div className="flex flex-col gap-2">
                        <Input 
                            label="If Height is..."
                            type="number"
                            value={lockHeight}
                            onChange={e => setLockHeight(Number(e.target.value))}
                            min={1}
                            rightIcon={<span className="text-[10px] font-bold text-white/20 uppercase">PX</span>}
                        />
                        <div className="flex justify-between items-center px-2 py-3 bg-white/[0.03] rounded-xl border border-white/5">
                            <span className="text-xs text-white/40 font-medium">Resulting Width</span>
                            <span className="text-sm font-bold text-accent">{derivedWidth}px</span>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        {/* Middle/Right: Preview */}
        <div className="lg:col-span-2 space-y-8">
            <div className="relative w-full aspect-video rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-10" 
                    style={{ 
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                <div 
                    className="bg-gradient-to-br from-accent to-purple-500 rounded-2xl shadow-xl transition-all duration-500 flex items-center justify-center border border-white/20"
                    style={{
                        width: ratio > 1.77 ? '100%' : `${(ratio / 1.77) * 100}%`,
                        aspectRatio: `${width} / ${height}`,
                        maxHeight: '100%',
                    }}
                >
                    <div className="text-center p-4 bg-black/20 backdrop-blur-sm rounded-xl border border-white/10">
                        <div className="text-2xl font-black text-white tracking-tighter">{simplified}</div>
                        <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{width} × {height}</div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Common Social Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SOCIAL_PRESETS.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => { setWidth(p.w); setHeight(p.h); }}
                            className={`
                                flex items-center justify-between p-4 rounded-xl border transition-all group
                                ${width === p.w && height === p.h 
                                    ? 'bg-accent/10 border-accent/30 shadow-inner' 
                                    : 'bg-surface-raised border-white/5 hover:border-white/10'
                                }
                            `}
                        >
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest group-hover:text-accent/60 transition-colors">{p.platform}</div>
                                <div className="text-sm font-bold text-white/80">{p.label}</div>
                            </div>
                            <code className="text-xs font-mono text-accent">{p.w}×{p.h}</code>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
