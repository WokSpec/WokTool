'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

type FontData = Record<string, string[]>;

const BLOCK_FONT: FontData = {
  'A': ['  #  ','  #  ',' # # ','#####','#   #','#   #','#   #'],
  'B': ['#### ','#   #','#   #','#### ','#   #','#   #','#### '],
  'C': [' ####','#    ','#    ','#    ','#    ','#    ',' ####'],
  'D': ['#### ','#   #','#   #','#   #','#   #','#   #','#### '],
  'E': ['#####','#    ','#    ','#### ','#    ','#    ','#####'],
  'F': ['#####','#    ','#    ','#### ','#    ','#    ','#    '],
  'G': [' ####','#    ','#    ','# ###','#   #','#   #',' ####'],
  'H': ['#   #','#   #','#   #','#####','#   #','#   #','#   #'],
  'I': ['#####','  #  ','  #  ','  #  ','  #  ','  #  ','#####'],
  'J': ['#####','   # ','   # ','   # ','   # ','#  # ',' ##  '],
  'K': ['#   #','#  # ','# #  ','##   ','# #  ','#  # ','#   #'],
  'L': ['#    ','#    ','#    ','#    ','#    ','#    ','#####'],
  'M': ['#   #','## ##','# # #','#   #','#   #','#   #','#   #'],
  'N': ['#   #','##  #','# # #','#  ##','#   #','#   #','#   #'],
  'O': [' ### ','#   #','#   #','#   #','#   #','#   #',' ### '],
  'P': ['#### ','#   #','#   #','#### ','#    ','#    ','#    '],
  'Q': [' ### ','#   #','#   #','#   #','# # #','#  ##',' ## #'],
  'R': ['#### ','#   #','#   #','#### ','# #  ','#  # ','#   #'],
  'S': [' ####','#    ','#    ',' ### ','    #','    #','#### '],
  'T': ['#####','  #  ','  #  ','  #  ','  #  ','  #  ','  #  '],
  'U': ['#   #','#   #','#   #','#   #','#   #','#   #',' ### '],
  'V': ['#   #','#   #','#   #','#   #',' # # ',' # # ','  #  '],
  'W': ['#   #','#   #','#   #','# # #','# # #','## ##','#   #'],
  'X': ['#   #',' # # ','  #  ','  #  ','  #  ',' # # ','#   #'],
  'Y': ['#   #','#   #',' # # ','  #  ','  #  ','  #  ','  #  '],
  'Z': ['#####','    #','   # ','  #  ',' #   ','#    ','#####'],
  '0': [' ### ','#  ##','# # #','## ##','#   #','#   #',' ### '],
  '1': ['  #  ',' ##  ','  #  ','  #  ','  #  ','  #  ','#####'],
  '2': [' ### ','#   #','    #','   # ','  #  ',' #   ','#####'],
  '3': [' ### ','#   #','    #',' ### ','    #','#   #',' ### '],
  '4': ['   # ','  ## ',' # # ','#  # ','#####','   # ','   # '],
  '5': ['#####','#    ','#    ','#### ','    #','    #','#### '],
  '6': [' ### ','#    ','#    ','#### ','#   #','#   #',' ### '],
  '7': ['#####','    #','   # ','  #  ',' #   ','#    ','#    '],
  '8': [' ### ','#   #','#   #',' ### ','#   #','#   #',' ### '],
  '9': [' ### ','#   #','#   #',' ####','    #','    #',' ### '],
  ' ': ['     ','     ','     ','     ','     ','     ','     '],
  '!': ['  #  ','  #  ','  #  ','  #  ','  #  ','     ','  #  '],
  '?': [' ### ','#   #','    #','   # ','  #  ','     ','  #  '],
  '.': ['     ','     ','     ','     ','     ','     ','  #  '],
};

const BANNER_FONT: FontData = Object.fromEntries(Object.entries(BLOCK_FONT).map(([k, v]) => [k, v.map(row => row.replace(/#/g, '*'))]));
const SIMPLE_FONT: FontData = Object.fromEntries(Object.entries(BLOCK_FONT).map(([k, v]) => [k, v.map(row => row.replace(/#/g, '▓'))]));

const FONTS = [
    { value: 'Block', label: 'Classic Block' },
    { value: 'Banner', label: 'Star Banner' },
    { value: 'Simple', label: 'Solid Block' },
];

const BORDERS = [
    { value: 'none', label: 'No Frame' },
    { value: 'single', label: 'Single Line ┌─┐' },
    { value: 'double', label: 'Double Line ╔═╗' },
    { value: 'ascii', label: 'ASCII +--+' },
    { value: 'stars', label: 'Stars ***' },
];

function textToAscii(text: string, font: string): string {
  const upper = text.toUpperCase();
  const fontData = font === 'Banner' ? BANNER_FONT : font === 'Simple' ? SIMPLE_FONT : BLOCK_FONT;
  const rows: string[] = ['','','','','','',''];
  for (const ch of upper) {
    const glyph = fontData[ch] ?? fontData[' '] ?? ['     ','     ','     ','     ','     ','     ','     '];
    for (let r = 0; r < 7; r++) {
      rows[r] += (glyph[r] ?? '     ') + ' ';
    }
  }
  return rows.join('\n');
}

function addBorder(text: string, style: string): string {
  if (style === 'none') return text;
  const lines = text.split('\n');
  const maxLen = Math.max(...lines.map(l => l.length));
  const chars = {
    'single': { tl:'┌',tr:'┐',bl:'└',br:'┘',h:'─',v:'│' },
    'double': { tl:'╔',tr:'╗',bl:'╚',br:'╝',h:'═',v:'║' },
    'ascii':  { tl:'+',tr:'+',bl:'+',br:'+',h:'-',v:'|' },
    'stars':  { tl:'*',tr:'*',bl:'*',br:'*',h:'*',v:'*' },
  }[style] ?? { tl:'+',tr:'+',bl:'+',br:'+',h:'-',v:'|' };
  const top = chars.tl + chars.h.repeat(maxLen + 2) + chars.tr;
  const bot = chars.bl + chars.h.repeat(maxLen + 2) + chars.br;
  const mid = lines.map(l => `${chars.v} ${l.padEnd(maxLen)} ${chars.v}`);
  return [top, ...mid, bot].join('\n');
}

export default function AsciiArtClient() {
  const [text, setText] = useState('WOKTOOL');
  const [font, setFont] = useState('Block');
  const [border, setBorder] = useState('none');

  const output = useMemo(() => {
    if (!text.trim()) return '';
    const art = textToAscii(text, font);
    return addBorder(art, border);
  }, [text, font, border]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="space-y-6">
            <Card title="Input Settings">
                <div className="space-y-6">
                    <Input 
                        label="Source Text"
                        value={text}
                        onChange={e => setText(e.target.value.slice(0, 20).replace(/[^a-zA-Z0-9 !?.]/g, ''))}
                        placeholder="MAX 20 CHARS"
                        className="text-lg font-black tracking-widest uppercase"
                    />
                    <Select 
                        label="Font Style"
                        value={font}
                        onChange={e => setFont(e.target.value)}
                        options={FONTS}
                    />
                    <Select 
                        label="Border Style"
                        value={border}
                        onChange={e => setBorder(e.target.value)}
                        options={BORDERS}
                    />
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 opacity-60">
                <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">Quick Presets</h4>
                <div className="flex flex-wrap gap-2">
                    {['HELLO', 'DESIGN', 'CLI', 'ASCII'].map(p => (
                        <button key={p} onClick={() => setText(p)} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 hover:text-white hover:bg-white/10 transition-all uppercase">{p}</button>
                    ))}
                </div>
            </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">ASCII Output</h3>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigator.clipboard.writeText(output)} 
                    className="h-7 text-[10px]"
                    disabled={!output}
                >
                    Copy Art
                </Button>
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-purple-500 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-500" />
                <div className="relative rounded-3xl bg-[#0a0a0a] border border-white/10 p-8 md:p-12 overflow-x-auto shadow-2xl custom-scrollbar min-h-[300px] flex items-center justify-center">
                    <pre className="font-mono text-xs md:text-sm text-accent leading-none whitespace-pre select-all">
                        {output || <span className="text-white/10 italic">Your art will appear here...</span>}
                    </pre>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 opacity-40">
                <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold">1</span>
                    <p className="text-[10px] leading-relaxed">ASCII art is perfect for source code comments, terminal banners, or retro styling.</p>
                </div>
                <div className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] font-bold">2</span>
                    <p className="text-[10px] leading-relaxed">This tool runs entirely client-side. No data ever leaves your device.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
