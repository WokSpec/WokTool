'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Dropzone from '@/components/ui/Dropzone';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

type CompressFormat = 'image/jpeg' | 'image/webp';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function ImageCompressTool() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<CompressFormat>('image/jpeg');
  const [fileName, setFileName] = useState('compressed');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const compress = useCallback((img: HTMLImageElement, fmt: CompressFormat, q: number) => {
    setError(null);
    setIsLoading(true);
    
    // Small delay to allow UI to update to "loading" state
    setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Canvas context unavailable');
        }
        
        // Draw image on white background (for JPEGs with transparency)
        if (fmt === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              throw new Error('Compression failed');
            }
            
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            const newUrl = URL.createObjectURL(blob);
            
            setCompressedSize(blob.size);
            setCompressedUrl(newUrl);
            setIsLoading(false);
          },
          fmt,
          q / 100
        );
      } catch (err) {
        setError('Failed to compress image. Please try another file.');
        setIsLoading(false);
      }
    }, 50);
  }, [compressedUrl]);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, WebP)');
        return;
    }

    const url = URL.createObjectURL(file);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    
    setOriginalUrl(url);
    setOriginalSize(file.size);
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    setCompressedUrl(null);
    
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      compress(img, format, quality);
    };
    img.onerror = () => {
        setError('Failed to load image.');
    };
    img.src = url;
  }, [originalUrl, format, quality, compress]);

  // Debounced re-compression
  useEffect(() => {
    if (!imgRef.current) return;
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      compress(imgRef.current!, format, quality);
    }, 200);
    
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [quality, format, compress]);

  const savings = originalSize > 0 && compressedSize > 0
    ? Math.round((1 - compressedSize / originalSize) * 100)
    : 0;
    
  const ext = format === 'image/jpeg' ? 'jpg' : 'webp';

  const reset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setOriginalUrl(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
    imgRef.current = null;
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Input Area */}
      {!originalUrl && (
        <Dropzone 
          onFileSelect={processFile}
          accept="image/png,image/jpeg,image/webp,image/gif"
          label="Drop an image to compress"
          description="Supports PNG, JPG, WebP up to 50MB"
        />
      )}

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
        </div>
      )}

      {/* Editor UI */}
      {originalUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls Sidebar */}
            <div className="space-y-6">
                <Card title="Settings">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-3">Output Format</label>
                            <div className="grid grid-cols-2 gap-2 bg-surface-raised p-1 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setFormat('image/jpeg')}
                                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                                        format === 'image/jpeg' 
                                            ? 'bg-accent text-white shadow-md' 
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    JPG
                                </button>
                                <button
                                    onClick={() => setFormat('image/webp')}
                                    className={`py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                                        format === 'image/webp' 
                                            ? 'bg-accent text-white shadow-md' 
                                            : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    WebP
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Slider
                                label="Quality"
                                value={quality}
                                min={1}
                                max={100}
                                onChange={setQuality}
                                unit="%"
                            />
                            <p className="text-xs text-white/40">
                                Lower quality results in smaller file sizes but may reduce image detail.
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-sm text-white/60">Original Size</span>
                            <span className="font-mono text-white">{formatBytes(originalSize)}</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-sm text-white/60">Compressed Size</span>
                            <span className={`font-mono font-bold ${isLoading ? 'opacity-50' : 'text-white'}`}>
                                {compressedSize > 0 ? formatBytes(compressedSize) : '...'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-white/60">Savings</span>
                            <span className={`font-mono font-bold ${savings > 0 ? 'text-success' : 'text-white/40'}`}>
                                {savings > 0 ? `-${savings}%` : '0%'}
                            </span>
                        </div>

                        <div className="pt-4 grid grid-cols-2 gap-3">
                            <Button 
                                variant="secondary" 
                                onClick={reset} 
                                className="w-full"
                            >
                                Reset
                            </Button>
                            {compressedUrl && (
                                <a 
                                    href={compressedUrl} 
                                    download={`${fileName}-compressed.${ext}`}
                                    className="inline-flex items-center justify-center font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none gap-2 bg-accent text-white shadow-lg hover:bg-accent-hover hover:shadow-accent/25 hover:shadow-xl hover:-translate-y-0.5 text-sm px-5 py-2.5 w-full"
                                >
                                    Download
                                </a>
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-2 space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl aspect-[4/3] group">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20" 
                        style={{ 
                            backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }} 
                    />
                    
                    {/* Images */}
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        {compressedUrl ? (
                            <img 
                                src={compressedUrl} 
                                alt="Preview" 
                                className={`max-w-full max-h-full object-contain shadow-xl transition-opacity duration-300 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100'}`} 
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-white/30">
                                <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm font-medium">Processing...</span>
                            </div>
                        )}
                    </div>

                    {/* Compare Hint */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Previewing Compressed Result
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
