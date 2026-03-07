'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

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

export default function HmacGenClient() {
  const [message, setMessage] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [algo, setAlgo] = useState<Algo>('SHA-256');
  const [result, setResult] = useState<{ hex: string; b64: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifyVal, setVerifyVal] = useState('');

  const generate = async () => {
    if (!message || !secretKey) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const r = await hmac(message, secretKey, algo);
      setResult(r);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const isMatch = result && verifyVal.trim() && (
    verifyVal.trim().toLowerCase() === result.hex.toLowerCase() || 
    verifyVal.trim() === result.b64
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Configuration */}
        <div className="space-y-6">
            <Card title="HMAC Configuration" description="Select your algorithm and provide the message and secret key.">
                <div className="space-y-6">
                    <Select 
                        label="Hash Algorithm"
                        value={algo}
                        onChange={e => setAlgo(e.target.value as Algo)}
                        options={ALGOS.map(a => ({ value: a, label: a }))}
                    />
                    
                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <Textarea 
                            label="Message"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Data to be authenticated..."
                            rows={3}
                        />
                        <div className="relative">
                            <Input 
                                label="Secret Key"
                                type={showKey ? 'text' : 'password'}
                                value={secretKey}
                                onChange={e => setSecretKey(e.target.value)}
                                placeholder="Key for the signature..."
                            />
                            <button 
                                onClick={() => setShowKey(!showKey)}
                                className="absolute right-3 top-9 text-white/20 hover:text-white transition-colors"
                            >
                                {showKey ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <Button 
                        onClick={generate} 
                        className="w-full" 
                        size="lg" 
                        loading={loading}
                        disabled={!message || !secretKey}
                    >
                        Generate Signature
                    </Button>

                    {error && (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                            {error}
                        </div>
                    )}
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">
                    !
                </div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    HMAC generation is performed 100% locally in your browser using the Web Crypto API. Your secret key is never sent to any server.
                </p>
            </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Authentication Tag</h3>
            {result ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2 px-1">Hexadecimal</h4>
                            <CodeBlock code={result.hex} maxHeight="100px" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-2 px-1">Base64</h4>
                            <CodeBlock code={result.b64} maxHeight="100px" />
                        </div>
                    </div>

                    <Card title="Verify Signature">
                        <div className="space-y-4">
                            <Input 
                                placeholder="Paste signature to compare..."
                                value={verifyVal}
                                onChange={e => setVerifyVal(e.target.value)}
                                className="font-mono text-xs"
                            />
                            {verifyVal.trim() && (
                                <div className={`p-4 rounded-xl border flex items-center justify-between animate-in zoom-in-95 ${isMatch ? 'bg-success/5 border-success/20 text-success' : 'bg-danger/5 border-danger/20 text-danger'}`}>
                                    <span className="text-xs font-bold uppercase">Result</span>
                                    <span className="text-xs font-black uppercase tracking-widest">{isMatch ? '✓ Authentic' : '✕ Mismatch'}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🔐</div>
                    <p className="text-sm">Signature will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
