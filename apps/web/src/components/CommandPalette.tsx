'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TOOLS, TAG_LABELS } from '@/lib/tools-registry';
import type { ToolTag } from '@/lib/tools-registry';

// ── Category accent colors ─────────────────────────────────────────────────

export const TAG_COLORS: Partial<Record<ToolTag, string>> = {
  image:        '#f472b6',
  design:       '#a78bfa',
  dev:          '#60a5fa',
  gamedev:      '#4ade80',
  audio:        '#fb923c',
  crypto:       '#fbbf24',
  collab:       '#2dd4bf',
  text:         '#818cf8',
  pdf:          '#f87171',
  css:          '#a78bfa',
  json:         '#60a5fa',
  security:     '#f87171',
  calculator:   '#fbbf24',
  network:      '#60a5fa',
  converter:    '#4ade80',
  devops:       '#60a5fa',
  seo:          '#2dd4bf',
  productivity: '#34d399',
  fun:          '#fb923c',
  reference:    '#a1a1aa',
  misc:         '#a1a1aa',
};

// ── Curated popular tools ──────────────────────────────────────────────────

export const POPULAR_IDS = [
  'json-tools',
  'image-converter',
  'regex-tester',
  'color-tools',
  'encode-decode',
  'uuid',
  'hash',
  'markdown',
  'background-remover',
  'jwt-debugger',
  'og-preview',
  'password-generator',
];

// ── Component ──────────────────────────────────────────────────────────────

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIdx(0);
  }, []);

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery('');
    setActiveIdx(0);
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => {
          if (!o) { setQuery(''); setActiveIdx(0); }
          return !o;
        });
      }
      if (e.key === 'Escape' && open) close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, close]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  // Expose opener globally so Nav button can call it
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__openToolPalette = openPalette;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return () => { delete (window as any).__openToolPalette; };
  }, [openPalette]);

  const results = useMemo(() => {
    if (!query.trim()) {
      return TOOLS.filter(t => POPULAR_IDS.includes(t.id))
        .sort((a, b) => POPULAR_IDS.indexOf(a.id) - POPULAR_IDS.indexOf(b.id));
    }
    const q = query.toLowerCase();
    return TOOLS.filter(t =>
      t.label.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.includes(q) || TAG_LABELS[tag]?.toLowerCase().includes(q))
    ).slice(0, 14);
  }, [query]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[activeIdx]) {
      router.push(results[activeIdx].href);
      close();
    }
  };

  if (!open) return null;

  return (
    <div
      className="cmd-backdrop"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Search tools"
    >
      <div className="cmd-panel" onClick={e => e.stopPropagation()}>
        {/* Search input row */}
        <div className="cmd-header">
          <svg className="cmd-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="cmd-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Search ${TOOLS.length} tools…`}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="cmd-esc" onClick={close}>esc</kbd>
        </div>

        <div className="cmd-divider" />

        {/* Results */}
        <div ref={listRef} className="cmd-list" role="listbox" aria-label="Tool results">
          {results.length === 0 ? (
            <div className="cmd-empty">No tools match &ldquo;{query}&rdquo;</div>
          ) : (
            <>
              <div className="cmd-list-label">
                {query.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Popular Tools'}
              </div>
              {results.map((tool, idx) => {
                const color = TAG_COLORS[tool.tags[0]] ?? 'var(--text-muted)';
                return (
                  <button
                    key={tool.id}
                    type="button"
                    data-idx={idx}
                    className={`cmd-item${activeIdx === idx ? ' --active' : ''}`}
                    onClick={() => { router.push(tool.href); close(); }}
                    onMouseEnter={() => setActiveIdx(idx)}
                    role="option"
                    aria-selected={activeIdx === idx}
                  >
                    <span className="cmd-item-icon" style={{ '--cat-color': color } as React.CSSProperties}>
                      {tool.icon}
                    </span>
                    <span className="cmd-item-body">
                      <span className="cmd-item-name">{tool.label}</span>
                      <span className="cmd-item-desc">
                        {tool.description.length > 72
                          ? tool.description.slice(0, 72) + '…'
                          : tool.description}
                      </span>
                    </span>
                    <span className="cmd-item-tag" style={{ color }}>
                      {TAG_LABELS[tool.tags[0]]}
                    </span>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
