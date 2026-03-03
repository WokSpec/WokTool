'use client';

import { useState } from 'react';
import { Download, Music, Video, Search, AlertCircle, Clock, Eye } from 'lucide-react';

interface Format {
  itag: number;
  container: string;
  label: string;
  type: 'audio' | 'video';
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
  if (n >= 1_000_000_000) return ` · ${(n / 1_000_000_000).toFixed(1)} GB`;
  if (n >= 1_000_000) return ` · ${(n / 1_000_000).toFixed(1)} MB`;
  return ` · ${(n / 1_000).toFixed(0)} KB`;
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function download(fmt: Format) {
    if (!info) return;
    setDownloading(fmt.itag);
    try {
      const params = new URLSearchParams({
        url: url.trim(),
        itag: String(fmt.itag),
        label: fmt.label,
      });
      // Trigger browser download via anchor
      const a = document.createElement('a');
      a.href = `/api/tools/yt-download?${params}`;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Give a moment before clearing state
      setTimeout(() => setDownloading(null), 3000);
    } catch {
      setDownloading(null);
    }
  }

  const audioFormats = info?.formats.filter(f => f.type === 'audio') ?? [];
  const videoFormats = info?.formats.filter(f => f.type === 'video') ?? [];

  return (
    <div className="yt-dl">
      {/* URL input */}
      <div className="yt-dl-input-row">
        <input
          className="yt-dl-input"
          type="url"
          placeholder="Paste YouTube URL…  e.g. https://youtube.com/watch?v=…"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchInfo()}
          spellCheck={false}
        />
        <button
          className="yt-dl-btn-primary"
          onClick={fetchInfo}
          disabled={loading || !url.trim()}
        >
          {loading ? (
            <span className="yt-dl-spinner" />
          ) : (
            <><Search size={15} /> Fetch</>
          )}
        </button>
      </div>

      {error && (
        <div className="yt-dl-error">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {info && (
        <div className="yt-dl-result">
          {/* Video card */}
          <div className="yt-dl-card">
            {info.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.thumbnail} alt={info.title} className="yt-dl-thumb" />
            )}
            <div className="yt-dl-meta">
              <p className="yt-dl-title">{info.title}</p>
              <p className="yt-dl-sub">{info.author}</p>
              <div className="yt-dl-badges">
                <span className="yt-dl-badge"><Clock size={11} /> {fmtDuration(info.durationSeconds)}</span>
                {info.viewCount && <span className="yt-dl-badge"><Eye size={11} /> {fmtViews(info.viewCount)}</span>}
              </div>
            </div>
          </div>

          {/* Notice */}
          <p className="yt-dl-notice">
            ⚠️ For personal use only. Respect copyright and YouTube&apos;s Terms of Service.
            Large files may time out on the free hosting tier.
          </p>

          {/* Audio formats */}
          {audioFormats.length > 0 && (
            <section className="yt-dl-section">
              <h3 className="yt-dl-section-title"><Music size={14} /> Audio</h3>
              <div className="yt-dl-formats">
                {audioFormats.map(fmt => (
                  <button
                    key={fmt.itag}
                    className="yt-dl-fmt-btn"
                    onClick={() => download(fmt)}
                    disabled={downloading === fmt.itag}
                  >
                    {downloading === fmt.itag ? (
                      <span className="yt-dl-spinner --sm" />
                    ) : (
                      <Download size={13} />
                    )}
                    <span>{fmt.label}{fmtSize(fmt.contentLength)}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Video formats */}
          {videoFormats.length > 0 && (
            <section className="yt-dl-section">
              <h3 className="yt-dl-section-title"><Video size={14} /> Video + Audio</h3>
              <div className="yt-dl-formats">
                {videoFormats.map(fmt => (
                  <button
                    key={fmt.itag}
                    className="yt-dl-fmt-btn"
                    onClick={() => download(fmt)}
                    disabled={downloading === fmt.itag}
                  >
                    {downloading === fmt.itag ? (
                      <span className="yt-dl-spinner --sm" />
                    ) : (
                      <Download size={13} />
                    )}
                    <span>{fmt.label}{fmtSize(fmt.contentLength)}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
