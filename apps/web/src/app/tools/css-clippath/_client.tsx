'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

type Point = { x: number; y: number };
type ShapeType = 'triangle' | 'diamond' | 'hexagon' | 'star' | 'pentagon' | 'arrow' | 'custom';

const PRESETS: Record<ShapeType, Point[]> = {
  triangle:  [{ x:50,y:0 }, { x:100,y:100 }, { x:0,y:100 }],
  diamond:   [{ x:50,y:0 }, { x:100,y:50 }, { x:50,y:100 }, { x:0,y:50 }],
  hexagon:   [{ x:50,y:0 }, { x:100,y:25 }, { x:100,y:75 }, { x:50,y:100 }, { x:0,y:75 }, { x:0,y:25 }],
  star:      [{ x:50,y:0 }, { x:61,y:35 }, { x:98,y:35 }, { x:68,y:57 }, { x:79,y:91 }, { x:50,y:70 }, { x:21,y:91 }, { x:32,y:57 }, { x:2,y:35 }, { x:39,y:35 }],
  pentagon:  [{ x:50,y:0 }, { x:100,y:38 }, { x:82,y:100 }, { x:18,y:100 }, { x:0,y:38 }],
  arrow:     [{ x:0,y:25 }, { x:60,y:25 }, { x:60,y:0 }, { x:100,y:50 }, { x:60,y:100 }, { x:60,y:75 }, { x:0,y:75 }],
  custom:    [{ x:10,y:10 }, { x:90,y:10 }, { x:90,y:90 }, { x:10,y:90 }],
};

const POINT_RADIUS = 8;
const CANVAS_SIZE = 400;

export default function CssClippathClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [shape, setShape] = useState<ShapeType>('hexagon');
  const [points, setPoints] = useState<Point[]>(PRESETS['hexagon']);
  const [dragging, setDragging] = useState<number | null>(null);
  const [color, setColor] = useState('#818cf8');
  const svgRef = useRef<SVGSVGElement>(null);

  const clipPath = useMemo(() => `polygon(${points.map(p => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`).join(', ')})`, [points]);
  const cssValue = `.clipped-element {\n  clip-path: ${clipPath};\n}`;

  const getSVGCoords = (e: React.MouseEvent): { x: number; y: number } | null => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging === null) return;
    const coords = getSVGCoords(e);
    if (!coords) return;
    const pct = { x: Math.max(0, Math.min(100, (coords.x / CANVAS_SIZE) * 100)), y: Math.max(0, Math.min(100, (coords.y / CANVAS_SIZE) * 100)) };
    setPoints(pts => pts.map((p, i) => i === dragging ? pct : p));
  };

  const addPoint = (e: React.MouseEvent) => {
    if (dragging !== null) return;
    const coords = getSVGCoords(e);
    if (!coords) return;
    setPoints([...points, { x: (coords.x / CANVAS_SIZE) * 100, y: (coords.y / CANVAS_SIZE) * 100 }]);
    setShape('custom');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Editor */}
        <div className="space-y-6">
            <Card title="Shape Presets">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {(Object.keys(PRESETS) as ShapeType[]).map(key => (
                        <button 
                            key={key} 
                            onClick={() => { setShape(key); setPoints([...PRESETS[key]]); }}
                            className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${shape === key ? 'bg-accent border-accent text-white shadow-lg' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white'}`}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </Card>

            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Visual Editor</h3>
                    <span className="text-[10px] text-white/20 italic">Double-click to add points</span>
                </div>
                <div className="relative aspect-square rounded-3xl bg-[#0d0d0d] border border-white/10 overflow-hidden cursor-crosshair">
                    <svg
                        ref={svgRef}
                        viewBox={`0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}`}
                        className="w-full h-full"
                        onMouseMove={handleMouseMove}
                        onMouseUp={() => setDragging(null)}
                        onMouseLeave={() => setDragging(null)}
                        onDoubleClick={addPoint}
                    >
                        <polygon points={points.map(p => `${(p.x/100)*CANVAS_SIZE},${(p.y/100)*CANVAS_SIZE}`).join(' ')} fill="rgba(129,140,248,0.1)" stroke="var(--accent)" strokeWidth="2" />
                        {points.map((p, i) => (
                            <circle
                                key={i}
                                cx={(p.x/100)*CANVAS_SIZE}
                                cy={(p.y/100)*CANVAS_SIZE}
                                r={POINT_RADIUS}
                                fill={dragging === i ? 'white' : 'var(--accent)'}
                                className="cursor-grab active:cursor-grabbing transition-colors"
                                onMouseDown={(e) => { e.stopPropagation(); setDragging(i); }}
                                onContextMenu={(e) => { e.preventDefault(); if (points.length > 3) setPoints(points.filter((_, idx) => idx !== i)); }}
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </div>

        {/* Right: Preview & Output */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Result Preview</h3>
            <div className="relative aspect-square rounded-3xl border border-white/10 flex items-center justify-center p-12 transition-all duration-500 shadow-2xl overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                <div 
                    className="w-64 h-64 shadow-2xl transition-all duration-300"
                    style={{
                        background: `linear-gradient(135deg, ${color}, #c084fc)`,
                        clipPath: clipPath
                    }}
                />
                
                <div className="absolute top-4 right-4">
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded-lg bg-transparent cursor-pointer border-none" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">CSS Output</h3>
                    <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(cssValue)} className="h-7 text-[10px]">Copy CSS</Button>
                </div>
                <CodeBlock code={cssValue} language="css" maxHeight="200px" />
            </div>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start opacity-60">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 text-xl">✂️</div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    Right-click any point to remove it. You can drag existing points to sculpt your custom shape.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
