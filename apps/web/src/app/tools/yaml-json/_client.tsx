'use client';
import { useState } from 'react';

// ── Simple YAML parser (handles basic cases) ───────────────────────────────
function parseYAML(str: string): unknown {
  const lines = str.split('\n');
  return parseYAMLLines(lines, 0, 0).value;
}

function getIndent(line: string): number {
  return line.length - line.trimStart().length;
}

function parseYAMLLines(lines: string[], startIdx: number, baseIndent: number): { value: unknown; nextIdx: number } {
  // Check if it's a mapping or sequence
  let idx = startIdx;
  // Skip empty lines
  while (idx < lines.length && lines[idx].trim() === '') idx++;
  if (idx >= lines.length) return { value: null, nextIdx: idx };

  const firstLine = lines[idx];
  const firstTrimmed = firstLine.trimStart();

  // Sequence
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
        // multi-line value — next lines are nested
        idx++;
        const nested = parseYAMLLines(lines, idx, indent + 2);
        arr.push(nested.value);
        idx = nested.nextIdx;
      } else if (rest.includes(': ') || rest.endsWith(':')) {
        // inline object
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

  // Mapping
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
        // nested
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
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

function stringifyYAML(val: unknown, indent = 0): string {
  const pad = ' '.repeat(indent);
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
      const itemStr = stringifyYAML(item, indent + 2);
      if (typeof item === 'object' && item !== null) {
        const lines = itemStr.split('\n');
        return `${pad}- ${lines[0]}\n${lines.slice(1).join('\n')}`;
      }
      return `${pad}- ${itemStr}`;
    }).join('\n');
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries.map(([k, v]) => {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        return `${pad}${k}:\n${stringifyYAML(v, indent + 2)}`;
      }
      if (Array.isArray(v)) {
        return `${pad}${k}:\n${stringifyYAML(v, indent + 2)}`;
      }
      return `${pad}${k}: ${stringifyYAML(v, indent)}`;
    }).join('\n');
  }
  return String(val);
}

// ── Simple TOML parser ─────────────────────────────────────────────────────
function parseTOML(str: string): unknown {
  const result: Record<string, unknown> = {};
  let current = result;
  const lines = str.split('\n');
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    // Section header
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

export default function YamlJsonClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [inFmt, setInFmt] = useState<'yaml'|'json'|'toml'>('json');
  const [outFmt, setOutFmt] = useState<'yaml'|'json'|'toml'>('yaml');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function convert() {
    setError('');
    try {
      let parsed: unknown;
      if (inFmt === 'json') parsed = JSON.parse(input);
      else if (inFmt === 'yaml') parsed = parseYAML(input);
      else parsed = parseTOML(input);

      let out: string;
      if (outFmt === 'json') out = JSON.stringify(parsed, null, 2);
      else if (outFmt === 'yaml') out = stringifyYAML(parsed);
      else out = stringifyTOML(parsed);

      setOutput(out);
    } catch (e) {
      setError(`Parse error: ${e instanceof Error ? e.message : String(e)}`);
      setOutput('');
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  const selStyle: React.CSSProperties = {
    padding: '0.4rem 0.6rem', borderRadius: 6, border: '1px solid var(--border)',
    background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer',
  };
  const taStyle: React.CSSProperties = {
    width: '100%', flex: 1, minHeight: 360, padding: '0.75rem', borderRadius: 8,
    border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)',
    fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical', outline: 'none',
  };

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
      {/* Controls */}
      <div style={{display:'flex',flexWrap:'wrap',gap:'0.75rem',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <label style={{color:'var(--text-secondary)',fontSize:'0.85rem'}}>Input:</label>
          <select value={inFmt} onChange={e=>setInFmt(e.target.value as 'yaml'|'json'|'toml')} style={selStyle}>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="toml">TOML</option>
          </select>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
          <label style={{color:'var(--text-secondary)',fontSize:'0.85rem'}}>Output:</label>
          <select value={outFmt} onChange={e=>setOutFmt(e.target.value as 'yaml'|'json'|'toml')} style={selStyle}>
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="toml">TOML</option>
          </select>
        </div>
        <button onClick={convert} className="btn-primary" style={{padding:'0.45rem 1.25rem',borderRadius:6,cursor:'pointer',border:'none',fontSize:'0.875rem',fontWeight:600}}>Convert →</button>
      </div>

      {/* Panels */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          <label style={{color:'var(--text-secondary)',fontSize:'0.8rem',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em'}}>Input ({inFmt.toUpperCase()})</label>
          <textarea value={input} onChange={e=>setInput(e.target.value)} style={taStyle} placeholder={`Paste your ${inFmt.toUpperCase()} here…`} spellCheck={false} />
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <label style={{color:'var(--text-secondary)',fontSize:'0.8rem',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.05em'}}>Output ({outFmt.toUpperCase()})</label>
            {output && (
              <button onClick={copyOutput} className="btn-secondary" style={{padding:'0.25rem 0.7rem',borderRadius:6,cursor:'pointer',fontSize:'0.78rem',border:'1px solid var(--border)'}}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea value={output} readOnly style={{...taStyle,background:'var(--bg-elevated)',color:output?'var(--text)':'var(--text-muted)'}} placeholder="Output will appear here…" spellCheck={false} />
        </div>
      </div>

      {error && (
        <div style={{padding:'0.75rem 1rem',borderRadius:8,background:'var(--danger-bg,rgba(248,113,113,0.1))',border:'1px solid var(--danger-border,rgba(248,113,113,0.25))',color:'var(--danger,#f87171)',fontSize:'0.875rem',fontFamily:'monospace'}}>
          {error}
        </div>
      )}
    </div>
  );
}
