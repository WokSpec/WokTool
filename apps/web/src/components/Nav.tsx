'use client';

import Link from 'next/link';
import { TOOLS } from '@/lib/tools-registry';
import CommandPalette from './CommandPalette';
import { Search, Github, Globe, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const TOOL_COUNT = TOOLS.length;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openPalette = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).__openToolPalette) (window as any).__openToolPalette();
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500">
        {/* Top Marquee Bar */}
        <div className="bg-white text-black py-1 overflow-hidden whitespace-nowrap select-none border-b border-white">
            <div className="flex animate-marquee-fast">
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-[0.3em] mx-8 flex items-center gap-2">
                        System Online <div className="w-1 h-1 rounded-full bg-black animate-pulse" /> Live Protocols: {TOOL_COUNT} <div className="w-1 h-1 rounded-full bg-black animate-pulse" /> Edge Processing Active
                    </span>
                ))}
            </div>
        </div>

        <nav className={`transition-all duration-500 border-b ${scrolled ? 'bg-bg-base/80 backdrop-blur-xl border-white/10 py-3' : 'bg-transparent border-transparent py-6'}`}>
          <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-12">
                <Link href="/" className="group flex items-center gap-3">
                    <div className="relative">
                        <span className="text-xl lg:text-2xl font-black uppercase tracking-[-0.08em] text-white group-hover:text-accent transition-colors duration-500">WokTool</span>
                        <div className="absolute -right-2 -top-1 w-1.5 h-1.5 bg-accent rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                    </div>
                    <span className="hidden lg:block h-4 w-[1px] bg-white/10" />
                    <span className="hidden lg:block text-[9px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-white/40 transition-colors">Industrial·Protocol</span>
                </Link>

                <div className="hidden lg:flex items-center gap-8">
                    {['Imaging', 'Design', 'Media', 'Web3'].map(cat => (
                        <Link key={cat} href={`/?category=${cat.toLowerCase().replace(' ', '')}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button 
                    onClick={openPalette}
                    className="hidden md:flex items-center gap-3 px-4 py-2 rounded-none border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                >
                    <Search size={14} className="text-white/40 group-hover:text-accent transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white">Quick Access</span>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[8px] font-mono text-white/20">
                        <span className="text-white/40">⌘</span>K
                    </div>
                </button>

                <a 
                    href="https://github.com/WokSpec/WokTool" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-white/40 hover:text-white transition-colors"
                >
                    <Github size={18} strokeWidth={2.5} />
                </a>

                <button 
                    className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-bg-base flex flex-col pt-32 px-8 animate-in fade-in duration-300">
            <div className="space-y-8">
                {['Imaging', 'Design', 'Engineering', 'Media', 'Web3', 'Security'].map(cat => (
                    <Link 
                        key={cat} 
                        href={`/?category=${cat.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-4xl font-black uppercase tracking-tighter text-white hover:text-accent transition-colors"
                    >
                        {cat}
                    </Link>
                ))}
            </div>
            
            <div className="mt-auto pb-12 space-y-6">
                <div className="h-[1px] w-full bg-white/5" />
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                    <span>© 2026 WokSpec</span>
                    <div className="flex gap-6">
                        <a href="https://wokspec.org" target="_blank" rel="noopener noreferrer">WokSpec.org</a>
                        <a href="https://github.com/WokSpec/WokTool" target="_blank" rel="noopener noreferrer">Source</a>
                    </div>
                </div>
            </div>
        </div>
      )}

      <CommandPalette />
    </>
  );
}
