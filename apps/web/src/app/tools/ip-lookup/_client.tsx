'use client';
import { useState, useEffect } from 'react';

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

function InfoRow({ label, value }: { label: string; value?: string | number }) {
  if (!value && value !== 0) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
      <span style={{ color: 'var(--text)', fontSize: '0.85rem', fontFamily: typeof value === 'number' ? 'monospace' : undefined }}>{String(value)}</span>
    </div>
  );
}

export default function IpLookupClient() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualIp, setManualIp] = useState('');
  const [searchIp, setSearchIp] = useState('');

  async function lookup(ip: string) {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const result = await fetchIpData(ip || 'me');
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lookup failed');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { lookup('me'); }, []);

  function handleSearch() { lookup(manualIp.trim()); setSearchIp(manualIp.trim()); }

  const inputStyle: React.CSSProperties = {
    padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none', flex: 1,
  };

  const flag = data?.country_code ? `https://flagcdn.com/w40/${data.country_code.toLowerCase()}.png` : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 600 }}>
      {/* Search */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={manualIp}
          onChange={e => setManualIp(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          style={inputStyle}
          placeholder="Enter IP address (e.g. 8.8.8.8) or leave blank for your IP"
        />
        <button onClick={handleSearch} className="btn-primary" disabled={loading} style={{ padding: '0.5rem 1.25rem', borderRadius: 8, cursor: 'pointer', border: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          {loading ? '…' : 'Look Up'}
        </button>
        <button onClick={() => { setManualIp(''); lookup('me'); setSearchIp(''); }} className="btn-secondary" disabled={loading} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.82rem', border: '1px solid var(--border)' }}>
          My IP
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔍</div>
          Looking up{searchIp ? ` ${searchIp}` : ' your IP'}…
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 8, background: 'var(--danger-bg,rgba(248,113,113,0.1))', border: '1px solid var(--danger-border,rgba(248,113,113,0.25))', color: 'var(--danger,#f87171)', fontSize: '0.875rem' }}>
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* IP + Country header */}
          <div style={{ padding: '1.25rem', borderRadius: 12, background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {flag && <img src={flag} alt={data.country_code} style={{ width: 40, borderRadius: 4, border: '1px solid var(--border)' }} />}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)' }}>{data.ip}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {[data.city, data.region, data.country_name].filter(Boolean).join(', ')}
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <InfoRow label="IP Address" value={data.ip} />
            <InfoRow label="City" value={data.city} />
            <InfoRow label="Region" value={data.region} />
            <InfoRow label="Country" value={data.country_name} />
            <InfoRow label="Postal Code" value={data.postal} />
            <InfoRow label="Timezone" value={data.timezone} />
            <InfoRow label="Latitude" value={data.latitude} />
            <InfoRow label="Longitude" value={data.longitude} />
            <InfoRow label="ISP / Org" value={data.org} />
            <InfoRow label="ASN" value={data.asn} />
            <InfoRow label="Currency" value={data.currency} />
            <InfoRow label="Languages" value={data.languages} />
          </div>

          {/* Coordinates */}
          {data.latitude !== undefined && data.longitude !== undefined && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Coordinates</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent-2,#a5b4fc)' }}>
                {data.latitude}° N, {data.longitude}° E
              </div>
              <a
                href={`https://www.openstreetmap.org/?mlat=${data.latitude}&mlon=${data.longitude}&zoom=10`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', marginTop: '0.5rem', color: 'var(--accent)', fontSize: '0.82rem', textDecoration: 'none' }}
              >
                View on OpenStreetMap →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
