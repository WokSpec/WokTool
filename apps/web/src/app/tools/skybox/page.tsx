'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { Search, Download, Zap, Info, Clock, RotateCcw, Box, Layers, Globe } from 'lucide-react';

const STYLES = [
  { id: 1, name: 'Realistic', icon: '📸' },
  { id: 2, name: 'Sci-Fi', icon: '🚀' },
  { id: 3, name: 'Fantasy', icon: '🧙' },
  { id: 4, name: 'Cyberpunk', icon: '🌆' },
  { id: 5, name: 'Low Poly', icon: '🧊' },
  { id: 6, name: 'Anime', icon: '🏮' },
];

export default function SkyboxPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/skybox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, styleId: style }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Skybox generation failed');
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
        {/* Left: Settings */}
        <div className="space-y-6">
            <Card title="Environment Design" description="Describe your 360° environment. Use vivid language for lighting and atmosphere.">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Prompt</label>
                        <textarea 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder="e.g. Futuristic city on Mars with neon lights and a giant red moon, cinematic lighting..."
                            className="w-full h-32 rounded-2xl bg-[#0d0d0d] border border-white/10 p-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none transition-all"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Art Style</label>
                        <div className="grid grid-cols-2 gap-2">
                            {STYLES.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => setStyle(s.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${style === s.id ? 'bg-accent/10 border-accent/30 text-accent shadow-inner' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white'}`}
                                >
                                    <span className="text-sm">{s.icon}</span>
                                    <span className="text-[10px] font-black uppercase">{s.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button onClick={generate} className="w-full" size="lg" loading={loading} disabled={!prompt.trim()}>
                        Generate Skybox
                    </Button>
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Layers size={20} />
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                    Powered by <strong>Blockade Labs AI</strong>. Generates high-fidelity equirectangular textures compatible with Unity, Unreal, and Three.js.
                </p>
            </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">360° Result Preview</h3>
            <div className="relative aspect-video rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center p-8 group">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                {result?.file_url ? (
                    <div className="relative w-full h-full animate-in zoom-in-95 duration-700">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={result.file_url} alt="Skybox" className="w-full h-full object-cover rounded-xl shadow-2xl" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                            <div className="px-4 py-2 rounded-full bg-accent text-[10px] font-black uppercase tracking-widest text-white shadow-xl">Panoramic Texture Ready</div>
                            <div className="flex gap-3">
                                <Button href={result.file_url} download="skybox.jpg" variant="primary" icon={<Download size={16} />}>Download JPG</Button>
                                <Button variant="secondary" onClick={() => setResults(null)}>Reset</Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center space-y-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl mx-auto">🌌</div>
                        <p className="text-sm font-bold">Your panoramic world will appear here</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Synthesizing World...</span>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 opacity-40">
                <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="text-[10px] font-black uppercase text-white/20 mb-2">Equirectangular</div>
                    <p className="text-xs text-white/40">Standard 2:1 projection ready for immediate use in 3D engines.</p>
                </div>
                <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                    <div className="text-[10px] font-black uppercase text-white/20 mb-2">High Resolution</div>
                    <p className="text-xs text-white/40">Detailed textures optimized for both mobile and desktop VR experiences.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
