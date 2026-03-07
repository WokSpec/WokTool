'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Dropzone from '@/components/ui/Dropzone';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Switch from '@/components/ui/Switch';

export default function TilemapTool() {
  const [tileset, setTileset] = useState<HTMLImageElement | null>(null);
  const [tsUrl, setTsUrl] = useState<string | null>(null);
  const [tileSize, setTileSize] = useState(32);
  const [cols, setCols] = useState(10);
  const [rows, setRows] = useState(10);
  const [selectedTile, setSelectedTile] = useState(0);
  const [map, setMap] = useState<number[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tsCanvasRef = useRef<HTMLCanvasElement>(null);
  const isPainting = useRef(false);

  useEffect(() => {
    setMap(new Array(cols * rows).fill(-1));
  }, [cols, rows]);

  const loadFiles = (file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setTileset(img);
      setTsUrl(url);
      setSelectedTile(0);
    };
    img.src = url;
  };

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !tileset) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const tsCols = Math.floor(tileset.width / tileSize);

    for (let i = 0; i < map.length; i++) {
      const tileIdx = map[i];
      if (tileIdx === -1) continue;
      const x = i % cols;
      const y = Math.floor(i / cols);
      const sx = (tileIdx % tsCols) * tileSize;
      const sy = Math.floor(tileIdx / tsCols) * tileSize;
      ctx.drawImage(tileset, sx, sy, tileSize, tileSize, x * tileSize, y * tileSize, tileSize, tileSize);
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= cols; x++) { ctx.beginPath(); ctx.moveTo(x*tileSize, 0); ctx.lineTo(x*tileSize, rows*tileSize); ctx.stroke(); }
      for (let y = 0; y <= rows; y++) { ctx.beginPath(); ctx.moveTo(0, y*tileSize); ctx.lineTo(cols*tileSize, y*tileSize); ctx.stroke(); }
    }
  }, [map, tileset, tileSize, cols, rows, showGrid]);

  useEffect(() => { render(); }, [render]);

  const paint = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / cols));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / rows));
    if (x >= 0 && x < cols && y >= 0 && y < rows) {
      const next = [...map];
      next[y * cols + x] = selectedTile;
      setMap(next);
    }
  };

  const exportTiled = () => {
    const data = {
      width: cols, height: rows,
      tilewidth: tileSize, tileheight: tileSize,
      layers: [{ data: map.map(v => v + 1), name: 'Layer 1', opacity: 1, type: 'tilelayer', visible: true, x: 0, y: 0 }],
      tilesets: [{ firstgid: 1, columns: Math.floor(tileset!.width / tileSize), tilecount: Math.floor((tileset!.width / tileSize) * (tileset!.height / tileSize)), tilewidth: tileSize, tileheight: tileSize }]
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.download = 'map.json'; a.href = URL.createObjectURL(blob); a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-6">
            <Card title="Tileset">
                {!tsUrl ? (
                    <Dropzone onFileSelect={loadFiles} label="Upload Tileset" description="PNG/JPG Grid" className="h-32" />
                ) : (
                    <div className="space-y-4">
                        <div className="relative aspect-square bg-[#0d0d0d] border border-white/10 rounded-xl overflow-auto custom-scrollbar p-2">
                            <div className="relative inline-block" style={{ width: tileset?.width, height: tileset?.height }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={tsUrl} alt="Tileset" className="max-w-none" />
                                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${Math.floor(tileset!.width/tileSize)}, ${tileSize}px)`, gridTemplateRows: `repeat(${Math.floor(tileset!.height/tileSize)}, ${tileSize}px)` }}>
                                    {Array.from({ length: Math.floor(tileset!.width/tileSize) * Math.floor(tileset!.height/tileSize) }).map((_, i) => (
                                        <div 
                                            key={i} 
                                            onClick={() => setSelectedTile(i)}
                                            className={`border border-white/5 cursor-pointer transition-all ${selectedTile === i ? 'bg-accent/40 ring-2 ring-accent border-transparent z-10' : 'hover:bg-white/5'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Button variant="secondary" size="sm" className="w-full" onClick={() => { setTsUrl(null); setTileset(null); }}>Change Tileset</Button>
                    </div>
                )}
            </Card>

            <Card title="Map Config">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Input label="Width (Tiles)" type="number" value={cols} onChange={e => setCols(Number(e.target.value))} />
                        <Input label="Height (Tiles)" type="number" value={rows} onChange={e => setRows(Number(e.target.value))} />
                    </div>
                    <Input label="Tile Size (px)" type="number" value={tileSize} onChange={e => setTileSize(Number(e.target.value))} />
                    <Switch label="Visible Grid" checked={showGrid} onChange={setShowGrid} />
                </div>
            </Card>

            <Button variant="primary" className="w-full" size="lg" disabled={!tileset} onClick={exportTiled}>Export JSON (Tiled)</Button>
        </div>

        <div className="lg:col-span-3 flex flex-col items-center justify-center bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl p-8 overflow-auto custom-scrollbar min-h-[600px]">
            {tsUrl ? (
                <canvas 
                    ref={canvasRef}
                    width={cols * tileSize}
                    height={rows * tileSize}
                    className="max-w-none shadow-2xl cursor-crosshair bg-white/[0.01]"
                    onMouseDown={e => { isPainting.current = true; paint(e); }}
                    onMouseMove={e => isPainting.current && paint(e)}
                    onMouseUp={() => isPainting.current = false}
                    onMouseLeave={() => isPainting.current = false}
                />
            ) : (
                <div className="text-center opacity-20 py-20">
                    <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl mb-6 mx-auto">🗺️</div>
                    <p className="text-lg font-bold">Upload a tileset to start painting</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
