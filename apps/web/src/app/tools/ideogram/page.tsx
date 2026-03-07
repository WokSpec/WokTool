'use client';

import { useState } from 'react';
import Image from 'next/image';
import ToolShell from '@/components/tools/ToolShell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';

const ASPECT_RATIOS = [
  { value: 'ASPECT_1_1', label: '1:1 Square' },
  { value: 'ASPECT_16_9', label: '16:9 Wide' },
  { value: 'ASPECT_9_16', label: '9:16 Portrait' },
  { value: 'ASPECT_4_3', label: '4:3' },
  { value: 'ASPECT_3_2', label: '3:2' },
];

const STYLE_TYPES = [
  { value: 'AUTO', label: 'Auto' },
  { value: 'GENERAL', label: 'General' },
  { value: 'REALISTIC', label: 'Realistic' },
  { value: 'DESIGN', label: 'Design' },
  { value: 'RENDER_3D', label: '3D Render' },
  { value: 'ANIME', label: 'Anime' },
];

export default function IdeogramPage() {
  const [prompt, setPrompt] = useState('');
  const [aspect, setAspect] = useState('ASPECT_1_1');
  const [style, setStyle] = useState('AUTO');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/ideogram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio: aspect, styleType: style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Generation failed');
      setResult(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolShell id="ideogram" label="Ideogram AI" description="Generate high-fidelity images where text renders perfectly, powered by Ideogram V2." icon="🎨">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card title="Describe your Image" description="Include specific text in double quotes for best results.">
                    <div className="space-y-6">
                        <Textarea 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder='e.g. A movie poster for "THE LAST VOYAGE" with a futuristic ship in space'
                            className="min-h-[120px] text-base"
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Select 
                                label="Aspect Ratio"
                                value={aspect}
                                onChange={e => setAspect(e.target.value)}
                                options={ASPECT_RATIOS}
                            />
                            <Select 
                                label="Style Preset"
                                value={style}
                                onChange={e => setStyle(e.target.value)}
                                options={STYLE_TYPES}
                            />
                        </div>

                        <Button 
                            variant="primary" 
                            className="w-full" 
                            size="lg" 
                            onClick={generate} 
                            loading={loading}
                            disabled={!prompt.trim()}
                        >
                            Generate Image
                        </Button>

                        {error && (
                            <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                                {error}
                            </div>
                        )}
                    </div>
                </Card>

                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">
                        i
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                        Ideogram is specialized in typography within images. If you need a logo, sign, or poster, this is the most capable model for rendering readable text.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Result Preview</h3>
                <div className="relative w-full aspect-square rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                    {result?.url ? (
                        <div className="relative w-full h-full animate-in zoom-in-95 duration-500">
                            <Image 
                                src={result.url} 
                                alt={prompt} 
                                fill 
                                className="object-contain" 
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-end justify-center p-8">
                                <Button 
                                    href={result.url} 
                                    download="generated-image.png" 
                                    target="_blank"
                                    variant="primary"
                                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
                                >
                                    Download Full Image
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-12 opacity-20">
                            <div className="w-20 h-20 rounded-3xl bg-white/[0.03] flex items-center justify-center mb-6 mx-auto text-3xl">🖼️</div>
                            <p className="text-sm font-medium">Your generated image will appear here</p>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold uppercase tracking-widest text-white">Generating AI Art...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </ToolShell>
  );
}
