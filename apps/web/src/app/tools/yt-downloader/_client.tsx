'use client';

import { useState, useMemo } from 'react';
import { 
  Download, Music, Video, Search, AlertCircle, Clock, Eye, 
  Youtube, Info, FileAudio, FileVideo, Zap, ChevronRight, Lock,
  Globe, ShieldCheck, Activity, ArrowRight, CheckCircle2
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { motion, AnimatePresence } from 'framer-motion';

interface Format {
  itag: number;
  container: string;
  label: string;
  type: 'audio' | 'video';
  ext: string;
  audioBitrate?: number;
  qualityLabel?: string;
  contentLength?: string;
}

interface VideoInfo {
  title: string;
  author: string;
  durationSeconds: number;
  thumbnail: string;
  viewCount: string;
  formats: Format[];
}

function fmtDuration(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function fmtViews(n: string) {
  const num = parseInt(n);
  if (isNaN(num)) return n;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toString();
}

function fmtSize(bytes?: string) {
  if (!bytes) return 'STREAM';
  const n = parseInt(bytes);
  if (isNaN(n)) return 'STREAM';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}GB`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}MB`;
  return `${(n / 1_000).toFixed(0)}KB`;
}

export default function YtDownloaderClient() {
  const [url, setUrl] = useState('');
  const [info, setInfo] = useState<VideoInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');

  async function fetchInfo() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true); setError(''); setInfo(null);
    try {
      const res = await fetch('/api/tools/yt-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch video info.');
      setInfo(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function download(fmt: Format) {
    if (!info) return;
    setDownloading(fmt.itag);
    const params = new URLSearchParams({ url: url.trim(), itag: String(fmt.itag), label: fmt.label });
    const a = document.createElement('a');
    a.href = `/api/tools/yt-download?${params}`;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => setDownloading(null), 5000);
  }

  const formats = useMemo(() => {
    if (!info) return { video: [], audio: [] };
    return {
        video: info.formats.filter(f => f.type === 'video').sort((a, b) => (parseInt(b.qualityLabel || '0')) - (parseInt(a.qualityLabel || '0'))),
        audio: info.formats.filter(f => f.type === 'audio').sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0)),
    };
  }, [info]);

  return (
    <div className="max-w-6xl mx-auto space-y-24 py-12">
      {/* 01: SOURCE INITIALIZATION */}
      <section className="space-y-12">
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-accent">01</span>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Source Initialization</h2>
        </div>

        <div className="relative group">
            <div className="absolute -inset-1 bg-white/5 opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-1000" />
            <div className="relative flex flex-col md:flex-row gap-[1px] bg-white/10 border border-white/10">
                <div className="flex-1 bg-bg-base flex items-center px-6">
                    <Youtube size={20} className="text-white/20 group-focus-within:text-red-500 transition-colors" />
                    <input 
                        type="text"
                        placeholder="PASTE YOUTUBE URL / IDENTIFIER..."
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && fetchInfo()}
                        className="w-full bg-transparent border-none py-6 px-4 text-sm font-black uppercase tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:ring-0"
                    />
                </div>
                <button 
                    onClick={fetchInfo}
                    disabled={!url.trim() || loading}
                    className="bg-white text-black px-12 py-6 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-colors disabled:opacity-30 flex items-center justify-center gap-3 shrink-0"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>Initialize <ArrowRight size={14} /></>
                    )}
                </button>
            </div>
        </div>

        {error && (
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="p-6 border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-4"
            >
                <AlertCircle size={16} />
                {error}
            </motion.div>
        )}
      </section>

      <AnimatePresence mode="wait">
        {info && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-24"
            >
                {/* 02: METADATA VALIDATION */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-accent">02</span>
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Metadata Validation</h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-1px bg-white/10 border border-white/10">
                        <div className="lg:col-span-4 bg-bg-base p-1px">
                            <div className="relative aspect-video lg:aspect-square overflow-hidden group/thumb">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover grayscale group-hover/thumb:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                                <div className="absolute bottom-6 right-6 font-mono text-[10px] font-black text-white/60 bg-black/80 px-2 py-1 border border-white/10">
                                    {fmtDuration(info.durationSeconds)}
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:col-span-8 bg-bg-base p-12 flex flex-col justify-between space-y-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    <span className="label-tech text-green-500">Source Verified</span>
                                </div>
                                <h3 className="text-3xl lg:text-5xl font-black uppercase tracking-tighter leading-[0.9]">{info.title}</h3>
                                <p className="text-sm font-black uppercase tracking-[0.2em] text-white/30">{info.author}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-12 border-t border-white/5 pt-12">
                                <div className="space-y-2">
                                    <span className="label-tech">Audience</span>
                                    <div className="font-mono text-sm font-black text-white/60">{fmtViews(info.viewCount)}</div>
                                </div>
                                <div className="space-y-2">
                                    <span className="label-tech">Temporal</span>
                                    <div className="font-mono text-sm font-black text-white/60">{fmtDuration(info.durationSeconds)}</div>
                                </div>
                                <div className="space-y-2">
                                    <span className="label-tech">Encryption</span>
                                    <div className="font-mono text-sm font-black text-white/60">GCM-256</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 03: ASSET EXTRACTION */}
                <section className="space-y-12 pb-24">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-accent">03</span>
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white">Asset Extraction</h2>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setActiveTab('video')} className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 border transition-all ${activeTab === 'video' ? 'bg-white text-black border-white' : 'text-white/20 border-white/10 hover:border-white/40'}`}>Video_Streams</button>
                            <button onClick={() => setActiveTab('audio')} className={`text-[9px] font-black uppercase tracking-widest px-4 py-2 border transition-all ${activeTab === 'audio' ? 'bg-white text-black border-white' : 'text-white/20 border-white/10 hover:border-white/40'}`}>Audio_Only</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
                        {formats[activeTab].map(fmt => (
                            <div key={fmt.itag} className="bg-bg-base p-8 space-y-8 group hover:bg-white/[0.02] transition-colors relative">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <div className="text-2xl font-black text-white group-hover:text-accent transition-colors">{fmt.qualityLabel || `${fmt.audioBitrate}K`}</div>
                                        <div className="text-[10px] font-mono text-white/20 uppercase">{fmt.container} · {fmtSize(fmt.contentLength)}</div>
                                    </div>
                                    {activeTab === 'video' ? <FileVideo size={20} className="text-white/10" /> : <FileAudio size={20} className="text-white/10" />}
                                </div>

                                <button 
                                    onClick={() => download(fmt)}
                                    disabled={!!downloading}
                                    className="w-full py-4 border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-3 group/btn"
                                >
                                    {downloading === fmt.itag ? (
                                        <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>Prepare_Asset <Download size={12} className="group-hover/btn:translate-y-0.5 transition-transform" /></>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="p-12 border border-white/5 bg-white/[0.01] flex flex-col md:flex-row gap-12 items-start opacity-40">
                        <div className="shrink-0 flex items-center gap-4">
                            <Info size={24} className="text-accent" />
                            <span className="label-tech">Protocol Advisory</span>
                        </div>
                        <p className="text-[11px] font-black uppercase tracking-widest leading-relaxed">
                            Asset extraction is processed via high-throughput edge nodes. High-resolution streams (4K+) utilize adaptive bitrate switching. For standard hardware, 1080p MP4 is the recommended extraction target.
                        </p>
                    </div>
                </section>
            </motion.div>
        )}
      </AnimatePresence>

      {!info && !loading && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/10 border border-white/10">
            {[
                { icon: Zap, label: 'Throughput', desc: 'Direct bypass protocol for near-instant media stream initialization.' },
                { icon: ShieldCheck, label: 'Isolation', desc: 'Metadata retrieval only. Final asset transfer is strictly client-to-source.' },
                { icon: Activity, label: 'Adaptive', desc: 'Full support for DASH streams and high-fidelity audio containers.' }
            ].map((item, i) => (
                <div key={i} className="bg-bg-base p-12 space-y-6 opacity-40 hover:opacity-100 transition-opacity">
                    <item.icon size={24} className="text-white/40" />
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{item.label}</h4>
                        <p className="text-[11px] font-bold text-white/30 leading-relaxed uppercase tracking-tight">{item.desc}</p>
                    </div>
                </div>
            ))}
        </section>
      )}
    </div>
  );
}
