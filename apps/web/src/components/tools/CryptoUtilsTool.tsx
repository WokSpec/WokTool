'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';

type Tab = 'qr' | 'wallet' | 'numconv';

/* ── Wallet Validation ── */
const BASE58_CHARS = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function isBase58(s: string): boolean {
  return s.split('').every(c => BASE58_CHARS.includes(c));
}

type CoinResult = { coin: string; icon: string; valid: boolean; reason: string } | null;

function detectWallet(addr: string): CoinResult {
  const a = addr.trim();
  if (!a) return null;

  if (a.startsWith('0x') && a.length === 42 && /^0x[0-9a-fA-F]{40}$/.test(a)) {
    return { coin: 'Ethereum (ETH)', icon: '🌐', valid: true, reason: 'Valid EVM address' };
  }
  if (a.startsWith('0x')) {
    return { coin: 'Ethereum (ETH)', icon: '🌐', valid: false, reason: `Invalid length (${a.length}/42) or format` };
  }

  if (a.startsWith('bc1')) {
    if (a.length >= 25 && a.length <= 62) return { coin: 'Bitcoin (BTC)', icon: '₿', valid: true, reason: 'Valid bech32 address' };
    return { coin: 'Bitcoin (BTC)', icon: '₿', valid: false, reason: `Invalid bech32 length` };
  }
  if ((a.startsWith('1') || a.startsWith('3')) && a.length >= 25 && a.length <= 34 && isBase58(a)) {
    return { coin: 'Bitcoin (BTC)', icon: '₿', valid: true, reason: 'Legacy/P2SH address' };
  }

  if (isBase58(a) && a.length >= 32 && a.length <= 44) {
    return { coin: 'Solana (SOL)', icon: '◎', valid: true, reason: 'Valid Solana address' };
  }

  return { coin: 'Unknown', icon: '❓', valid: false, reason: 'Unknown or invalid format' };
}

/* ── Number Conversion ── */
function convertNumber(raw: string) {
  const s = raw.trim();
  if (!s) return null;
  try {
    let val: number;
    if (s.toLowerCase().startsWith('0x')) val = parseInt(s, 16);
    else if (s.toLowerCase().startsWith('0b')) val = parseInt(s.substring(2), 2);
    else val = parseInt(s, 10);

    if (isNaN(val)) return { error: 'Invalid number format' };
    
    return {
      hex: '0x' + val.toString(16).toUpperCase(),
      dec: val.toString(10),
      bin: '0b' + val.toString(2),
      oct: '0o' + val.toString(8),
    };
  } catch {
    return { error: 'Conversion error' };
  }
}

export default function CryptoUtilsTool() {
  const [activeTab, setActiveTab] = useState<Tab>('qr');

  /* ── QR state ── */
  const [qrText, setQrText] = useState('');
  const [qrPng, setQrPng] = useState('');
  const [qrSvg, setQrSvg] = useState('');
  const [qrError, setQrError] = useState('');
  const qrTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (qrTimerRef.current) clearTimeout(qrTimerRef.current);
    if (!qrText.trim()) { setQrPng(''); setQrSvg(''); setQrError(''); return; }
    qrTimerRef.current = setTimeout(async () => {
      try {
        const png = await QRCode.toDataURL(qrText, { 
            width: 600, 
            margin: 2,
            color: { dark: '#000000', light: '#ffffff' }
        });
        const svg = await QRCode.toString(qrText, { type: 'svg' });
        setQrPng(png);
        setQrSvg(svg);
        setQrError('');
      } catch (e) {
        setQrError((e as Error).message);
      }
    }, 200);
    return () => { if (qrTimerRef.current) clearTimeout(qrTimerRef.current); };
  }, [qrText]);

  /* ── Wallet state ── */
  const [walletAddr, setWalletAddr] = useState('');
  const walletResult = useMemo(() => detectWallet(walletAddr), [walletAddr]);

  /* ── Num state ── */
  const [numInput, setNumInput] = useState('');
  const numResult = useMemo(() => convertNumber(numInput), [numInput]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs 
            activeTab={activeTab}
            onChange={id => setActiveTab(id as Tab)}
            tabs={[
                { id: 'qr', label: 'QR Generator', icon: '📱' },
                { id: 'wallet', label: 'Wallet Verify', icon: '🪙' },
                { id: 'numconv', label: 'Unit Converter', icon: '🔢' },
            ]}
            className="w-full max-w-xl"
        />
      </div>

      <div className="min-h-[400px]">
        {/* QR Generator */}
        {activeTab === 'qr' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-2">
                <div className="space-y-6">
                    <Card title="Input Content" description="Enter a URL, text, or any data to encode into a QR code.">
                        <Input 
                            value={qrText}
                            onChange={e => setQrText(e.target.value)}
                            placeholder="https://wokspec.org"
                            label="Content"
                        />
                        {qrError && <p className="mt-2 text-xs text-danger font-medium">{qrError}</p>}
                    </Card>
                    
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-xs text-white/40 leading-relaxed">
                            QR codes are generated locally in your browser. No data is sent to any server. Perfect for sensitive links or WiFi credentials.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-6">
                    {qrPng ? (
                        <>
                            <div className="p-4 bg-white rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={qrPng} alt="QR Code" className="w-64 h-64 rounded-xl" />
                            </div>
                            <div className="flex gap-3 w-full max-w-xs">
                                <Button className="flex-1" onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = qrPng; a.download = 'qrcode.png'; a.click();
                                }}>PNG</Button>
                                <Button variant="secondary" className="flex-1" onClick={() => {
                                    const blob = new Blob([qrSvg], { type: 'image/svg+xml' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url; a.download = 'qrcode.svg'; a.click();
                                    URL.revokeObjectURL(url);
                                }}>SVG</Button>
                            </div>
                        </>
                    ) : (
                        <div className="w-64 h-64 rounded-3xl border-2 border-dashed border-white/10 bg-white/[0.01] flex items-center justify-center text-center p-8 text-white/20 text-sm">
                            Waiting for input...
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Wallet Validator */}
        {activeTab === 'wallet' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-2">
                <Card title="Address Validator" description="Detect and verify Bitcoin, Ethereum, Solana, and Monero addresses.">
                    <Input 
                        value={walletAddr}
                        onChange={e => setWalletAddr(e.target.value)}
                        placeholder="Paste address here..."
                        label="Crypto Address"
                        className="font-mono"
                    />
                </Card>

                {walletResult && (
                    <div className={`p-6 rounded-2xl border flex gap-6 items-center animate-in slide-in-from-top-4 ${
                        walletResult.valid ? 'bg-success/10 border-success/20' : 'bg-danger/10 border-danger/20'
                    }`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg ${
                            walletResult.valid ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                        }`}>
                            {walletResult.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-white mb-1">{walletResult.coin}</h4>
                            <p className={`text-sm font-medium ${walletResult.valid ? 'text-success' : 'text-danger'}`}>
                                {walletResult.valid ? '✓ Valid Address' : '✕ Invalid Address'}
                            </p>
                            <p className="text-xs text-white/40 mt-1">{walletResult.reason}</p>
                        </div>
                    </div>
                )}
            </div>
        )}

        {/* Number Conversion */}
        {activeTab === 'numconv' && (
            <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-2">
                <Card title="Base Converter" description="Convert between Decimal, Hexadecimal, Binary, and Octal.">
                    <Input 
                        value={numInput}
                        onChange={e => setNumInput(e.target.value)}
                        placeholder="e.g. 255 or 0xFF or 0b1111"
                        label="Input Value"
                        className="font-mono"
                    />
                </Card>

                {numResult && !('error' in numResult) ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { label: 'Decimal', value: numResult.dec, base: 10 },
                            { label: 'Hexadecimal', value: numResult.hex, base: 16 },
                            { label: 'Binary', value: numResult.bin, base: 2 },
                            { label: 'Octal', value: numResult.oct, base: 8 },
                        ].map(item => (
                            <div key={item.label} className="group relative p-4 rounded-xl bg-surface-raised border border-white/5 hover:border-white/10 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-white/40 font-mono">base {item.base}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <code className="text-sm font-bold text-accent break-all">{item.value}</code>
                                    <button 
                                        onClick={() => navigator.clipboard.writeText(item.value)}
                                        className="p-1.5 rounded-lg bg-white/5 text-white/20 hover:text-white hover:bg-white/10 transition-all shrink-0"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : numInput && (
                    <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
                        Invalid number format. Use plain digits, 0x for Hex, or 0b for Binary.
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
