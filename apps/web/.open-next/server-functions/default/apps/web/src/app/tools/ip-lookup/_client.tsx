'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface IpData {
  ip: string;
  city?: string;
  region?: string;
  country_name?: string;
  country_code?: string;
  org?: string;
  asn?: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  postal?: string;
  currency?: string;
  languages?: string;
}

async function fetchIpData(ip: string): Promise<IpData> {
  const url = ip === 'me' || !ip
    ? 'https://ipapi.co/json/'
    : `https://ipapi.co/${ip}/json/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.reason || 'Lookup failed');
  return data;
}

export default function IpLookupClient() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualIp, setManualIp] = useState('');

  async function lookup(ip: string) {
    setLoading(true);
    setError('');
    try {
      const result = await fetchIpData(ip);
      setData(result);
    } catch (e: any) {
      setError(e.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { lookup('me'); }, []);

  const flag = data?.country_code ? `https://flagcdn.com/w80/${data.country_code.toLowerCase()}.png` : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card title="Locate IP Address" description="Get precise geolocation, ISP, and network data for any IP address. Leaves blank to check your own connection.">
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
                <Input 
                    value={manualIp}
                    onChange={e => setManualIp(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && lookup(manualIp.trim())}
                    placeholder="e.g. 8.8.8.8"
                    leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={() => lookup(manualIp.trim())} loading={loading} disabled={loading}>Analyze</Button>
                <Button variant="secondary" onClick={() => { setManualIp(''); lookup('me'); }} disabled={loading}>My IP</Button>
            </div>
        </div>
        {error && (
            <div className="mt-4 p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-medium">
                {error}
            </div>
        )}
      </Card>

      {data && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
            {/* Main Identity */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="flex flex-col items-center text-center p-8 bg-surface-raised border-white/10 shadow-2xl">
                    {flag && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={flag} alt={data.country_code} className="w-20 h-auto rounded-lg shadow-lg mb-6 border border-white/10" />
                    )}
                    <h2 className="text-2xl font-black text-white font-mono tracking-tighter mb-1">{data.ip}</h2>
                    <p className="text-accent font-bold text-sm">{data.city}, {data.country_name}</p>
                    <div className="mt-6 pt-6 border-t border-white/5 w-full flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>ASN {data.asn}</span>
                        <span>{data.timezone}</span>
                    </div>
                </Card>

                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">Coordinates</span>
                        <code className="text-xs font-bold text-white/60">{data.latitude?.toFixed(4)}, {data.longitude?.toFixed(4)}</code>
                    </div>
                    <Button 
                        href={`https://www.google.com/maps?q=${data.latitude},${data.longitude}`} 
                        target="_blank" 
                        variant="secondary" 
                        size="sm" 
                        className="w-full"
                    >
                        View on Map
                    </Button>
                </div>
            </div>

            {/* Detailed Stats */}
            <div className="lg:col-span-2">
                <Card title="Network & Location Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                        {[
                            { l: 'Organization', v: data.org },
                            { l: 'ISP', v: data.org },
                            { l: 'Region', v: data.region },
                            { l: 'Postal Code', v: data.postal },
                            { l: 'Timezone', v: data.timezone },
                            { l: 'Currency', v: data.currency },
                            { l: 'Languages', v: data.languages },
                            { l: 'Country Code', v: data.country_code },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-white/[0.03] group hover:bg-white/[0.01] px-2 transition-colors">
                                <span className="text-xs font-bold text-white/30 uppercase tracking-widest">{item.l}</span>
                                <span className="text-sm font-bold text-white/80">{item.v || '—'}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
      )}

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/20">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold uppercase tracking-widest">Querying Global IP Databases...</p>
        </div>
      )}
    </div>
  );
}
