'use client';

import { useState, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Dropzone from '@/components/ui/Dropzone';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { Mic, Clock, User, MessageSquare, Download, Play, Info } from 'lucide-react';

interface TranscriptUtterance {
  speaker: string;
  text: string;
  start: number;
  end: number;
}

interface TranscribeResult {
  text: string;
  utterances?: TranscriptUtterance[];
  duration: number;
  status: string;
}

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranscribeResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'raw' | 'speakers'>('raw');

  const handleTranscribe = async () => {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/tools/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transcription failed');
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
            <Card title="Audio Source" description="Upload an interview, podcast, or meeting recording to transcribe with AI.">
                <div className="space-y-6">
                    <Dropzone 
                        onFileSelect={setFile}
                        accept="audio/*,video/*"
                        label={file ? file.name : "Drop audio/video file"}
                        className="h-48"
                    />
                    
                    <Button 
                        onClick={handleTranscribe} 
                        className="w-full" 
                        size="lg" 
                        loading={loading}
                        disabled={!file}
                    >
                        Start Transcription
                    </Button>
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Mic size={20} />
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                    Powered by <strong>AssemblyAI Universal-2</strong>. Supports speaker detection, automated punctuation, and high-fidelity accuracy.
                </p>
            </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Transcript Output</h3>
                {result && (
                    <Tabs 
                        activeTab={activeTab}
                        onChange={id => setActiveTab(id as any)}
                        tabs={[
                            { id: 'raw', label: 'Raw Text' },
                            { id: 'speakers', label: 'Speakers' },
                        ]}
                        className="scale-90 origin-right"
                    />
                )}
            </div>

            <div className="relative min-h-[500px] rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                {result ? (
                    <div className="flex-1 p-8 overflow-auto custom-scrollbar animate-in slide-in-from-bottom-4 duration-700">
                        {activeTab === 'raw' ? (
                            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{result.text}</p>
                        ) : (
                            <div className="space-y-6">
                                {result.utterances?.map((u, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                            <span className="text-[10px] font-black text-accent uppercase">S{u.speaker}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-white/40 uppercase">Speaker {u.speaker}</span>
                                                <span className="text-[9px] font-mono text-white/10">{Math.round(u.start/1000)}s</span>
                                            </div>
                                            <p className="text-sm text-white/70 leading-relaxed">{u.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 opacity-20 group">
                        <div className="w-20 h-20 rounded-3xl border-2 border-dashed border-white/40 flex items-center justify-center text-3xl mb-6">📝</div>
                        <p className="text-sm font-bold">Waiting for audio processing</p>
                    </div>
                )}

                {loading && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
                        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-white">AI is Listening...</span>
                    </div>
                )}

                {result && (
                    <div className="p-4 bg-white/[0.02] border-t border-white/5 flex justify-between items-center px-8">
                        <span className="text-[10px] font-bold text-white/20 uppercase">Length: {result.duration.toFixed(1)}s</span>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result.text)}>Copy Text</Button>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                    {error}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
