'use client';

import { useState, useRef, useCallback, useMemo } from 'react';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import Switch from '@/components/ui/Switch';

interface Preset {
  id: string;
  platform: string;
  label: string;
  w: number;
  h: number;
  selected: boolean;
}

const DEFAULT_PRESETS: Preset[] = [
  { id: 'ig-post',    platform: 'Instagram', label: 'Post (Square)',    w: 1080, h: 1080, selected: true },
  { id: 'ig-story',   platform: 'Instagram', label: 'Story / Reel',    w: 1080, h: 1920, selected: true },
  { id: 'tw-post',    platform: 'Twitter/X', label: 'Post',            w: 1600, h: 900,  selected: true },
  { id: 'fb-post',    platform: 'Facebook',  label: 'Post',            w: 1200, h: 630,  selected: true },
  { id: 'li-post',    platform: 'LinkedIn',  label: 'Post',            w: 1200, h: 627,  selected: true },
  { id: 'yt-thumb',   platform: 'YouTube',   label: 'Thumbnail',       w: 1280, h: 720,  selected: true },
  { id: 'og',         platform: 'Web',       label: 'Open Graph',      w: 1200, h: 630,  selected: true },
];

type Fit = 'cover' | 'contain' | 'fill';

async function resizeToCanvas(img: HTMLImageElement, w: number, h: number, fit: Fit): Promise<string> {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  
  // High quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);

  const iw = img.naturalWidth, ih = img.naturalHeight;
  let dx = 0, dy = 0, dw = w, dh = h;

  if (fit === 'cover') {
    const scale = Math.max(w / iw, h / ih);
    dw = iw * scale; dh = ih * scale;
    dx = (w - dw) / 2; dy = (h - dh) / 2;
  } else if (fit === 'contain') {
    const scale = Math.min(w / iw, h / ih);
    dw = iw * scale; dh = ih * scale;
    dx = (w - dw) / 2; dy = (h - dh) / 2;
  }

  ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
  return c.toDataURL('image/png');
}

export default function SocialResizeTool() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS);
  const [fit, setFit] = useState<Fit>('cover');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<{ id: string; url: string; label: string; platform: string; w: number; h: number }[]>([]);

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    const img = new window.Image();
    img.onload = () => {
        setImage(img);
        setResults([]);
    };
    img.src = url;
  }, []);

  const togglePreset = (id: string) => {
    setPresets(p => p.map(x => x.id === id ? { ...x, selected: !x.selected } : x));
  };

  const generateAll = useCallback(async () => {
    if (!image) return;
    setIsProcessing(true);
    const selected = presets.filter(p => p.selected);
    const out: typeof results = [];

    for (const p of selected) {
      const url = await resizeToCanvas(image, p.w, p.h, fit);
      out.push({ id: p.id, url, label: p.label, platform: p.platform, w: p.w, h: p.h });
    }

    setResults(out);
    setIsProcessing(false);
  }, [image, presets, fit]);

  const downloadAll = async () => {
    if (!results.length) return;
    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    results.forEach(r => {
      const base64 = r.url.split(',')[1];
      zip.file(`${r.platform}-${r.label}-${r.w}x${r.h}.png`, base64, { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'social-exports.zip';
    a.click();
  };

  const platforms = useMemo(() => Array.from(new Set(DEFAULT_PRESETS.map(p => p.platform))), []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!previewUrl ? (
        <Dropzone 
            onFileSelect={loadFile}
            label="Drop an image to batch resize for social media"
            description="PNG, JPG, WebP supported. All processing is local."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar: Settings */}
            <div className="space-y-6">
                <Card title="Configuration">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-white/40">Fit Mode</span>
                            <Tabs 
                                activeTab={fit}
                                onChange={id => setFit(id as Fit)}
                                tabs={[
                                    { id: 'cover', label: 'Cover' },
                                    { id: 'contain', label: 'Contain' },
                                    { id: 'fill', label: 'Stretch' },
                                ]}
                                className="scale-90 origin-right"
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest">Select Targets</h4>
                            {platforms.map(platform => (
                                <div key={platform} className="space-y-2">
                                    <div className="text-[10px] font-bold text-accent uppercase">{platform}</div>
                                    <div className="space-y-1">
                                        {presets.filter(p => p.platform === platform).map(p => (
                                            <label key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={p.selected} 
                                                        onChange={() => togglePreset(p.id)}
                                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent"
                                                    />
                                                    <span className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">{p.label}</span>
                                                </div>
                                                <span className="text-[10px] font-mono text-white/20">{p.w}×{p.h}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button onClick={generateAll} className="w-full" size="lg" loading={isProcessing}>
                                Generate {presets.filter(p => p.selected).length} Sizes
                            </Button>
                            <Button variant="ghost" onClick={() => { setPreviewUrl(null); setImage(null); setResults([]); }} className="w-full" size="sm">
                                Change Source Image
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main: Results */}
            <div className="lg:col-span-2 space-y-6">
                {results.length > 0 ? (
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <span className="w-2 h-5 bg-success rounded-full" />
                                Generated Results ({results.length})
                            </h3>
                            <Button variant="secondary" size="sm" onClick={downloadAll}>
                                Download All (.zip)
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.map((r) => (
                                <Card key={r.id} className="p-0 overflow-hidden border-white/10 group">
                                    <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center p-4 border-b border-white/5 overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={r.url} alt={r.label} className="max-w-full max-h-full object-contain shadow-2xl transition-transform group-hover:scale-105 duration-500" />
                                    </div>
                                    <div className="p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-accent uppercase">{r.platform}</div>
                                            <div className="text-xs font-bold text-white/80">{r.label}</div>
                                            <div className="text-[10px] font-mono text-white/30">{r.w} × {r.h} px</div>
                                        </div>
                                        <Button href={r.url} download={`${r.platform}-${r.label}.png`} variant="secondary" size="sm">
                                            Save
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="h-full min-h-[500px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 overflow-hidden">
                        <div className="relative w-48 aspect-video mb-8">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-xl opacity-20 grayscale" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center animate-pulse">
                                    <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.587-1.587a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white/80 mb-2">Ready to resize</h3>
                        <p className="text-sm text-white/30 max-w-xs">Select the social media formats you need from the sidebar and click generate to process them all at once.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
