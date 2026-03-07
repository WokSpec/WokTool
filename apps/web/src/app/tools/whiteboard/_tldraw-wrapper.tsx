'use client';

import { Tldraw } from 'tldraw';
import { useEffect, useState, useCallback } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import 'tldraw/tldraw.css';

export default function TldrawWrapper() {
  const [mounted, setMounted] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = useCallback(() => {
    try {
      localStorage.removeItem('tldraw_persistence_whiteboard');
      window.location.reload();
    } catch (e) {
      console.error('Failed to clear canvas:', e);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/20 bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">Initialising Canvas Protocol...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full tldraw-wrapper-inner relative">
      <ErrorBoundary
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-6 text-red-400 bg-[#050505] p-12 text-center">
            <div className="space-y-2">
                <p className="text-lg font-black uppercase tracking-tighter text-white">Engine Failure Detected</p>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">The drawing protocol encountered a fatal exception. This may be due to incompatible local state.</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                >
                    Soft Reboot
                </button>
                <button 
                    onClick={handleReset}
                    className="px-6 py-2.5 text-[11px] font-black uppercase tracking-widest bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                    Wipe State & Reset
                </button>
            </div>
          </div>
        }
      >
        <Tldraw 
            persistenceKey="whiteboard" 
            autoFocus 
            inferDarkMode
        />
      </ErrorBoundary>
    </div>
  );
}
