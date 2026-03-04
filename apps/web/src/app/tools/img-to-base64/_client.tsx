'use client';

import { useState, useRef } from 'react';

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 820 },
  tabs: { display: 'flex', gap: 4, background: 'var(--bg-surface)', padding: 4, borderRadius: 10, width: 'fit-content' },
  tab: { padding: '0.45rem 1.1rem', borderRadius: 7, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--text-muted)', transition: 'all 0.15s' },
  tabActive: { background: 'var(--accent)', color: '#fff' },
  dropzone: { border: '2px dashed var(--border-strong, rgba(255,255,255,0.15))', borderRadius: 12, padding: '2rem', textAlign: 'center' as const, cursor: 'pointer', transition: 'all 0.2s', background: 'var(--bg-surface)' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 },
  group: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const, alignItems: 'center' },
  textarea: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontSize: '0.8rem', fontFamily: 'var(--font-mono, monospace)', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  infoCard: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' },
  stat: { display: 'flex', flexDirection: 'column' as const, gap: 2 },
  statLabel: { fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 },
  statVal: { fontSize: '1rem', fontWeight: 700, color: 'var(--text)' },
};

type Mode = 'encode' | 'decode';
type OutputMode = 'datauri' | 'base64';

export default function ImgToBase64Client() {
  const [mode, setMode] = useState<Mode>('encode');
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState('');
  const [base64Only, setBase64Only] = useState('');
  const [outputMode, setOutputMode] = useState<OutputMode>('datauri');
  const [cssSnippet, setCssSnippet] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; origSize: string; b64Size: string; pct: string } | null>(null);
  const [copied, setCopied] = useState(false);
  // Decode
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeUrl, setDecodeUrl] = useState('');
  const [decodeError, setDecodeError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const uri = e.target?.result as string;
      setDataUri(uri);
      const b64 = uri.split(',')[1] ?? '';
      setBase64Only(b64);
      setCssSnippet(`background-image: url("${uri}");`);
      setPreviewUrl(uri);

      const origBytes = file.size;
      const b64Bytes = b64.length;
      const pct = (((b64Bytes - origBytes) / origBytes) * 100).toFixed(1);
      const fmt = (n: number) => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`;
      setFileInfo({ name: file.name, origSize: fmt(origBytes), b64Size: fmt(b64Bytes), pct: `+${pct}%` });
    };
    reader.readAsDataURL(file);
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDecode = () => {
    setDecodeError(''); setDecodeUrl('');
    try {
      let src = decodeInput.trim();
      if (!src.startsWith('data:')) src = `data:image/png;base64,${src}`;
      // Validate base64
      atob(src.split(',')[1] ?? '');
      setDecodeUrl(src);
    } catch {
      setDecodeError('Invalid base64 input.');
    }
  };

  const downloadDecoded = () => {
    if (!decodeUrl) return;
    const a = document.createElement('a');
    a.href = decodeUrl;
    a.download = 'decoded-image.png';
    a.click();
  };

  const outputVal = outputMode === 'datauri' ? dataUri : base64Only;

  return (
    <div style={S.root}>
      {/* Tabs */}
      <div style={S.tabs}>
        {(['encode', 'decode'] as const).map(t => (
          <button key={t} style={{ ...S.tab, ...(mode === t ? S.tabActive : {}) }} onClick={() => setMode(t)}>
            {t === 'encode' ? '🖼️ Image → Base64' : '🔄 Base64 → Image'}
          </button>
        ))}
      </div>

      {mode === 'encode' ? (
        <>
          {/* Dropzone */}
          <div
            style={{ ...S.dropzone, borderColor: dragging ? 'var(--accent)' : undefined }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
            onClick={() => fileRef.current?.click()}
          >
            <div style={{ fontSize: '2rem', marginBottom: 6 }}>🖼️</div>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Drop image or click to browse</p>
            <p style={{ color: 'var(--text-faint, rgba(255,255,255,0.18))', fontSize: '0.8rem', marginTop: 4 }}>PNG · JPEG · GIF · WebP · SVG</p>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
          </div>

          {dataUri && (
            <>
              {/* Preview + info */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl!} alt="Preview" style={{ maxWidth: 160, maxHeight: 120, borderRadius: 8, border: '1px solid var(--border)', objectFit: 'cover' }} />
                {fileInfo && (
                  <div style={S.infoCard}>
                    {[['File', fileInfo.name], ['Original', fileInfo.origSize], ['Base64', fileInfo.b64Size], ['Size increase', fileInfo.pct]].map(([k, v]) => (
                      <div key={k} style={S.stat}><span style={S.statLabel}>{k}</span><span style={S.statVal}>{v}</span></div>
                    ))}
                  </div>
                )}
              </div>

              {/* Output options */}
              <div style={S.row}>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Output:</span>
                {(['datauri', 'base64'] as const).map(m => (
                  <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.875rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <input type="radio" checked={outputMode === m} onChange={() => setOutputMode(m)} style={{ accentColor: 'var(--accent)' }} />
                    {m === 'datauri' ? 'Data URI' : 'Base64 only'}
                  </label>
                ))}
              </div>

              <div style={S.group}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={S.label}>{outputMode === 'datauri' ? 'Data URI' : 'Base64 String'}</div>
                  <button className="btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem' }} onClick={() => copy(outputVal)}>
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <textarea style={{ ...S.textarea, minHeight: 100 }} value={outputVal} readOnly />
              </div>

              <div style={S.group}>
                <div style={S.label}>CSS background-image</div>
                <textarea style={{ ...S.textarea, minHeight: 50 }} value={cssSnippet} readOnly />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div style={S.group}>
            <div style={S.label}>Paste base64 or data URI</div>
            <textarea style={{ ...S.textarea, minHeight: 100 }} placeholder="data:image/png;base64,... or just the base64 string" value={decodeInput} onChange={e => setDecodeInput(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={handleDecode} disabled={!decodeInput.trim()}>Preview Image</button>
            {decodeUrl && <button className="btn-ghost" onClick={downloadDecoded}>⬇ Download</button>}
          </div>
          {decodeError && <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{decodeError}</div>}
          {decodeUrl && (
            <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: 'var(--bg-surface)', padding: '1rem', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={decodeUrl} alt="Decoded" style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
