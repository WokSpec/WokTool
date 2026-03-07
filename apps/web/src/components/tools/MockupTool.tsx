'use client';

import { useState, useRef, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Dropzone from '@/components/ui/Dropzone';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const DEVICES = [
  { id: 'macbook', label: 'MacBook Pro', w: 1200, h: 750, frame: 'rounded-[1.5rem] border-[12px] border-[#1a1a1a] shadow-2xl' },
  { id: 'iphone',  label: 'iPhone 15',   w: 390,  h: 844, frame: 'rounded-[3rem] border-[10px] border-[#0a0a0a] shadow-2xl ring-2 ring-white/5' },
  { id: 'ipad',    label: 'iPad Pro',    w: 834,  h: 1194, frame: 'rounded-[2rem] border-[14px] border-[#111] shadow-2xl' },
  { id: 'browser', label: 'Chrome Window',w: 1200, h: 800, frame: 'rounded-xl border border-white/10 shadow-2xl pt-8 bg-white/[0.03]' },
];

export default function MockupTool() {
  const [image, setImage] = useState<string | null>(null);
  const [device, setDevice] = useState(DEVICES[0]);
  const [isExporting, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    setImage(URL.createObjectURL(file));
  };

  const currentDevice = DEVICES.find(d => d.id === device.id) || DEVICES[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <Card title="Settings">
                <div className="space-y-6">
                    <Select 
                        label="Device Frame"
                        value={currentDevice.id}
                        onChange={e => setDevice(DEVICES.find(d => d.id === e.target.value)!)}
                        options={DEVICES.map(d => ({ value: d.id, label: d.label }))}
                    />
                    
                    <Dropzone 
                        onFileSelect={handleFile}
                        label="Replace Screenshot"
                        className="h-32"
                    />

                    <div className="pt-4 border-t border-white/5 space-y-3">
                        <Button variant="primary" className="w-full" onClick={() => window.print()}>
                            Print / Export PDF
                        </Button>
                        <Button variant="ghost" className="w-full" size="sm" onClick={() => setImage(null)}>
                            Reset Tool
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start opacity-60">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 text-xl">📸</div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    For best results, use a screenshot with the same aspect ratio as the selected device. Browser frame works best with 16:9.
                </p>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Mockup Preview</h3>
            <div className="relative aspect-video rounded-3xl bg-[#0a0a0a] border border-white/10 flex items-center justify-center p-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                        backgroundImage: 'linear-gradient(45deg, #161616 25%, transparent 25%), linear-gradient(-45deg, #161616 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161616 75%), linear-gradient(-45deg, transparent 75%, #161616 75%)',
                        backgroundSize: '24px 24px'
                    }} 
                />
                
                {image ? (
                    <div 
                        className={`relative transition-all duration-500 overflow-hidden ${currentDevice.frame} animate-in zoom-in-95`}
                        style={{ 
                            width: currentDevice.id === 'iphone' ? '240px' : '85%',
                            aspectRatio: `${currentDevice.w} / ${currentDevice.h}`
                        }}
                    >
                        {currentDevice.id === 'browser' && (
                            <div className="absolute top-0 left-0 right-0 h-8 flex items-center gap-1.5 px-4 pointer-events-none">
                                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/40" />
                                <div className="w-2 h-2 rounded-full bg-green-500/40" />
                            </div>
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image} alt="Screenshot" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className="max-w-md w-full">
                        <Dropzone onFileSelect={handleFile} label="Upload Screenshot" description="MacBook, iPhone, and iPad frames supported" />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
