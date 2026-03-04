'use client';

import { useState, useCallback } from 'react';

// ─── Common passwords list (top 50) ─────────────────────────────────────────
const COMMON = new Set([
  'password','123456','password123','admin','letmein','welcome','monkey','1234567890',
  'qwerty','abc123','111111','dragon','master','sunshine','princess','shadow','superman',
  'michael','football','baseball','soccer','batman','trustno1','iloveyou','jennifer',
  '12345678','1234567','12345','1234','123','000000','test','pass','login','qwertyuiop',
  'password1','hello','charlie','donald','password2','123123','654321','666666','asdfgh',
  'qazwsx','thomas','robert','hunter2','hunter','matrix',
]);

// ─── Entropy / scoring ───────────────────────────────────────────────────────
function calcCharsetSize(pw: string): number {
  let size = 0;
  if (/[a-z]/.test(pw)) size += 26;
  if (/[A-Z]/.test(pw)) size += 26;
  if (/[0-9]/.test(pw)) size += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) size += 32;
  return size || 1;
}

function entropy(pw: string): number {
  return pw.length * Math.log2(calcCharsetSize(pw));
}

function crackTime(bits: number): string {
  // Assuming 1 billion guesses/sec
  const secs = Math.pow(2, bits) / 1e9;
  if (secs < 1) return 'Instant';
  if (secs < 60) return `${secs.toFixed(1)} seconds`;
  if (secs < 3600) return `${(secs / 60).toFixed(1)} minutes`;
  if (secs < 86400) return `${(secs / 3600).toFixed(1)} hours`;
  if (secs < 31536000) return `${(secs / 86400).toFixed(1)} days`;
  if (secs < 3.154e9) return `${(secs / 31536000).toFixed(1)} years`;
  return `${(secs / 3.154e9).toFixed(0)} billion years`;
}

interface Analysis {
  score: number; // 0-100
  entropy: number;
  crackTime: string;
  length: number;
  hasUpper: boolean;
  hasLower: boolean;
  hasDigit: boolean;
  hasSymbol: boolean;
  isCommon: boolean;
  hasRepeat: boolean;
  hasSequential: boolean;
  suggestions: string[];
}

function analyze(pw: string): Analysis {
  const e = entropy(pw);
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const isCommon = COMMON.has(pw.toLowerCase());
  const hasRepeat = /(.)\1{2,}/.test(pw);
  const hasSequential = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pw);

  // Score: 0-100
  let score = 0;
  score += Math.min(40, (e / 80) * 40); // up to 40 from entropy
  if (hasUpper) score += 10;
  if (hasLower) score += 10;
  if (hasDigit) score += 10;
  if (hasSymbol) score += 15;
  if (pw.length >= 12) score += 10;
  if (pw.length >= 16) score += 5;
  if (isCommon) score = Math.min(score, 5);
  if (hasRepeat) score -= 10;
  if (hasSequential) score -= 5;
  score = Math.max(0, Math.min(100, score));

  const suggestions: string[] = [];
  if (pw.length < 12) suggestions.push('Use at least 12 characters');
  if (!hasUpper) suggestions.push('Add uppercase letters');
  if (!hasLower) suggestions.push('Add lowercase letters');
  if (!hasDigit) suggestions.push('Add numbers');
  if (!hasSymbol) suggestions.push('Add special characters (!, @, #, …)');
  if (isCommon) suggestions.push('This is a very common password — pick something unique');
  if (hasRepeat) suggestions.push('Avoid repeated characters (aaa, 111)');
  if (hasSequential) suggestions.push('Avoid sequential patterns (abc, 123)');

  return { score, entropy: e, crackTime: crackTime(e), length: pw.length, hasUpper, hasLower, hasDigit, hasSymbol, isCommon, hasRepeat, hasSequential, suggestions };
}

function scoreColor(s: number): string {
  if (s < 25) return '#ef4444';
  if (s < 50) return '#f97316';
  if (s < 75) return '#eab308';
  return '#22c55e';
}
function scoreLabel(s: number): string {
  if (s < 25) return 'Very Weak';
  if (s < 50) return 'Weak';
  if (s < 75) return 'Fair';
  if (s < 90) return 'Strong';
  return 'Very Strong';
}

// ─── Password generator ──────────────────────────────────────────────────────
const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

function generatePassword(length: number, useLower: boolean, useUpper: boolean, useDigits: boolean, useSymbols: boolean): string {
  let pool = '';
  if (useLower) pool += CHARSETS.lower;
  if (useUpper) pool += CHARSETS.upper;
  if (useDigits) pool += CHARSETS.digits;
  if (useSymbols) pool += CHARSETS.symbols;
  if (!pool) pool = CHARSETS.lower + CHARSETS.digits;

  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => pool[b % pool.length]).join('');
}

// ─── Component ───────────────────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: 680 },
  label: { fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  group: { display: 'flex', flexDirection: 'column' as const, gap: 8 },
  passWrap: { position: 'relative' as const },
  input: { width: '100%', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.7rem 3rem 0.7rem 0.875rem', color: 'var(--text)', fontSize: '1rem', fontFamily: 'var(--font-mono, monospace)', boxSizing: 'border-box' as const },
  passToggle: { position: 'absolute' as const, right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem' },
  card: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '1rem' },
  checkRow: { display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' },
  genGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' },
};
const checkStyle = (ok: boolean): React.CSSProperties => ({ color: ok ? '#22c55e' : '#ef4444', fontSize: '0.9rem' });

export default function PwStrengthClient() {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  // Generator state
  const [genLen, setGenLen] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generated, setGenerated] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback((v: string) => {
    setPassword(v);
    setAnalysis(v ? analyze(v) : null);
  }, []);

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const gen = () => {
    const pw = generatePassword(genLen, useLower, useUpper, useDigits, useSymbols);
    setGenerated(pw);
  };

  const useGenerated = () => {
    handleChange(generated);
    setGenerated('');
  };

  const color = analysis ? scoreColor(analysis.score) : 'var(--border)';

  return (
    <div style={S.root}>
      {/* Password input */}
      <div style={S.group}>
        <div style={S.label}>Password</div>
        <div style={S.passWrap}>
          <input
            type={showPw ? 'text' : 'password'}
            style={S.input}
            placeholder="Type or paste a password…"
            value={password}
            onChange={e => handleChange(e.target.value)}
            autoComplete="new-password"
          />
          <button style={S.passToggle} onClick={() => setShowPw(v => !v)}>{showPw ? '🙈' : '👁️'}</button>
        </div>
        {/* Strength bar */}
        <div style={{ height: 6, background: 'var(--bg-elevated, #161616)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${analysis?.score ?? 0}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.3s, background 0.3s' }} />
        </div>
        {analysis && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color, fontWeight: 700 }}>{scoreLabel(analysis.score)}</span>
            <span style={{ color: 'var(--text-muted)' }}>{analysis.score}/100</span>
          </div>
        )}
      </div>

      {analysis && (
        <>
          {/* Analysis breakdown */}
          <div style={S.card}>
            <div style={{ ...S.label, marginBottom: 12 }}>Analysis</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' }}>
              {[
                ['Length', `${analysis.length} characters`, analysis.length >= 12],
                ['Uppercase', analysis.hasUpper ? 'Present' : 'Missing', analysis.hasUpper],
                ['Lowercase', analysis.hasLower ? 'Present' : 'Missing', analysis.hasLower],
                ['Numbers', analysis.hasDigit ? 'Present' : 'Missing', analysis.hasDigit],
                ['Symbols', analysis.hasSymbol ? 'Present' : 'Missing', analysis.hasSymbol],
                ['Common password', analysis.isCommon ? 'Yes ⚠️' : 'No', !analysis.isCommon],
                ['Repeated chars', analysis.hasRepeat ? 'Detected' : 'None', !analysis.hasRepeat],
                ['Sequential', analysis.hasSequential ? 'Detected' : 'None', !analysis.hasSequential],
              ].map(([k, v, ok]) => (
                <div key={String(k)} style={S.checkRow}>
                  <span style={checkStyle(ok as boolean)}>{ok ? '✓' : '✗'}</span>
                  <span style={{ color: 'var(--text-muted)', minWidth: 110 }}>{k}:</span>
                  <span style={{ color: 'var(--text)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem 1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Entropy: <span style={{ color: 'var(--text)' }}>{analysis.entropy.toFixed(1)} bits</span></div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crack time: <span style={{ color }}>{analysis.crackTime}</span></div>
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div style={{ ...S.card, borderColor: 'rgba(234,179,8,0.3)', background: 'rgba(234,179,8,0.04)' }}>
              <div style={{ ...S.label, marginBottom: 10, color: '#ca8a04' }}>Suggestions</div>
              {analysis.suggestions.map(s => (
                <div key={s} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 4 }}>• {s}</div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Generator */}
      <div style={{ ...S.card, borderTop: '1px solid var(--border)' }}>
        <div style={{ ...S.label, marginBottom: 12 }}>Password Generator</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Length: {genLen}</span>
          <input type="range" min={8} max={64} value={genLen} onChange={e => setGenLen(Number(e.target.value))} style={{ flex: 1, minWidth: 120, accentColor: 'var(--accent)' }} />
        </div>
        <div style={S.genGrid}>
          {([['Lowercase a-z', useLower, setUseLower], ['Uppercase A-Z', useUpper, setUseUpper], ['Numbers 0-9', useDigits, setUseDigits], ['Symbols !@#…', useSymbols, setUseSymbols]] as [string, boolean, (v: boolean) => void][]).map(([label, val, set]) => (
            <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              {label}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 12, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={gen}>Generate</button>
          {generated && (
            <>
              <code style={{ flex: 1, background: 'var(--bg-elevated, #161616)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.6rem 0.875rem', fontFamily: 'var(--font-mono, monospace)', fontSize: '0.875rem', color: 'var(--text)', wordBreak: 'break-all' }}>{generated}</code>
              <button className="btn-ghost" onClick={() => copy(generated)}>{copied ? '✓' : 'Copy'}</button>
              <button className="btn-secondary" onClick={useGenerated}>Analyze →</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
