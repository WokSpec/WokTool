'use client';

import { useState } from 'react';
import Image from 'next/image';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { Search, Download, ExternalLink, ImageIcon, Image as ImageIcon2, Camera, Layers, Zap } from 'lucide-react';

interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  largeImageURL: string;
  user: string;
}

export default function AssetSearchTool() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PixabayImage[]>([]);
  const [error, setError] = useState('');

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(''); setResults([]);
    try {
      const res = await fetch('/api/tools/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), type }),
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="CC0 Asset Search" description="Search 5M+ free high-quality images, illustrations, and videos from Pixabay. Commercial use allowed.">
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                    <Input
                        placeholder="e.g. abstract gradients, developer desk, nature..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && search()}
                        leftIcon={<Search size={18} className="text-accent" />}
                    />
                </div>
                <Button onClick={search} loading={loading} disabled={!query.trim()}>
                    Find Assets
                </Button>
            </div>

            <div className="flex justify-center">
                <Tabs 
                    activeTab={type}
                    onChange={setType}
                    tabs={[
                        { id: 'all', label: 'All', icon: <Layers size={14} /> },
                        { id: 'photo', label: 'Photos', icon: <Camera size={14} /> },
                        { id: 'illustration', label: 'Vector/Art', icon: <ImageIcon size={14} /> },
                    ]}
                    className="w-full max-w-sm"
                />
            </div>
        </div>
      </Card>

      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-500">
            {results.map(img => (
                <Card key={img.id} className="p-0 overflow-hidden group">
                    <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={img.previewURL} 
                            alt={img.tags} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            loading="lazy" 
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                            <Button href={img.largeImageURL} target="_blank" variant="primary" size="sm" icon={<Download size={14} />}>Large</Button>
                            <Button href={img.pageURL} target="_blank" variant="secondary" size="sm" icon={<ExternalLink size={14} />}>Source</Button>
                        </div>
                    </div>
                    <div className="p-3">
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-tighter truncate" title={img.tags}>{img.tags}</p>
                        <p className="text-[8px] font-bold text-accent/60 uppercase mt-0.5">by {img.user}</p>
                    </div>
                </Card>
            ))}
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Safe for Work</div>
                <p className="text-xs text-white/40">All results are filtered for appropriate content and safe browsing.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">No Attribution</div>
                <p className="text-xs text-white/40">Images are released under the Pixabay License, no credit required.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">High Resolution</div>
                <p className="text-xs text-white/40">Direct access to original high-res files via Pixabay CDN.</p>
            </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
            {error}
        </div>
      )}
    </div>
  );
}
