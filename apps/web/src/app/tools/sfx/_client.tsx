'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Play, Download, Search, Music, Volume2, Info } from 'lucide-react';

interface FreesoundResult {
  id: number;
  name: string;
  previews: { 'preview-hq-mp3': string };
  duration: number;
  username: string;
}

export default function SfxClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FreesoundResult[]>([]);
  const [error, setError] = useState('');
  const [playingId, setPlayingId] = useState<number | null>(null);

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const res = await fetch('/api/tools/sfx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setResults(data.results || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const play = (sfx: FreesoundResult) => {
    const audio = new Audio(sfx.previews['preview-hq-mp3']);
    setPlayingId(sfx.id);
    audio.play();
    audio.onended = () => setPlayingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Asset Browser" description="Search 500k+ CC0 sound effects from the Freesound database. Find the perfect audio for your games or projects.">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
                placeholder="e.g. explosion, futuristic ui, forest ambience..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                leftIcon={<Search size={18} className="text-accent" />}
            />
          </div>
          <Button onClick={search} loading={loading} disabled={!query.trim()}>
            Search Library
          </Button>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                {error}
            </div>
        )}
      </Card>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {results.map(s => (
                <Card key={s.id} className="group hover:border-accent/30 transition-all p-4">
                    <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-accent transition-colors">
                            <Volume2 size={20} />
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase text-white/20 tracking-tighter">{s.duration.toFixed(1)}s</div>
                            <div className="text-[9px] font-bold text-white/40 truncate max-w-[100px]">by {s.username}</div>
                        </div>
                    </div>
                    
                    <h4 className="text-sm font-bold text-white mb-4 line-clamp-1 group-hover:text-accent transition-colors">{s.name}</h4>
                    
                    <div className="flex gap-2">
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="flex-1" 
                            onClick={() => play(s)}
                            icon={playingId === s.id ? <div className="w-3 h-3 bg-accent animate-pulse rounded-sm" /> : <Play size={14} />}
                        >
                            {playingId === s.id ? 'Playing' : 'Preview'}
                        </Button>
                        <Button 
                            href={s.previews['preview-hq-mp3']} 
                            target="_blank" 
                            variant="ghost" 
                            size="sm"
                            icon={<Download size={14} />}
                        />
                    </div>
                </Card>
            ))}
        </div>
      ) : !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">High Quality</div>
                <p className="text-xs text-white/40">Access HQ MP3 previews for instant integration into your design workflow.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Massive Library</div>
                <p className="text-xs text-white/40">Query half a million sound effects across dozens of categories.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">CC0 Licensed</div>
                <p className="text-xs text-white/40">Most assets are Public Domain or Creative Commons. Check individual metadata.</p>
            </div>
        </div>
      )}
    </div>
  );
}
