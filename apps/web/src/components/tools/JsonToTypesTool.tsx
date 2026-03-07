'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

function jsonToTs(obj: any, interfaceName = 'RootInterface'): string {
  let interfaces = '';
  
  function transform(o: any, name: string): string {
    if (o === null) return 'null';
    if (Array.isArray(o)) {
      if (o.length === 0) return 'any[]';
      const types = Array.from(new Set(o.map(item => typeof item === 'object' && item !== null ? transform(item, name + 'Item') : typeof item))).join(' | ');
      return `(${types})[]`;
    }
    if (typeof o === 'object') {
      let res = `interface ${name} {\n`;
      for (const [key, val] of Object.entries(o)) {
        const type = val === null ? 'null' : Array.isArray(val) ? transform(val, key.charAt(0).toUpperCase() + key.slice(1)) : typeof val === 'object' ? key.charAt(0).toUpperCase() + key.slice(1) : typeof val;
        res += `  ${key}: ${type};\n`;
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          interfaces += transform(val, key.charAt(0).toUpperCase() + key.slice(1)) + '\n\n';
        }
      }
      res += '}';
      return res;
    }
    return typeof o;
  }

  const root = transform(obj, interfaceName);
  return (interfaces + root).trim();
}

export default function JsonToTypesTool() {
  const [input, setInput] = useState('{\n  "id": 1,\n  "name": "WokTool",\n  "active": true,\n  "tags": ["utility", "free"],\n  "author": {\n    "name": "WokSpec",\n    "github": "https://github.com/WokSpec"\n  }\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const convert = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToTs(parsed));
    } catch (e: any) {
      setError(`Invalid JSON: ${e.message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">JSON Sample</h3>
                    <Button variant="ghost" size="sm" onClick={() => { setInput(''); setOutput(''); }} className="h-7 text-[10px]">Clear</Button>
                </div>
                <Textarea 
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Paste JSON here..."
                    className="min-h-[350px] font-mono text-xs"
                    spellCheck={false}
                />
            </div>
            <Button onClick={convert} className="w-full" size="lg" disabled={!input.trim()}>
                Generate TypeScript Interfaces
            </Button>
            {error && (
                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono">
                    {error}
                </div>
            )}
        </div>

        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Generated Types</h3>
            {output ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <CodeBlock code={output} language="typescript" maxHeight="450px" />
                    <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(output)}>
                        Copy Definition
                    </Button>
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🔷</div>
                    <p className="text-sm">TS interfaces will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
