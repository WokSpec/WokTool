'use client';

import { useState, useRef, useCallback } from 'react';

// ─── SVG Optimizer ───────────────────────────────────────────────────────────

function optimizeSvg(svg: string): string {
  let out = svg;

  // Remove XML declaration
  out = out.replace(/<\?xml[^>]*\?>/g, '');

  // Remove DOCTYPE
  out = out.replace(/<!DOCTYPE[^>]*>/gi, '');

  // Remove comments
  out = out.replace(/<!--[\s\S]*?-->/g, '');

  // Remove <metadata>...</metadata>
  out = out.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');

  // Remove unnecessary attributes
  out = out.replace(/\s+version="[^"]*"/g, '');
  out = out.replace(/\s+xml:space="[^"]*"/g, '');
  out = out.replace(/\s+xmlns:xlink="[^"]*"/g, '');

  // Remove empty groups: <g></g> or <g/>
  out = out.replace(/<g\s*\/>/g, '');
  out = out.replace(/<g\s*><\/g>/g, '');

  // Clean up numbers: 1.0 → 1, 0.5 → .5
  out = out.replace(/\b([0-9]+)\.0+\b/g, '$1');
  out = out.replace(/\b0+\.([0-9]+)\b/g, '.$1');

  // Collapse multiple whitespace in attribute values (preserve inside text content)
  out = out.replace(/\s{2,}/g, ' ');

  // Remove whitespace between tags
  out = out.replace(/>\s+</g, '><');

  // Trim leading/trailing whitespace per tag attribute
  out = out.replace(/\s+>/g, '>');
  out = out.replace(/\s+\/>/g, '/>');

  // Convert long color names to hex (common ones)
  const colorMap: Record<string, string> = {
    'black': '#000', 'white': '#fff', 'red': '#f00', 'green': '#008000',
    'blue': '#00f', 'yellow': '#ff0', 'cyan': '#0ff', 'magenta': '#f0f',
    'gray': '#808080', 'grey': '#808080', 'orange': '#ffa500',
  };
  for (const [name, hex] of Object.entries(colorMap)) {
    out = out.replace(new RegExp(`(?<=[":;\\s])${name}(?=[";\\s]|$)`, 'gi'), hex);
  }

  // Shorten 6-digit hex colors that are pairs: #aabbcc → #abc
  out = out.replace(/#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g, '#$1$2$3');

  // Remove default attribute values
  out = out.replace(/\s+fill-opacity="1"/g, '');
  out = out.replace(/\s+stroke-opacity="1"/g, '');
  out = out.replace(/\s+stroke-width="1"/g, '');
  out = out.replace(/\s+opacity="1"/g, '');
  out = out.replace(/\s+fill="none"\s+stroke="none"/g, '');

  return out.trim();
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1048576).toFixed(2)} MB`;
}

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 900 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 },
  group: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  textarea: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontSize: '0.8rem', fontFamily: 'var(--font-mono, monospace)', resize: 'vertical' as const, boxSizing: 'border-box' as const, minHeight: 220 },
  statsRow: { display: 'flex', gap: '1.5rem', flexWrap: 'wrap' as const, padding: '0.75rem 1rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8 },
  stat: { display: 'flex', flexDirection: 'column' as const, gap: 2 },
  statLabel: { fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  statVal: { fontSize: '1rem', fontWeight: 700, color: 'var(--text)' },
  previewBox: { border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px', minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  dropzone: { border: '2px dashed var(--border)', borderRadius: 10, padding: '1.5rem', textAlign: 'center' as const, cursor: 'pointer', background: 'var(--bg-surface)' },
};

export default function SvgOptimizerClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<{ orig: number; opt: number; pct: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const run = useCallback((src: string) => {
    if (!src.trim()) return;
    const optimized = optimizeSvg(src);
    setOutput(optimized);
    const orig = new Blob([src]).size;
    const opt = new Blob([optimized]).size;
    setStats({ orig, opt, pct: Math.max(0, ((orig - opt) / orig) * 100) });
  }, []);

  const onInputChange = (v: string) => {
    setInput(v);
    run(v);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([output], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'optimized.svg';
    a.click();
  };

  const loadFile = (file: File) => {
    const r = new FileReader();
    r.onload = e => {
      const text = e.target?.result as string;
      setInput(text);
      run(text);
    };
    r.readAsText(file);
  };

  return (
    <div style={S.root}>
      {/* File drop */}
      <div
        style={{ ...S.dropzone, borderColor: dragging ? 'var(--accent)' : undefined }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) loadFile(f); }}
        onClick={() => fileRef.current?.click()}
      >
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.875rem' }}>Drop .svg file or click to upload — or paste SVG below</p>
        <input ref={fileRef} type="file" accept=".svg,image/svg+xml" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
      </div>

      {/* Two-column editor */}
      <div style={S.twoCol}>
        <div style={S.group}>
          <div style={S.label}>Original SVG</div>
          <textarea style={S.textarea} placeholder="Paste SVG code here…" value={input} onChange={e => onInputChange(e.target.value)} />
        </div>
        <div style={S.group}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div style={S.label}>Optimized SVG</div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn-ghost" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={copy} disabled={!output}>{copied ? '✓' : 'Copy'}</button>
              <button className="btn-ghost" style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }} onClick={download} disabled={!output}>⬇ Download</button>
            </div>
          </div>
          <textarea style={{ ...S.textarea, color: 'var(--text-secondary)' }} value={output} readOnly />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div style={S.statsRow}>
          <div style={S.stat}><span style={S.statLabel}>Original</span><span style={S.statVal}>{fmtBytes(stats.orig)}</span></div>
          <div style={S.stat}><span style={S.statLabel}>Optimized</span><span style={S.statVal}>{fmtBytes(stats.opt)}</span></div>
          <div style={S.stat}><span style={S.statLabel}>Reduction</span><span style={{ ...S.statVal, color: '#22c55e' }}>−{stats.pct.toFixed(1)}%</span></div>
          <div style={S.stat}><span style={S.statLabel}>Saved</span><span style={{ ...S.statVal, color: '#22c55e' }}>{fmtBytes(stats.orig - stats.opt)}</span></div>
        </div>
      )}

      {/* Live Preview */}
      {output && (
        <div style={S.group}>
          <div style={S.label}>Live Preview</div>
          <div style={S.previewBox} dangerouslySetInnerHTML={{ __html: output }} />
        </div>
      )}
    </div>
  );
}
