'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import CodeBlock from '@/components/ui/CodeBlock';

async function deriveKey(passphrase: string, salt: Uint8Array) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(passphrase),
    'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, ['encrypt', 'decrypt']
  );
}

export default function AesToolClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [tab, setTab] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [plaintext, setPlaintext] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEncrypt = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const key = await deriveKey(passphrase, salt);
      const encoded = new TextEncoder().encode(plaintext);
      const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
      
      const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
      combined.set(salt, 0);
      combined.set(iv, salt.length);
      combined.set(new Uint8Array(encrypted), salt.length + iv.length);
      
      setResult(btoa(String.fromCharCode(...combined)));
    } catch (e: any) {
      setError('Encryption failed. Please check your inputs.');
    } finally { setLoading(false); }
  };

  const handleDecrypt = async () => {
    setLoading(true); setError(''); setResult(null);
    try {
      const combined = new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)));
      const salt = combined.slice(0, 16);
      const iv = combined.slice(16, 28);
      const data = combined.slice(28);
      const key = await deriveKey(passphrase, salt);
      const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
      setResult(new TextDecoder().decode(decrypted));
    } catch (e: any) {
      setError('Decryption failed. Check your passphrase and ciphertext.');
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={tab}
            onChange={id => { setTab(id as any); setResult(null); setError(''); }}
            tabs={[{id:'encrypt', label:'Encrypt', icon:'🔒'}, {id:'decrypt', label:'Decrypt', icon:'🔓'}]}
            className="w-full max-w-xs"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Card title={tab === 'encrypt' ? 'Source Content' : 'Encrypted Data'}>
                <div className="space-y-4">
                    <Textarea 
                        value={tab === 'encrypt' ? plaintext : ciphertext}
                        onChange={e => tab === 'encrypt' ? setPlaintext(e.target.value) : setCiphertext(e.target.value)}
                        placeholder={tab === 'encrypt' ? 'Enter sensitive text...' : 'Paste base64 ciphertext...'}
                        className="min-h-[150px] font-mono text-sm"
                    />
                    <div className="relative">
                        <Input 
                            label="Secret Passphrase"
                            type={showPass ? 'text' : 'password'}
                            value={passphrase}
                            onChange={e => setPassphrase(e.target.value)}
                            placeholder="Min 8 characters recommended..."
                        />
                        <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-9 text-white/20 hover:text-white transition-colors">
                            {showPass ? '🙈' : '👁️'}
                        </button>
                    </div>
                    <Button 
                        onClick={tab === 'encrypt' ? handleEncrypt : handleDecrypt} 
                        className="w-full" 
                        size="lg" 
                        loading={loading}
                        disabled={!passphrase || (tab === 'encrypt' ? !plaintext : !ciphertext)}
                    >
                        {tab === 'encrypt' ? 'Encrypt Text' : 'Decrypt Data'}
                    </Button>
                </div>
            </Card>

            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">!</div>
                <p className="text-xs text-white/40 leading-relaxed italic">
                    Uses AES-GCM 256-bit encryption with PBKDF2 key derivation (100k iterations). Everything happens in your browser.
                </p>
            </div>
        </div>

        <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 px-1">Result</h3>
            {result ? (
                <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
                    <CodeBlock code={result} language="text" maxHeight="400px" />
                    <Button variant="primary" className="w-full" size="lg" onClick={() => navigator.clipboard.writeText(result)}>
                        Copy Result
                    </Button>
                </div>
            ) : (
                <div className="h-[400px] rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center p-12 opacity-20">
                    {error ? (
                        <p className="text-sm text-danger font-mono">{error}</p>
                    ) : (
                        <>
                            <div className="w-16 h-16 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 text-2xl">🔐</div>
                            <p className="text-sm">Processed output will appear here</p>
                        </>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
