'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';
import CodeBlock from '@/components/ui/CodeBlock';
import Dropzone from '@/components/ui/Dropzone';

interface Sprite {
  id: string;
  name: string;
  img: HTMLImageElement;
  w: number;
  h: number;
  url: string;
}

interface PackedSprite extends Sprite {
  px: number;
  py: number;
}

function nextPow2(n: number) {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

function packSprites(sprites: Sprite[], padding = 2): { items: PackedSprite[]; width: number; height: number } {
  if (sprites.length === 0) return { items: [], width: 0, height: 0 };
  
  // Sort by height descending for shelf packing
  const sorted = [...sprites].sort((a, b) => b.h - a.h);
  const items: PackedSprite[] = [];
  const shelves: { y: number; x: number; h: number }[] = [];
  
  // Estimate a reasonable max width (square-ish power of 2)
  const totalArea = sprites.reduce((a, s) => a + (s.w + padding) * (s.h + padding), 0);
  const side = Math.sqrt(totalArea * 1.2);
  const maxW = nextPow2(Math.max(side, sorted[0].w + padding));
  
  let currentY = 0;

  for (const s of sorted) {
    const sw = s.w + padding;
    const sh = s.h + padding;
    let placed = false;

    for (const shelf of shelves) {
      if (shelf.x + sw <= maxW && sh <= shelf.h) {
        items.push({ ...s, px: shelf.x, py: shelf.y });
        shelf.x += sw;
        placed = true;
        break;
      }
    }

    if (!placed) {
      items.push({ ...s, px: 0, py: currentY });
      shelves.push({ y: currentY, x: sw, h: sh });
      currentY += sh;
    }
  }

  const finalW = nextPow2(Math.max(...items.map(i => i.px + i.w + padding), 1));
  const finalH = nextPow2(Math.max(...items.map(i => i.py + i.h + padding), 1));
  
  return { items, width: finalW, height: finalH };
}

export default function SpritePackerTool() {
  const [sprites, setSprites] = useState<Sprite[]>([]);
  const [padding, setPadding] = useState(2);
  const [format, setFormat] = useState<'json-hash' | 'json-array' | 'css'>('json-hash');
  const [showGrid, setShowGrid] = useState(true);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFiles = useCallback((file: File) => {
    setLoading(true);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setSprites(prev => [...prev, {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^.]+$/, ''),
        img,
        w: img.width,
        h: img.height,
        url
      }]);
      setLoading(false);
    };
    img.src = url;
  }, []);

  const packed = useMemo(() => packSprites(sprites, padding), [sprites, padding]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !packed.width) return;
    canvas.width = packed.width;
    canvas.height = packed.height;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, packed.width, packed.height);

    packed.items.forEach(s => {
      ctx.drawImage(s.img, s.px, s.py, s.w, s.h);
      if (showGrid) {
        ctx.strokeStyle = '#818cf866';
        ctx.lineWidth = 1;
        ctx.strokeRect(s.px, s.py, s.w, s.h);
      }
    });
  }, [packed, showGrid]);

  const manifest = useMemo(() => {
    if (!packed.items.length) return '';
    if (format === 'json-hash') {
      const frames: any = {};
      packed.items.forEach(s => {
        frames[s.name] = { frame: { x: s.px, y: s.py, w: s.w, h: s.h }, sourceSize: { w: s.w, h: s.h } };
      });
      return JSON.stringify({ frames, meta: { size: { w: packed.width, h: packed.height } } }, null, 2);
    }
    if (format === 'json-array') {
      return JSON.stringify(packed.items.map(s => ({ name: s.name, x: s.px, y: s.py, w: s.w, h: s.h })), null, 2);
    }
    return packed.items.map(s => `.sprite-${s.name} { width: ${s.w}px; height: ${s.h}px; background-position: -${s.px}px -${s.py}px; }`).join('\n');
  }, [packed, format]);

  const downloadAll = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'spritesheet.png';
    a.click();
    
    const blob = new Blob([manifest], { type: 'text/plain' });
    const a2 = document.createElement('a');
    a2.href = URL.createObjectURL(blob);
    a2.download = `spritesheet.${format === 'css' ? 'css' : 'json'}`;
    a2.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Management */}
        <div className="space-y-6">
            <Card title="Add Sprites">
                <Dropzone onFileSelect={loadFiles} label="Drop PNG/SVG icons" description="Select multiple files to pack them" className="h-32" />
                
                {sprites.length > 0 && (
                    <div className="mt-6 space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Library ({sprites.length})</span>
                            <button onClick={() => setSprites([])} className="text-[10px] font-bold text-danger/60 hover:text-danger">Clear</button>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                            {sprites.map(s => (
                                <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 group">
                                    <div className="flex items-center gap-3">
                                        <img src={s.url} className="w-8 h-8 object-contain bg-white/5 rounded" alt="" />
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-bold text-white/80 truncate max-w-[120px]">{s.name}</div>
                                            <div className="text-[9px] font-mono text-white/20">{s.w}×{s.h}</div>
                                        </div>
                                    </div>
                                    <button onClick={() => setSprites(prev => prev.filter(x => x.id !== s.id))} className="p-1.5 text-white/10 hover:text-danger opacity-0 group-hover:opacity-100 transition-all">✕</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            <Card title="Packing Logic">
                <div className="space-y-6">
                    <Slider label="Padding" min={0} max={32} value={padding} onChange={setPadding} unit="px" />
                    <Select 
                        label="Output Format"
                        value={format}
                        onChange={e => setFormat(e.target.value as any)}
                        options={[
                            { value: 'json-hash', label: 'JSON Hash (TexturePacker)' },
                            { value: 'json-array', label: 'JSON Array' },
                            { value: 'css', label: 'CSS Classes' },
                        ]}
                    />
                    <Switch label="Show Grid Overlay" checked={showGrid} onChange={setShowGrid} />
                </div>
            </Card>
        </div>

        {/* Right: Preview & Code */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Atlas Preview</h3>
                <div className="flex gap-3">
                    <span className="text-[10px] font-black text-accent uppercase bg-accent/5 px-2 py-1 rounded border border-accent/10">{packed.width} × {packed.height}</span>
                    <Button variant="primary" size="sm" onClick={downloadAll} disabled={!sprites.length}>Download Atlas</Button>
                </div>
            </div>

            <div className="relative aspect-square rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-auto shadow-2xl flex items-center justify-center p-8 custom-scrollbar">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                <canvas ref={canvasRef} className="max-w-none shadow-2xl" />
                {!sprites.length && <p className="text-white/10 font-bold uppercase tracking-widest text-sm">Add sprites to begin</p>}
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated Manifest</h3>
                <CodeBlock code={manifest} language={format.includes('json') ? 'json' : 'css'} maxHeight="300px" />
            </div>
        </div>
      </div>
    </div>
  );
}
