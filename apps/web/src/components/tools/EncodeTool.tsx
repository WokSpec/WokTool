'use client';

import { useState, useCallback, useMemo } from 'react';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

const MORSE: Record<string, string> = {
  A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',
  K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',
  U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....',
  '6':'-....','7':'--...','8':'---..','9':'----.',' ':'/',
};
const MORSE_REV = Object.fromEntries(Object.entries(MORSE).map(([k,v]) => [v,k]));

type Op = 'base64-enc' | 'base64-dec' | 'url-enc' | 'url-dec' | 'html-enc' | 'html-dec' | 'morse-enc' | 'morse-dec' | 'rot13';

const OPS: { id: Op; label: string; group: 'Encoding' | 'Decoding' | 'Fun' }[] = [
  { id: 'base64-enc', label: 'Base64 Encode', group: 'Encoding' },
  { id: 'url-enc',    label: 'URL Encode',    group: 'Encoding' },
  { id: 'html-enc',   label: 'HTML Encode',   group: 'Encoding' },
  { id: 'base64-dec', label: 'Base64 Decode', group: 'Decoding' },
  { id: 'url-dec',    label: 'URL Decode',    group: 'Decoding' },
  { id: 'html-dec',   label: 'HTML Decode',   group: 'Decoding' },
  { id: 'rot13',      label: 'ROT-13',        group: 'Fun' },
  { id: 'morse-enc',  label: 'Morse Encode',  group: 'Fun' },
  { id: 'morse-dec',  label: 'Morse Decode',  group: 'Fun' },
];

function htmlEncode(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
function htmlDecode(s: string) {
  return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#039;/g,"'");
}
function rot13(s: string) {
  return s.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function transform(op: Op, input: string): string {
  if (!input) return '';
  try {
    switch (op) {
      case 'base64-enc': return btoa(unescape(encodeURIComponent(input)));
      case 'base64-dec': {
          const s = input.replace(/-/g, '+').replace(/_/g, '/').trim();
          const padLen = (4 - (s.length % 4)) % 4;
          const b64 = s + '='.repeat(padLen);
          return decodeURIComponent(atob(b64).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''));
        }
      case 'url-enc':    return encodeURIComponent(input);
      case 'url-dec':    return decodeURIComponent(input);
      case 'html-enc':   return htmlEncode(input);
      case 'html-dec':   return htmlDecode(input);
      case 'morse-enc':  return input.toUpperCase().split('').map(c => MORSE[c] ?? '?').join(' ');
      case 'morse-dec':  return input.split(' ').map(code => MORSE_REV[code] ?? '?').join('').toLowerCase();
      case 'rot13':      return rot13(input);
      default: return input;
    }
  } catch (e) {
    return `Error: ${(e as Error).message}`;
  }
}

export default function EncodeTool() {
  const [input, setInput] = useState('');
  const [op, setOp] = useState<Op>('base64-enc');
  
  const output = useMemo(() => transform(op, input), [op, input]);

  const groups = ['Encoding', 'Decoding', 'Fun'] as const;

  const swap = () => {
    setInput(output);
    // Find reverse op if possible
    if (op.includes('-enc')) setOp(op.replace('-enc', '-dec') as Op);
    else if (op.includes('-dec')) setOp(op.replace('-dec', '-enc') as Op);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Ops */}
        <div className="space-y-6">
            <Card title="Choose Operation">
                <div className="space-y-6">
                    {groups.map(g => (
                        <div key={g} className="space-y-2">
                            <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest px-1">{g}</h4>
                            <div className="grid grid-cols-1 gap-1">
                                {OPS.filter(o => o.group === g).map(o => (
                                    <button
                                        key={o.id}
                                        onClick={() => setOp(o.id)}
                                        className={`
                                            w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all
                                            ${op === o.id 
                                                ? 'bg-accent text-white shadow-md' 
                                                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        {o.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <h4 className="text-sm font-bold text-white mb-2">Pro Tip</h4>
                <p className="text-xs text-white/40 leading-relaxed">
                    Use the <strong>Swap</strong> button to quickly use your output as the new input. This is useful for multi-stage encoding or verifying decodes.
                </p>
            </div>
        </div>

        {/* Main: Input/Output */}
        <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Input</h3>
                    <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter text to process..."
                    className="min-h-[180px] font-mono text-sm"
                />
            </div>

            <div className="flex justify-center">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={swap}
                    disabled={!output || output.startsWith('Error')}
                    icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>}
                >
                    Swap Input & Output
                </Button>
            </div>

            <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Output</h3>
                {output ? (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <CodeBlock 
                            code={output} 
                            label={OPS.find(o => o.id === op)?.label}
                            maxHeight="300px" 
                        />
                        <Button 
                            variant="primary" 
                            className="w-full" 
                            size="lg"
                            onClick={() => navigator.clipboard.writeText(output)}
                        >
                            Copy Result
                        </Button>
                    </div>
                ) : (
                    <div className="h-[200px] rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center text-white/20 text-sm italic">
                        Waiting for input...
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
