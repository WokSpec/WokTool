'use client';

import { useState } from 'react';

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 760 },
  tabs: { display: 'flex', gap: 4, background: 'var(--bg-surface)', padding: 4, borderRadius: 10, width: 'fit-content' },
  tab: { padding: '0.45rem 1.1rem', borderRadius: 7, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: 'none', background: 'transparent', color: 'var(--text-muted)', transition: 'all 0.15s' },
  tabActive: { background: 'var(--accent)', color: '#fff' },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 },
  row: { display: 'flex', gap: '0.75rem', flexWrap: 'wrap' as const },
  input: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', boxSizing: 'border-box' as const },
  textarea: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.75rem', color: 'var(--text)', fontSize: '0.875rem', fontFamily: 'var(--font-mono, monospace)', resize: 'vertical' as const, boxSizing: 'border-box' as const },
  select: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer', flex: 1 },
  group: { display: 'flex', flexDirection: 'column' as const, gap: 6 },
  passWrap: { position: 'relative' as const },
  passToggle: { position: 'absolute' as const, right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' },
  resultBox: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem', display: 'flex', flexDirection: 'column' as const, gap: '0.75rem' },
  mono: { fontFamily: 'var(--font-mono, monospace)', wordBreak: 'break-all' as const, fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated, #161616)', padding: '0.6rem', borderRadius: 6 },
  detail: { display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 0.75rem', fontSize: '0.8rem' },
  detailKey: { color: 'var(--text-muted)', fontWeight: 600 },
  detailVal: { fontFamily: 'var(--font-mono, monospace)', color: 'var(--text-secondary)', wordBreak: 'break-all' as const },
  error: { color: 'var(--danger, #f87171)', background: 'var(--danger-bg, rgba(248,113,113,0.08))', border: '1px solid var(--danger-border, rgba(248,113,113,0.2))', borderRadius: 8, padding: '0.6rem 0.875rem', fontSize: '0.875rem' },
};

// ─── Crypto helpers ──────────────────────────────────────────────────────────

function toBase64(buf: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}
function bufConcat(...bufs: Uint8Array[]): Uint8Array {
  const total = bufs.reduce((n, b) => n + b.length, 0);
  const out = new Uint8Array(total);
  let off = 0;
  for (const b of bufs) { out.set(b, off); off += b.length; }
  return out;
}
function hex(buf: Uint8Array): string {
  return Array.from(buf).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function deriveKey(pass: string, salt: Uint8Array, keyBits: 128 | 192 | 256, usage: KeyUsage[]): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-' + (usage.includes('encrypt') || usage.includes('decrypt') ? (true ? 'CBC' : 'GCM') : 'CBC'), length: keyBits },
    false,
    usage,
  );
}

async function encryptData(plaintext: string, pass: string, keyBits: 128 | 192 | 256, mode: 'CBC' | 'GCM'): Promise<{ cipherB64: string; saltHex: string; ivHex: string }> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const ivLen = mode === 'CBC' ? 16 : 12;
  const iv = crypto.getRandomValues(new Uint8Array(ivLen));

  const baseKey = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-' + mode, length: keyBits },
    false,
    ['encrypt'],
  );

  const algo = mode === 'CBC' ? { name: 'AES-CBC', iv } : { name: 'AES-GCM', iv };
  const cipherBuf = await crypto.subtle.encrypt(algo, key, enc.encode(plaintext));

  // Pack: [1 byte keyBits/64][1 byte ivLen][16 bytes salt][iv][ciphertext]
  const payload = bufConcat(
    new Uint8Array([keyBits / 64, ivLen]),
    salt,
    iv,
    new Uint8Array(cipherBuf),
  );
  return { cipherB64: toBase64(payload.buffer), saltHex: hex(salt), ivHex: hex(iv) };
}

async function decryptData(cipherB64: string, pass: string): Promise<{ plaintext: string; saltHex: string; ivHex: string; keyBits: number; mode: string }> {
  const enc = new TextEncoder();
  const payload = fromBase64(cipherB64.trim());
  const keyBits = (payload[0] * 64) as 128 | 192 | 256;
  const ivLen = payload[1];
  const salt = payload.slice(2, 18);
  const iv = payload.slice(18, 18 + ivLen);
  const cipherBytes = payload.slice(18 + ivLen);
  const mode = ivLen === 12 ? 'GCM' : 'CBC';

  const baseKey = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-' + mode, length: keyBits },
    false,
    ['decrypt'],
  );

  const algo = mode === 'CBC' ? { name: 'AES-CBC', iv } : { name: 'AES-GCM', iv };
  const plainBuf = await crypto.subtle.decrypt(algo, key, cipherBytes);
  return {
    plaintext: new TextDecoder().decode(plainBuf),
    saltHex: hex(salt),
    ivHex: hex(iv),
    keyBits,
    mode,
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AesToolClient() {
  const [tab, setTab] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [keySize, setKeySize] = useState<128 | 192 | 256>(256);
  const [mode, setMode] = useState<'CBC' | 'GCM'>('GCM');
  const [result, setResult] = useState<{ value: string; saltHex: string; ivHex: string; keyBits?: number; mode?: string } | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleEncrypt = async () => {
    if (!plaintext || !passphrase) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { cipherB64, saltHex, ivHex } = await encryptData(plaintext, passphrase, keySize, mode);
      setResult({ value: cipherB64, saltHex, ivHex });
    } catch (e: unknown) {
      setError('Encryption failed: ' + (e instanceof Error ? e.message : String(e)));
    } finally { setLoading(false); }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !passphrase) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { plaintext: pt, saltHex, ivHex, keyBits, mode: m } = await decryptData(ciphertext, passphrase);
      setResult({ value: pt, saltHex, ivHex, keyBits, mode: m });
    } catch (e: unknown) {
      setError('Decryption failed — wrong passphrase or corrupted data.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.root}>
      {/* Tabs */}
      <div style={S.tabs}>
        {(['encrypt', 'decrypt'] as const).map(t => (
          <button key={t} style={{ ...S.tab, ...(tab === t ? S.tabActive : {}) }} onClick={() => { setTab(t); setResult(null); setError(''); }}>
            {t === 'encrypt' ? '🔒 Encrypt' : '🔓 Decrypt'}
          </button>
        ))}
      </div>

      {tab === 'encrypt' ? (
        <>
          {/* Input */}
          <div style={S.group}>
            <div style={S.label}>Plaintext</div>
            <textarea style={{ ...S.textarea, minHeight: 100 }} placeholder="Enter text to encrypt…" value={plaintext} onChange={e => setPlaintext(e.target.value)} />
          </div>

          {/* Options row */}
          <div style={S.row}>
            <div style={{ ...S.group, flex: 1, minWidth: 140 }}>
              <div style={S.label}>Key Size</div>
              <select style={S.select} value={keySize} onChange={e => setKeySize(Number(e.target.value) as 128 | 192 | 256)}>
                <option value={128}>AES-128</option>
                <option value={192}>AES-192</option>
                <option value={256}>AES-256</option>
              </select>
            </div>
            <div style={{ ...S.group, flex: 1, minWidth: 120 }}>
              <div style={S.label}>Mode</div>
              <select style={S.select} value={mode} onChange={e => setMode(e.target.value as 'CBC' | 'GCM')}>
                <option value="GCM">GCM (Authenticated)</option>
                <option value="CBC">CBC</option>
              </select>
            </div>
          </div>
        </>
      ) : (
        <div style={S.group}>
          <div style={S.label}>Ciphertext (base64)</div>
          <textarea style={{ ...S.textarea, minHeight: 100 }} placeholder="Paste base64 ciphertext…" value={ciphertext} onChange={e => setCiphertext(e.target.value)} />
        </div>
      )}

      {/* Passphrase */}
      <div style={S.group}>
        <div style={S.label}>Passphrase</div>
        <div style={S.passWrap}>
          <input type={showPass ? 'text' : 'password'} style={{ ...S.input, paddingRight: 56 }} placeholder="Enter passphrase…" value={passphrase} onChange={e => setPassphrase(e.target.value)} />
          <button style={S.passToggle} onClick={() => setShowPass(v => !v)}>{showPass ? '🙈' : '👁️'}</button>
        </div>
      </div>

      <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={tab === 'encrypt' ? handleEncrypt : handleDecrypt} disabled={loading || (tab === 'encrypt' ? !plaintext || !passphrase : !ciphertext || !passphrase)}>
        {loading ? '⏳ Processing…' : tab === 'encrypt' ? '🔒 Encrypt' : '🔓 Decrypt'}
      </button>

      {error && <div style={S.error}>{error}</div>}

      {result && (
        <div style={S.resultBox}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
              {tab === 'encrypt' ? 'Encrypted Output' : 'Decrypted Text'}
            </span>
            <button className="btn-ghost" style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }} onClick={() => copy(result.value)}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div style={S.mono}>{result.value}</div>
          <details style={{ fontSize: '0.8rem' }}>
            <summary style={{ cursor: 'pointer', color: 'var(--text-muted)', userSelect: 'none' }}>Details</summary>
            <div style={{ ...S.detail, marginTop: '0.5rem' }}>
              <span style={S.detailKey}>Salt</span><span style={S.detailVal}>{result.saltHex}</span>
              <span style={S.detailKey}>IV</span><span style={S.detailVal}>{result.ivHex}</span>
              {result.keyBits && <><span style={S.detailKey}>Key Size</span><span style={S.detailVal}>AES-{result.keyBits}</span></>}
              {result.mode && <><span style={S.detailKey}>Mode</span><span style={S.detailVal}>{result.mode}</span></>}
              <span style={S.detailKey}>KDF</span><span style={S.detailVal}>PBKDF2 · SHA-256 · 100,000 iterations</span>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
