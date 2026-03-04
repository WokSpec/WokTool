'use client';

import { useState } from 'react';

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 760 },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 },
  group: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  input: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', boxSizing: 'border-box' as const },
  textarea: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'var(--font-mono, monospace)', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  select: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer' },
  resultBox: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
  resultRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' as const },
  mono: { flex: 1, fontFamily: 'var(--font-mono, monospace)', wordBreak: 'break-all' as const, fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated, #161616)', padding: '0.5rem 0.6rem', borderRadius: 6, minWidth: 0 },
  algoRow: { display: 'flex', gap: 4, flexWrap: 'wrap' as const },
  algoBtn: { padding: '0.35rem 0.7rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)', transition: 'all 0.15s' },
  algoBtnActive: { background: 'var(--accent)', color: '#fff', borderColor: 'transparent' },
  verifyInput: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'var(--font-mono, monospace)', boxSizing: 'border-box' as const },
  matchBadge: { padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 700 },
  passWrap: { position: 'relative' as const },
  passToggle: { position: 'absolute' as const, right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' },
};

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type Algo = typeof ALGOS[number];

async function hmac(message: string, key: string, algo: Algo): Promise<{ hex: string; b64: string }> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key),
    { name: 'HMAC', hash: algo },
    false, ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message));
  const bytes = new Uint8Array(sig);
  const hexStr = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const b64Str = btoa(String.fromCharCode(...bytes));
  return { hex: hexStr, b64: b64Str };
}

// Constant-time compare (best effort in JS)
function safeEqual(a: string, b: string): boolean {
  const na = a.toLowerCase().trim();
  const nb = b.toLowerCase().trim();
  if (na.length !== nb.length) return false;
  let diff = 0;
  for (let i = 0; i < na.length; i++) diff |= na.charCodeAt(i) ^ nb.charCodeAt(i);
  return diff === 0;
}

export default function HmacGenClient() {
  const [message, setMessage] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [algo, setAlgo] = useState<Algo>('SHA-256');
  const [result, setResult] = useState<{ hex: string; b64: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<'hex' | 'b64' | null>(null);
  const [compareVal, setCompareVal] = useState('');
  const [matchStatus, setMatchStatus] = useState<'match' | 'mismatch' | null>(null);

  const generate = async () => {
    if (!message || !secretKey) return;
    setLoading(true); setError(''); setResult(null); setMatchStatus(null);
    try {
      const r = await hmac(message, secretKey, algo);
      setResult(r);
      if (compareVal) setMatchStatus(safeEqual(compareVal, r.hex) || safeEqual(compareVal, r.b64) ? 'match' : 'mismatch');
    } catch (e: unknown) {
      setError('HMAC failed: ' + (e instanceof Error ? e.message : String(e)));
    } finally { setLoading(false); }
  };

  const copy = async (text: string, which: 'hex' | 'b64') => {
    await navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1500);
  };

  const onCompareChange = (v: string) => {
    setCompareVal(v);
    if (result && v) setMatchStatus(safeEqual(v, result.hex) || safeEqual(v, result.b64) ? 'match' : 'mismatch');
    else setMatchStatus(null);
  };

  return (
    <div style={S.root}>
      {/* Algorithm selector */}
      <div style={S.group}>
        <div style={S.label}>Algorithm</div>
        <div style={S.algoRow}>
          {ALGOS.map(a => (
            <button key={a} style={{ ...S.algoBtn, ...(algo === a ? S.algoBtnActive : {}) }} onClick={() => setAlgo(a)}>{a}</button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div style={S.group}>
        <div style={S.label}>Message</div>
        <textarea style={{ ...S.textarea, minHeight: 90 }} placeholder="Enter message…" value={message} onChange={e => setMessage(e.target.value)} />
      </div>

      {/* Secret Key */}
      <div style={S.group}>
        <div style={S.label}>Secret Key</div>
        <div style={S.passWrap}>
          <input type={showKey ? 'text' : 'password'} style={{ ...S.input, paddingRight: 56 }} placeholder="Enter secret key…" value={secretKey} onChange={e => setSecretKey(e.target.value)} />
          <button style={S.passToggle} onClick={() => setShowKey(v => !v)}>{showKey ? '🙈' : '👁️'}</button>
        </div>
      </div>

      <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={generate} disabled={loading || !message || !secretKey}>
        {loading ? '⏳ Generating…' : '→ Generate HMAC'}
      </button>

      {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</div>}

      {result && (
        <div style={S.resultBox}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>HMAC-{algo}</div>

          {/* Hex */}
          <div>
            <div style={{ ...S.label, marginBottom: 4 }}>Hex</div>
            <div style={S.resultRow}>
              <code style={S.mono}>{result.hex}</code>
              <button className="btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', flexShrink: 0 }} onClick={() => copy(result.hex, 'hex')}>
                {copied === 'hex' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Base64 */}
          <div>
            <div style={{ ...S.label, marginBottom: 4 }}>Base64</div>
            <div style={S.resultRow}>
              <code style={S.mono}>{result.b64}</code>
              <button className="btn-ghost" style={{ padding: '0.3rem 0.65rem', fontSize: '0.78rem', flexShrink: 0 }} onClick={() => copy(result.b64, 'b64')}>
                {copied === 'b64' ? '✓' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Verify */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            <div style={{ ...S.label, marginBottom: 6 }}>Verify — paste expected HMAC (hex or base64)</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input style={{ ...S.verifyInput, flex: 1 }} placeholder="Paste expected HMAC to compare…" value={compareVal} onChange={e => onCompareChange(e.target.value)} />
              {matchStatus && (
                <span style={{ ...S.matchBadge, background: matchStatus === 'match' ? 'var(--success-bg, rgba(34,197,94,0.1))' : 'var(--danger-bg)', color: matchStatus === 'match' ? 'var(--success, #34d399)' : 'var(--danger, #f87171)', border: `1px solid ${matchStatus === 'match' ? 'rgba(34,197,94,0.3)' : 'rgba(248,113,113,0.3)'}` }}>
                  {matchStatus === 'match' ? '✓ Match' : '✗ Mismatch'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
