'use client';

import { useState, useRef, useCallback } from 'react';
import { Shield, Zap, Code, Palette, Copy } from 'lucide-react';
import Dropzone from '@/components/ui/Dropzone';
import ColorSwatch from '@/components/ui/ColorSwatch';

type RGB = [number, number, number];

function rgbToHex([r, g, b]: RGB) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toLowerCase();
}

function colorDist([r1, g1, b1]: RGB, [r2, g2, b2]: RGB) {
  return (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
}

function kMeans(pixels: RGB[], k: number, iterations = 20): RGB[] {
  if (pixels.length === 0) return [];
  if (pixels.length <= k) return pixels;

  let centers: RGB[] = [];
  const spread = Math.floor(pixels.length / k);
  for (let i = 0; i < k; i++) {
    centers.push(pixels[Math.min(i * spread + Math.floor(spread / 2), pixels.length - 1)]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const clusters: RGB[][] = Array.from({ length: k }, () => []);
    for (let i = 0; i < pixels.length; i++) {
      const px = pixels[i];
      let minD = Infinity, minI = 0;
      for (let j = 0; j < k; j++) {
        const d = colorDist(px, centers[j]);
        if (d < minD) { minD = d; minI = j; }
      }
      clusters[minI].push(px);
    }
    
    let moved = false;
    const nextCenters: RGB[] = clusters.map((cl, i) => {
      if (cl.length === 0) return centers[i];
      const sum = cl.reduce(([ar, ag, ab], [r, g, b]) => [ar + r, ag + g, ab + b] as RGB, [0, 0, 0] as RGB);
      const newCenter: RGB = [Math.round(sum[0] / cl.length), Math.round(sum[1] / cl.length), Math.round(sum[2] / cl.length)];
      if (colorDist(newCenter, centers[i]) > 1) moved = true;
      return newCenter;
    });
    centers = nextCenters;
    if (!moved) break;
  }

  return centers.sort((a, b) => {
    const lumA = 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
    const lumB = 0.2126 * b[0] + 0.7152 * b[1] + 0.0722 * b[2];
    return lumB - lumA;
  });
}

export default function ColorExtractorTool() {
  const [colors, setColors] = useState<RGB[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [count, setCount] = useState(8);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setLoading(true);
    setColors([]);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const MAX_SIZE = 250; 
      const scale = Math.min(1, MAX_SIZE / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const pixels: RGB[] = [];
      for (let i = 0; i < imageData.length; i += 16) {
        if (imageData[i + 3] < 128) continue; 
        pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
      }
      setTimeout(() => {
        setColors(kMeans(pixels, count));
        setLoading(false);
      }, 50);
    };
    img.src = url;
  }, [count, previewUrl]);

  const copyAs = (format: 'hex' | 'css' | 'tailwind' | 'json') => {
    const hexes = colors.map(rgbToHex);
    let text = '';
    switch (format) {
      case 'hex': text = hexes.join('\n'); break;
      case 'css': text = hexes.map((h, i) => `--color-${i + 1}: ${h};`).join('\n'); break;
      case 'tailwind': text = JSON.stringify(Object.fromEntries(hexes.map((h, i) => [`color-${i + 1}`, h])), null, 2); break;
      case 'json': text = JSON.stringify(hexes, null, 2); break;
    }
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
        <div className="flex items-center gap-4">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Quantity</label>
          <div className="flex bg-white/[0.03] p-1 rounded-xl border border-white/[0.08]">
            {[4, 6, 8, 10, 12].map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                  count === n 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        
        {colors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600 mr-2">Export</span>
            <button onClick={() => copyAs('hex')} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">HEX</button>
            <button onClick={() => copyAs('css')} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">CSS</button>
            <button onClick={() => copyAs('tailwind')} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-black text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">TW</button>
          </div>
        )}
      </div>

      <Dropzone 
        onFileSelect={processImage} 
        previewUrl={previewUrl}
        loading={loading}
      />

      {colors.length > 0 && !loading && (
        <div className="space-y-8 pt-4 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
              <div className="h-5 w-1 bg-accent/40 rounded-full" />
              Extracted Harmony
            </h2>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">Select to copy</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5">
            {colors.map((c, i) => (
              <ColorSwatch key={`${i}-${rgbToHex(c)}`} color={rgbToHex(c)} />
            ))}
          </div>
        </div>
      )}
      
      {!previewUrl && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                <Shield size={24} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tighter">Autonomous</h4>
            <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">Neural clustering runs 100% locally. Zero telemetry. Absolute privacy.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                <Palette size={24} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tighter">High Fidelity</h4>
            <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">Advanced K-Means algorithm isolates the most impactful brand colors instantly.</p>
          </div>
          <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent">
                <Code size={24} />
            </div>
            <h4 className="text-sm font-black uppercase tracking-tighter">Protocol Ready</h4>
            <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">One-click export to Tailwind, CSS, or JSON for immediate engineering integration.</p>
          </div>
        </div>
      )}
    </div>
  );
}
