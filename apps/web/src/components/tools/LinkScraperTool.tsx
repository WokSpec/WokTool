'use client';

import { useState, useMemo } from 'react';
import { Search, Globe, Image as ImageIcon, Link as LinkIcon, Tag, FileCode, Layout, Zap, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import CodeBlock from '@/components/ui/CodeBlock';

interface ScrapeResult {
  links: Array<{ url: string; text: string; type: 'internal' | 'external' }>;
  images: Array<{ url: string; alt: string }>;
  meta: Record<string, string>;
  title: string;
  description: string;
  source?: 'firecrawl' | 'basic';
  markdown?: string;
}

type Tab = 'overview' | 'links' | 'images' | 'meta' | 'markdown';

export default function LinkScraperTool() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [filter, setFilter] = useState('');

  async function handleScrape() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await fetch('/api/tools/link-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to scrape webpage');
      setResult(data);
      setActiveTab('overview');
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  const filteredLinks = useMemo(() => {
    if (!result) return [];
    const q = filter.toLowerCase();
    return result.links.filter(l => !q || l.url.toLowerCase().includes(q) || l.text.toLowerCase().includes(q));
  }, [result, filter]);

  const filteredImages = useMemo(() => {
    if (!result) return [];
    const q = filter.toLowerCase();
    return result.images.filter(i => !q || i.url.toLowerCase().includes(q) || i.alt.toLowerCase().includes(q));
  }, [result, filter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Analyze Any Webpage" description="Extract structured data, visual assets, and markdown content from public URLs instantly.">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
                placeholder="https://github.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
                leftIcon={<Globe size={18} className="text-accent" />}
            />
          </div>
          <Button onClick={handleScrape} loading={loading} disabled={!url.trim()}>
            {loading ? 'Analyzing...' : 'Scrape Page'}
          </Button>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium animate-in slide-in-from-top-2">
                {error}
            </div>
        )}
      </Card>

      {result && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center">
                <Tabs 
                    activeTab={activeTab}
                    onChange={id => setActiveTab(id as Tab)}
                    tabs={[
                        { id: 'overview', label: 'Overview', icon: <Layout size={14} /> },
                        { id: 'links', label: 'Links', icon: <LinkIcon size={14} /> },
                        { id: 'images', label: 'Images', icon: <ImageIcon size={14} /> },
                        { id: 'meta', label: 'Metadata', icon: <Tag size={14} /> },
                        { id: 'markdown', label: 'Content', icon: <FileCode size={14} /> },
                    ]}
                    className="w-full max-w-2xl"
                />
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2">
                        <Card title="Page Identity" className="lg:col-span-2">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block mb-1">Title</label>
                                    <p className="text-lg font-bold text-white leading-tight">{result.title || '—'}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-white/20 tracking-widest block mb-1">Description</label>
                                    <p className="text-sm text-white/60 leading-relaxed">{result.description || '—'}</p>
                                </div>
                            </div>
                        </Card>
                        <div className="space-y-4">
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                                <div className="text-[10px] font-black text-white/20 uppercase mb-1">Discovery</div>
                                <div className="text-2xl font-black text-accent">{result.links.length} Links</div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                                <div className="text-[10px] font-black text-white/20 uppercase mb-1">Assets</div>
                                <div className="text-2xl font-black text-success">{result.images.length} Images</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'links' && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <Input placeholder="Filter discovered links..." value={filter} onChange={e => setFilter(e.target.value)} leftIcon={<Search size={16} />} />
                        <div className="grid grid-cols-1 gap-2">
                            {filteredLinks.map((l, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-surface-raised border border-white/5 group hover:border-white/10">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${l.type === 'internal' ? 'bg-accent/10 text-accent' : 'bg-white/5 text-white/40'}`}>
                                        {l.type === 'internal' ? <LinkIcon size={14} /> : <ExternalLink size={14} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-white/80 truncate">{l.text || 'No anchor text'}</div>
                                        <div className="text-[10px] font-mono text-white/20 truncate">{l.url}</div>
                                    </div>
                                    <Button href={l.url} target="_blank" variant="ghost" size="sm" icon={<ExternalLink size={12} />}>Visit</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'images' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-2">
                        <Input placeholder="Search alt text or filenames..." value={filter} onChange={e => setFilter(e.target.value)} leftIcon={<Search size={16} />} />
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {filteredImages.map((img, i) => (
                                <Card key={i} className="p-0 overflow-hidden group">
                                    <div className="aspect-square bg-[#0a0a0a] flex items-center justify-center p-2 relative overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img.url} alt={img.alt} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button href={img.url} target="_blank" variant="primary" size="sm">View</Button>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-[10px] text-white/20 font-bold truncate px-1 uppercase tracking-tighter" title={img.alt}>{img.alt || 'Untitled'}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'meta' && (
                    <Card className="animate-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 gap-1">
                            {Object.entries(result.meta).map(([k, v]) => (
                                <div key={k} className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-white/[0.03] group hover:bg-white/[0.01] px-2 transition-colors">
                                    <span className="text-[10px] font-black text-accent uppercase tracking-widest sm:w-48 shrink-0">{k}</span>
                                    <span className="text-xs text-white/60 font-medium break-all">{v}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}

                {activeTab === 'markdown' && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center px-1">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Cleaned Content</h3>
                            <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(result.markdown || '')} className="h-7 text-[10px]">Copy MD</Button>
                        </div>
                        <CodeBlock code={result.markdown || 'No content could be extracted.'} language="markdown" maxHeight="600px" />
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
