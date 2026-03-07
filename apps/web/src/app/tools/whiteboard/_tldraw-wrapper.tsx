'use client';

import { Tldraw } from 'tldraw';
import { useEffect, useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function TldrawWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('TldrawWrapper mounted');
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/20 bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">Loading Canvas...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full tldraw-wrapper-inner relative">
      <ErrorBoundary
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-red-400 bg-[#0a0a0a]">
            <p className="text-sm font-medium">Failed to load Whiteboard engine.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-xs font-bold uppercase tracking-widest border border-red-500/20 rounded-full hover:bg-red-500/10 transition-colors"
            >
              Reload Page
            </button>
          </div>
        }
      >
        <Tldraw persistenceKey="whiteboard" />
      </ErrorBoundary>
    </div>
  );
}
