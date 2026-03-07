'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import Tabs from '@/components/ui/Tabs';
import Dropzone from '@/components/ui/Dropzone';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import Input from '@/components/ui/Input';

type Tab = 'waveform' | 'fileinfo' | 'gif';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioTool() {
  const [activeTab, setActiveTab] = useState<Tab>('waveform');

  /* ── Waveform state ── */
  const [waveFile, setWaveFile] = useState<File | null>(null);
  const [waveLoading, setWaveLoading] = useState(false);
  const [waveError, setWaveError] = useState('');
  const waveCanvasRef = useRef<HTMLCanvasElement>(null);

  /* ── File info state ── */
  const [infoFile, setInfoFile] = useState<File | null>(null);
  const [audioStats, setAudioStats] = useState<any>(null);
  const [infoLoading, setInfoLoading] = useState(false);

  /* ── GIF state ── */
  const [gifFiles, setGifFiles] = useState<File[]>([]);
  const [gifDelay, setGifDelay] = useState(100);
  const [gifWidth, setGifWidth] = useState(480);
  const [gifLoading, setGifLoading] = useState(false);
  const [gifPreview, setGifPreview] = useState('');
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    offscreenCanvasRef.current = document.createElement('canvas');
  }, []);

  const drawWaveform = useCallback(async (file: File) => {
    setWaveLoading(true);
    setWaveError('');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = new AudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      await ctx.close();

      const canvas = waveCanvasRef.current;
      if (!canvas) return;
      
      const W = canvas.parentElement?.offsetWidth || 800;
      const H = 240;
      canvas.width = W;
      canvas.height = H;
      const c2d = canvas.getContext('2d')!;

      c2d.clearRect(0, 0, W, H);
      
      const data = audioBuffer.getChannelData(0);
      const step = Math.ceil(data.length / W);
      const mid = H / 2;

      c2d.fillStyle = '#818cf8';
      
      for (let x = 0; x < W; x++) {
        let min = 1, max = -1;
        for (let j = 0; j < step; j++) {
          const v = data[x * step + j] ?? 0;
          if (v < min) min = v;
          if (v > max) max = v;
        }
        const barH = (max - min) * mid;
        c2d.fillRect(x, mid - barH / 2, 1, barH);
      }
    } catch (e) {
      setWaveError('Failed to decode audio. Format might not be supported.');
    } finally {
      setWaveLoading(false);
    }
  }, []);

  const handleInfoFile = useCallback(async (file: File) => {
    setInfoLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = new AudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      await ctx.close();

      setAudioStats({
        format: file.name.split('.').pop()?.toUpperCase() ?? 'Unknown',
        duration: formatDuration(audioBuffer.duration),
        sampleRate: `${audioBuffer.sampleRate.toLocaleString()} Hz`,
        channels: audioBuffer.numberOfChannels === 1 ? 'Mono (1)' : 'Stereo (2)',
        size: formatBytes(file.size),
        bitrate: `~${Math.round((file.size * 8) / audioBuffer.duration / 1000)} kbps`,
      });
    } catch (e) {
        alert('Error analyzing audio.');
    } finally {
      setInfoLoading(false);
    }
  }, []);

  const buildGif = async () => {
    if (gifFiles.length < 1) return;
    setGifLoading(true);
    setGifPreview('');
    try {
      const encoder = GIFEncoder();
      const canvas = offscreenCanvasRef.current!;
      const W = gifWidth;

      for (const file of gifFiles) {
        const img = await new Promise<HTMLImageElement>((res, rej) => {
            const url = URL.createObjectURL(file);
            const i = new Image();
            i.onload = () => { URL.revokeObjectURL(url); res(i); };
            i.onerror = rej;
            i.src = url;
        });
        const H = Math.round((img.naturalHeight / img.naturalWidth) * W);
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, W, H);
        const { data: pixels } = ctx.getImageData(0, 0, W, H);
        const palette = quantize(pixels as any, 256);
        const index = applyPalette(pixels as any, palette);
        encoder.writeFrame(index, W, H, { palette, delay: gifDelay });
      }
      encoder.finish();
      const blob = new Blob([encoder.bytes()], { type: 'image/gif' });
      setGifPreview(URL.createObjectURL(blob));
    } catch (e) {
      alert('Error building GIF.');
    } finally {
      setGifLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as Tab)}
            tabs={[
                { id: 'waveform', label: 'Waveform', icon: '〰️' },
                { id: 'fileinfo', label: 'Audio Stats', icon: '📊' },
                { id: 'gif', label: 'GIF Maker', icon: '🎞️' },
            ]}
            className="w-full max-w-xl"
        />
      </div>

      <div className="min-h-[400px]">
        {/* Waveform */}
        {activeTab === 'waveform' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-2">
                {!waveFile ? (
                    <Dropzone onFileSelect={f => { setWaveFile(f); drawWaveform(f); }} accept="audio/*" label="Drop audio file to visualize waveform" />
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">🎵</div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">{waveFile.name}</h4>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{formatBytes(waveFile.size)}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setWaveFile(null)}>Change File</Button>
                        </div>

                        <div className="relative w-full h-[300px] rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
                            {waveLoading && (
                                <div className="flex flex-col items-center gap-3 text-white/20">
                                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Decoding Audio...</span>
                                </div>
                            )}
                            <canvas ref={waveCanvasRef} className={`w-full h-full p-8 ${waveLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`} />
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* File Info */}
        {activeTab === 'fileinfo' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2">
                {!infoFile ? (
                    <Dropzone onFileSelect={f => { setInfoFile(f); handleInfoFile(f); }} accept="audio/*" label="Drop audio file to view technical data" />
                ) : (
                    <div className="space-y-6">
                        <Card title="Technical Specifications">
                            {infoLoading ? (
                                <div className="py-12 flex flex-col items-center gap-4 text-white/20">
                                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                                    <p className="text-xs font-bold uppercase">Analyzing Metadata...</p>
                                </div>
                            ) : audioStats && (
                                <div className="grid grid-cols-1 gap-1">
                                    {Object.entries(audioStats).map(([k, v]) => (
                                        <div key={k} className="flex justify-between items-center p-4 rounded-xl hover:bg-white/[0.02] border-b border-white/[0.03]">
                                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{k}</span>
                                            <span className="text-sm font-bold text-white">{v as string}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                        <Button variant="ghost" className="w-full" onClick={() => { setInfoFile(null); setAudioStats(null); }}>Choose Another File</Button>
                    </div>
                )}
            </div>
        )}

        {/* GIF Maker */}
        {activeTab === 'gif' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2">
                <div className="space-y-6">
                    <Card title="Frame Upload">
                        <Dropzone 
                            onFileSelect={f => setGifFiles(p => [...p, f])} 
                            accept="image/*" 
                            label="Add Frame" 
                            description="Add images sequentially"
                            className="h-32"
                        />
                        {gifFiles.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase">
                                    <span>Timeline ({gifFiles.length} frames)</span>
                                    <button onClick={() => setGifFiles([])} className="hover:text-white">Clear</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {gifFiles.map((f, i) => (
                                        <div key={i} className="w-10 h-10 rounded border border-white/10 bg-white/5 relative group overflow-hidden">
                                            <button onClick={() => setGifFiles(p => p.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-danger/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card title="GIF Settings">
                        <div className="space-y-6">
                            <Slider label="Frame Delay" min={20} max={1000} value={gifDelay} onChange={setGifDelay} unit="ms" />
                            <Slider label="Output Width" min={100} max={1200} value={gifWidth} onChange={setGifWidth} unit="px" />
                            <Button className="w-full" size="lg" onClick={buildGif} loading={gifLoading} disabled={gifFiles.length < 2}>Create Animation</Button>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <div className="relative aspect-video rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center p-8 overflow-hidden shadow-2xl">
                        {gifPreview ? (
                            <div className="flex flex-col items-center gap-6 animate-in zoom-in-95">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={gifPreview} alt="GIF Preview" className="max-w-full max-h-[400px] rounded-xl shadow-2xl" />
                                <Button href={gifPreview} download="animated.gif" variant="primary">Download Animated GIF</Button>
                            </div>
                        ) : (
                            <div className="text-center text-white/20">
                                <p className="text-sm">Animated preview will appear here</p>
                                <p className="text-[10px] uppercase font-black tracking-widest mt-2">Add at least 2 frames to start</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
