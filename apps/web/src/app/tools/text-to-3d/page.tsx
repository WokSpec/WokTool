'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Box, Download, Zap, Info, Clock, RotateCcw } from 'lucide-react';

function TextTo3DInner() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/text-to-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || '3D generation failed');
      setResult(data.data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
            <Card title="3D Concept" description="Describe the object you want to generate. Be specific about geometry and materials.">
                <div className="space-y-6">
                    <Textarea 
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder="e.g. A futuristic sci-fi helmet, matte black with blue glowing visors, highly detailed, 8k resolution"
                        className="min-h-[150px] text-base"
                    />
                    <Button onClick={generate} className="w-full" size="lg" loading={loading} disabled={!prompt.trim()}>
                        Generate 3D Model
                    </Button>
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Box size={20} />
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                    Powered by <strong>Meshy AI</strong>. High-quality PBR textures and optimized topology for game engines.
                </p>
            </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Model Result</h3>
            <div className="relative aspect-video rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center p-8 group">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                {result?.model_url ? (
                    <div className="relative w-full h-full animate-in zoom-in-95 duration-700 flex flex-col items-center justify-center gap-6">
                        <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center animate-bounce shadow-[0_0_50px_rgba(129,140,248,0.3)]">
                            <Box size={48} className="text-accent" />
                        </div>
                        <div className="text-center">
                            <h4 className="text-white font-bold text-lg mb-4">GLB Asset Ready</h4>
                            <div className="flex gap-3">
                                <Button href={result.model_url} download="model.glb" variant="primary" icon={<Download size={16} />}>Download GLB</Button>
                                <Button variant="secondary" onClick={() => setResult(null)}>Reset</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl mx-auto">🧊</div>
                        <p className="text-sm font-bold">Generated 3D asset will appear here</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Sculpting Geometry...</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
                <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="text-[10px] font-black uppercase text-white/20 mb-2">PBR Materials</div>
                    <p className="text-xs text-white/40">Includes Albedo, Roughness, and Normal maps pre-applied to the model.</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="text-[10px] font-black uppercase text-white/20 mb-2">Quad Mesh</div>
                    <p className="text-xs text-white/40">Topology optimized for sculpting, deformation, and smooth shading.</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="text-[10px] font-black uppercase text-white/20 mb-2">Production Ready</div>
                    <p className="text-xs text-white/40">Directly import into Unity, Unreal Engine, Blender, or WebGL projects.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function TextTo3DPage() {
  return (
    <Suspense fallback={null}>
      <TextTo3DInner />
    </Suspense>
  );
}
