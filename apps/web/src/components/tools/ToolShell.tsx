'use client';

import Link from 'next/link';
import { ChevronLeft, Info, Github, ExternalLink, Command, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-bg-base text-white pt-32 pb-24 px-6 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Navigation / Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/5 pb-8">
            <nav className="flex items-center gap-4" aria-label="Breadcrumb">
                <Link href="/" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-colors flex items-center gap-2 group">
                    <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    Registry
                </Link>
                <span className="text-white/10 text-[10px]">/</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">{label}</span>
            </nav>

            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <span className="label-tech text-green-500">Live_Protocol</span>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={12} className="text-white/20" />
                    <span className="label-tech">Encrypted_Edge</span>
                </div>
            </div>
        </div>

        {/* Hero Section */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
            <div className="lg:col-span-8 space-y-8">
                <div className="space-y-4">
                    <span className="label-tech text-accent">Module_Initialization_Success</span>
                    <h1 className="text-5xl lg:text-8xl font-black uppercase tracking-[-0.06em] leading-[0.85]">{label}</h1>
                </div>
                <p className="max-w-2xl text-lg lg:text-xl text-white/40 font-medium leading-relaxed uppercase tracking-tight">
                    {description}
                </p>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-end gap-4 lg:items-end">
                <div className="flex gap-2">
                    <a 
                        href={`https://github.com/WokSpec/WokTool/tree/main/apps/web/src/app/tools/${id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-v btn-v-secondary !px-4"
                    >
                        <Github size={14} /> SOURCE
                    </a>
                    <button className="btn-v btn-v-secondary !px-4">
                        <Info size={14} /> DOCS
                    </button>
                </div>
                <div className="label-tech !tracking-[0.4em] opacity-40">Build_4.2.1_Verified</div>
            </div>
        </header>

        {/* Core Tool Container */}
        <main className="relative">
          {comingSoon || !children ? (
            <div className="py-48 flex flex-col items-center justify-center text-center space-y-12 border border-dashed border-white/10 bg-white/[0.01]">
              <div className="text-4xl opacity-20">PROTOCOL_PENDING</div>
              <div className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Under Synthesis</h2>
                <p className="text-white/30 text-xs font-black uppercase tracking-[0.2em] max-w-sm mx-auto">This professional utility is currently being engineered. System readiness expected shortly.</p>
              </div>
              <Link href="/" className="btn-v btn-v-primary">
                ← Return to Registry
              </Link>
            </div>
          ) : (
            <div className="animate-slide-up">
                {children}
            </div>
          )}
        </main>

        {/* Technical Footer */}
        <footer className="mt-32 pt-12 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-12 opacity-40 hover:opacity-100 transition-opacity duration-700">
            <div className="space-y-4">
                <h4 className="label-tech text-white/60">Data_Isolation</h4>
                <p className="text-[11px] font-bold text-white/30 leading-relaxed uppercase tracking-tight">Processing occurs strictly within the local environment. Zero retention protocol active. No external telemetry.</p>
            </div>
            <div className="space-y-4">
                <h4 className="label-tech text-white/60">Open_Blueprint</h4>
                <p className="text-[11px] font-bold text-white/30 leading-relaxed uppercase tracking-tight">Verified by the global engineering collective. Part of the WokSpec open-source initiative.</p>
            </div>
            <div className="space-y-4">
                <h4 className="label-tech text-white/60">Edge_Optimization</h4>
                <p className="text-[11px] font-bold text-white/30 leading-relaxed uppercase tracking-tight">Low-latency architecture utilizing browser-native APIs for professional-grade performance.</p>
            </div>
        </footer>
      </div>
    </div>
  );
}

function ShieldCheck({ size, className }: { size: number; className?: string }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    );
}
