'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Tabs from '@/components/ui/Tabs';
import Dropzone from '@/components/ui/Dropzone';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ToolShell from '@/components/tools/ToolShell';

interface InterrogateResult {
  caption: string;
  tags: string[];
  suggestedPrompt: string;
  confidence: number;
}

export function InterrogateClient() {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterrogateResult | null>(null);

  const processFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInterrogate = useCallback(async () => {
    const finalUrl = inputMode === 'url' ? imageUrl : previewUrl;
    if (!finalUrl) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch('/api/tools/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: finalUrl }),
      });
      if (!response.ok) throw new Error('Interrogation failed');
      const data = await response.json();
      setResult(data);
    } catch (e) {
      setError('AI service unavailable or image format not supported.');
    } finally {
      setLoading(false);
    }
  }, [imageUrl, previewUrl, inputMode]);

  return (
    <ToolShell id="interrogate" label="Image Interrogator" description="Reverse-engineer prompts from any image using BLIP AI models." icon="🔍">
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card title="Analyze Image" description="Upload an image or paste a URL to generate AI descriptions and prompts.">
                <div className="space-y-6">
                    <div className="flex justify-center">
                        <Tabs 
                            activeTab={inputMode}
                            onChange={id => setInputMode(id as any)}
                            tabs={[
                                { id: 'upload', label: 'Upload', icon: '📁' },
                                { id: 'url', label: 'URL', icon: '🔗' },
                            ]}
                            className="w-full max-w-xs"
                        />
                    </div>

                    {inputMode === 'upload' ? (
                        <Dropzone onFileSelect={processFile} previewUrl={previewUrl} className="h-48" />
                    ) : (
                        <Input 
                            placeholder="https://example.com/image.jpg"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>}
                        />
                    )}

                    <Button 
                        onClick={handleInterrogate} 
                        className="w-full" 
                        size="lg" 
                        loading={loading}
                        disabled={inputMode === 'url' ? !imageUrl.trim() : !previewUrl}
                    >
                        Analyze with BLIP AI
                    </Button>

                    {error && (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                            {error}
                        </div>
                    )}
                </div>
            </Card>

            {result && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="space-y-6">
                        <Card title="Visual Caption">
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 text-white text-lg font-medium leading-relaxed">
                                    {result.caption}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Confidence Score</span>
                                    <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">{Math.round(result.confidence * 100)}%</span>
                                </div>
                                <Button variant="secondary" className="w-full" size="sm" onClick={() => navigator.clipboard.writeText(result.caption)}>Copy Caption</Button>
                            </div>
                        </Card>

                        <Card title="Detected Tags">
                            <div className="flex flex-wrap gap-2">
                                {result.tags.map(tag => (
                                    <button 
                                        key={tag} 
                                        onClick={() => navigator.clipboard.writeText(tag)}
                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all"
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title="Suggested AI Prompt">
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-[#0d0d0d] border border-white/10 text-xs font-mono text-accent leading-relaxed">
                                    {result.suggestedPrompt}
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(result.suggestedPrompt)}>Copy Prompt</Button>
                                    <Button href="/tools/ideogram" variant="primary" size="sm">Use in Ideogram</Button>
                                </div>
                            </div>
                        </Card>

                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                🤖
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white/90 mb-1">Model Info</h4>
                                <p className="text-xs text-white/40 leading-relaxed">
                                    This tool uses the <strong>Salesforce BLIP</strong> model via HuggingFace Inference API to understand image semantics and convert them into natural language.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </ToolShell>
  );
}
