'use client';

import dynamic from 'next/dynamic';

const TldrawCanvas = dynamic(
  () => import('./_tldraw-wrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/20 bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest">Initializing Canvas...</span>
      </div>
    ),
  }
);

export default function WhiteboardClient() {
  return (
    <div className="relative w-full h-[75vh] min-h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl animate-in fade-in duration-700">
        <TldrawCanvas />
        
        <div className="absolute top-4 left-4 z-50 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black text-white/40 uppercase tracking-widest">
                Infinite Canvas • Auto-saving
            </div>
        </div>
    </div>
  );
}
