'use client';

import { useState, useMemo } from 'react';
import {
  Search,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Copy,
  Download,
  ExternalLink,
  FileCode,
  Layout,
  AlertCircle,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

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
    setLoading(true);
    setError('');
    setResult(null);
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
      toast.success('Webpage scraped successfully');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      toast.error('Scrape failed');
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  };

  const filteredLinks = useMemo(() => {
    if (!result) return [];
    return result.links.filter(l =>
      !filter || l.url.toLowerCase().includes(filter.toLowerCase()) || l.text.toLowerCase().includes(filter.toLowerCase())
    );
  }, [result, filter]);

  const filteredImages = useMemo(() => {
    if (!result) return [];
    return result.images.filter(i =>
      !filter || i.url.toLowerCase().includes(filter.toLowerCase()) || i.alt.toLowerCase().includes(filter.toLowerCase())
    );
  }, [result, filter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Globe size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white">Link Scraper</h1>
        </div>
        <p className="text-zinc-400 max-w-2xl">
          Professional-grade webpage analysis. Extract links, images, metadata, and full markdown content from any public URL.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input
              type="url"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all outline-none"
              placeholder="Enter URL to scrape... (e.g., https://github.com)"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScrape()}
            />
          </div>
          <button
            className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white font-semibold py-3 px-8 rounded-xl transition-all flex items-center justify-center gap-2"
            onClick={handleScrape}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Analyzing...</>
            ) : (
              <><Zap size={18} /> Scrape Page</>
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

      {result && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
              <TabButton
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                icon={<Layout size={18} />}
                label="Overview"
              />
              <TabButton
                active={activeTab === 'links'}
                onClick={() => setActiveTab('links')}
                icon={<LinkIcon size={18} />}
                label="Links"
                count={result.links.length}
              />
              <TabButton
                active={activeTab === 'images'}
                onClick={() => setActiveTab('images')}
                icon={<ImageIcon size={18} />}
                label="Images"
                count={result.images.length}
              />
              <TabButton
                active={activeTab === 'meta'}
                onClick={() => setActiveTab('meta')}
                icon={<Tag size={18} />}
                label="Metadata"
              />
              {result.markdown && (
                <TabButton
                  active={activeTab === 'markdown'}
                  onClick={() => setActiveTab('markdown')}
                  icon={<FileCode size={18} />}
                  label="Markdown"
                />
              )}

              <div className="pt-6 mt-6 border-t border-zinc-800 space-y-3">
                <button
                  onClick={() => downloadFile(JSON.stringify(result, null, 2), 'scraped-data.json', 'application/json')}
                  className="w-full flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
                >
                  <Download size={16} /> Export JSON
                </button>
                <button
                  onClick={() => copyToClipboard(result.links.map(l => l.url).join('\n'))}
                  className="w-full flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-3 py-2"
                >
                  <Copy size={16} /> Copy all URLs
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Page Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Title</label>
                      <p className="text-lg text-white font-medium">{result.title || 'No title found'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                      <p className="text-zinc-400">{result.description || 'No description found'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <StatCard label="Total Links" value={result.links.length} color="text-blue-400" />
                  <StatCard label="Total Images" value={result.images.length} color="text-green-400" />
                  <StatCard label="Source" value={result.source === 'firecrawl' ? 'AI Scraper' : 'Basic'} color="text-purple-400" />
                </div>
              </div>
            )}

            {/* Links */}
            {activeTab === 'links' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between mb-4">
                  <input
                    type="text"
                    placeholder="Filter links..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <span className="bg-zinc-900 text-zinc-400 text-xs px-3 py-1.5 rounded-lg border border-zinc-800">
                      {filteredLinks.length} results
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  {filteredLinks.map((link, i) => (
                    <div key={i} className="group bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 rounded-xl p-3 flex items-center gap-4 transition-all">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${link.type === 'internal' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {link.type === 'internal' ? <Layout size={14} /> : <ExternalLink size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-zinc-400 text-xs font-medium uppercase truncate">{link.text || 'No anchor text'}</p>
                          <span className="text-[10px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded uppercase">{link.type}</span>
                        </div>
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-zinc-200 text-sm hover:text-purple-400 hover:underline transition-colors truncate block">
                          {link.url}
                        </a>
                      </div>
                      <button
                        onClick={() => copyToClipboard(link.url)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-white transition-all"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {activeTab === 'images' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <input
                  type="text"
                  placeholder="Filter images..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredImages.map((img, i) => (
                    <div key={i} className="group bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all">
                      <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => copyToClipboard(img.url)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors">
                            <Copy size={18} />
                          </button>
                          <a href={img.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-sm transition-colors">
                            <ExternalLink size={18} />
                          </a>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] text-zinc-500 truncate" title={img.alt || 'No alt text'}>
                          {img.alt || 'Untitled Image'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            {activeTab === 'meta' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {Object.entries(result.meta).map(([key, value]) => (
                  <div key={key} className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row gap-2 sm:gap-6">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-wider sm:w-48 flex-shrink-0">{key}</span>
                    <span className="text-sm text-zinc-300 break-all">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Markdown */}
            {activeTab === 'markdown' && result.markdown && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Extracted Content</h2>
                  <button
                    onClick={() => copyToClipboard(result.markdown!)}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Copy size={14} /> Copy Markdown
                  </button>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 font-mono text-sm text-zinc-400 max-h-[600px] overflow-auto whitespace-pre-wrap">
                  {result.markdown}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
        active
          ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20'
          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${active ? 'bg-purple-500/20 text-purple-400' : 'bg-zinc-800 text-zinc-500'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center text-center">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
