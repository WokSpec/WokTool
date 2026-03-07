'use client';

import { useState, useRef, useCallback } from 'react';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Textarea from '@/components/ui/Textarea';

function optimizeSvg(svg: string): string {
  let out = svg;
  out = out.replace(/<\?xml[^>]*\?>/g, '');
  out = out.replace(/<!DOCTYPE[^>]*>/gi, '');
  out = out.replace(/<!--[\s\S]*?-->/g, '');
  out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
  out = out.replace(/\s+version="[^"]*"/g, '');
  out = out.replace(/\s+xml:space="[^"]*"/g, '');
  out = out.replace(/\s+xmlns:xlink="[^"]*"/g, '');
  out = out.replace(/<g\s*\/>/g, '');
  out = out.replace(/<g\s*><\/g>/g, '');
  out = out.replace(/\b([0-9]+)\.0+\b/g, '$1');
  out = out.replace(/\b0+\.([0-9]+)\b/g, '.$1');
  out = out.replace(/\s{2,}/g, ' ');
  out = out.replace(/>\s+</g, '><');
  out = out.replace(/\s+>/g, '>');
  out = out.replace(/\s+\/>/g, '/>');
  
  const colorMap: Record<string, string> = {
    'black': '#000', 'white': '#fff', 'red': '#f00', 'green': '#008000',
    'blue': '#00f', 'yellow': '#ff0', 'cyan': '#0ff', 'magenta': '#f0f',
    'gray': '#808080', 'grey': '#808080', 'orange': '#ffa500',
  };
  for (const [name, hex] of Object.entries(colorMap)) {
    out = out.replace(new RegExp(`(?<=[":;\\s])${name}(?=[";\\s]|$)`, 'gi'), hex);
  }
  out = out.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');
  out = out.replace(/\s+fill-opacity="1"/g, '');
  out = out.replace(/\s+stroke-opacity="1"/g, '');
  out = out.replace(/\s+stroke-width="1"/g, '');
  out = out.replace(/\s+opacity="1"/g, '');
  out = out.replace(/\s+fill="none"\s+stroke="none"/g, '');

  return out.trim();
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(2)} MB`;
}

export default function SvgOptimizerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<{ orig: number; opt: number; pct: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback((src: string) => {
    if (!src.trim()) {
        setOutput('');
        setStats(null);
        return;
    }
    setLoading(true);
    // Tiny delay for UI
    setTimeout(() => {
        const optimized = optimizeSvg(src);
        setOutput(optimized);
        const orig = new Blob([src]).size;
        const opt = new Blob([optimized]).size;
        setStats({ orig, opt, pct: Math.max(0, ((orig - opt) / orig) * 100) });
        setLoading(false);
    }, 50);
  }, []);

  const handleFile = (file: File) => {
    const r = new FileReader();
    r.onload = e => {
      const text = e.target?.result as string;
      setInput(text);
      run(text);
    };
    r.readAsText(file);
  };

  const download = () => {
    const blob = new Blob([output], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'optimized.svg';
    a.click();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">SVG Source</h3>
                    <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); setStats(null); }} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Dropzone 
                    onFileSelect={handleFile}
                    accept=".svg"
                    label="Drop SVG file here"
                    description="Or paste the code below"
                    className="h-32 py-4"
                />
                <Textarea 
                    value={input}
                    onChange={e => { setInput(e.target.value); run(e.target.value); }}
                    placeholder="<svg>...</svg>"
                    className="min-h-[300px] font-mono text-xs leading-relaxed"
                    spellCheck={false}
                />
            </div>
        </div>

        {/* Right: Result */}
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Optimized Output</h3>
                {output ? (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                        <CodeBlock 
                            code={output} 
                            language="xml" 
                            maxHeight="350px" 
                        />
                        
                        {stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <Card className="p-3 text-center border-white/5 bg-white/[0.01]">
                                    <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Original</div>
                                    <div className="text-xs font-bold text-white/70">{fmtBytes(stats.orig)}</div>
                                </Card>
                                <Card className="p-3 text-center border-white/5 bg-white/[0.01]">
                                    <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Optimized</div>
                                    <div className="text-xs font-bold text-white/70">{fmtBytes(stats.opt)}</div>
                                </Card>
                                <Card className="p-3 text-center border-success/20 bg-success/5">
                                    <div className="text-[10px] font-bold text-success/40 uppercase mb-1">Reduction</div>
                                    <div className="text-xs font-bold text-success">−{stats.pct.toFixed(1)}%</div>
                                </Card>
                                <Card className="p-3 text-center border-white/5 bg-white/[0.01]">
                                    <div className="text-[10px] font-bold text-white/30 uppercase mb-1">Saved</div>
                                    <div className="text-xs font-bold text-white/70">{fmtBytes(stats.orig - stats.opt)}</div>
                                </Card>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button variant="primary" className="flex-1" onClick={download}>
                                Download Optimized SVG
                            </Button>
                            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(output)}>
                                Copy Code
                            </Button>
                        </div>

                        <Card title="Live Preview">
                            <div className="aspect-video bg-[#0a0a0a] rounded-xl border border-white/10 flex items-center justify-center p-8 overflow-hidden relative">
                                <div className="absolute inset-0 opacity-10" 
                                    style={{ 
                                        backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                                        backgroundSize: '20px 20px'
                                    }} 
                                />
                                <div 
                                    className="relative max-w-full max-h-full"
                                    dangerouslySetInnerHTML={{ __html: output }}
                                />
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">⚡</div>
                        <p className="text-sm">Processed SVG will appear here</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
