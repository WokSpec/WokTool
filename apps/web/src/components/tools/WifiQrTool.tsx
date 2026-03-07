'use client';

import { useState, useRef, useEffect } from 'react';
import { Wifi, Shield, Key, Download, RefreshCw, Smartphone, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import QRCode from 'qrcode';

export default function WifiQrTool() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [fgColor, setQrColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  
  const generate = async () => {
    // WiFi format: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;H:<true|false>;;
    const wifiString = "WIFI:S:" + ssid + ";T:" + encryption + ";P:" + password + ";H:" + hidden + ";;";
    
    try {
      const url = await QRCode.toDataURL(wifiString, {
        width: 1024,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: 'H'
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (ssid) generate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ssid, password, encryption, hidden, fgColor, bgColor]);

  const download = () => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = "wifi-qr-" + ssid + ".png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
            <Card title="Network Credentials" description="Configure the broadcast parameters for your local wireless node.">
                <div className="space-y-5">
                    <Input 
                        label="Network Name (SSID)" 
                        value={ssid} 
                        onChange={e => setSsid(e.target.value)} 
                        placeholder="MyHomeWiFi"
                        leftIcon={<Wifi size={18} />}
                    />
                    <div className="relative">
                        <Input 
                            label="Password" 
                            type={showPassword ? 'text' : 'password'} 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="••••••••"
                            leftIcon={<Key size={18} />}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[38px] text-zinc-600 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    <Select 
                        label="Security Protocol"
                        value={encryption}
                        onChange={e => setEncryption(e.target.value)}
                        options={[
                            { value: 'WPA', label: 'WPA/WPA2 (Standard)' },
                            { value: 'WEP', label: 'WEP (Legacy)' },
                            { value: 'nopass', label: 'None (Open)' },
                        ]}
                    />
                </div>
            </Card>

            <Card title="Visual Theme" description="Adjust the high-fidelity rendering of the matrix.">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Foreground</label>
                        <div className="flex gap-2">
                            <input type="color" value={fgColor} onChange={e => setQrColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-white/10" />
                            <input type="text" value={fgColor} onChange={e => setQrColor(e.target.value)} className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-2 text-[10px] font-mono text-center" />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Background</label>
                        <div className="flex gap-2">
                            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border border-white/10" />
                            <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-2 text-[10px] font-mono text-center" />
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-square max-w-md mx-auto rounded-[3rem] bg-[#050505] border border-white/[0.08] shadow-2xl flex flex-col items-center justify-center p-12 overflow-hidden group">
                {qrUrl ? (
                    <div className="relative z-10 animate-in zoom-in-95 duration-700">
                        <img src={qrUrl} alt="WiFi QR Code" className="w-full h-full rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.05)]" />
                    </div>
                ) : (
                    <div className="text-center space-y-4 opacity-20">
                        <Wifi size={80} className="mx-auto" strokeWidth={1} />
                        <p className="text-sm font-bold uppercase tracking-widest">Enter SSID to Generate</p>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-radial-glow opacity-10" />
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button onClick={download} disabled={!qrUrl} size="lg" className="rounded-2xl px-12" icon={<Download size={18} />}>
                    Export PNG Asset
                </Button>
                <Button variant="secondary" onClick={() => { setSsid(''); setPassword(''); }} size="lg" className="rounded-2xl" icon={<RefreshCw size={18} />}>
                    Reset Protocol
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] flex gap-6 items-start">
                    <Smartphone size={24} className="text-accent shrink-0" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-tighter">Native Scan</h4>
                        <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">Compatible with all modern iOS and Android vision engines. Zero friction onboarding.</p>
                    </div>
                </div>
                <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] flex gap-6 items-start">
                    <Shield size={24} className="text-accent shrink-0" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase tracking-tighter">Encrypted Matrix</h4>
                        <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">High-error correction level (H) ensures the code remains scannable even with branding overlays.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
