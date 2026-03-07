'use client';

import Link from 'next/link';
import { ChevronLeft, Info, Github, ExternalLink } from 'lucide-react';

interface ToolShellProps {
  id: string;
  label: string;
  description: string;
  icon: string;
  children?: React.ReactNode;
  comingSoon?: boolean;
}

export default function ToolShell({
  id,
  label,
  description,
  icon,
  children,
  comingSoon,
}: ToolShellProps) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <div className="tool-shell">
        {/* Navigation / Breadcrumb */}
        <nav className="tool-shell-breadcrumb group" aria-label="Breadcrumb">
          <Link href="/tools" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-widest">Dashboard</span>
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-300">{label}</span>
        </nav>

        {/* Hero Section for Tool */}
        <header className="tool-shell-header flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div className="tool-shell-icon-badge">
              {icon}
            </div>
            <div>
              <h1 className="tool-shell-title">{label}</h1>
              <p className="tool-shell-desc">{description}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <a 
                href={`https://github.com/WokSpec/WokTool/tree/main/apps/web/src/app/tools/${id}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
                <Github size={14} />
                <span>Source</span>
            </a>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all">
                <Info size={14} />
                <span>Docs</span>
            </button>
          </div>
        </header>

        {/* Core Tool Container */}
        <div className="tool-shell-body mt-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {comingSoon || !children ? (
            <div className="flex flex-col items-center justify-center py-32 text-center space-y-8">
              <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center text-3xl opacity-20">⚙️</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tighter">In Development</h2>
                <p className="text-zinc-500 max-w-sm mx-auto">This professional utility is currently being synthesized. Check back shortly.</p>
              </div>
              <Link href="/tools" className="btn-v btn-v-secondary">
                ← Back to Dashboard
              </Link>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Tool Context Footer */}
        <footer className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-accent tracking-[0.2em]">Privacy</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Processing happens strictly on your machine. No data is ever transmitted or stored.</p>
            </div>
            <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Open Source</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Verified by the community. Part of the WokSpec Global Open Source Protocol.</p>
            </div>
            <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em]">Performance</h4>
                <p className="text-[11px] text-zinc-500 leading-relaxed">Optimized for sub-millisecond response times using browser-native APIs.</p>
            </div>
        </footer>
      </div>
    </div>
  );
}
