'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ColorSwatch from '@/components/ui/ColorSwatch';

// ── Color conversion helpers ──────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  if (full.length !== 6) return null;
  const n = parseInt(full, 16);
  if (isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toLowerCase();
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    else if (max === gn) h = ((bn - rn) / d + 2) / 6;
    else h = ((rn - gn) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}

function parseInput(raw: string): [number, number, number] | null {
  const s = raw.trim().toLowerCase();
  if (s.startsWith('#') || /^[0-9a-f]{3,6}$/.test(s)) {
    return hexToRgb(s.startsWith('#') ? s : '#' + s);
  }
  const rgb = s.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (rgb) return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
  const hsl = s.match(/^hsl\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)$/i);
  if (hsl) {
    const h = parseInt(hsl[1]) / 360, sv = parseInt(hsl[2]) / 100, l = parseInt(hsl[3]) / 100;
    const q = l < 0.5 ? l * (1 + sv) : l + sv - l * sv;
    const p = 2 * l - q;
    const hue2rgb = (t: number) => {
      if (t < 0) t += 1; if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    return [Math.round(hue2rgb(h + 1/3) * 255), Math.round(hue2rgb(h) * 255), Math.round(hue2rgb(h - 1/3) * 255)];
  }
  if (typeof document !== 'undefined') {
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.fillStyle = s;
      const computed = ctx.fillStyle;
      if (computed.startsWith('#')) return hexToRgb(computed);
      const m = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (m) return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
    }
  }
  return null;
}

export default function ColorConverterTool() {
  const [input, setInput] = useState('#818cf8');

  const rgb = parseInput(input);
  const hex  = rgb ? rgbToHex(...rgb) : null;
  const hsl  = rgb ? rgbToHsl(...rgb) : null;
  const hsv  = rgb ? rgbToHsv(...rgb) : null;

  const formats = rgb && hex && hsl && hsv ? [
    { label: 'HEX',  value: hex },
    { label: 'RGB',  value: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` },
    { label: 'HSL',  value: `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)` },
    { label: 'HSV',  value: `hsv(${hsv[0]}, ${hsv[1]}%, ${hsv[2]}%)` },
    { label: 'CSS',  value: `color: ${hex};` },
  ] : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Input */}
        <div className="space-y-6">
            <Card title="Color Input" description="Enter any color format: HEX, RGB, HSL, or CSS names.">
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <Input 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="#818cf8 or blue"
                            className="font-mono"
                        />
                    </div>
                    <div className="w-12 h-12 rounded-xl border border-white/10 shadow-inner flex-shrink-0" style={{ background: hex || 'transparent' }} />
                </div>
                {!rgb && input.trim() && (
                    <p className="mt-2 text-xs text-danger font-medium animate-pulse">Invalid color format</p>
                )}
            </Card>

            <div className="grid grid-cols-3 gap-3">
                {['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#818cf8', '#a29bfe'].map(c => (
                    <button 
                        key={c} 
                        onClick={() => setInput(c)}
                        className="h-10 rounded-lg border border-white/5 transition-transform hover:scale-105 active:scale-95"
                        style={{ background: c }}
                    />
                ))}
            </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Converted Formats</h3>
            {formats ? (
                <div className="grid gap-3">
                    {formats.map((f) => (
                        <div key={f.label} className="group relative flex items-center justify-between p-4 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 transition-all">
                            <div className="flex items-center gap-4">
                                <span className="w-10 text-[10px] font-bold text-white/30 uppercase tracking-wider">{f.label}</span>
                                <code className="text-sm font-bold text-white/80">{f.value}</code>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => navigator.clipboard.writeText(f.value)}
                            >
                                Copy
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-[280px] rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 opacity-40">
                    <p className="text-sm">Enter a valid color to see results</p>
                </div>
            )}
        </div>
      </div>

      {hex && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Visual Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 h-40 rounded-2xl flex items-center justify-center text-4xl font-bold shadow-2xl" style={{ background: hex, color: (hsl?.[2] ?? 0) > 60 ? '#000' : '#fff' }}>
                    Aa
                </div>
                <div className="space-y-3">
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg" style={{ background: hex, opacity: 0.1 }} />
                        <span className="text-xs font-medium text-white/60">Subtle Background</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-4" style={{ borderColor: hex }} />
                        <span className="text-xs font-medium text-white/60">Border / Stroke</span>
                    </div>
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] flex items-center gap-3">
                        <span className="text-xl font-bold" style={{ color: hex }}>Text</span>
                        <span className="text-xs font-medium text-white/60 ml-auto">Foreground Color</span>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
