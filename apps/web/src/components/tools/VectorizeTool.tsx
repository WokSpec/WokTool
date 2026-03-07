'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Dropzone from '@/components/ui/Dropzone';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type InputMode = 'url' | 'upload';

export default function VectorizeTool() {
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  const processFile = useCallback((file: File) => {
    setError('');
    setSvg('');
    const url = URL.createObjectURL(file);
    setPreviewSrc(url);
  }, []);

  useEffect(() => {
    if (inputMode !== 'url' || !imageUrl.trim()) return;
    const t = setTimeout(() => setPreviewSrc(imageUrl.trim()), 600);
    return () => clearTimeout(t);
  }, [imageUrl, inputMode]);

  async function vectorize() {
    if (!previewSrc) return;
    setLoading(true); setError(''); setSvg('');
    try {
      let body: Record<string, string>;
      if (previewSrc.startsWith('blob:')) {
        const response = await fetch(previewSrc);
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });
        body = { imageBase64: dataUrl };
      } else {
        body = { imageUrl: previewSrc };
      }

      const res = await fetch('/api/tools/vectorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Vectorization failed');
      setSvg(data.svg);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Raster to SVG" description="Convert PNG, JPG, or WebP images into clean, scalable SVG vectors using AI.">
        <div className="space-y-6">
            <div className="flex justify-center">
                <Tabs 
                    activeTab={inputMode}
                    onChange={id => setInputMode(id as InputMode)}
                    tabs={[
                        { id: 'upload', label: 'Upload Image', icon: '📁' },
                        { id: 'url', label: 'Image URL', icon: '🔗' },
                    ]}
                    className="w-full max-w-xs"
                />
            </div>

            {inputMode === 'upload' ? (
                <Dropzone 
                    onFileSelect={processFile}
                    previewUrl={previewSrc?.startsWith('blob:') ? previewSrc : null}
                    label="Drop raster image here"
                    description="PNG, JPG, WebP supported"
                    className="h-48"
                />
            ) : (
                <Input 
                    placeholder="https://example.com/logo.png"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
                />
            )}

            <Button 
                onClick={vectorize} 
                className="w-full" 
                size="lg" 
                loading={loading}
                disabled={!previewSrc}
            >
                Start Vectorization
            </Button>

            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                    {error}
                </div>
            )}
        </div>
      </Card>

      {svg && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Vector Preview</h3>
                <div className="aspect-square rounded-3xl bg-white border border-white/10 flex items-center justify-center p-12 shadow-2xl overflow-hidden">
                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
                <Button 
                    variant="primary" 
                    className="w-full" 
                    onClick={() => {
                        const blob = new Blob([svg], { type: 'image/svg+xml' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url; a.download = 'vectorized.svg'; a.click();
                    }}
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                >
                    Download SVG
                </Button>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">SVG Code</h3>
                <CodeBlock code={svg} language="xml" maxHeight="450px" />
                <Button variant="secondary" className="w-full" onClick={() => navigator.clipboard.writeText(svg)}>
                    Copy Code
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
