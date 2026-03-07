'use client';

import { useState, useCallback, useRef } from 'react';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Dropzone from '@/components/ui/Dropzone';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ToolShell from '@/components/tools/ToolShell';

interface UpscaleResult {
  url: string;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  durationMs: number;
}

type Scale = 2 | 4;

export function UpscaleClient() {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scale, setScale] = useState<Scale>(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UpscaleResult | null>(null);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleUpscale = useCallback(async () => {
    const finalUrl = inputMode === 'url' ? imageUrl : previewUrl;
    if (!finalUrl) return;

    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/tools/upscale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: finalUrl, scale }),
      });
      if (!response.ok) throw new Error('Upscale failed');
      const data = await response.json() as UpscaleResult;
      setResult(data);
    } catch (e) {
      setError('AI upscaling service is currently busy or the image is too large. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  }, [imageUrl, previewUrl, inputMode, scale]);

  return (
    <ToolShell id="upscale" label="4× AI Image Upscaler" description="Sharpen and enlarge images up to 4× their original size using Real-ESRGAN models." icon="✨">
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card title="Enhance Resolution" description="Select your scale factor and upload an image to increase detail and size using on-device AI.">
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <Tabs 
                            activeTab={inputMode}
                            onChange={id => setInputMode(id as any)}
                            tabs={[
                                { id: 'upload', label: 'Upload', icon: '📁' },
                                { id: 'url', label: 'URL', icon: '🔗' },
                            ]}
                            className="w-full max-w-xs"
                        />
                    </div>

                    {inputMode === 'upload' ? (
                        <Dropzone onFileSelect={processFile} previewUrl={previewUrl} className="h-48" />
                    ) : (
                        <Input 
                            placeholder="https://example.com/photo.jpg"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
                        />
                    )}

                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-bold uppercase text-white/40">Scale Factor</span>
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            {([2, 4] as Scale[]).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setScale(s)}
                                    className={`px-6 py-1.5 rounded-lg text-sm font-black transition-all ${
                                        scale === s ? 'bg-accent text-white shadow-lg' : 'text-white/30 hover:text-white/60'
                                    }`}
                                >
                                    {s}×
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button 
                        onClick={handleUpscale} 
                        className="w-full" 
                        size="lg" 
                        loading={loading}
                        disabled={inputMode === 'url' ? !imageUrl.trim() : !previewUrl}
                    >
                        {loading ? 'Processing AI...' : 'Upscale Image'}
                    </Button>

                    {error && (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                            {error}
                        </div>
                    )}
                </div>
            </Card>

            {result && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <Card title="Before" className="p-0 overflow-hidden border-white/10">
                            <div className="p-2 bg-white/[0.02] border-b border-white/5 flex justify-between px-4">
                                <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{result.originalWidth}×{result.originalHeight}</span>
                            </div>
                            <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewUrl ?? imageUrl} alt="Before" className="max-w-full max-h-full object-contain" />
                            </div>
                        </Card>

                        <Card title="After (Upscaled)" className="p-0 overflow-hidden border-white/10 ring-2 ring-accent/30">
                            <div className="p-2 bg-accent/5 border-b border-white/5 flex justify-between px-4">
                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{result.width}×{result.height}</span>
                                <span className="text-[10px] font-bold text-success uppercase">{Math.round(result.durationMs/1000)}s process</span>
                            </div>
                            <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center p-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={result.url} alt="After" className="max-w-full max-h-full object-contain shadow-2xl" />
                            </div>
                        </Card>
                    </div>

                    <Button 
                        href={result.url} 
                        download="upscaled-image.png" 
                        variant="primary" 
                        size="lg" 
                        className="w-full"
                        icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                    >
                        Download Full Resolution PNG
                    </Button>
                </div>
            )}
        </div>
    </ToolShell>
  );
}
