'use client';

import { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const SIZES = [
  { label: '16×16', size: 16, name: 'favicon-16x16.png' },
  { label: '32×32', size: 32, name: 'favicon-32x32.png' },
  { label: '48×48', size: 48, name: 'favicon-48x48.png' },
  { label: '180×180 (Apple)', size: 180, name: 'apple-touch-icon.png' },
  { label: '192×192 (Android)', size: 192, name: 'android-chrome-192x192.png' },
  { label: '512×512 (Android)', size: 512, name: 'android-chrome-512x512.png' },
];

function renderToCanvas(img: HTMLImageElement, size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  // High quality resampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
  const sw = img.naturalWidth * scale;
  const sh = img.naturalHeight * scale;
  ctx.drawImage(img, (size - sw) / 2, (size - sh) / 2, sw, sh);
  return canvas;
}

export default function FaviconTool() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{ size: number; url: string }[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const processImage = useCallback((img: HTMLImageElement) => {
    const previewSizes = [16, 32, 48, 128, 180];
    const newPreviews = previewSizes.map(size => {
      const canvas = renderToCanvas(img, size);
      return { size, url: canvas.toDataURL('image/png') };
    });
    setPreviews(newPreviews);
  }, []);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      processImage(img);
    };
    img.src = url;
  }, [processImage]);

  const downloadAll = useCallback(async () => {
    const img = imgRef.current;
    if (!img) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const { size, name } of SIZES) {
        const canvas = renderToCanvas(img, size);
        const dataUrl = canvas.toDataURL('image/png');
        zip.file(name, dataUrl.split(',')[1], { base64: true });
      }
      
      // Add a simple site.webmanifest
      const manifest = {
        name: "WokTool Favicon Package",
        short_name: "WokTool",
        icons: [
            { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
            { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      };
      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));

      const blob = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'favicon-package.zip';
      a.click();
    } finally {
      setIsZipping(false);
    }
  }, []);

  const reset = () => {
    setOriginalUrl(null);
    setPreviews([]);
    imgRef.current = null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!originalUrl ? (
        <Dropzone 
            onFileSelect={loadFile} 
            label="Drop your logo to generate favicons"
            description="High-resolution PNG or SVG works best. Square aspect ratio preferred."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Previews */}
            <div className="space-y-6">
                <Card title="Live Previews">
                    <div className="flex flex-wrap gap-6 justify-center">
                        {previews.map(p => (
                            <div key={p.size} className="flex flex-col items-center gap-2">
                                <div 
                                    className="bg-white rounded-lg shadow-xl border border-white/10 flex items-center justify-center p-1"
                                    style={{ width: Math.max(p.size, 48), height: Math.max(p.size, 48) }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={p.url}
                                        alt={`${p.size}px`}
                                        style={{ width: p.size, height: p.size, imageRendering: p.size <= 32 ? 'pixelated' : 'auto' }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{p.size}px</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <Button variant="primary" className="w-full" onClick={downloadAll} loading={isZipping}>
                        Download Full Package (.zip)
                    </Button>
                    <Button variant="ghost" className="w-full" size="sm" onClick={reset}>
                        Reset & Upload Another
                    </Button>
                </div>
            </div>

            {/* Right: File List */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Included Assets</h3>
                <div className="grid grid-cols-1 gap-2">
                    {SIZES.map(({ label, size, name }) => (
                        <div key={name} className="group flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white/80">{name}</div>
                                    <div className="text-[10px] font-mono text-white/20 uppercase">{label} • PNG</div>
                                </div>
                            </div>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => {
                                    const canvas = renderToCanvas(imgRef.current!, size);
                                    canvas.toBlob(blob => {
                                        if (!blob) return;
                                        const a = document.createElement('a');
                                        a.href = URL.createObjectURL(blob);
                                        a.download = name; a.click();
                                    });
                                }}
                            >
                                Save
                            </Button>
                        </div>
                    ))}
                    <div className="p-4 rounded-xl border border-dashed border-white/5 bg-white/[0.01]">
                        <div className="text-sm font-bold text-white/60 mb-1">site.webmanifest</div>
                        <p className="text-xs text-white/20">Standard JSON manifest for PWA support and modern browser metadata.</p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
