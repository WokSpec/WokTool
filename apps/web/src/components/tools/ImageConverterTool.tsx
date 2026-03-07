'use client';

import { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import Dropzone from '@/components/ui/Dropzone';
import Slider from '@/components/ui/Slider';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Card from '@/components/ui/Card';

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

interface ConvertedFile {
  id: string;
  name: string;
  originalSize: number;
  convertedSize: number | null;
  status: 'pending' | 'converting' | 'done' | 'error';
  downloadUrl: string | null;
  error: string | null;
}

const FORMAT_OPTIONS = [
  { label: 'PNG', value: 'image/png' },
  { label: 'JPG', value: 'image/jpeg' },
  { label: 'WebP', value: 'image/webp' },
  { label: 'GIF', value: 'image/gif' },
];

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getOutputExt(fmt: OutputFormat): string {
  return { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }[fmt];
}

async function convertFile(file: File, format: OutputFormat, quality: number): Promise<{ blob: Blob; url: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) { 
        URL.revokeObjectURL(objectUrl); 
        reject(new Error('Canvas context unavailable')); 
        return; 
      }

      // Draw white background for JPEGs (transparency handling)
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Conversion failed')); return; }
          resolve({ blob, url: URL.createObjectURL(blob) });
        },
        format,
        format === 'image/png' || format === 'image/gif' ? 1.0 : Math.max(0, Math.min(1, quality / 100))
      );
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')); };
    img.src = objectUrl;
  });
}

export default function ImageConverterTool() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [format, setFormat] = useState<OutputFormat>('image/png');
  const [quality, setQuality] = useState(85);
  const [isZipping, setIsZipping] = useState(false);
  const fileMapRef = useRef<Map<string, File>>(new Map());

  const hasQuality = format === 'image/jpeg' || format === 'image/webp';
  const showWarning = format === 'image/gif';

  const addFiles = useCallback((incoming: File) => {
    // Dropzone returns a single file, but we can adapt if needed or just add one by one
    // Here we treat the single file from Dropzone as "incoming"
    const arr = [incoming]; 
    if (!arr.length) return;
    
    setFiles(prev => {
      const slots = 10 - prev.length;
      if (slots <= 0) return prev;
      
      const toAdd = arr.slice(0, slots).map((f): ConvertedFile => {
        const id = `${f.name}-${f.size}-${Date.now()}-${Math.random()}`;
        fileMapRef.current.set(id, f);
        return { 
          id, 
          name: f.name, 
          originalSize: f.size, 
          convertedSize: null, 
          status: 'pending', 
          downloadUrl: null, 
          error: null 
        };
      });
      return [...prev, ...toAdd];
    });
  }, []);

  const convertAll = useCallback(async () => {
    const pending = files.filter(f => f.status === 'pending');
    if (!pending.length) return;
    
    for (const cf of pending) {
      const rawFile = fileMapRef.current.get(cf.id);
      if (!rawFile) continue;
      
      setFiles(prev => prev.map(f => f.id === cf.id ? { ...f, status: 'converting' } : f));
      
      try {
        const { blob, url } = await convertFile(rawFile, format, quality);
        const ext = getOutputExt(format);
        const baseName = cf.name.replace(/\.[^.]+$/, '');
        
        setFiles(prev => prev.map(f => f.id === cf.id
          ? { ...f, status: 'done', convertedSize: blob.size, downloadUrl: url, name: `${baseName}.${ext}`, error: null }
          : f
        ));
      } catch (err) {
        setFiles(prev => prev.map(f => f.id === cf.id
          ? { ...f, status: 'error', error: err instanceof Error ? err.message : 'Error' }
          : f
        ));
      }
    }
  }, [files, format, quality]);

  const downloadAll = useCallback(async () => {
    const done = files.filter(f => f.status === 'done' && f.downloadUrl);
    if (!done.length) return;
    
    setIsZipping(true);
    try {
      const zip = new JSZip();
      for (const cf of done) {
        const resp = await fetch(cf.downloadUrl!);
        const buf = await resp.arrayBuffer();
        zip.file(cf.name, buf);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted-images.zip';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsZipping(false);
    }
  }, [files]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    fileMapRef.current.delete(id);
  };

  const clearAll = () => {
    files.forEach(f => { if (f.downloadUrl) URL.revokeObjectURL(f.downloadUrl); });
    fileMapRef.current.clear();
    setFiles([]);
  };

  const hasPending = files.some(f => f.status === 'pending');
  const hasDone = files.some(f => f.status === 'done');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <Card title="Conversion Settings" className="h-full">
            <div className="space-y-6">
                <Select
                    label="Output Format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    options={FORMAT_OPTIONS}
                />
                
                {hasQuality && (
                    <Slider
                        label="Quality"
                        value={quality}
                        min={1}
                        max={100}
                        onChange={setQuality}
                        unit="%"
                    />
                )}
                
                {showWarning && (
                    <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning">
                        GIF output is static (single frame). Animation is not supported.
                    </div>
                )}
            </div>
        </Card>

        {/* Dropzone Panel */}
        <div className="md:col-span-2">
            {files.length < 10 ? (
                <Dropzone 
                    onFileSelect={addFiles}
                    accept="image/*"
                    label="Add images to convert"
                    description={`Batch convert up to 10 files. (${10 - files.length} remaining)`}
                    className="h-full min-h-[240px]"
                />
            ) : (
                <div className="h-full min-h-[240px] flex items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02] text-white/40">
                    Maximum 10 files reached
                </div>
            )}
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-6 bg-accent rounded-full" />
                    Files ({files.length})
                </h3>
                <div className="flex gap-2">
                    {hasDone && (
                        <Button variant="secondary" size="sm" onClick={downloadAll} disabled={isZipping}>
                            {isZipping ? 'Zipping...' : 'Download All (.zip)'}
                        </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={clearAll}>Clear All</Button>
                </div>
            </div>

            <div className="grid gap-3">
                {files.map((f) => (
                    <div key={f.id} className="bg-surface-raised border border-white/5 p-4 rounded-xl flex items-center gap-4 group hover:border-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white/40">{f.name.split('.').pop()?.toUpperCase()}</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white truncate">{f.name}</span>
                                {f.status === 'pending' && <span className="text-[10px] bg-white/10 text-white/50 px-1.5 py-0.5 rounded uppercase tracking-wide">Pending</span>}
                                {f.status === 'converting' && <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded uppercase tracking-wide animate-pulse">Converting</span>}
                                {f.status === 'done' && <span className="text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded uppercase tracking-wide">Done</span>}
                                {f.status === 'error' && <span className="text-[10px] bg-danger/10 text-danger px-1.5 py-0.5 rounded uppercase tracking-wide">Error</span>}
                            </div>
                            
                            <div className="text-xs text-white/40 flex items-center gap-2">
                                <span>{formatBytes(f.originalSize)}</span>
                                {f.convertedSize && (
                                    <>
                                        <span>→</span>
                                        <span className="text-white/70">{formatBytes(f.convertedSize)}</span>
                                        <span className={f.convertedSize < f.originalSize ? 'text-success' : 'text-warning'}>
                                            ({Math.round((1 - f.convertedSize / f.originalSize) * 100) > 0 ? '-' : '+'}{Math.abs(Math.round((1 - f.convertedSize / f.originalSize) * 100))}%)
                                        </span>
                                    </>
                                )}
                                {f.error && <span className="text-danger">{f.error}</span>}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                             {f.status === 'done' && f.downloadUrl && (
                                <Button href={f.downloadUrl} variant="primary" size="sm" download={f.name}>
                                    Save
                                </Button>
                             )}
                             <button 
                                onClick={() => removeFile(f.id)}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                             >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                             </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {hasPending && (
                <div className="flex justify-end py-4">
                    <Button onClick={convertAll} size="lg" className="w-full md:w-auto">
                        Convert All Files
                    </Button>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
