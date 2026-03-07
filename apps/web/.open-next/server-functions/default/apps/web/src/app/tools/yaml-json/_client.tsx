'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

// ── Simple YAML parser (basic) ──────────────────────────────────────────────
function parseYAML(str: string): unknown {
  const lines = str.split('\n');
  return parseYAMLLines(lines, 0, 0).value;
}

function getIndent(line: string): number {
  return line.length - line.trimStart().length;
}

function parseYAMLLines(lines: string[], startIdx: number, baseIndent: number): { value: unknown; nextIdx: number } {
  let idx = startIdx;
  while (idx < lines.length && lines[idx].trim() === '') idx++;
  if (idx >= lines.length) return { value: null, nextIdx: idx };

  const firstLine = lines[idx];
  const firstTrimmed = firstLine.trimStart();

  if (firstTrimmed.startsWith('- ')) {
    const arr: unknown[] = [];
    while (idx < lines.length) {
      const line = lines[idx];
      if (line.trim() === '') { idx++; continue; }
      const indent = getIndent(line);
      if (indent < baseIndent) break;
      const trimmed = line.trimStart();
      if (!trimmed.startsWith('- ')) break;
      const rest = trimmed.slice(2);
      if (rest.trim() === '') {
        idx++;
        const nested = parseYAMLLines(lines, idx, indent + 2);
        arr.push(nested.value);
        idx = nested.nextIdx;
      } else if (rest.includes(': ') || rest.endsWith(':')) {
        idx++;
        const subLines = [rest];
        while (idx < lines.length) {
          const sub = lines[idx];
          if (sub.trim() === '') { idx++; continue; }
          if (getIndent(sub) <= indent) break;
          subLines.push(sub.trimStart());
          idx++;
        }
        arr.push(parseYAMLLines(subLines, 0, 0).value);
      } else {
        arr.push(parseYAMLScalar(rest.trim()));
        idx++;
      }
    }
    return { value: arr, nextIdx: idx };
  }

  if (firstTrimmed.includes(': ') || firstTrimmed.endsWith(':')) {
    const obj: Record<string, unknown> = {};
    while (idx < lines.length) {
      const line = lines[idx];
      if (line.trim() === '') { idx++; continue; }
      const indent = getIndent(line);
      if (indent < baseIndent) break;
      const trimmed = line.trimStart();
      if (trimmed.startsWith('- ')) break;
      const colonIdx = trimmed.indexOf(': ');
      if (colonIdx === -1 && !trimmed.endsWith(':')) { idx++; continue; }
      const key = colonIdx === -1 ? trimmed.slice(0, -1) : trimmed.slice(0, colonIdx);
      const rest = colonIdx === -1 ? '' : trimmed.slice(colonIdx + 2);
      idx++;
      if (rest.trim() === '') {
        const nested = parseYAMLLines(lines, idx, indent + 2);
        obj[key] = nested.value;
        idx = nested.nextIdx;
      } else {
        obj[key] = parseYAMLScalar(rest.trim());
      }
    }
    return { value: obj, nextIdx: idx };
  }

  return { value: parseYAMLScalar(firstTrimmed), nextIdx: idx + 1 };
}

function parseYAMLScalar(s: string): unknown {
  if (s === 'null' || s === '~') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

function stringifyYAML(val: unknown, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (val === null || val === undefined) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    if (/[:#\[\]{},&*?|<>=!%@`]/.test(val) || val.includes('\n') || val === '') return JSON.stringify(val);
    return val;
  }
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    return val.map(item => {
      const itemStr = stringifyYAML(item, indent + 1);
      if (typeof item === 'object' && item !== null) {
        const lines = itemStr.split('\n');
        return `${pad}- ${lines[0].trimStart()}\n${lines.slice(1).join('\n')}`;
      }
      return `${pad}- ${itemStr.trimStart()}`;
    }).join('\n');
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([k, v]) => {
      if (typeof v === 'object' && v !== null) {
        return `${pad}${k}:\n${stringifyYAML(v, indent + 1)}`;
      }
      return `${pad}${k}: ${stringifyYAML(v, indent)}`;
    }).join('\n');
  }
  return String(val);
}

// ── Simple TOML parser ───────────────────────────────────────────────────────
function parseTOML(str: string): unknown {
  const result: Record<string, unknown> = {};
  let current = result;
  const lines = str.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    if (line.startsWith('[') && line.endsWith(']')) {
      const key = line.slice(1, -1).trim();
      const parts = key.split('.');
      let obj = result;
      for (const part of parts) {
        if (!obj[part]) obj[part] = {};
        obj = obj[part] as Record<string, unknown>;
      }
      current = obj;
      continue;
    }
    const eqIdx = line.indexOf('=');
    if (eqIdx === -1) continue;
    const key = line.slice(0, eqIdx).trim();
    const rawVal = line.slice(eqIdx + 1).trim();
    current[key] = parseTOMLValue(rawVal);
  }
  return result;
}

function parseTOMLValue(s: string): unknown {
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1);
  if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
  if (s.startsWith('[') && s.endsWith(']')) {
    const inner = s.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(x => parseTOMLValue(x.trim()));
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  return s;
}

function stringifyTOML(val: unknown, prefix = ''): string {
  if (typeof val !== 'object' || val === null || Array.isArray(val)) return '';
  const obj = val as Record<string, unknown>;
  const scalars: string[] = [];
  const tables: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v === null || typeof v !== 'object' || Array.isArray(v)) {
      scalars.push(`${k} = ${tomlScalar(v)}`);
    } else {
      const inner = stringifyTOML(v, fullKey);
      tables.push(`\n[${fullKey}]\n${inner}`);
    }
  }
  return [...scalars, ...tables].join('\n');
}

function tomlScalar(v: unknown): string {
  if (v === null) return '""';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'number') return String(v);
  if (Array.isArray(v)) return `[${v.map(tomlScalar).join(', ')}]`;
  return JSON.stringify(String(v));
}

const FMTS = [
    { value: 'json', label: 'JSON' },
    { value: 'yaml', label: 'YAML' },
    { value: 'toml', label: 'TOML' },
];

export default function YamlJsonClient() {
  const [input, setInput] = useState('{\n  "project": "WokTool",\n  "version": "2.0",\n  "features": ["conversion", "security", "design"],\n  "active": true\n}');
  const [output, setOutput] = useState('');
  const [inFmt, setInFmt] = useState<'yaml'|'json'|'toml'>('json');
  const [outFmt, setOutFmt] = useState<'yaml'|'json'|'toml'>('yaml');
  const [error, setError] = useState('');

  function convert() {
    setError('');
    try {
      let parsed: unknown;
      const clean = input.trim();
      if (!clean) return;
      
      if (inFmt === 'json') parsed = JSON.parse(clean);
      else if (inFmt === 'yaml') parsed = parseYAML(clean);
      else parsed = parseTOML(clean);

      let out: string;
      if (outFmt === 'json') out = JSON.stringify(parsed, null, 2);
      else if (outFmt === 'yaml') out = stringifyYAML(parsed);
      else out = stringifyTOML(parsed);

      setOutput(out);
    } catch (e: any) {
      setError(`Format Error: ${e.message}`);
      setOutput('');
    }
  }

  const swap = () => {
    const tempIn = inFmt;
    const tempOut = outFmt;
    setInFmt(tempOut);
    setOutFmt(tempIn);
    setInput(output || input);
    setOutput('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Source Data</h3>
                <div className="flex gap-2">
                    <Select value={inFmt} onChange={e => setInFmt(e.target.value as any)} options={FMTS} className="h-8 !py-1 !text-[10px] uppercase font-black" />
                    <Button variant="ghost" size="sm" onClick={() => setInput('')} className="h-8 text-[10px]">Clear</Button>
                </div>
            </div>
            <Textarea 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={`Paste ${inFmt.toUpperCase()} here...`}
                className="min-h-[400px] font-mono text-xs leading-relaxed"
                spellCheck={false}
            />
            <Button onClick={convert} className="w-full" size="lg">
                Convert to {outFmt.toUpperCase()}
            </Button>
        </div>

        {/* Right: Output */}
        <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Target Format</h3>
                <div className="flex gap-2 items-center">
                    <Button variant="ghost" size="sm" onClick={swap} className="h-8 text-[10px]" icon={<svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>}>Swap</Button>
                    <Select value={outFmt} onChange={e => setOutFmt(e.target.value as any)} options={FMTS} className="h-8 !py-1 !text-[10px] uppercase font-black" />
                </div>
            </div>

            {output ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <CodeBlock code={output} language={outFmt} maxHeight="450px" />
                    <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(output)}>
                        Copy Result
                    </Button>
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    {error ? (
                        <p className="text-sm text-danger font-mono">{error}</p>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🔄</div>
                            <p className="text-sm">Converted data will appear here</p>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
