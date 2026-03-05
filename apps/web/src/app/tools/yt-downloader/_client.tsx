'use client';

import { useState, useMemo } from 'react';
import {
  Download,
  Music,
  Video,
  Search,
  AlertCircle,
  Clock,
  Eye,
  Youtube,
  Info,
  FileAudio,
  FileVideo,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

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

  async function fetchInfo() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    setInfo(null);
    try {
      const res = await fetch('/api/tools/yt-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch video info.');
      setInfo(data);
      toast.success('Video info retrieved');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      toast.error('Failed to fetch video');
    } finally {
      setLoading(false);
    }
  }

  async function download(fmt: Format) {
    if (!info) return;
    setDownloading(fmt.itag);
    toast.info(`Starting download: ${fmt.label}`);
    try {
      const params = new URLSearchParams({
        url: url.trim(),
        itag: String(fmt.itag),
        label: fmt.label,
      });
      const a = document.createElement('a');
      a.href = `/api/tools/yt-download?${params}`;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => setDownloading(null), 5000);
    } catch {
      setDownloading(null);
      toast.error('Download failed');
    }
  }

  const audioFormats = useMemo(() => info?.formats.filter(f => f.type === 'audio') ?? [], [info]);
  const videoFormats = useMemo(() => info?.formats.filter(f => f.type === 'video') ?? [], [info]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
            <Youtube size={24} />
          </div>
          <h1 className="text-2xl font-bold text-white">YouTube Downloader</h1>
        </div>
        <p className="text-zinc-400 max-w-2xl">
          High-speed YouTube media extractor. Save videos in HD or extract high-quality audio in seconds.
        </p>
      </div>

      {/* Input */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="url"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3.5 pl-11 pr-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none"
              placeholder="Paste YouTube URL... (e.g., https://youtube.com/watch?v=...)"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchInfo()}
            />
          </div>
          <button
            className="bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white font-semibold py-3.5 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
            onClick={fetchInfo}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <><Zap size={18} /> Fetch Video</>
            )}
          </button>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {info && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Video Metadata Card */}
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-72 aspect-video bg-zinc-950 relative flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={info.thumbnail} alt={info.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white backdrop-blur-md">
                {fmtDuration(info.durationSeconds)}
              </div>
            </div>
            <div className="p-6 flex flex-col justify-center min-w-0">
              <h2 className="text-lg font-bold text-white mb-1 truncate" title={info.title}>{info.title}</h2>
              <p className="text-zinc-400 text-sm mb-4">{info.author}</p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><Eye size={14} /> {fmtViews(info.viewCount)}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {fmtDuration(info.durationSeconds)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Audio Formats */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Music size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Audio Extraction</h3>
              </div>
              <div className="space-y-2">
                {audioFormats.map(fmt => (
                  <button
                    key={fmt.itag}
                    className="w-full group bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 rounded-xl p-4 flex items-center justify-between transition-all"
                    onClick={() => download(fmt)}
                    disabled={downloading === fmt.itag}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <FileAudio size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {fmt.audioBitrate}kbps {fmt.container.toUpperCase()}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                          {fmtSize(fmt.contentLength) || 'Variable Size'}
                        </div>
                      </div>
                    </div>
                    {downloading === fmt.itag ? (
                      <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    ) : (
                      <Download size={18} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Video Formats */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-zinc-400">
                <Video size={18} className="text-emerald-400" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Video + Audio</h3>
              </div>
              <div className="space-y-2">
                {videoFormats.map(fmt => (
                  <button
                    key={fmt.itag}
                    className="w-full group bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/5 rounded-xl p-4 flex items-center justify-between transition-all"
                    onClick={() => download(fmt)}
                    disabled={downloading === fmt.itag}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                        <FileVideo size={20} />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {fmt.qualityLabel} {fmt.container.toUpperCase()}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">
                          {fmtSize(fmt.contentLength) || 'Variable Size'}
                        </div>
                      </div>
                    </div>
                    {downloading === fmt.itag ? (
                      <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    ) : (
                      <Download size={18} className="text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl flex items-start gap-3">
            <Info className="text-zinc-500 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-xs text-zinc-500 leading-relaxed">
              We provide direct links to YouTube&apos;s media servers. Some high-resolution formats (1080p+) may not include audio due to YouTube&apos;s adaptive streaming (DASH). For audio-only files, M4A usually offers the best compatibility and quality.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
