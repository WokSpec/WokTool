'use client';

import { useState, useCallback, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';

const RECORD_TYPES = ['A','AAAA','CNAME','MX','TXT','NS','SOA','PTR','CAA'] as const;
type RecordType = typeof RECORD_TYPES[number];

const TYPE_CODES: Record<RecordType, number> = {
  A: 1, AAAA: 28, CNAME: 5, MX: 15, TXT: 16, NS: 2, SOA: 6, PTR: 12, CAA: 257,
};

interface DnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  Answer?: DnsAnswer[];
  Authority?: DnsAnswer[];
  Question?: Array<{ name: string; type: number }>;
}

const STATUS_MSGS: Record<number, string> = {
  0: 'Success',
  1: 'Format Error',
  2: 'Server Failure',
  3: 'Non-Existent Domain',
  4: 'Not Implemented',
  5: 'Query Refused',
};

function typeName(code: number): string {
  return Object.entries(TYPE_CODES).find(([, v]) => v === code)?.[0] ?? String(code);
}

async function dnsLookup(domain: string, type: RecordType): Promise<DnsResponse> {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
  const res = await fetch(url, { headers: { Accept: 'application/dns-json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

interface LookupResult {
  type: RecordType;
  data: DnsResponse;
  error?: string;
}

export default function DnsLookupClient() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const [domain, setDomain] = useState('');
  const [type, setType] = useState<RecordType>('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LookupResult[]>([]);

  const lookup = async (d: string, t: RecordType) => {
    if (!d.trim()) return;
    setLoading(true); setResults([]);
    try {
      const data = await dnsLookup(d.trim(), t);
      setResults([{ type: t, data }]);
    } catch (e: any) {
      setResults([{ type: t, data: { Status: -1 }, error: e.message }]);
    } finally { setLoading(false); }
  };

  const lookupAll = async () => {
    if (!domain.trim()) return;
    setLoading(true); setResults([]);
    const out: LookupResult[] = [];
    for (const t of RECORD_TYPES) {
      try {
        const data = await dnsLookup(domain.trim(), t);
        if (data.Answer?.length || data.Authority?.length) out.push({ type: t, data });
      } catch { }
    }
    if (!out.length) out.push({ type: 'A', data: { Status: 3 }, error: 'No records found for any type.' });
    setResults(out);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Query Domain Records" description="Fetch DNS data directly from Cloudflare's privacy-first 1.1.1.1 DNS-over-HTTPS service.">
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                    <Input 
                        placeholder="example.com"
                        value={domain}
                        onChange={e => setDomain(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && lookup(domain, type)}
                        leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select 
                        value={type}
                        onChange={e => setType(e.target.value as RecordType)}
                        options={RECORD_TYPES.map(t => ({ value: t, label: t }))}
                    />
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => lookup(domain, type)} loading={loading && results.length === 0} disabled={!domain.trim()}>Lookup</Button>
                    <Button variant="secondary" onClick={lookupAll} loading={loading && results.length > 0} disabled={!domain.trim()}>Scan All</Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
                {RECORD_TYPES.map(t => (
                    <button
                        key={t}
                        onClick={() => { setType(t); lookup(domain, t); }}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${type === t ? 'bg-accent border-accent text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
      </Card>

      <div className="space-y-6">
        {results.map((r, ri) => (
            <Card key={ri} className="p-0 overflow-hidden border-white/10 animate-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${ri * 100}ms` }}>
                <div className="px-6 py-4 bg-white/[0.03] border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-md bg-accent text-white text-[10px] font-black uppercase tracking-tighter">{r.type}</span>
                        <span className="text-sm font-bold text-white">{domain}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${r.data.Status === 0 ? 'text-success' : 'text-danger'}`}>
                        {STATUS_MSGS[r.data.Status] || `Error ${r.data.Status}`}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    {r.data.Answer ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/[0.01]">
                                    <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Name</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">TTL</th>
                                    <th className="p-4 text-[10px] font-black uppercase text-white/20 tracking-widest">Data</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {r.data.Answer.map((ans, i) => (
                                    <tr key={i} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="p-4 text-xs font-medium text-white/60">{ans.name}</td>
                                        <td className="p-4 text-xs font-mono text-white/40">{ans.TTL}s</td>
                                        <td className="p-4 text-xs font-mono text-accent break-all">{ans.data}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-white/20 text-xs font-medium italic">
                            {r.error || `No ${r.type} records found for this domain.`}
                        </div>
                    )}
                </div>
            </Card>
        ))}
      </div>

      {results.length === 0 && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 opacity-40">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Privacy First</div>
                <p className="text-xs text-white/40">We use Cloudflare&apos;s 1.1.1.1 DoH endpoint. No identifying data is logged by us.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Multi-Record</div>
                <p className="text-xs text-white/40">Query individual types like MX and TXT, or scan all common records at once.</p>
            </div>
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.01]">
                <div className="text-[10px] font-black uppercase text-white/20 mb-2">Global Propagation</div>
                <p className="text-xs text-white/40">Results reflect what Cloudflare sees globally, perfect for verifying recent changes.</p>
            </div>
        </div>
      )}
    </div>
  );
}
