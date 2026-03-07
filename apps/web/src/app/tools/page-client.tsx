'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, X, Star, Zap, Clock, Grid, ChevronRight, Activity, Command, 
  Youtube, Layers, RefreshCw, Maximize, PenTool, Code, Palette, Type, 
  Monitor, FileJson, Lock, ShieldCheck, Key, FileText, Share2, Edit3, 
  Save, Globe, Box, Download, Music, Video, Info
} from 'lucide-react';
import { TOOLS, TAG_LABELS } from '@/lib/tools-registry';
import type { ToolTag, ToolDef } from '@/lib/tools-registry';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const CATEGORIES: Array<{ tag: ToolTag | null; label: string; icon: any }> = [
  { tag: null,       label: 'Overview',    icon: Command },
  { tag: 'image',   label: 'Imaging',     icon: Layers },
  { tag: 'design',  label: 'Design',      icon: Palette },
  { tag: 'dev',     label: 'Engineering',  icon: Code },
  { tag: 'audio',   label: 'Media',       icon: Music },
  { tag: 'crypto',  label: 'Web3',        icon: Activity },
  { tag: 'utility', label: 'Workflow',    icon: Zap },
];

const ICON_MAP: Record<string, any> = {
  Youtube, Layers, RefreshCw, Zap, Maximize, PenTool, Code, Palette, Type, 
  Monitor, FileJson, Search, Globe, Box, Lock, ShieldCheck, Key, FileText, 
  Activity, Share2, Edit3, Clock, Save
};

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Grid;
  return <Icon className={className} />;
}

function ToolCard({ tool, starred, onStar, onVisit }: { tool: ToolDef; starred: boolean; onStar: any; onVisit: any }) {
  return (
    <Link
      href={tool.href}
      onClick={() => onVisit(tool.id)}
      className="group relative flex flex-col p-6 rounded-[1.5rem] bg-[#050505] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,255,255,0.02)]"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.03] border border-white/[0.08] transition-all duration-500 group-hover:scale-110 group-hover:bg-white/[0.06] group-hover:border-white/[0.2]">
          <ToolIcon name={tool.icon} className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onStar(tool.id); }}
          className={`p-2 rounded-xl transition-all ${starred ? 'text-yellow-500 bg-yellow-500/10' : 'text-zinc-700 hover:text-white hover:bg-white/5'}`}
        >
          <Star size={14} fill={starred ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex-1">
        <h3 className="text-[15px] font-bold text-white mb-1.5 flex items-center gap-2 tracking-tight">
            {tool.label}
            <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-zinc-600" />
        </h3>
        <p className="text-[13px] text-zinc-500 leading-relaxed line-clamp-2 font-medium">{tool.description}</p>
      </div>

      {tool.isNew && (
        <div className="absolute top-4 right-12 px-2 py-0.5 rounded-full bg-accent text-[8px] font-black uppercase tracking-widest text-white">New</div>
      )}
    </Link>
  );
}

export default function ToolsHubClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [activeTag, setActiveTag] = useState<ToolTag | null>(() => (searchParams.get('category') as ToolTag | null) ?? null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      setRecentIds(JSON.parse(localStorage.getItem('toolhub-recent') ?? '[]'));
      setStarredIds(JSON.parse(localStorage.getItem('toolhub-starred') ?? '[]'));
    } catch { }
  }, []);

  const syncUrl = useCallback((tag: ToolTag | null, q: string) => {
    const params = new URLSearchParams();
    if (tag) params.set('category', tag);
    if (q.trim()) params.set('q', q.trim());
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : '/', { scroll: false });
  }, [router]);

  const handleCategoryChange = (tag: ToolTag | null) => {
    setActiveTag(tag);
    syncUrl(tag, search);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    syncUrl(activeTag, q);
  };

  const toggleStar = (id: string) => {
    setStarredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('toolhub-starred', JSON.stringify(next));
      return next;
    });
  };

  const trackRecent = (id: string) => {
    setRecentIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 12);
      localStorage.setItem('toolhub-recent', JSON.stringify(next));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = TOOLS;
    if (activeTag) list = list.filter(t => t.tags.includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.label.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeTag]);

  const recentTools = recentIds.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as ToolDef[];
  const starredTools = starredIds.map(id => TOOLS.find(t => t.id === id)).filter(Boolean) as ToolDef[];

  const ytTool = TOOLS.find(t => t.id === 'yt-downloader');

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* ── Dashboard Sidebar ────────────────────────────────────────── */}
      <aside className="fixed left-0 top-14 bottom-0 w-[260px] hidden xl:flex flex-col border-r border-white/[0.06] bg-black p-6 z-40">
        <div className="space-y-10">
            <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Explore
                </div>
                <nav className="space-y-0.5">
                    {CATEGORIES.map(c => {
                        const Icon = c.icon;
                        return (
                            <button
                                key={c.label}
                                onClick={() => handleCategoryChange(c.tag)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all group ${activeTag === c.tag ? 'bg-white/[0.06] text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02]'}`}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon size={16} className={`transition-all duration-300 ${activeTag === c.tag ? 'text-accent' : 'text-zinc-600 group-hover:text-zinc-400'}`} />
                                    {c.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {(recentTools.length > 0 || starredTools.length > 0) && (
                <div className="space-y-3 pt-6 border-t border-white/[0.06]">
                    <div className="flex items-center gap-2 px-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-600">
                        My Library
                    </div>
                    <nav className="space-y-0.5">
                        {starredTools.length > 0 && (
                            <button onClick={() => { setActiveTag(null); setSearch(''); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-bold text-zinc-500 hover:text-white transition-all"><Star size={14} className="text-yellow-500/40" /> Favorites</button>
                        )}
                        {recentTools.length > 0 && (
                            <button onClick={() => { setActiveTag(null); setSearch(''); }} className="w-full flex items-center gap-3 px-3 py-2 text-[13px] font-bold text-zinc-500 hover:text-white transition-all"><Clock size={14} className="text-accent/60" /> Recents</button>
                        )}
                    </nav>
                </div>
            )}
        </div>

        <div className="mt-auto group">
            <a 
                href="https://wokspec.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] transition-all hover:bg-white/[0.04] hover:border-white/[0.1]"
            >
                <div className="h-8 w-8 rounded-lg bg-accent flex items-center justify-center font-black text-[10px]">W</div>
                <div>
                    <div className="text-[11px] font-bold text-white uppercase tracking-tighter">WokSpec Global</div>
                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Protocol V2</div>
                </div>
            </a>
        </div>
      </aside>

      {/* ── Main Dashboard ─────────────────────────────────────────── */}
      <main className="flex-1 xl:pl-[260px] bg-black">
        {/* Spotlight Hero (YouTube) */}
        {!activeTag && !search && ytTool && (
            <section className="relative border-b border-white/[0.06] overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
                    <div className="space-y-8 flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                            <Zap size={12} className="text-accent" /> Spotlight Feature
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[0.9]">
                                YouTube Pro <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Downloader.</span>
                            </h1>
                            <p className="text-base md:text-xl text-zinc-500 max-w-xl font-medium leading-relaxed">
                                High-fidelity media extraction. Convert any video to professional-grade <span className="text-white">MP3, WAV, or 4K MP4</span> instantly.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <Button href={ytTool.href} size="lg" className="rounded-2xl px-10">Launch Tool</Button>
                            <div className="flex items-center gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                <span className="flex items-center gap-2"><Music size={14} /> MP3/WAV</span>
                                <span className="flex items-center gap-2"><Video size={14} /> 4K MP4</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative w-full max-w-sm aspect-square md:aspect-auto md:h-80 rounded-[2.5rem] bg-[#050505] border border-white/[0.08] flex items-center justify-center shadow-2xl shadow-red-500/5 group-hover:border-red-500/20 transition-all duration-700">
                        <Youtube size={120} className="text-red-500/20 group-hover:text-red-500 group-hover:scale-110 transition-all duration-700" strokeWidth={1.5} />
                        <div className="absolute inset-0 bg-radial-glow opacity-20" />
                    </div>
                </div>
            </section>
        )}

        {/* Regular Header (Search + Categories) */}
        <header className={`sticky top-14 z-30 bg-black/80 backdrop-blur-xl border-b border-white/[0.06] p-6 lg:px-12 transition-all ${(!activeTag && !search) ? 'pt-12' : 'py-6'}`}>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="relative group max-w-2xl">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-white/10 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-700" />
                    <div className="relative">
                        <input 
                            type="text"
                            placeholder="Find a professional utility (⌘K)..."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="w-full h-14 text-lg pl-14 pr-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-white/10 focus:bg-white/[0.05] transition-all"
                        />
                        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors" />
                        {search && (
                            <button onClick={() => handleSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                        <button
                            key={c.label}
                            onClick={() => handleCategoryChange(c.tag)}
                            className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${activeTag === c.tag ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]' : 'bg-white/5 border-white/[0.06] text-zinc-600 hover:text-zinc-200 hover:border-white/20'}`}
                        >
                            {c.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>

        {/* The Grid Area */}
        <div className="p-6 lg:p-12 max-w-[1440px] mx-auto space-y-16">
            {/* Conditional: Recents */}
            {recentTools.length > 0 && !search && !activeTag && (
                <section className="space-y-8 animate-in fade-in duration-1000">
                    <div className="flex items-center gap-3 px-1">
                        <div className="h-6 w-1 bg-accent/40 rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">Recently Utilized</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {recentTools.map(t => (
                            <ToolCard key={t.id} tool={t} starred={starredIds.includes(t.id)} onStar={toggleStar} onVisit={trackRecent} />
                        ))}
                    </div>
                </section>
            )}

            {/* Main Result Area */}
            <section className="space-y-8 animate-in fade-in duration-1000 delay-100">
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                        <div className="h-6 w-1 bg-white/10 rounded-full" />
                        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-600">
                            {activeTag ? TAG_LABELS[activeTag] : 'Core Protocol Utilities'}
                        </h2>
                    </div>
                    <span className="text-[10px] font-black font-mono text-zinc-800 tracking-tighter">{filtered.length} LOADED</span>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map(t => (
                            <ToolCard key={t.id} tool={t} starred={starredIds.includes(t.id)} onStar={toggleStar} onVisit={trackRecent} />
                        ))}
                    </div>
                ) : (
                    <div className="py-40 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-24 h-24 rounded-[2.5rem] border border-dashed border-white/10 flex items-center justify-center text-4xl grayscale opacity-10">🔍</div>
                        <div className="space-y-1">
                            <p className="font-black text-zinc-500 uppercase tracking-widest text-sm">Protocol Miss</p>
                            <p className="text-xs text-zinc-700 font-bold uppercase tracking-widest">Search query yielded zero modules.</p>
                        </div>
                        <Button onClick={() => { handleSearch(''); handleCategoryChange(null); }} variant="secondary" size="sm" className="rounded-xl">Reset Search</Button>
                    </div>
                )}
            </section>
        </div>

        {/* Global Footer */}
        <footer className="border-t border-white/[0.04] bg-[#050505] p-12 mt-32">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-3 grayscale opacity-40">
                        <div className="h-6 w-6 rounded-md bg-white shadow-xl shadow-white/5" />
                        <span className="text-sm font-black uppercase tracking-tighter">WokTool</span>
                    </div>
                    <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.2em]">© 2026 WokSpec Global · Autonomous Tool Protocol</p>
                </div>
                <div className="flex gap-10">
                    <a href="https://wokspec.org" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors">Ecosystem</a>
                    <a href="https://github.com/WokSpec/WokTool" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors">Repository</a>
                    <a href="/tools/privacy-policy" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-colors">Privacy</a>
                </div>
            </div>
        </footer>
      </main>
    </div>
  );
}
