'use client';

import { useState, useMemo } from 'react';
import { 
  Download, Music, Video, Search, AlertCircle, Clock, Eye, 
  Youtube, Info, FileAudio, FileVideo, Zap, ChevronRight, Lock
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';

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
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K views`;
  return `${num} views`;
}

function fmtSize(bytes?: string) {
  if (!bytes) return '';
  const n = parseInt(bytes);
  if (isNaN(n)) return '';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} GB`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} MB`;
  return `${(n / 1_000).toFixed(0)} KB`;
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
    <div className="space-y-10 animate-in fade-in duration-500">
      <Card title="High-Fidelity Extraction" description="Retrieve studio-quality media assets from any public YouTube source. Encrypted and direct.">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 group">
            <Input
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchInfo()}
                leftIcon={<Youtube size={20} className="text-red-500 group-focus-within:scale-110 transition-transform" />}
                className="h-14"
            />
          </div>
          <Button onClick={fetchInfo} loading={loading} disabled={!url.trim()} size="lg" className="h-14 rounded-xl px-10">
            Fetch Pipeline
          </Button>
        </div>
        {error && (
            <div className="mt-6 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
                <AlertCircle size={18} />
                {error}
            </div>
        )}
      </Card>

      {info && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-1000 ease-out">
            {/* Metadata Engine Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                <div className="relative aspect-video lg:aspect-auto lg:h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group/thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover/thumb:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 right-6 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-[11px] font-black text-white border border-white/10 shadow-xl">
                        {fmtDuration(info.durationSeconds)}
                    </div>
                </div>
                
                <div className="lg:col-span-2 flex flex-col justify-center space-y-6 p-2">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-black uppercase tracking-widest text-accent">
                            Source Identity Verified
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white leading-[1.1] tracking-tight">{info.title}</h2>
                        <p className="text-base font-bold text-zinc-500 uppercase tracking-widest">{info.author}</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-8 pt-4 border-t border-white/[0.06]">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Metrics</div>
                            <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
                                <Eye size={14} className="text-accent" /> {fmtViews(info.viewCount)}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Duration</div>
                            <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
                                <Clock size={14} className="text-accent" /> {fmtDuration(info.durationSeconds)}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Type</div>
                            <div className="flex items-center gap-2 text-zinc-300 font-bold text-sm">
                                <Zap size={14} className="text-accent" /> Adaptive Stream
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex justify-center">
                    <Tabs 
                        activeTab={activeTab}
                        onChange={id => setActiveTab(id as any)}
                        tabs={[
                            { id: 'video', label: 'Video Containers', icon: <Video size={16} /> },
                            { id: 'audio', label: 'Audio Streams', icon: <Music size={16} /> },
                        ]}
                        className="w-full max-w-md p-1.5"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {formats[activeTab].map(fmt => (
                        <Card key={fmt.itag} className="group hover:border-accent/40 transition-all duration-500 p-5 flex flex-col justify-between bg-[#050505] shadow-xl">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-500 group-hover:text-accent group-hover:bg-accent/5 transition-all duration-500">
                                    {activeTab === 'video' ? <FileVideo size={24} /> : <FileAudio size={24} />}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-white group-hover:text-accent transition-colors">{fmt.qualityLabel || `${fmt.audioBitrate}kbps`}</div>
                                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter mt-0.5">{fmt.container} • {fmtSize(fmt.contentLength) || 'Streaming'}</div>
                                </div>
                            </div>
                            <Button 
                                variant="secondary" 
                                size="sm" 
                                className="w-full h-11 rounded-xl" 
                                onClick={() => download(fmt)}
                                loading={downloading === fmt.itag}
                                icon={<Download size={16} />}
                            >
                                {downloading === fmt.itag ? 'Preparing...' : 'Extract Asset'}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] flex gap-6 items-start">
                <div className="w-12 h-12 rounded-2xl bg-accent/5 flex items-center justify-center text-accent shrink-0 border border-accent/10">
                    <Info size={24} />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black uppercase tracking-tighter">Protocol Specifications</h4>
                    <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">
                        High-resolution 4K/8K formats may require muxing or utilize adaptive bitrates. For maximum compatibility with local hardware players, 1080p MP4 is the recommended export target.
                    </p>
                </div>
            </div>
        </div>
      )}

      {!info && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 opacity-60 group-hover:opacity-100 transition-opacity">
            <div className="space-y-4 p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                <Zap size={24} className="text-accent" />
                <h4 className="text-sm font-black uppercase tracking-tighter">Instant Bypass</h4>
                <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">Direct connection to Google media servers ensures zero-bottleneck download speeds.</p>
            </div>
            <div className="space-y-4 p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                <Music size={24} className="text-accent" />
                <h4 className="text-sm font-black uppercase tracking-tighter">Studio Audio</h4>
                <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">Extract high-bitrate M4A or WAV streams for professional audio production.</p>
            </div>
            <div className="space-y-4 p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] hover:bg-white/[0.02] transition-colors">
                <Lock size={24} className="text-accent" />
                <h4 className="text-sm font-black uppercase tracking-tighter">Privacy Layer</h4>
                <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">We proxy only the metadata. All file transfers are anonymous and unlogged.</p>
            </div>
        </div>
      )}
    </div>
  );
}
