'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Dropzone from '@/components/ui/Dropzone';
import Slider from '@/components/ui/Slider';

export default function ImageDiffTool() {
  const [img1, setImg1] = useState<string | null>(null);
  const [img2, setImg2] = useState<string | null>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    if (img1) URL.revokeObjectURL(img1);
    if (img2) URL.revokeObjectURL(img2);
    setImg1(null);
    setImg2(null);
    setSliderPos(50);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {!(img1 && img2) ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1 text-center">Reference Image (A)</h3>
                <Dropzone 
                    onFileSelect={f => setImg1(URL.createObjectURL(f))}
                    previewUrl={img1}
                    className="h-64"
                />
            </div>
            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1 text-center">Comparison Image (B)</h3>
                <Dropzone 
                    onFileSelect={f => setImg2(URL.createObjectURL(f))}
                    previewUrl={img2}
                    className="h-64"
                />
            </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="relative group">
                <div 
                    ref={containerRef}
                    className="relative w-full aspect-video rounded-3xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center cursor-ew-resize"
                >
                    {/* Checkerboard BG */}
                    <div className="absolute inset-0 opacity-10" 
                        style={{ 
                            backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                            backgroundSize: '24px 24px'
                        }} 
                    />

                    {/* Image B (Bottom) */}
                    <img src={img2!} alt="Image B" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />

                    {/* Image A (Top, Clipped) */}
                    <div 
                        className="absolute inset-0 overflow-hidden pointer-events-none"
                        style={{ width: `${sliderPos}%`, borderRight: '2px solid white' }}
                    >
                        <img 
                            src={img1!} 
                            alt="Image A" 
                            className="absolute inset-0 h-full object-contain max-w-none" 
                            style={{ width: containerRef.current?.offsetWidth || '100%' }}
                        />
                    </div>

                    {/* Handle UI */}
                    <div 
                        className="absolute top-0 bottom-0 pointer-events-none flex items-center justify-center z-20"
                        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className="w-10 h-10 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-accent">
                            <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-4 4 4 4m8-8l4 4-4 4" /></svg>
                        </div>
                    </div>

                    {/* Labels */}
                    <div className="absolute bottom-6 left-6 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-white tracking-widest z-30">Reference A</div>
                    <div className="absolute bottom-6 right-6 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase text-white tracking-widest z-30">New B</div>

                    {/* Interaction Range */}
                    <input 
                        type="range" 
                        min="0" max="100" 
                        value={sliderPos} 
                        onChange={e => setSliderPos(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-white/[0.02] border border-white/5">
                <div className="flex-1 w-full max-w-xl">
                    <Slider label="Comparison Split" min={0} max={100} value={sliderPos} onChange={setSliderPos} unit="%" />
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={reset}>Reset Comparison</Button>
                </div>
            </div>
        </div>
      )}

      {!(img1 && img2) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Visual Diff</div>
                <p className="text-xs text-white/40">Easily spot subtle changes between two images using our interactive slider.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">No Server Upload</div>
                <p className="text-xs text-white/40">Your images never leave your computer. Processing happens instantly in-browser.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Pixel Perfect</div>
                <p className="text-xs text-white/40">Perfect for checking compression artifacts or UI regression tests.</p>
            </div>
        </div>
      )}
    </div>
  );
}
