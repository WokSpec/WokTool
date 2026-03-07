'use client';

import { useState, useCallback, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';
import CodeBlock from '@/components/ui/CodeBlock';
import { Sparkles, RefreshCw, Copy, Download, Zap, Heart } from 'lucide-react';

interface Palette {
  colors: string[];
  id: string;
}

const MODELS = [
    { id: 'default', label: 'Balanced', icon: '⚖️' },
    { id: 'vibrant', label: 'Vibrant', icon: '🌈' },
    { id: 'pastel', label: 'Soft', icon: '☁️' },
    { id: 'dark', label: 'Deep', icon: '🌙' },
];

export default function PaletteGenClient() {
  const [activeModel, setActiveModel] = useState('default');
  const [palette, setPalette] = useState<string[]>(['#818cf8', '#c084fc', '#fb7185', '#fbbf24', '#34d399']);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState<'css' | 'tailwind' | 'json'>('css');

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const randomHex = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      const next = Array.from({length: 5}, randomHex);
      await new Promise(r => setTimeout(r, 600));
      setPalette(next);
    } finally {
      setLoading(false);
    }
  }, []);

  const exportedCode = useMemo(() => {
    if (format === 'css') return `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join('\n')}\n}`;
    if (format === 'json') return JSON.stringify(palette, null, 2);
    return `// tailwind.config.js\ncolors: {\n${palette.map((c, i) => `  'brand-${i + 1}': '${c}',`).join('\n')}\n}`;
  }, [palette, format]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings */}
        <div className="space-y-6">
            <Card title="Intelligence Engine" description="Choose a style and let our AI generate a harmonious color scheme for your next project.">
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2">
                        {MODELS.map(m => (
                            <button
                                key={m.id}
                                onClick={() => setActiveModel(m.id)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${activeModel === m.id ? 'bg-accent/10 border-accent/30 text-accent shadow-inner' : 'bg-surface-raised border-white/5 text-white/40 hover:text-white'}`}
                            >
                                <span className="text-sm">{m.icon}</span>
                                <span className="text-[10px] font-black uppercase">{m.label}</span>
                            </button>
                        ))}
                    </div>

                    <Button onClick={generate} className="w-full" size="lg" loading={loading} icon={<Sparkles size={16} />}>
                        Generate Palette
                    </Button>
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Zap size={20} />
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white/60 font-mono">Space</kbd> to quickly regenerate the palette.
                </p>
            </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-8">
            <div className="flex h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative group">
                {palette.map((c, i) => (
                    <div 
                        key={i} 
                        className="flex-1 h-full relative group/swatch transition-all hover:flex-[1.5] cursor-pointer"
                        style={{ background: c }}
                        onClick={() => navigator.clipboard.writeText(c)}
                    >
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/swatch:opacity-100 flex flex-col items-center justify-center transition-opacity">
                            <span className="text-xs font-black text-white uppercase drop-shadow-md mb-1">{c}</span>
                            <Copy size={14} className="text-white/60" />
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Export Formats</h3>
                    <Tabs 
                        activeTab={format}
                        onChange={id => setFormat(id as any)}
                        tabs={[
                            { id: 'css', label: 'CSS' },
                            { id: 'tailwind', label: 'Tailwind' },
                            { id: 'json', label: 'JSON' },
                        ]}
                        className="scale-90 origin-right"
                    />
                </div>
                <CodeBlock code={exportedCode} language={format === 'json' ? 'json' : 'css'} maxHeight="200px" />
                <Button variant="primary" className="w-full" onClick={() => navigator.clipboard.writeText(exportedCode)}>
                    Copy All Variables
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
