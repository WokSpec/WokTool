'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Download, Search, File as FileIcon, Music, Video, Info } from 'lucide-react';

interface MediaItem {
  url: string;
  type: string;
  filename: string;
  size?: string;
}

export default function MediaDownloaderTool() {
  const [inputUrl, setInputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [error, setError] = useState('');

  const handleFetch = async () => {
    const url = inputUrl.trim();
    if (!url) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const res = await fetch('/api/tools/media-downloader', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch media');
      setResults(data.items || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Direct Media Extractor" description="Extract direct download links for images, audio, and video from any public webpage.">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
                placeholder="https://example.com/gallery"
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFetch()}
                leftIcon={<Search size={18} className="text-accent" />}
            />
          </div>
          <Button onClick={handleFetch} loading={loading} disabled={!inputUrl.trim()}>
            Extract Media
          </Button>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                {error}
            </div>
        )}
      </Card>

      {results.length > 0 && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 px-1">
            <span className="w-2 h-5 bg-accent rounded-full" />
            Extracted Files ({results.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((item, i) => (
              <Card key={i} className="p-4 group hover:border-accent/30 transition-all flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors shrink-0">
                    {item.type.startsWith('image') ? <Search size={20} /> : item.type.startsWith('audio') ? <Music size={20} /> : <Video size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white/80 truncate mb-0.5">{item.filename}</div>
                    <div className="text-[10px] font-black uppercase text-white/20 tracking-tighter">{item.type} {item.size && `• ${item.size}`}</div>
                </div>
                <Button 
                    href={item.url} 
                    target="_blank" 
                    download={item.filename}
                    variant="secondary" 
                    size="sm"
                    className="shrink-0"
                    icon={<Download size={14} />}
                >
                    Save
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!results.length && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Multi-Format</div>
                <p className="text-xs text-white/40">Scans for common image (PNG, JPG, SVG), audio (MP3, WAV), and video (MP4) extensions.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Deep Discovery</div>
                <p className="text-xs text-white/40">We check HTML tags, meta properties, and common media subdirectories.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Direct Links</div>
                <p className="text-xs text-white/40">Get the raw underlying file URL instead of proxied or wrapper landing pages.</p>
            </div>
        </div>
      )}
    </div>
  );
}
