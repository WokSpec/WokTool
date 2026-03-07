'use client';

import { useState, useRef, useCallback } from 'react';
import Dropzone from '@/components/ui/Dropzone';
import Slider from '@/components/ui/Slider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';
import Tabs from '@/components/ui/Tabs';
import CodeBlock from '@/components/ui/CodeBlock';

type RGB = [number, number, number];
type ExportFormat = 'css' | 'tailwind' | 'json' | 'scss';

function rgbToHex([r, g, b]: RGB) {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toLowerCase();
}

function rgbStr([r, g, b]: RGB) {
  return `rgb(${r}, ${g}, ${b})`;
}

function colorName(i: number) {
  return `color-${i + 1}`;
}

function generateExport(colors: RGB[], format: ExportFormat): string {
  if (colors.length === 0) return '';
  const hexes = colors.map(rgbToHex);
  
  switch (format) {
    case 'css':
      return `:root {\n${hexes.map((h, i) => `  --${colorName(i)}: ${h};`).join('\n')}\n}`;
    case 'tailwind':
      const obj = Object.fromEntries(hexes.map((h, i) => [colorName(i), h]));
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(obj, null, 2)}\n    },\n  },\n};`;
    case 'json':
      return JSON.stringify(hexes.map((h, i) => ({ name: colorName(i), hex: h, rgb: rgbStr(colors[i]) })), null, 2);
    case 'scss':
      return hexes.map((h, i) => `$${colorName(i)}: ${h};`).join('\n');
    default:
      return '';
  }
}

export default function ColorPaletteTool() {
  const [colors, setColors] = useState<RGB[]>([]);
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('css');
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const extractColors = useCallback(async (src: string, colorCount: number) => {
    setLoading(true);
    setImgSrc(src);
    
    // We'll use a dynamic import for color-thief-browser if possible, 
    // but for reliability let's use our own K-Means or similar if it's not available.
    // Actually, I'll use the same K-Means logic I wrote for ColorExtractorTool as it's built-in and fast.
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 200;
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

        // Simple K-Means
        setTimeout(() => {
            const palette = kMeans(pixels, colorCount);
            setColors(palette);
            setLoading(false);
        }, 50);
    };
    img.src = src;
  }, []);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    extractColors(url, count);
  }, [count, extractColors]);

  const exportedCode = generateExport(colors, format);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <Card title="Source Image">
                <Dropzone 
                    onFileSelect={handleFile}
                    previewUrl={imgSrc}
                    loading={loading}
                    className={imgSrc ? 'h-auto py-4' : 'h-48'}
                />
            </Card>

            <Card title="Settings">
                <div className="space-y-6">
                    <Slider 
                        label="Number of Colors"
                        min={2} max={12}
                        value={count}
                        onChange={(v) => {
                            setCount(v);
                            if (imgSrc) extractColors(imgSrc, v);
                        }}
                    />
                    <Button 
                        variant="secondary" 
                        className="w-full" 
                        onClick={() => imgSrc && extractColors(imgSrc, count)}
                        loading={loading}
                    >
                        Regenerate Palette
                    </Button>
                </div>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
            {colors.length > 0 ? (
                <>
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Extracted Palette</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {colors.map((c, i) => (
                                <ColorSwatch key={`${i}-${rgbToHex(c)}`} color={rgbToHex(c)} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 px-1">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Export Palette</h3>
                            <Tabs 
                                activeTab={format}
                                onChange={(id) => setFormat(id as ExportFormat)}
                                tabs={[
                                    { id: 'css', label: 'CSS' },
                                    { id: 'tailwind', label: 'Tailwind' },
                                    { id: 'scss', label: 'SCSS' },
                                    { id: 'json', label: 'JSON' },
                                ]}
                                className="scale-90 origin-right"
                            />
                        </div>
                        <CodeBlock 
                            code={exportedCode} 
                            language={format === 'json' ? 'json' : format === 'tailwind' ? 'javascript' : 'css'} 
                            maxHeight="300px"
                        />
                    </div>
                </>
            ) : (
                <div className="h-full min-h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12">
                    <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mb-6 text-3xl">🎨</div>
                    <h3 className="text-xl font-bold text-white/80 mb-2">Create your palette</h3>
                    <p className="text-sm text-white/30 max-w-sm">Upload an image to extract its dominant colors and generate a professional color scheme.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

// Reuse K-Means utility
function kMeans(pixels: RGB[], k: number, iterations = 15): RGB[] {
  if (pixels.length === 0) return [];
  if (pixels.length <= k) return pixels;

  let centers: RGB[] = [];
  const spread = Math.floor(pixels.length / k);
  for (let i = 0; i < k; i++) {
    centers.push(pixels[Math.min(i * spread + Math.floor(spread / 2), pixels.length - 1)]);
  }

  for (let iter = 0; iter < iterations; iter++) {
    const clusters: RGB[][] = Array.from({ length: k }, () => []);
    for (const px of pixels) {
      let minD = Infinity, minI = 0;
      for (let j = 0; j < k; j++) {
        const d = (px[0]-centers[j][0])**2 + (px[1]-centers[j][1])**2 + (px[2]-centers[j][2])**2;
        if (d < minD) { minD = d; minI = j; }
      }
      clusters[minI].push(px);
    }
    
    let moved = false;
    const nextCenters: RGB[] = clusters.map((cl, i) => {
      if (cl.length === 0) return centers[i];
      const sum = cl.reduce(([ar, ag, ab], [r, g, b]) => [ar + r, ag + g, ab + b] as RGB, [0, 0, 0] as RGB);
      const newCenter: RGB = [Math.round(sum[0]/cl.length), Math.round(sum[1]/cl.length), Math.round(sum[2]/cl.length)];
      if ((newCenter[0]-centers[i][0])**2 + (newCenter[1]-centers[i][1])**2 + (newCenter[2]-centers[i][2])**2 > 1) moved = true;
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
