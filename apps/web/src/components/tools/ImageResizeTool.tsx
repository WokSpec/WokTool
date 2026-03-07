'use client';

import { useState, useRef, useCallback } from 'react';
import Dropzone from '@/components/ui/Dropzone';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

type FitMode = 'contain' | 'cover' | 'fill';

const PRESETS = [
  { label: 'Instagram Post', w: 1080, h: 1080 },
  { label: 'Instagram Story', w: 1080, h: 1920 },
  { label: 'Twitter/X Post', w: 1200, h: 675 },
  { label: 'Facebook Cover', w: 820, h: 312 },
  { label: 'LinkedIn Banner', w: 1584, h: 396 },
  { label: 'YouTube Thumbnail', w: 1280, h: 720 },
  { label: 'OG Image', w: 1200, h: 630 },
];

const FIT_MODES = [
  { value: 'contain', label: 'Contain (Letterbox)' },
  { value: 'cover', label: 'Cover (Crop)' },
  { value: 'fill', label: 'Fill (Stretch)' },
];

const OUTPUT_FORMATS = [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPG' },
    { value: 'image/webp', label: 'WebP' },
];

export default function ImageResizeTool() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [fitMode, setFitMode] = useState<FitMode>('contain');
  const [fileName, setFileName] = useState('resized');
  const [naturalW, setNaturalW] = useState(0);
  const [naturalH, setNaturalH] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/png'|'image/jpeg'|'image/webp'>('image/png');
  const [quality, setQuality] = useState(90);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file');
        return;
    }
    
    setError(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
    setFileName(file.name.replace(/\.[^.]+$/, ''));
    
    const img = new window.Image();
    img.onload = () => {
      imgRef.current = img;
      setNaturalW(img.naturalWidth);
      setNaturalH(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
    };
    img.onerror = () => setError('Failed to load image');
    img.src = url;
  }, [originalUrl, resultUrl]);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && naturalW && naturalH) {
      setHeight(Math.round(val * naturalH / naturalW));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && naturalW && naturalH) {
      setWidth(Math.round(val * naturalW / naturalH));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setWidth(w);
    setHeight(h);
  };

  const doResize = useCallback(() => {
    setError(null);
    const img = imgRef.current;
    if (!img) {
      setError('No image loaded');
      return;
    }
    if (!width || !height) {
      setError('Invalid dimensions');
      return;
    }
    
    setIsLoading(true);

    // Small timeout to allow UI to update
    setTimeout(() => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Canvas not available');
            }

            // Fill background with white/black depending on format if needed, 
            // but let's default to black for letterboxing as standard practice or transparent for PNG
            if (outputFormat === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
            } else {
                ctx.fillStyle = 'rgba(0,0,0,0)'; // Transparent
            }
            
            // For 'contain' mode with letterboxing, maybe black is better? 
            // Let's stick to transparency for PNG/WebP and White for JPG
            if (fitMode === 'contain' && outputFormat === 'image/jpeg') {
                 ctx.fillStyle = '#FFFFFF';
            }
            
            ctx.fillRect(0, 0, width, height);

            if (fitMode === 'fill') {
                ctx.drawImage(img, 0, 0, width, height);
            } else if (fitMode === 'contain') {
                const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
                const sw = img.naturalWidth * scale;
                const sh = img.naturalHeight * scale;
                // If JPG and contain, we might want black bars instead of white? 
                // Let's keep it simple for now.
                ctx.drawImage(img, (width - sw) / 2, (height - sh) / 2, sw, sh);
            } else {
                // cover — crop center
                const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
                const sw = img.naturalWidth * scale;
                const sh = img.naturalHeight * scale;
                ctx.drawImage(img, (width - sw) / 2, (height - sh) / 2, sw, sh);
            }

            canvas.toBlob(blob => {
                if (!blob) {
                    throw new Error('Failed to create image');
                }
                
                if (resultUrl) URL.revokeObjectURL(resultUrl);
                setResultUrl(URL.createObjectURL(blob));
                setIsLoading(false);
            }, outputFormat, outputFormat === 'image/png' ? undefined : quality / 100);
        } catch (err) {
            setError('Resize failed');
            setIsLoading(false);
        }
    }, 50);
  }, [width, height, fitMode, resultUrl, outputFormat, quality]);

  const reset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalUrl(null);
    setResultUrl(null);
    imgRef.current = null;
    setNaturalW(0);
    setNaturalH(0);
    setError(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Drop zone */}
      {!originalUrl && (
        <Dropzone 
          onFileSelect={loadFile}
          accept="image/*"
          label="Drop an image to resize"
          description="Supports PNG, JPG, WebP, GIF"
        />
      )}

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
            Error: {error}
        </div>
      )}

      {originalUrl && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings */}
            <div className="space-y-6">
                <Card title="Dimensions">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Input 
                                label="Width" 
                                type="number" 
                                value={width} 
                                onChange={e => handleWidthChange(Number(e.target.value))}
                                min={1}
                            />
                            <Input 
                                label="Height" 
                                type="number" 
                                value={height} 
                                onChange={e => handleHeightChange(Number(e.target.value))}
                                min={1}
                            />
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setLockAspect(!lockAspect)}
                                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                                    lockAspect ? 'text-accent' : 'text-white/40 hover:text-white'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {lockAspect ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                    )}
                                </svg>
                                {lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                            </button>
                            
                            {naturalW > 0 && (
                                <span className="text-xs text-white/40 font-mono">
                                    Orig: {naturalW}×{naturalH}
                                </span>
                            )}
                        </div>
                    </div>
                </Card>

                <Card title="Options">
                    <div className="space-y-6">
                        <Select 
                            label="Fit Mode"
                            value={fitMode}
                            onChange={(e) => setFitMode(e.target.value as FitMode)}
                            options={FIT_MODES}
                        />
                        
                        <Select 
                            label="Output Format"
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value as any)}
                            options={OUTPUT_FORMATS}
                        />
                        
                        {outputFormat !== 'image/png' && (
                            <Slider
                                label="Quality"
                                value={quality}
                                min={1}
                                max={100}
                                onChange={setQuality}
                                unit="%"
                            />
                        )}
                    </div>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider">Social Presets</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {PRESETS.map(p => (
                            <button
                                key={p.label}
                                onClick={() => applyPreset(p.w, p.h)}
                                className="text-left p-2.5 rounded-lg bg-surface-raised border border-white/5 hover:border-accent/30 hover:bg-white/5 transition-all group"
                            >
                                <div className="text-xs font-semibold text-white/80 group-hover:text-white">{p.label}</div>
                                <div className="text-[10px] text-white/40 font-mono mt-0.5">{p.w} × {p.h}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2 space-y-6">
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl min-h-[400px] flex items-center justify-center p-8">
                     {/* Checkerboard */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)',
                            backgroundSize: '20px 20px',
                            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }} 
                    />
                    
                    {resultUrl ? (
                        <img 
                            src={resultUrl} 
                            alt="Resized" 
                            className="max-w-full max-h-[600px] object-contain shadow-2xl animate-in zoom-in-95 duration-300" 
                        />
                    ) : (
                         <div className="text-center opacity-40">
                            <p className="text-sm">Preview will appear here after resizing</p>
                        </div>
                    )}
                    
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                             <div className="w-10 h-10 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
                             <p className="text-sm font-medium text-white">Processing...</p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Button onClick={doResize} size="lg" className="flex-1" loading={isLoading}>
                        {resultUrl ? 'Update Resize' : 'Resize Image'}
                    </Button>
                    
                    {resultUrl && (
                        <Button 
                            href={resultUrl} 
                            download={`${fileName}-${width}x${height}.${outputFormat === 'image/png' ? 'png' : outputFormat === 'image/jpeg' ? 'jpg' : 'webp'}`} 
                            variant="secondary" 
                            size="lg"
                            className="flex-1"
                        >
                            Download
                        </Button>
                    )}
                    
                    <Button onClick={reset} variant="ghost" size="lg">
                        Reset
                    </Button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
