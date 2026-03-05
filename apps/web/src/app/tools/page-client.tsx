'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Star } from 'lucide-react';
import { TOOLS, TAG_LABELS } from '@/lib/tools-registry';
import type { ToolTag, ToolDef } from '@/lib/tools-registry';
import TutorialOverlay, { useTutorial, TOOLS_TUTORIAL } from '@/components/TutorialOverlay';
import { TAG_COLORS, POPULAR_IDS } from '@/components/CommandPalette';

import MagicMirror from '@/components/MagicMirror';

declare global {
  interface Window { __openToolPalette?: () => void; }
}

const SIDEBAR_CATEGORIES: Array<{ tag: ToolTag | null; label: string }> = [
  { tag: null,       label: 'All Tools' },
  { tag: 'image',   label: 'Image' },
  { tag: 'design',  label: 'Design' },
  { tag: 'dev',     label: 'Dev Tools' },
  { tag: 'gamedev', label: 'Game Dev' },
  { tag: 'audio',   label: 'Audio' },
  { tag: 'crypto',  label: '₿ Crypto/Web3' },
  { tag: 'collab',  label: 'Collab' },
];

const STATS = [
  { value: String(TOOLS.length) + '+', label: 'tools' },
  { value: '8', label: 'categories' },
  { value: '100%', label: 'client-side' },
  { value: 'Free', label: 'forever' },
];

function countForTag(tag: ToolTag | null) {
  return tag ? TOOLS.filter(t => t.tags.includes(tag)).length : TOOLS.length;
}

// ---------------------------------------------------------------------------
// ToolCard
// ---------------------------------------------------------------------------

interface ToolCardProps {
  tool: ToolDef;
  starred: boolean;
  accent?: string;
  onStar: (id: string, e: React.MouseEvent) => void;
  onVisit: (id: string) => void;
}

function ToolCard({ tool, starred, accent, onStar, onVisit }: ToolCardProps) {
  return (
    <Link
      href={tool.href}
      className="toolhub-card"
      style={accent ? { '--card-accent': accent } as React.CSSProperties : undefined}
      onClick={() => onVisit(tool.id)}
    >
      <div className="toolhub-card-top">
        <span className="toolhub-card-icon" aria-hidden="true">
          {tool.icon}
        </span>
      </div>
      <div className="toolhub-card-body">
        <div className="toolhub-card-name">{tool.label}</div>
        <p className="toolhub-card-desc">{tool.description}</p>
      </div>
      <div className="toolhub-card-top-right">
        {tool.isNew && <span className="toolhub-card-badge">New</span>}
        <button
          type="button"
          className={`toolhub-card-star${starred ? ' --starred' : ''}`}
          onClick={e => onStar(tool.id, e)}
          title={starred ? 'Remove from starred' : 'Star this tool'}
          aria-label={starred ? 'Unstar' : 'Star'}
        >
          <Star size={12} fill={starred ? 'currentColor' : 'none'} />
        </button>
      </div>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ToolsHubClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const [activeTag, setActiveTag] = useState<ToolTag | null>(() => (searchParams.get('category') as ToolTag | null) ?? null);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [starredIds, setStarredIds] = useState<string[]>([]);

  const { active: tutActive, start: startTut, complete: completeTut, skip: skipTut } = useTutorial(TOOLS_TUTORIAL, false);

  // Hydrate localStorage
  useEffect(() => {
    try {
      const r = JSON.parse(localStorage.getItem('toolhub-recent') ?? '[]');
      const s = JSON.parse(localStorage.getItem('toolhub-starred') ?? '[]');
      setRecentIds(Array.isArray(r) ? r : []);
      setStarredIds(Array.isArray(s) ? s : []);
    } catch { /* ignore */ }
  }, []);

  // URL sync — uses `/` as the hub root
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

  const handleSearchChange = (q: string) => {
    setSearch(q);
    syncUrl(activeTag, q);
  };

  const toggleStar = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStarredIds(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('toolhub-starred', JSON.stringify(next));
      return next;
    });
  }, []);

  const trackRecent = useCallback((id: string) => {
    setRecentIds(prev => {
      const next = [id, ...prev.filter(x => x !== id)].slice(0, 10);
      localStorage.setItem('toolhub-recent', JSON.stringify(next));
      return next;
    });
  }, []);

  const filtered = useMemo(() => {
    let list = TOOLS;
    if (activeTag) list = list.filter(t => t.tags.includes(activeTag));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.label.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.includes(q))
      );
    }
    return list;
  }, [search, activeTag]);

  // Group tools by their first tag when showing "all" without search
  const grouped = useMemo(() => {
    if (activeTag || search.trim()) return null;
    const groups: { tag: ToolTag; label: string; tools: ToolDef[] }[] = [];
    const tags = SIDEBAR_CATEGORIES.filter(c => c.tag !== null) as { tag: ToolTag; label: string }[];
    for (const { tag, label } of tags) {
      const tools = TOOLS.filter(t => t.tags[0] === tag || (t.tags.includes(tag) && !groups.some(g => g.tools.includes(t))));
      if (tools.length > 0) groups.push({ tag, label, tools });
    }
    return groups;
  }, [activeTag, search]);

  const recentTools = recentIds
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is ToolDef => t !== undefined)
    .slice(0, 3);

  const starredTools = starredIds
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is ToolDef => t !== undefined);

  const popularTools = POPULAR_IDS
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is ToolDef => t !== undefined);

  const showPopular = !search.trim() && !activeTag && recentTools.length === 0 && starredTools.length === 0;

  const cardProps = { starred: false, onStar: toggleStar, onVisit: trackRecent };

  return (
    <main className="toolhub-layout">
      {tutActive && (
        <TutorialOverlay tutorial={TOOLS_TUTORIAL} onComplete={completeTut} onSkip={skipTut} />
      )}

      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside className="toolhub-sidebar">
        <div className="toolhub-sidebar-title">Categories</div>
        {SIDEBAR_CATEGORIES.map(({ tag, label }) => (
          <button type="button"
            key={tag ?? 'all'}
            className={`toolhub-sidebar-item${activeTag === tag ? ' --active' : ''}`}
            onClick={() => handleCategoryChange(tag)}
          >
            <span>{label}</span>
            <span className="toolhub-sidebar-count">{countForTag(tag)}</span>
          </button>
        ))}
      </aside>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="toolhub-content">
        {/* Hero — only shown when not filtering */}
        {!activeTag && !search.trim() && (
          <div className="toolhub-hero">
            <h1 className="toolhub-hero-title">
              The open toolkit for{' '}
              <span className="toolhub-hero-accent">builders</span>
            </h1>
            <p className="toolhub-hero-sub">
              {TOOLS.length}+ free, browser-based tools for developers &amp; designers.
              No login. No tracking. Your data never leaves your device.
            </p>
            <div className="toolhub-stats-row">
              {STATS.map(s => (
                <div key={s.label} className="toolhub-stat">
                  <span className="toolhub-stat-value">{s.value}</span>
                  <span className="toolhub-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Magic Mirror */}
        {!activeTag && !search.trim() && <MagicMirror />}

        {/* Search */}
        <div className="toolhub-search-wrap">
          <Search className="toolhub-search-icon" size={16} aria-hidden="true" />
          <input
            className="toolhub-search"
            type="search"
            placeholder={`Search ${TOOLS.length}+ tools…`}
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            autoComplete="off"
          />
          {search ? (
            <button
              type="button"
              className="toolhub-search-clear"
              onClick={() => handleSearchChange('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : (
            <button
              type="button"
              className="toolhub-search-kbd"
              onClick={() => window.__openToolPalette?.()}
              aria-label="Open command palette"
            >
              <kbd>⌘K</kbd>
            </button>
          )}
        </div>

        {/* Recently Used */}
        {recentTools.length > 0 && !search.trim() && (
          <section className="toolhub-section">
            <h2 className="toolhub-section-title">Recently Used</h2>
            <div className="toolhub-grid">
              {recentTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} {...cardProps}
                  accent={TAG_COLORS[tool.tags[0] as ToolTag]}
                  starred={starredIds.includes(tool.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Starred */}
        {starredTools.length > 0 && !search.trim() && !activeTag && (
          <section className="toolhub-section">
            <h2 className="toolhub-section-title">Starred</h2>
            <div className="toolhub-grid">
              {starredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} {...cardProps}
                  accent={TAG_COLORS[tool.tags[0] as ToolTag]}
                  starred={true} />
              ))}
            </div>
          </section>
        )}

        {/* Popular — shown only before user has history */}
        {showPopular && (
          <section className="toolhub-section">
            <h2 className="toolhub-section-title">Popular</h2>
            <div className="toolhub-grid">
              {popularTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} {...cardProps}
                  accent={TAG_COLORS[tool.tags[0] as ToolTag]}
                  starred={starredIds.includes(tool.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Grouped view (all, no search) */}
        {grouped ? (
          grouped.map(({ tag, label, tools }) => (
            <section key={tag} className="toolhub-section">
              <h2 className="toolhub-section-title">
                {TAG_COLORS[tag] && (
                  <span className="toolhub-cat-dot" style={{ background: TAG_COLORS[tag] }} aria-hidden="true" />
                )}
                {label}
                <span className="toolhub-section-count">{tools.length}</span>
              </h2>
              <div className="toolhub-grid">
                {tools.map(tool => (
                  <ToolCard key={tool.id} tool={tool} {...cardProps}
                    accent={TAG_COLORS[tag]}
                    starred={starredIds.includes(tool.id)} />
                ))}
              </div>
            </section>
          ))
        ) : (
          /* Filtered / searched view */
          <section className="toolhub-section">
            <h2 className="toolhub-section-title">
              {activeTag && TAG_COLORS[activeTag] && (
                <span className="toolhub-cat-dot" style={{ background: TAG_COLORS[activeTag] }} aria-hidden="true" />
              )}
              {activeTag ? TAG_LABELS[activeTag] : 'Results'}
              <span className="toolhub-section-count">{filtered.length}</span>
            </h2>

            {filtered.length === 0 ? (
              <div className="toolhub-empty">
                <p>No tools match &ldquo;{search}&rdquo;</p>
                <button type="button" className="btn-ghost" onClick={() => { handleSearchChange(''); handleCategoryChange(null); }}>
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="toolhub-grid">
                {filtered.map(tool => (
                  <ToolCard key={tool.id} tool={tool} {...cardProps}
                    accent={TAG_COLORS[tool.tags[0] as ToolTag]}
                    starred={starredIds.includes(tool.id)} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Footer */}
        <footer className="toolhub-footer">
          <p>
            All tools are free forever.{' '}
            <Link href="/" className="toolhub-footer-link">Back to Hub →</Link>
          </p>
          <p>
            Missing a tool?{' '}
            <a href="https://github.com/WokSpec/WokTool/issues" target="_blank" rel="noopener noreferrer" className="toolhub-footer-link">
              Request it on GitHub
            </a>
            {' · '}
            <button type="button"
              className="toolhub-footer-link"
              onClick={startTut}
            >
              ? Take a tour
            </button>
          </p>
        </footer>
      </div>
    </main>
  );
}
