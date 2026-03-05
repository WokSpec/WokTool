'use client';

import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';
import CommandPalette from './CommandPalette';

const TOOL_COUNT = TOOLS.length;

function openPalette() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).__openToolPalette?.();
}

export default function Nav() {
  return (
    <>
      <CommandPalette />
      <nav className="wt-nav">
        <div className="wt-nav-inner">
          {/* Left: logo */}
          <Link href="/" className="wt-nav-logo">
            <span className="wt-nav-logo-icon" aria-hidden="true">🛠️</span>
            <span className="wt-nav-logo-name">WokTool</span>
            <span className="wt-nav-logo-count" aria-label={`${TOOL_COUNT} tools`}>{TOOL_COUNT}</span>
          </Link>

          {/* Center: Cmd+K search trigger */}
          <button type="button" className="wt-nav-search" onClick={openPalette} aria-label="Search tools (⌘K)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <span className="wt-nav-search-text">Search tools…</span>
            <kbd className="wt-nav-search-kbd">⌘K</kbd>
          </button>

          {/* Right: links */}
          <div className="wt-nav-links">
            <a
              href="https://wokspec.org"
              target="_blank"
              rel="noopener noreferrer"
              className="wt-nav-link"
            >
              wokspec.org
            </a>
            <a
              href="https://github.com/WokSpec/WokTool"
              target="_blank"
              rel="noopener noreferrer"
              className="wt-nav-link wt-nav-link--icon"
              aria-label="GitHub"
            >
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
