'use client';

import { useState, useMemo } from 'react';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import CodeBlock from '@/components/ui/CodeBlock';
import Button from '@/components/ui/Button';

function base64urlDecode(str: string): string {
  try {
    const padded = str.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const b64 = padded + '='.repeat(padLen);
    return decodeURIComponent(
      atob(b64)
        .split('')
        .map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
  } catch {
    return '';
  }
}

function decodeJwt(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, sig] = parts;
  const headerStr  = base64urlDecode(headerB64);
  const payloadStr = base64urlDecode(payloadB64);
  if (!headerStr || !payloadStr) return null;
  
  let header: any = null;
  let payload: any = null;
  try { header  = JSON.parse(headerStr); } catch {}
  try { payload = JSON.parse(payloadStr); } catch {}
  
  return { header, payload, signature: sig, headerStr, payloadStr };
}

export default function JwtDebuggerTool() {
  const [token, setToken] = useState('');
  const decoded = useMemo(() => (token.trim() ? decodeJwt(token) : null), [token]);

  const expInfo = useMemo(() => {
    if (!decoded?.payload?.exp) return null;
    const exp = decoded.payload.exp;
    const date = new Date(exp * 1000);
    const expired = date < new Date();
    return { date, expired };
  }, [decoded]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Encoded Token</label>
        <Textarea 
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Paste your JWT here (header.payload.signature)"
            className="min-h-[120px] font-mono text-sm leading-relaxed"
            spellCheck={false}
        />
      </div>

      {token.trim() && !decoded && (
        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
            Invalid JWT format. Expected 3 base64url-encoded parts separated by dots.
        </div>
      )}

      {decoded && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Decoded Sections */}
            <div className="space-y-6">
                <Card className="p-0 overflow-hidden border-white/10">
                    <div className="px-4 py-2 bg-blue-500/10 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-tighter">Header: Algorithm & Token Type</span>
                        <span className="text-[10px] font-mono text-white/20">JSON</span>
                    </div>
                    <div className="p-4 bg-[#0d0d0d]">
                        <CodeBlock code={JSON.stringify(decoded.header, null, 2)} language="json" maxHeight="200px" />
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden border-white/10">
                    <div className="px-4 py-2 bg-success/10 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-success tracking-tighter">Payload: Data & Claims</span>
                        {expInfo && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                expInfo.expired ? 'bg-danger/20 text-danger' : 'bg-success/20 text-success'
                            }`}>
                                {expInfo.expired ? 'Expired' : 'Valid'}
                            </span>
                        )}
                    </div>
                    <div className="p-4 bg-[#0d0d0d]">
                        <CodeBlock code={JSON.stringify(decoded.payload, null, 2)} language="json" maxHeight="400px" />
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden border-white/10">
                    <div className="px-4 py-2 bg-danger/10 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase text-danger tracking-tighter">Signature</span>
                    </div>
                    <div className="p-4 bg-[#0d0d0d]">
                        <code className="text-xs text-danger/80 break-all font-mono">
                            {decoded.signature}
                        </code>
                        <p className="mt-3 text-[10px] text-white/20 italic">Note: Signature verification requires the server-side secret key.</p>
                    </div>
                </Card>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
                <Card title="Token Insights">
                    <div className="space-y-4">
                        {decoded.payload?.sub && (
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                <span className="text-xs text-white/40 font-medium">Subject</span>
                                <span className="text-xs text-white font-bold">{decoded.payload.sub}</span>
                            </div>
                        )}
                        {decoded.payload?.iss && (
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                <span className="text-xs text-white/40 font-medium">Issuer</span>
                                <span className="text-xs text-white font-bold">{decoded.payload.iss}</span>
                            </div>
                        )}
                        {expInfo && (
                            <div className="flex justify-between items-center pb-3 border-b border-white/5">
                                <span className="text-xs text-white/40 font-medium">Expiration</span>
                                <span className={`text-xs font-bold ${expInfo.expired ? 'text-danger' : 'text-white'}`}>
                                    {expInfo.date.toLocaleString()}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-white/40 font-medium">Algorithm</span>
                            <span className="text-xs text-accent font-bold uppercase">{decoded.header?.alg || 'None'}</span>
                        </div>
                    </div>
                </Card>

                <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10">
                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        What is a JWT?
                    </h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                        JSON Web Tokens are an open, industry standard method for representing claims securely between two parties. JWT.io-style debuggers like this one allow you to inspect the contents of a token without needing a secret key.
                    </p>
                </div>
            </div>
        </div>
      )}

      {!token.trim() && (
        <div className="h-[300px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-8 opacity-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🔐</div>
            <p className="text-sm max-w-xs">Paste a JWT token above to decode and inspect its header, payload, and claims.</p>
        </div>
      )}
    </div>
  );
}
