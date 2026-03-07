'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';

type Status = 'idle' | 'loading-model' | 'processing' | 'done' | 'error';

function BackgroundRemoverToolInner() {
  const [status, setStatus] = useState<Status>('idle');
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [comparePos, setComparePos] = useState(50);
  const lastFileRef = useRef<File | null>(null);

  const processFile = useCallback(async (file: File) => {
    lastFileRef.current = file;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    setError(null);
    setResultUrl(null);
    setProgress(0);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setStatus('loading-model');

    try {
      const { removeBackground } = await import('@imgly/background-removal');
      setStatus('processing');
      setProgress(30);

      const blob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (total > 0) setProgress(Math.round((current / total) * 70) + 30);
        },
      });

      setProgress(100);
      setResultUrl(URL.createObjectURL(blob));
      setStatus('done');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Background removal failed.');
      setStatus('error');
    }
  }, []);

  const reset = () => {
    setStatus('idle');
    setOriginalUrl(null);
    setResultUrl(null);
    setError(null);
    setProgress(0);
    setComparePos(50);
  };

  const searchParams = useSearchParams();
  const preloadUrl = searchParams.get('imageUrl');

  useEffect(() => {
    if (!preloadUrl) return;
    fetch(preloadUrl)
      .then(r => r.blob())
      .then(blob => {
        const ext = blob.type.split('/')[1] ?? 'png';
        processFile(new File([blob], `image.${ext}`, { type: blob.type }));
      })
      .catch(() => setError('Failed to load image from URL.'));
  }, [preloadUrl, processFile]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {status === 'idle' && (
        <Dropzone 
            onFileSelect={processFile}
            label="Drop an image to remove background"
            description="Supports PNG, JPG, WebP, AVIF. 100% Client-side."
        />
      )}

      {(status === 'loading-model' || status === 'processing') && (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full" />
                <div 
                    className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin" 
                    style={{ animationDuration: '1s' }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-white">
                    {progress}%
                </div>
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">
                    {status === 'loading-model' ? 'Loading AI Model...' : 'Removing Background...'}
                </h3>
                <p className="text-sm text-white/40 max-w-xs">
                    {status === 'loading-model' 
                        ? 'Fetching neural network (~3MB). This only happens once.' 
                        : 'Using on-device AI to isolate your subject.'}
                </p>
            </div>
        </div>
      )}

      {status === 'error' && (
        <Card className="border-danger/20 bg-danger/5">
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-12 h-12 rounded-full bg-danger/20 flex items-center justify-center text-danger">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="text-center">
                    <h4 className="text-white font-bold">Something went wrong</h4>
                    <p className="text-sm text-white/50 mt-1">{error}</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => lastFileRef.current && processFile(lastFileRef.current)}>Try Again</Button>
                    <Button variant="ghost" onClick={reset}>Choose Another Image</Button>
                </div>
            </div>
        </Card>
      )}

      {status === 'done' && resultUrl && originalUrl && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Result Area */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="relative aspect-square md:aspect-video rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl group">
                        {/* Background Checkerboard (Target) */}
                        <div className="absolute inset-0" 
                            style={{ 
                                backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                                backgroundSize: '20px 20px',
                                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                            }} 
                        />
                        
                        {/* Original (Behind) */}
                        <img src={originalUrl} alt="Original" className="absolute inset-0 w-full h-full object-contain" />
                        
                        {/* Result (Clipped) */}
                        <div className="absolute inset-0 overflow-hidden" style={{ width: `${comparePos}%` }}>
                             <div className="absolute inset-0" 
                                style={{ 
                                    backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
                                    backgroundSize: '20px 20px',
                                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                                }} 
                            />
                            <img 
                                src={resultUrl} 
                                alt="Processed" 
                                className="absolute inset-0 h-full object-contain" 
                                style={{ width: `${(100 / comparePos) * 100}%`, maxWidth: 'none' }}
                            />
                        </div>

                        {/* Divider */}
                        <div className="absolute top-0 bottom-0 pointer-events-none z-20" style={{ left: `${comparePos}%`, width: '2px', background: 'white' }}>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-4 4 4 4m8-8l4 4-4 4" /></svg>
                            </div>
                        </div>

                        {/* Invisible range for interaction */}
                        <input 
                            type="range" 
                            min="0" max="100" 
                            value={comparePos} 
                            onChange={e => setComparePos(Number(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                        />

                        {/* Labels */}
                        <div className="absolute bottom-4 left-4 z-40 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">Removed</div>
                        <div className="absolute bottom-4 right-4 z-40 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest border border-white/10">Original</div>
                    </div>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card title="Download Result">
                        <div className="space-y-4">
                            <Button 
                                href={resultUrl} 
                                download="background-removed.png" 
                                className="w-full" 
                                size="lg"
                                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                            >
                                Download PNG
                            </Button>
                            <p className="text-center text-[10px] text-white/30 uppercase font-black tracking-tighter">Transparency preserved</p>
                        </div>
                    </Card>

                    <Card title="Tools">
                        <Button variant="secondary" className="w-full" onClick={reset}>
                            Process Another
                        </Button>
                    </Card>

                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white/90 mb-1">Privacy Guarantee</h4>
                            <p className="text-xs text-white/40 leading-relaxed">
                                Images are processed strictly on your machine using WASM. We never see your data.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

export default function BackgroundRemoverTool() {
  return (
    <Suspense fallback={null}>
      <BackgroundRemoverToolInner />
    </Suspense>
  );
}
