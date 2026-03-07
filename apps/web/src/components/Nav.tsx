'use client';

import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';
import CommandPalette from './CommandPalette';
import { Search, Github } from 'lucide-react';

const TOOL_COUNT = TOOLS.length;

function openPalette() {
  (window as any).__openToolPalette?.();
}

export default function Nav() {
  return (
    <>
      <CommandPalette />
      <nav className="sticky top-0 z-[100] w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4 md:px-6">
          {/* Left: Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-lg shadow-accent/20">
                <span className="text-base font-bold">W</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black uppercase tracking-tighter text-white">WokTool</span>
                <span className="text-[10px] font-bold text-white/30">{TOOL_COUNT} UTILS</span>
              </div>
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden items-center gap-6 md:flex">
                <Link href="/tools" className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-accent">Explorer</Link>
                <a href="https://wokspec.org" target="_blank" rel="noopener noreferrer" className="text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white">WokSpec</a>
            </div>
          </div>

          {/* Center: Search Trigger */}
          <button 
            onClick={openPalette}
            className="group hidden h-9 w-full max-w-[320px] items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 transition-all hover:border-white/10 hover:bg-white/[0.05] lg:flex"
          >
            <div className="flex items-center gap-2 text-white/30 group-hover:text-white/50 transition-colors">
              <Search size={14} />
              <span className="text-xs font-medium">Quick search...</span>
            </div>
            <kbd className="flex h-5 items-center gap-1 rounded bg-black/40 px-1.5 font-mono text-[10px] font-bold text-white/20 border border-white/5">
              <span>⌘</span>K
            </kbd>
          </button>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button 
                onClick={openPalette}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] transition-all hover:bg-white/[0.08] lg:hidden"
            >
                <Search size={16} className="text-white/40" />
            </button>
            
            <a 
                href="https://github.com/WokSpec/WokTool" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex h-9 items-center gap-2 rounded-xl bg-white text-black px-4 text-xs font-bold shadow-lg shadow-white/5 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
            >
                <Github size={14} />
                <span className="hidden sm:inline">Star on GitHub</span>
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}
