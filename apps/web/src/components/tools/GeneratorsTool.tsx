'use client';

import { useState, useCallback, useMemo } from 'react';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Slider from '@/components/ui/Slider';
import Switch from '@/components/ui/Switch';
import Input from '@/components/ui/Input';
import CodeBlock from '@/components/ui/CodeBlock';

type Tab = 'uuid' | 'password' | 'lorem' | 'timestamp';

// ── UUID Utils ───────────────────────────────────────────────────────────
function genUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

// ── Password Utils ───────────────────────────────────────────────────────
const CHARS = {
  lower:  'abcdefghijklmnopqrstuvwxyz',
  upper:  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function genPassword(length: number, opts: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean }) {
  let pool = '';
  if (opts.lower)   pool += CHARS.lower;
  if (opts.upper)   pool += CHARS.upper;
  if (opts.digits)  pool += CHARS.digits;
  if (opts.symbols) pool += CHARS.symbols;
  if (!pool) return '';
  
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(n => pool[n % pool.length]).join('');
}

function getEntropy(pw: string) {
  if (!pw) return 0;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw))    pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  return Math.log2(Math.pow(pool || 1, pw.length));
}

// ── Lorem Utils ──────────────────────────────────────────────────────────
const WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');

function generateLorem(count: number, unit: 'words' | 'sentences' | 'paragraphs') {
  const getWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];
  const getSentence = () => {
    const len = 8 + Math.floor(Math.random() * 10);
    const s = Array.from({length: len}, getWord).join(' ');
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  };
  const getParagraph = () => {
    const len = 3 + Math.floor(Math.random() * 4);
    return Array.from({length: len}, getSentence).join(' ');
  };

  if (unit === 'words') return Array.from({length: count}, getWord).join(' ');
  if (unit === 'sentences') return Array.from({length: count}, getSentence).join(' ');
  return Array.from({length: count}, getParagraph).join('\n\n');
}

export default function GeneratorsTool() {
  const [activeTab, setActiveTab] = useState<Tab>('uuid');

  // UUID State
  const [uuidCount, setUuidCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);

  // Password State
  const [pwLen, setPwLen] = useState(24);
  const [pwOpts, setPwOpts] = useState({ lower: true, upper: true, digits: true, symbols: true });
  const [password, setPassword] = useState('');

  // Lorem State
  const [loremCount, setLoremCount] = useState(3);
  const [loremUnit, setLoremUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [loremText, setLoremText] = useState('');

  // Timestamp State
  const [tsInput, setTsInput] = useState('');
  const now = useMemo(() => new Date(), []);

  const handleGenUUID = () => {
    setUuids(Array.from({ length: uuidCount }, genUUID));
  };

  const handleGenPassword = () => {
    setPassword(genPassword(pwLen, pwOpts));
  };

  const handleGenLorem = () => {
    setLoremText(generateLorem(loremCount, loremUnit));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-center">
        <Tabs
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id as Tab)}
          tabs={[
            { id: 'uuid', label: 'UUID', icon: '🆔' },
            { id: 'password', label: 'Password', icon: '🔑' },
            { id: 'lorem', label: 'Lorem Ipsum', icon: '📝' },
            { id: 'timestamp', label: 'Timestamp', icon: '🕒' },
          ]}
          className="w-full max-w-2xl"
        />
      </div>

      <div className="min-h-[400px]">
        {/* UUID Generator */}
        {activeTab === 'uuid' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <Card title="UUID v4 Generator" description="Generate cryptographically strong unique identifiers.">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="flex-1 w-full">
                    <Slider 
                        label="Number of UUIDs"
                        min={1} max={50}
                        value={uuidCount}
                        onChange={setUuidCount}
                    />
                </div>
                <Button onClick={handleGenUUID} className="w-full md:w-auto">Generate</Button>
              </div>
            </Card>

            {uuids.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Result</h3>
                    <Button variant="ghost" size="sm" onClick={() => setUuids([])}>Clear</Button>
                </div>
                <CodeBlock code={uuids.join('\n')} label="Generated UUIDs" maxHeight="300px" />
              </div>
            )}
          </div>
        )}

        {/* Password Generator */}
        {activeTab === 'password' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Settings" className="md:col-span-1">
                    <div className="space-y-6">
                        <Slider 
                            label="Length"
                            min={8} max={128}
                            value={pwLen}
                            onChange={setPwLen}
                        />
                        <div className="space-y-4 pt-2">
                            <Switch label="Lowercase" checked={pwOpts.lower} onChange={v => setPwOpts(p => ({...p, lower: v}))} />
                            <Switch label="Uppercase" checked={pwOpts.upper} onChange={v => setPwOpts(p => ({...p, upper: v}))} />
                            <Switch label="Numbers" checked={pwOpts.digits} onChange={v => setPwOpts(p => ({...p, digits: v}))} />
                            <Switch label="Symbols" checked={pwOpts.symbols} onChange={v => setPwOpts(p => ({...p, symbols: v}))} />
                        </div>
                        <Button onClick={handleGenPassword} className="w-full" size="lg">Generate</Button>
                    </div>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    {password ? (
                        <>
                            <Card title="Your Secure Password">
                                <div className="space-y-6">
                                    <div className="p-6 rounded-xl bg-black/40 border border-white/10 text-center">
                                        <div className="font-mono text-2xl md:text-3xl text-accent break-all selection:bg-accent/30 selection:text-white">
                                            {password}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-white/40">
                                            <span>Strength Analysis</span>
                                            <span>{Math.round(getEntropy(password))} bits</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-500 ${
                                                    getEntropy(password) < 50 ? 'bg-danger w-1/3' : 
                                                    getEntropy(password) < 80 ? 'bg-warning w-2/3' : 'bg-success w-full'
                                                }`} 
                                            />
                                        </div>
                                        <p className="text-[10px] text-white/30 italic text-right">
                                            {getEntropy(password) < 50 ? 'Weak — Add more characters or types' : 
                                             getEntropy(password) < 80 ? 'Good — Sufficient for most uses' : 'Strong — High security'}
                                        </p>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button 
                                            className="flex-1" 
                                            onClick={() => navigator.clipboard.writeText(password)}
                                            icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>}
                                        >
                                            Copy Password
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                            
                            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white/90 mb-1">Secure Generation</h4>
                                    <p className="text-xs text-white/40 leading-relaxed">
                                        Passwords are generated using the browser's <code>crypto.getRandomValues</code> API, ensuring high-quality randomness. No data ever leaves your device.
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01] text-white/30 text-sm">
                            Configure settings and click generate
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}

        {/* Lorem Ipsum */}
        {activeTab === 'lorem' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <Card title="Lorem Ipsum Generator">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="w-full md:w-32">
                        <Input 
                            label="Count"
                            type="number"
                            value={loremCount}
                            onChange={e => setLoremCount(Number(e.target.value))}
                            min={1} max={100}
                        />
                    </div>
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-white/70 mb-1.5 ml-1">Unit</label>
                        <div className="bg-surface-raised p-1 rounded-xl border border-white/5 flex">
                            {(['words', 'sentences', 'paragraphs'] as const).map(u => (
                                <button
                                    key={u}
                                    onClick={() => setLoremUnit(u)}
                                    className={`flex-1 py-2 px-4 rounded-lg text-xs font-bold transition-all ${
                                        loremUnit === u 
                                            ? 'bg-accent text-white shadow-md' 
                                            : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {u.charAt(0).toUpperCase() + u.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleGenLorem} className="w-full md:w-auto">Generate</Button>
                </div>
            </Card>

            {loremText && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-bold text-white/50 uppercase tracking-widest">Result</h3>
                        <Button variant="ghost" size="sm" onClick={() => setLoremText('')}>Clear</Button>
                    </div>
                    <CodeBlock code={loremText} label="Placeholder Text" maxHeight="400px" />
                </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        {activeTab === 'timestamp' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Current Time">
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Unix (seconds)</span>
                                <code className="text-accent font-bold">{Math.floor(now.getTime()/1000)}</code>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Unix (ms)</span>
                                <code className="text-white/80">{now.getTime()}</code>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                            <div>
                                <span className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1">ISO 8601</span>
                                <code className="text-white/80 text-xs break-all">{now.toISOString()}</code>
                            </div>
                            <div>
                                <span className="text-xs text-white/40 font-bold uppercase tracking-wider block mb-1">RFC 2822</span>
                                <code className="text-white/80 text-xs break-all">{now.toUTCString()}</code>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Convert Timestamp">
                    <div className="space-y-6">
                        <Input 
                            placeholder="Unix timestamp or ISO date string..."
                            value={tsInput}
                            onChange={e => setTsInput(e.target.value)}
                            label="Input Date/Timestamp"
                        />

                        {tsInput && (() => {
                            const n = isNaN(+tsInput) ? new Date(tsInput) : new Date(+tsInput * (String(tsInput).length <= 10 ? 1000 : 1));
                            if (isNaN(n.getTime())) return (
                                <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                                    Invalid date or timestamp format.
                                </div>
                            );
                            return (
                                <div className="space-y-3 p-4 rounded-xl bg-accent/5 border border-accent/10">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">Local Time</span>
                                        <span className="text-white font-medium">{n.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">ISO Date</span>
                                        <span className="text-white font-medium">{n.toISOString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-white/40">Unix (sec)</span>
                                        <span className="text-white font-medium">{Math.floor(n.getTime()/1000)}</span>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
