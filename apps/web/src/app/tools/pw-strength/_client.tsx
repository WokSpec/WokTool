'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import Switch from '@/components/ui/Switch';

const COMMON = new Set(['password','123456','password123','admin','letmein','welcome','monkey','1234567890','qwerty','abc123','111111','dragon','master','sunshine','princess','shadow','superman','michael','football','baseball','soccer','batman','trustno1','iloveyou','jennifer','12345678','1234567','12345','1234','123','000000','test','pass','login','qwertyuiop','password1','hello','charlie','donald','password2','123123','654321','666666','asdfgh','qazwsx','thomas','robert','hunter2','hunter','matrix']);

function calcCharsetSize(pw: string): number {
  let size = 0;
  if (/[a-z]/.test(pw)) size += 26;
  if (/[A-Z]/.test(pw)) size += 26;
  if (/[0-9]/.test(pw)) size += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) size += 32;
  return size || 1;
}

function crackTime(bits: number): string {
  const secs = Math.pow(2, bits) / 1e9;
  if (secs < 1) return 'Instant';
  if (secs < 60) return `${secs.toFixed(1)}s`;
  if (secs < 3600) return `${(secs / 60).toFixed(1)}m`;
  if (secs < 86400) return `${(secs / 3600).toFixed(1)}h`;
  if (secs < 31536000) return `${(secs / 86400).toFixed(1)}d`;
  if (secs < 3.154e9) return `${(secs / 31536000).toFixed(1)}y`;
  return `${(secs / 3.154e9).toFixed(0)}B years`;
}

function analyze(pw: string) {
  if (!pw) return null;
  const entropy = pw.length * Math.log2(calcCharsetSize(pw));
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /[0-9]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const isCommon = COMMON.has(pw.toLowerCase());
  const hasRepeat = /(.)\1{2,}/.test(pw);
  const hasSeq = /(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(pw);

  let score = 0;
  score += Math.min(40, (entropy / 80) * 40);
  if (hasUpper) score += 10;
  if (hasLower) score += 10;
  if (hasDigit) score += 10;
  if (hasSymbol) score += 15;
  if (pw.length >= 12) score += 10;
  if (pw.length >= 16) score += 5;
  if (isCommon) score = Math.min(score, 5);
  if (hasRepeat) score -= 10;
  if (hasSeq) score -= 5;
  score = Math.max(0, Math.min(100, score));

  return { score, entropy, crackTime: crackTime(entropy), length: pw.length, hasUpper, hasLower, hasDigit, hasSymbol, isCommon, hasRepeat, hasSeq };
}

const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?',
};

export default function PwStrengthClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [genLen, setGenLen] = useState(24);
  const [genOpts, setGenOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });

  const analysis = useMemo(() => analyze(password), [password]);

  const generate = () => {
    let pool = '';
    if (genOpts.lower) pool += CHARSETS.lower;
    if (genOpts.upper) pool += CHARSETS.upper;
    if (genOpts.digits) pool += CHARSETS.digits;
    if (genOpts.symbols) pool += CHARSETS.symbols;
    if (!pool) pool = CHARSETS.lower + CHARSETS.digits;
    const arr = new Uint8Array(genLen);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr).map(b => pool[b % pool.length]).join(''));
  };

  const getLevel = (s: number) => {
    if (s < 25) return { l: 'Very Weak', c: 'bg-danger' };
    if (s < 50) return { l: 'Weak', c: 'bg-orange-500' };
    if (s < 75) return { l: 'Fair', c: 'bg-warning' };
    if (s < 90) return { l: 'Strong', c: 'bg-success' };
    return { l: 'Bulletproof', c: 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]' };
  };

  const lvl = analysis ? getLevel(analysis.score) : { l: 'Empty', c: 'bg-white/10' };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Card title="Security Analysis" description="Check the cryptographic strength of your password. Results are calculated entirely in your browser.">
                <div className="space-y-6">
                    <div className="relative">
                        <Input 
                            type={showPw ? 'text' : 'password'}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter password to analyze..."
                            className="font-mono text-lg pr-12"
                            autoComplete="new-password"
                        />
                        <button 
                            onClick={() => setShowPw(!showPw)}
                            className="absolute right-3 top-9 text-white/20 hover:text-white transition-colors"
                        >
                            {showPw ? '🙈' : '👁️'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Strength Score</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${analysis ? 'text-white' : 'text-white/10'}`}>{lvl.l} — {analysis?.score.toFixed(0) || 0}/100</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-500 ${lvl.c}`} style={{ width: `${analysis?.score || 0}%` }} />
                        </div>
                    </div>

                    {analysis && (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="text-[9px] font-black text-white/20 uppercase mb-1">Entropy</div>
                                <div className="text-sm font-bold text-white">{analysis.entropy.toFixed(1)} bits</div>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="text-[9px] font-black text-white/20 uppercase mb-1">Crack Time</div>
                                <div className="text-sm font-bold text-accent">{analysis.crackTime}</div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Quick Generator">
                <div className="space-y-6">
                    <Slider label="Length" min={8} max={64} value={genLen} onChange={setGenLen} />
                    <div className="grid grid-cols-2 gap-4">
                        <Switch label="Lowercase" checked={genOpts.lower} onChange={v => setGenOpts(p => ({...p, lower: v}))} />
                        <Switch label="Uppercase" checked={genOpts.upper} onChange={v => setGenOpts(p => ({...p, upper: v}))} />
                        <Switch label="Digits" checked={genOpts.digits} onChange={v => setGenOpts(p => ({...p, digits: v}))} />
                        <Switch label="Symbols" checked={genOpts.symbols} onChange={v => setGenOpts(p => ({...p, symbols: v}))} />
                    </div>
                    <Button onClick={generate} className="w-full" size="lg">Generate & Analyze</Button>
                </div>
            </Card>
        </div>

        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Checklist</h3>
            <Card className="p-0 overflow-hidden border-white/10">
                <div className="divide-y divide-white/[0.03]">
                    {[
                        { l: 'Length (12+)', v: analysis?.length || 0, ok: (analysis?.length || 0) >= 12 },
                        { l: 'Uppercase', v: analysis?.hasUpper ? 'Yes' : 'No', ok: !!analysis?.hasUpper },
                        { l: 'Lowercase', v: analysis?.hasLower ? 'Yes' : 'No', ok: !!analysis?.hasLower },
                        { l: 'Numbers', v: analysis?.hasDigit ? 'Yes' : 'No', ok: !!analysis?.hasDigit },
                        { l: 'Symbols', v: analysis?.hasSymbol ? 'Yes' : 'No', ok: !!analysis?.hasSymbol },
                        { l: 'Not Common', v: analysis?.isCommon ? 'Common ⚠️' : 'Unique', ok: analysis ? !analysis.isCommon : false },
                        { l: 'No Repeats', v: analysis?.hasRepeat ? 'Found' : 'None', ok: analysis ? !analysis.hasRepeat : false },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 group hover:bg-white/[0.01] transition-colors">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{item.l}</span>
                            <div className="flex items-center gap-3">
                                <span className={`text-[10px] font-bold ${item.ok ? 'text-success' : 'text-white/20'}`}>{item.v || '—'}</span>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${item.ok ? 'bg-success/10 border-success/30 text-success' : 'bg-white/5 border-white/10 text-white/10'}`}>
                                    {item.ok ? '✓' : '•'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">
                    !
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    Crack times are based on an offline brute-force attack performing <strong>1 billion</strong> guesses per second. Modern hardware can often do much more.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
