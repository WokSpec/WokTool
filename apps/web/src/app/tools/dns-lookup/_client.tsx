'use client';

import { useState } from 'react';

// ─── DNS Types ───────────────────────────────────────────────────────────────

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
  0: 'NOERROR — Success',
  1: 'FORMERR — Format Error',
  2: 'SERVFAIL — Server Failure',
  3: 'NXDOMAIN — Non-Existent Domain',
  4: 'NOTIMP — Not Implemented',
  5: 'REFUSED — Query Refused',
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

const S: Record<string, React.CSSProperties> = {
  root: { display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: 860 },
  inputRow: { display: 'flex', gap: '0.65rem', flexWrap: 'wrap' as const },
  input: { flex: 1, minWidth: 200, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem 0.875rem', color: 'var(--text)', fontSize: '0.9rem', boxSizing: 'border-box' as const },
  select: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem 0.875rem', color: 'var(--text)', fontSize: '0.875rem', cursor: 'pointer' },
  section: { background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' },
  sectionTitle: { padding: '0.65rem 1rem', background: 'var(--bg-elevated, #161616)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '0.83rem' },
  th: { padding: '0.5rem 0.75rem', textAlign: 'left' as const, color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase' as const, borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated, #161616)' },
  td: { padding: '0.45rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-secondary)', wordBreak: 'break-all' as const },
  badge: { padding: '0.2rem 0.6rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700, background: 'var(--accent-subtle, rgba(129,140,248,0.1))', color: 'var(--accent)' },
  typeToggle: { padding: '0.3rem 0.7rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--bg-surface)', color: 'var(--text-muted)', transition: 'all 0.15s' },
  typeToggleActive: { background: 'var(--accent)', color: '#fff', borderColor: 'transparent' },
  error: { color: 'var(--danger)', fontSize: '0.875rem', padding: '0.5rem 0.75rem' },
};

export default function DnsLookupClient() {
  const [domain, setDomain] = useState('');
  const [type, setType] = useState<RecordType>('A');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LookupResult[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);

  const lookup = async (d: string, t: RecordType) => {
    if (!d.trim()) return;
    setLoading(true); setResults([]);
    try {
      const data = await dnsLookup(d.trim(), t);
      setResults([{ type: t, data }]);
    } catch (e: unknown) {
      setResults([{ type: t, data: { Status: -1 }, error: e instanceof Error ? e.message : String(e) }]);
    } finally { setLoading(false); }
  };

  const lookupAll = async () => {
    if (!domain.trim()) return;
    setLoadingAll(true); setResults([]);
    const out: LookupResult[] = [];
    for (const t of RECORD_TYPES) {
      try {
        const data = await dnsLookup(domain.trim(), t);
        if (data.Answer?.length || data.Authority?.length) out.push({ type: t, data });
      } catch { /* skip */ }
    }
    if (!out.length) out.push({ type: 'A', data: { Status: 3 }, error: 'No records found for any type.' });
    setResults(out);
    setLoadingAll(false);
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') lookup(domain, type); };

  return (
    <div style={S.root}>
      {/* Input */}
      <div style={S.inputRow}>
        <input
          style={S.input}
          placeholder="example.com"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          onKeyDown={onKey}
        />
        <select style={S.select} value={type} onChange={e => setType(e.target.value as RecordType)}>
          {RECORD_TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <button className="btn-primary" onClick={() => lookup(domain, type)} disabled={loading || !domain.trim()}>
          {loading ? '⏳ Looking up…' : 'Lookup'}
        </button>
        <button className="btn-secondary" onClick={lookupAll} disabled={loadingAll || !domain.trim()}>
          {loadingAll ? '⏳' : 'All Records'}
        </button>
      </div>

      {/* Record type quick select */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {RECORD_TYPES.map(t => (
          <button
            key={t}
            style={{ ...S.typeToggle, ...(type === t ? S.typeToggleActive : {}) }}
            onClick={() => { setType(t); }}
          >{t}</button>
        ))}
      </div>

      {/* Results */}
      {results.map(r => (
        <div key={r.type} style={S.section}>
          <div style={S.sectionTitle}>
            <span>{r.type} Records — <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{domain}</span></span>
            <span style={{ fontSize: '0.75rem', color: r.data.Status === 0 ? '#22c55e' : 'var(--danger)', fontWeight: 400 }}>
              {STATUS_MSGS[r.data.Status] ?? `Status ${r.data.Status}`}
            </span>
          </div>

          {r.error && !r.data.Answer && <div style={S.error}>{r.error}</div>}

          {r.data.Answer && r.data.Answer.length > 0 && (
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Name</th>
                  <th style={S.th}>Type</th>
                  <th style={S.th}>TTL</th>
                  <th style={S.th}>Data</th>
                </tr>
              </thead>
              <tbody>
                {r.data.Answer.map((ans, i) => (
                  <tr key={i}>
                    <td style={S.td}>{ans.name}</td>
                    <td style={S.td}><span style={S.badge}>{typeName(ans.type)}</span></td>
                    <td style={{ ...S.td, whiteSpace: 'nowrap' }}>{ans.TTL}s</td>
                    <td style={{ ...S.td, fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem' }}>{ans.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {r.data.Authority && r.data.Authority.length > 0 && !r.data.Answer?.length && (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.83rem' }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Authority records:</div>
              {r.data.Authority.map((a, i) => <div key={i} style={{ fontFamily: 'var(--font-mono, monospace)', marginBottom: 2 }}>{a.data}</div>)}
            </div>
          )}

          {r.data.Status === 0 && !r.data.Answer?.length && !r.data.Authority?.length && (
            <div style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.83rem' }}>No {r.type} records found.</div>
          )}
        </div>
      ))}

      {/* Info */}
      {results.length === 0 && !loading && !loadingAll && (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 10, border: '1px solid var(--border)' }}>
          Enter a domain name above to look up DNS records via Cloudflare DNS-over-HTTPS.
          No data is sent to WokTool servers — queries go directly to <code style={{ fontFamily: 'var(--font-mono, monospace)' }}>cloudflare-dns.com</code>.
        </div>
      )}
    </div>
  );
}
