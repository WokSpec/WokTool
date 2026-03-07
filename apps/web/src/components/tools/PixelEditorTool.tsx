'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import Switch from '@/components/ui/Switch';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

type Tool = 'pencil' | 'eraser' | 'fill' | 'eyedropper';

const PALETTE_DEFAULTS = [
  '#000000','#ffffff','#ff0000','#00ff00','#0000ff','#ffff00',
  '#ff00ff','#00ffff','#ff8800','#8800ff','#008800','#884400',
  '#444444','#888888','#cccccc','#ff8888',
];

const GRID_SIZES = [
    { value: 8, label: '8 × 8' },
    { value: 16, label: '16 × 16' },
    { value: 32, label: '32 × 32' },
    { value: 48, label: '48 × 48' },
    { value: 64, label: '64 × 64' },
];

export default function PixelEditorTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gridSize, setGridSize] = useState(16);
  const [tool, setTool] = useState<Tool>('pencil');
  const [color, setColor] = useState('#818cf8');
  const [palette, setPalette] = useState(PALETTE_DEFAULTS);
  const [showGrid, setShowGrid] = useState(true);
  const isDrawing = useRef(false);

  // pixel data: index = y * gridSize + x
  const pixels = useRef<string[]>(new Array(64 * 64).fill(''));

  const cellSize = useMemo(() => Math.floor(520 / gridSize), [gridSize]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const c = pixels.current[y * gridSize + x];
        if (c) {
          ctx.fillStyle = c;
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= gridSize; x++) {
        ctx.beginPath(); ctx.moveTo(x * cellSize, 0); ctx.lineTo(x * cellSize, gridSize * cellSize); ctx.stroke();
      }
      for (let y = 0; y <= gridSize; y++) {
        ctx.beginPath(); ctx.moveTo(0, y * cellSize); ctx.lineTo(gridSize * cellSize, y * cellSize); ctx.stroke();
      }
    }
  }, [gridSize, cellSize, showGrid]);

  useEffect(() => { draw(); }, [draw]);

  const applyTool = (x: number, y: number) => {
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return;
    const idx = y * gridSize + x;
    if (tool === 'pencil') pixels.current[idx] = color;
    else if (tool === 'eraser') pixels.current[idx] = '';
    else if (tool === 'fill') {
      const target = pixels.current[idx];
      if (target === color) return;
      const stack = [[x, y]];
      while(stack.length) {
        const [cx, cy] = stack.pop()!;
        const ci = cy * gridSize + cx;
        if (pixels.current[ci] === target) {
            pixels.current[ci] = color;
            if (cx > 0) stack.push([cx-1, cy]);
            if (cx < gridSize - 1) stack.push([cx+1, cy]);
            if (cy > 0) stack.push([cx, cy-1]);
            if (cy < gridSize - 1) stack.push([cx, cy+1]);
        }
      }
    } else if (tool === 'eyedropper') {
      const c = pixels.current[idx];
      if (c) setColor(c);
    }
    draw();
  };

  const handlePointer = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = Math.floor((clientX - rect.left) / (rect.width / gridSize));
    const y = Math.floor((clientY - rect.top) / (rect.height / gridSize));
    applyTool(x, y);
  };

  const exportPng = () => {
    const exp = document.createElement('canvas');
    exp.width = gridSize; exp.height = gridSize;
    const ctx = exp.getContext('2d')!;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const c = pixels.current[y * gridSize + x];
        if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); }
      }
    }
    const a = document.createElement('a'); a.download = `pixel-art.png`; a.href = exp.toDataURL(); a.click();
  };

  const TOOLS = [
    { id: 'pencil', icon: '✏️', label: 'Pencil' },
    { id: 'eraser', icon: '🧹', label: 'Eraser' },
    { id: 'fill', icon: '🧪', label: 'Bucket' },
    { id: 'eyedropper', icon: '💉', label: 'Pick' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Toolbar */}
        <div className="space-y-6">
            <Card title="Toolbar">
                <div className="grid grid-cols-2 gap-2">
                    {TOOLS.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTool(t.id as Tool)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${tool === t.id ? 'bg-accent border-accent text-white shadow-lg' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white'}`}
                        >
                            <span className="text-xl mb-1">{t.icon}</span>
                            <span className="text-[10px] font-black uppercase tracking-tighter">{t.label}</span>
                        </button>
                    ))}
                </div>
            </Card>

            <Card title="Canvas Config">
                <div className="space-y-6">
                    <Select label="Grid Resolution" value={gridSize} onChange={e => { setGridSize(Number(e.target.value)); pixels.current.fill(''); }} options={GRID_SIZES} />
                    <Switch label="Visible Grid" checked={showGrid} onChange={setShowGrid} />
                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <Button variant="primary" className="w-full" onClick={exportPng}>Download PNG</Button>
                        <Button variant="ghost" className="w-full" size="sm" onClick={() => { pixels.current.fill(''); draw(); }}>Clear Canvas</Button>
                    </div>
                </div>
            </Card>
        </div>

        {/* Main: Canvas */}
        <div className="lg:col-span-2 flex items-center justify-center bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl p-8 relative overflow-hidden h-[600px]">
            <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                    backgroundSize: '24px 24px'
                }} 
            />
            <canvas
                ref={canvasRef}
                width={gridSize * cellSize}
                height={gridSize * cellSize}
                className="max-w-full h-auto cursor-crosshair shadow-2xl relative z-10 bg-transparent"
                onMouseDown={e => { isDrawing.current = true; handlePointer(e); }}
                onMouseMove={e => isDrawing.current && handlePointer(e)}
                onMouseUp={() => isDrawing.current = false}
                onMouseLeave={() => isDrawing.current = false}
            />
        </div>

        {/* Right: Color Panel */}
        <div className="space-y-6">
            <Card title="Color Picker">
                <div className="space-y-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl shadow-inner border border-white/10 shrink-0" style={{ background: color }} />
                        <Input value={color} onChange={e => setColor(e.target.value)} className="font-mono uppercase" />
                    </div>
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-10 rounded-xl bg-white/5 border border-white/10 cursor-pointer p-1" />
                </div>
            </Card>

            <Card title="Swatches">
                <div className="grid grid-cols-4 gap-2">
                    {palette.map((c, i) => (
                        <button
                            key={i}
                            onClick={() => setColor(c)}
                            className={`aspect-square rounded-lg border transition-all ${color === c ? 'border-white ring-2 ring-white/10 scale-110 z-10' : 'border-white/5 hover:scale-105'}`}
                            style={{ background: c }}
                        />
                    ))}
                    <button 
                        onClick={() => !palette.includes(color) && setPalette([...palette, color])}
                        className="aspect-square rounded-lg bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-white/20 hover:text-white hover:border-white/40 transition-all"
                    >
                        +
                    </button>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
