'use client';

import { useState } from 'react';
import Image from 'next/image';
import ToolShell from '@/components/tools/ToolShell';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { Palette, Download, Zap, ImageIcon, Layers } from 'lucide-react';

const STYLES = [
  { value: 'realistic_image', label: 'Realistic Photo' },
  { value: 'digital_illustration', label: 'Illustration' },
  { value: 'vector_illustration', label: 'Vector Art' },
  { value: 'icon', label: 'Icon Set' },
];

export default function RecraftPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic_image');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  async function generate() {
    if (!prompt.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/recraft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
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
    <ToolShell id="recraft" label="Recraft v3 AI" description="Generate professional brand-grade illustrations, icons, and photos with Recraft v3." icon="🎭">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
                <Card title="Design Concept" description="Describe your illustration or photo. Recraft is excellent at maintaining brand consistency.">
                    <div className="space-y-6">
                        <Textarea 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="e.g. A minimal vector illustration of a scientist working in a high-tech lab, blue and white color scheme..."
                            className="min-h-[120px] text-base"
                        />
                        
                        <Select 
                            label="Output Style"
                            value={style}
                            onChange={e => setStyle(e.target.value)}
                            options={STYLES}
                        />

                        <Button 
                            variant="primary" 
                            className="w-full" 
                            size="lg" 
                            onClick={generate} 
                            loading={loading}
                            disabled={!prompt.trim()}
                        >
                            Create Asset
                        </Button>

                        {error && (
                            <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                                {error}
                            </div>
                        )}
                    </div>
                </Card>

                <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">
                        <Palette size={20} />
                    </div>
                    <p className="text-xs text-white/40 leading-relaxed">
                        Recraft v3 is built for designers. It allows for precise control over anatomical correctness and professional aesthetic styles.
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Asset Result</h3>
                <div className="relative w-full aspect-square rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl group">
                    {result?.url ? (
                        <div className="relative w-full h-full animate-in zoom-in-95 duration-500">
                            <Image 
                                src={result.url} 
                                alt={prompt} 
                                fill 
                                className="object-contain p-4" 
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                                <div className="px-4 py-2 rounded-full bg-accent text-[10px] font-black uppercase tracking-widest text-white shadow-xl">High Quality Image Ready</div>
                                <Button 
                                    href={result.url} 
                                    download="recraft-asset.png" 
                                    target="_blank"
                                    variant="primary"
                                    icon={<Download size={16} />}
                                >
                                    Download Image
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center space-y-4 opacity-20 group-hover:opacity-30 transition-opacity">
                            <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl mx-auto">🎨</div>
                            <p className="text-sm font-medium">Your design asset will appear here</p>
                        </div>
                    )}

                    {loading && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Crafting with AI...</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </ToolShell>
  );
}
