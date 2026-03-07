'use client';

import { useState, useRef, useEffect } from 'react';
import Dropzone from '@/components/ui/Dropzone';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Card from '@/components/ui/Card';
import CodeBlock from '@/components/ui/CodeBlock';
import Select from '@/components/ui/Select';

type Mode = 'encode' | 'decode';

export default function ImgToBase64Client() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [mode, setMode] = useState<Mode>('encode');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dataUri, setDataUri] = useState('');
  const [base64Only, setBase64Only] = useState('');
  const [fileInfo, setFileInfo] = useState<{ name: string; origSize: string; b64Size: string; pct: string } | null>(null);
  
  // Decode
  const [decodeInput, setDecodeInput] = useState('');
  const [decodeUrl, setDecodeUrl] = useState('');
  const [decodeError, setDecodeError] = useState('');

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const uri = e.target?.result as string;
      setDataUri(uri);
      const b64 = uri.split(',')[1] ?? '';
      setBase64Only(b64);
      setPreviewUrl(uri);

      const origBytes = file.size;
      const b64Bytes = b64.length;
      const pct = (((b64Bytes - origBytes) / origBytes) * 100).toFixed(1);
      const fmt = (n: number) => n < 1024 ? `${n} B` : n < 1048576 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1048576).toFixed(2)} MB`;
      setFileInfo({ name: file.name, origSize: fmt(origBytes), b64Size: fmt(b64Bytes), pct: `+${pct}%` });
    };
    reader.readAsDataURL(file);
  };

  const handleDecode = () => {
    setDecodeError(''); 
    setDecodeUrl('');
    try {
      let src = decodeInput.trim();
      if (!src) return;
      
      // Auto-fix if just raw base64 is pasted without data: prefix
      if (!src.startsWith('data:')) {
         // Try to guess mime type or default to png
         src = `data:image/png;base64,${src}`;
      }
      
      // Validate base64
      atob(src.split(',')[1] ?? '');
      setDecodeUrl(src);
    } catch {
      setDecodeError('Invalid base64 string. Please check your input.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="bg-surface-raised p-1 rounded-xl border border-white/5 inline-flex">
            <button
                onClick={() => setMode('encode')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'encode' 
                        ? 'bg-accent text-white shadow-md' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
                Image → Base64
            </button>
            <button
                onClick={() => setMode('decode')}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === 'decode' 
                        ? 'bg-accent text-white shadow-md' 
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
            >
                Base64 → Image
            </button>
        </div>
      </div>

      {mode === 'encode' ? (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Input & Preview */}
                <div className="space-y-6">
                    <Dropzone 
                        onFileSelect={processFile}
                        accept="image/*"
                        label="Drop image to convert"
                        description="PNG, JPG, GIF, WebP, SVG"
                        previewUrl={previewUrl}
                        className={previewUrl ? 'h-auto py-6' : ''}
                    />

                    {fileInfo && (
                        <Card title="File Stats">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Filename</span>
                                    <span className="font-medium text-white truncate max-w-[150px]">{fileInfo.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Original Size</span>
                                    <span className="font-medium text-white">{fileInfo.origSize}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Base64 Size</span>
                                    <span className="font-medium text-white">{fileInfo.b64Size}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/50">Size Increase</span>
                                    <span className="font-medium text-warning">{fileInfo.pct}</span>
                                </div>
                                <p className="text-[10px] text-white/30 mt-2 pt-2 border-t border-white/5">
                                    Base64 encoding always increases file size by ~33%. Use for small icons or critical CSS assets.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Col: Output */}
                <div className="lg:col-span-2 space-y-6">
                    {dataUri ? (
                        <>
                            <div>
                                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-2">Data URI (HTML &lt;img&gt; src)</h3>
                                <CodeBlock code={dataUri} maxHeight="150px" />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-2">CSS Background Image</h3>
                                <CodeBlock code={`background-image: url("${dataUri}");`} language="css" maxHeight="100px" />
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-2">Base64 String Only</h3>
                                <CodeBlock code={base64Only} maxHeight="150px" />
                            </div>
                        </>
                    ) : (
                        <div className="h-full min-h-[300px] flex items-center justify-center border border-white/5 rounded-2xl bg-white/[0.02] text-white/30">
                            Upload an image to see Base64 output
                        </div>
                    )}
                </div>
            </div>
        </>
      ) : (
        <>
            <Card title="Base64 Decoder">
                <div className="space-y-6">
                    <Textarea
                        placeholder="Paste your base64 string or data URI here..."
                        value={decodeInput}
                        onChange={e => setDecodeInput(e.target.value)}
                        className="font-mono text-xs"
                    />
                    
                    <div className="flex justify-end">
                         <Button onClick={handleDecode} disabled={!decodeInput.trim()}>
                            Decode Image
                         </Button>
                    </div>

                    {decodeError && (
                        <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm font-medium">
                            {decodeError}
                        </div>
                    )}

                    {decodeUrl && (
                        <div className="border border-white/10 rounded-2xl p-8 bg-[#0a0a0a] flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={decodeUrl} alt="Decoded" className="max-w-full max-h-[400px] object-contain shadow-2xl" />
                            
                            <Button 
                                href={decodeUrl} 
                                download="decoded-image.png"
                                variant="secondary"
                            >
                                Download Image
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </>
      )}
    </div>
  );
}
