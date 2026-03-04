'use client';
import { useState } from 'react';

type HeaderType = 'Request' | 'Response' | 'Both';
type HeaderCategory = 'Caching' | 'Security' | 'Content' | 'Auth' | 'CORS' | 'Connection' | 'Redirect' | 'Request Info' | 'Response Info' | 'Cookie' | 'Encoding';

interface HttpHeader {
  name: string;
  type: HeaderType;
  category: HeaderCategory;
  description: string;
  example: string;
}

const HEADERS: HttpHeader[] = [
  // Caching
  { name: 'Cache-Control', type: 'Both', category: 'Caching', description: 'Directives for caching mechanisms in both requests and responses. Controls how long a response is cached.', example: 'Cache-Control: max-age=3600, public' },
  { name: 'ETag', type: 'Response', category: 'Caching', description: 'Identifier for a specific version of a resource. Enables cache validation.', example: 'ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"' },
  { name: 'If-None-Match', type: 'Request', category: 'Caching', description: 'Makes a request conditional. Server only returns the resource if the ETag does not match.', example: 'If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"' },
  { name: 'If-Modified-Since', type: 'Request', category: 'Caching', description: 'Makes a request conditional. Server only returns the resource if modified after this date.', example: 'If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT' },
  { name: 'Last-Modified', type: 'Response', category: 'Caching', description: 'The date and time at which the server believes the resource was last modified.', example: 'Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT' },
  { name: 'Expires', type: 'Response', category: 'Caching', description: 'The date after which the response is considered stale. Superseded by Cache-Control.', example: 'Expires: Wed, 21 Oct 2015 07:28:00 GMT' },
  { name: 'Pragma', type: 'Both', category: 'Caching', description: 'Legacy header. "Pragma: no-cache" is the only standard directive; equivalent to Cache-Control: no-cache.', example: 'Pragma: no-cache' },
  { name: 'Vary', type: 'Response', category: 'Caching', description: 'Tells caches to store separate responses for different values of the listed request headers.', example: 'Vary: Accept-Encoding, Accept-Language' },
  { name: 'Age', type: 'Response', category: 'Caching', description: 'The time in seconds an object has been in a proxy cache.', example: 'Age: 24' },
  // Security
  { name: 'Content-Security-Policy', type: 'Response', category: 'Security', description: 'Controls which resources the browser is allowed to load. Helps prevent XSS attacks.', example: "Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com" },
  { name: 'Strict-Transport-Security', type: 'Response', category: 'Security', description: 'Forces clients to use HTTPS. Browsers should only access the server via HTTPS for the specified max-age period.', example: 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' },
  { name: 'X-Frame-Options', type: 'Response', category: 'Security', description: 'Controls if the browser should be allowed to render a page in a frame/iframe. Prevents clickjacking.', example: 'X-Frame-Options: DENY' },
  { name: 'X-Content-Type-Options', type: 'Response', category: 'Security', description: 'Prevents MIME type sniffing. Forces browser to use declared Content-Type.', example: 'X-Content-Type-Options: nosniff' },
  { name: 'X-XSS-Protection', type: 'Response', category: 'Security', description: 'Legacy header enabling cross-site scripting filter in some browsers. Mostly replaced by CSP.', example: 'X-XSS-Protection: 1; mode=block' },
  { name: 'Referrer-Policy', type: 'Response', category: 'Security', description: 'Controls how much referrer information is sent in the Referer header with requests.', example: 'Referrer-Policy: strict-origin-when-cross-origin' },
  { name: 'Permissions-Policy', type: 'Response', category: 'Security', description: 'Controls which browser features and APIs can be used (formerly Feature-Policy).', example: 'Permissions-Policy: camera=(), microphone=(), geolocation=()' },
  { name: 'Cross-Origin-Opener-Policy', type: 'Response', category: 'Security', description: 'Controls the browsing context group. Prevents Spectre-like attacks.', example: 'Cross-Origin-Opener-Policy: same-origin' },
  { name: 'Cross-Origin-Resource-Policy', type: 'Response', category: 'Security', description: 'Prevents other domains from embedding the response.', example: 'Cross-Origin-Resource-Policy: same-origin' },
  // Content
  { name: 'Content-Type', type: 'Both', category: 'Content', description: 'Indicates the media type of the resource, including charset for text types.', example: 'Content-Type: application/json; charset=utf-8' },
  { name: 'Content-Length', type: 'Both', category: 'Content', description: 'The size of the response/request body in bytes.', example: 'Content-Length: 1234' },
  { name: 'Content-Language', type: 'Both', category: 'Content', description: 'The language(s) of the intended audience for the resource.', example: 'Content-Language: en-US' },
  { name: 'Content-Disposition', type: 'Response', category: 'Content', description: 'Controls if the content is displayed inline or downloaded as an attachment.', example: 'Content-Disposition: attachment; filename="report.pdf"' },
  { name: 'Content-Range', type: 'Response', category: 'Content', description: 'Indicates where in a full body message a partial message belongs.', example: 'Content-Range: bytes 200-1000/67589' },
  { name: 'Accept', type: 'Request', category: 'Content', description: 'Informs the server which content types the client can process.', example: 'Accept: application/json, text/html;q=0.9, */*;q=0.8' },
  { name: 'Accept-Language', type: 'Request', category: 'Content', description: 'Tells the server which languages the client prefers.', example: 'Accept-Language: en-US,en;q=0.9,fr;q=0.8' },
  // Encoding
  { name: 'Content-Encoding', type: 'Both', category: 'Encoding', description: 'The encoding transformations applied to the body. Most commonly gzip or br.', example: 'Content-Encoding: gzip' },
  { name: 'Accept-Encoding', type: 'Request', category: 'Encoding', description: 'Informs the server about content encoding (compression) the client understands.', example: 'Accept-Encoding: gzip, deflate, br' },
  { name: 'Transfer-Encoding', type: 'Response', category: 'Encoding', description: 'The encoding used to transfer the body between nodes. "chunked" is most common.', example: 'Transfer-Encoding: chunked' },
  // Auth
  { name: 'Authorization', type: 'Request', category: 'Auth', description: 'Contains the credentials to authenticate a user agent with a server.', example: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
  { name: 'WWW-Authenticate', type: 'Response', category: 'Auth', description: 'Defines the authentication method to use to gain access. Sent with 401 responses.', example: 'WWW-Authenticate: Bearer realm="api", charset="UTF-8"' },
  { name: 'Proxy-Authorization', type: 'Request', category: 'Auth', description: 'Contains credentials to authenticate with a proxy server.', example: 'Proxy-Authorization: Basic YWxhZGRpbjpvcGVuc2VzYW1l' },
  { name: 'Proxy-Authenticate', type: 'Response', category: 'Auth', description: 'Defines the authentication method to use with a proxy. Sent with 407 responses.', example: 'Proxy-Authenticate: Basic realm="Access to the internal site"' },
  // CORS
  { name: 'Access-Control-Allow-Origin', type: 'Response', category: 'CORS', description: 'Indicates whether the response can be shared with requesting code from the given origin.', example: 'Access-Control-Allow-Origin: https://example.com' },
  { name: 'Access-Control-Allow-Methods', type: 'Response', category: 'CORS', description: 'Specifies the HTTP methods allowed when accessing the resource in response to a preflight request.', example: 'Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS' },
  { name: 'Access-Control-Allow-Headers', type: 'Response', category: 'CORS', description: 'Specifies which headers can be used in the actual request when making a CORS request.', example: 'Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With' },
  { name: 'Access-Control-Allow-Credentials', type: 'Response', category: 'CORS', description: 'Indicates whether the actual request can be made with credentials (cookies, auth headers).', example: 'Access-Control-Allow-Credentials: true' },
  { name: 'Access-Control-Expose-Headers', type: 'Response', category: 'CORS', description: 'Indicates which response headers can be exposed to the browser during a cross-origin request.', example: 'Access-Control-Expose-Headers: X-Custom-Header, Content-Range' },
  { name: 'Access-Control-Max-Age', type: 'Response', category: 'CORS', description: 'Specifies how long (in seconds) preflight request results can be cached.', example: 'Access-Control-Max-Age: 86400' },
  { name: 'Origin', type: 'Request', category: 'CORS', description: 'Indicates the origin of the cross-origin request. Cannot be changed programmatically.', example: 'Origin: https://developer.mozilla.org' },
  // Connection
  { name: 'Connection', type: 'Both', category: 'Connection', description: 'Controls whether the network connection stays open after the current transaction.', example: 'Connection: keep-alive' },
  { name: 'Keep-Alive', type: 'Both', category: 'Connection', description: 'Allows the sender to hint about how the connection may be used.', example: 'Keep-Alive: timeout=5, max=100' },
  { name: 'Upgrade', type: 'Both', category: 'Connection', description: 'Allows the client to request upgrading to another protocol (e.g., WebSocket).', example: 'Upgrade: websocket' },
  // Request Info
  { name: 'Host', type: 'Request', category: 'Request Info', description: 'Specifies the host and port of the server to which the request is being sent. Required in HTTP/1.1.', example: 'Host: api.example.com:8080' },
  { name: 'User-Agent', type: 'Request', category: 'Request Info', description: 'String identifying the client software (browser, bot, etc.).', example: 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
  { name: 'Referer', type: 'Request', category: 'Request Info', description: 'Contains the address of the previous web page from which the current request was made.', example: 'Referer: https://www.google.com/search?q=http+headers' },
  { name: 'Range', type: 'Request', category: 'Request Info', description: 'Requests only part of an entity. Used for resumable downloads.', example: 'Range: bytes=500-999' },
  { name: 'X-Forwarded-For', type: 'Request', category: 'Request Info', description: 'Identifies the originating IP address of a client connecting through a proxy or load balancer.', example: 'X-Forwarded-For: 203.0.113.195, 70.41.3.18' },
  { name: 'X-Forwarded-Proto', type: 'Request', category: 'Request Info', description: 'Identifies the protocol (HTTP or HTTPS) used to connect to the proxy.', example: 'X-Forwarded-Proto: https' },
  { name: 'X-Real-IP', type: 'Request', category: 'Request Info', description: 'Contains the real IP address of the connecting client, typically set by proxies.', example: 'X-Real-IP: 203.0.113.195' },
  { name: 'X-Request-ID', type: 'Both', category: 'Request Info', description: 'Unique identifier for tracking a request through multiple systems (distributed tracing).', example: 'X-Request-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5' },
  // Response Info
  { name: 'Location', type: 'Response', category: 'Redirect', description: 'Indicates the URL to redirect to. Used with 3xx or 201 responses.', example: 'Location: https://example.com/new-page' },
  { name: 'Allow', type: 'Response', category: 'Response Info', description: 'Lists the HTTP methods supported for the URL. Sent with 405 Method Not Allowed.', example: 'Allow: GET, POST, HEAD' },
  { name: 'Server', type: 'Response', category: 'Response Info', description: 'Information about the server software. Often intentionally obscured for security.', example: 'Server: nginx/1.18.0' },
  { name: 'Date', type: 'Response', category: 'Response Info', description: 'The date and time at which the message was originated.', example: 'Date: Wed, 21 Oct 2023 07:28:00 GMT' },
  { name: 'Retry-After', type: 'Response', category: 'Response Info', description: 'Tells the client how long to wait before making a new request (429, 503 responses).', example: 'Retry-After: 120' },
  { name: 'Link', type: 'Response', category: 'Response Info', description: 'Provides hints to browsers about related resources, prefetch, and pagination links.', example: 'Link: </page/2>; rel="next", </page/1>; rel="prev"' },
  // Cookie
  { name: 'Cookie', type: 'Request', category: 'Cookie', description: 'Contains stored HTTP cookies previously sent by the server with Set-Cookie.', example: 'Cookie: session_id=abc123; user_pref=dark_mode' },
  { name: 'Set-Cookie', type: 'Response', category: 'Cookie', description: 'Sends cookies from the server to the user agent. Supports Secure, HttpOnly, SameSite attributes.', example: 'Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Strict' },
];

const CATEGORIES = ['All', ...Array.from(new Set(HEADERS.map(h => h.category))).sort()];
const TYPES: (HeaderType | 'All')[] = ['All', 'Request', 'Response', 'Both'];

const CATEGORY_COLORS: Record<string, string> = {
  Caching: '#f59e0b', Security: '#ef4444', Content: '#3b82f6', Auth: '#8b5cf6',
  CORS: '#06b6d4', Connection: '#22c55e', Redirect: '#f97316', 'Request Info': '#a78bfa',
  'Response Info': '#34d399', Cookie: '#fb923c', Encoding: '#60a5fa',
};

export default function HttpHeadersRefClient() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<HeaderType | 'All'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = HEADERS.filter(h => {
    if (typeFilter !== 'All' && h.type !== typeFilter) return false;
    if (categoryFilter !== 'All' && h.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q);
    }
    return true;
  });

  const typeColor = (t: HeaderType): string =>
    t === 'Request' ? '#60a5fa' : t === 'Response' ? '#34d399' : '#fbbf24';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search headers by name or description…"
          style={{ flex: 1, minWidth: 200, padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-input)', color: 'var(--text)', fontSize: '0.9rem', outline: 'none' }}
        />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as HeaderType | 'All')} style={{ padding: '0.45rem 0.65rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '0.45rem 0.65rem', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text)', fontSize: '0.85rem', cursor: 'pointer' }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        {filtered.length} header{filtered.length !== 1 ? 's' : ''} · click to expand
      </div>

      {/* Headers List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {filtered.map(h => {
          const isExpanded = expanded === h.name;
          const catColor = CATEGORY_COLORS[h.category] || '#888';
          return (
            <div
              key={h.name}
              onClick={() => setExpanded(isExpanded ? null : h.name)}
              style={{
                padding: '0.75rem 1rem', borderRadius: 8,
                border: `1px solid ${isExpanded ? 'var(--accent)' : 'var(--border)'}`,
                background: isExpanded ? 'var(--accent-subtle,rgba(129,140,248,0.08))' : 'var(--bg-elevated)',
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <code style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{h.name}</code>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: 4, color: typeColor(h.type), background: `${typeColor(h.type)}20` }}>{h.type}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.15rem 0.45rem', borderRadius: 4, color: catColor, background: `${catColor}20` }}>{h.category}</span>
                {!isExpanded && (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginLeft: '0.25rem', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {h.description}
                  </span>
                )}
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: 'auto', flexShrink: 0 }}>{isExpanded ? '▲' : '▼'}</span>
              </div>
              {isExpanded && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h.description}</p>
                  <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Example</div>
                    <code style={{ display: 'block', padding: '0.5rem 0.75rem', borderRadius: 6, background: 'var(--bg-overlay)', color: 'var(--accent-2,#a5b4fc)', fontFamily: 'monospace', fontSize: '0.82rem', wordBreak: 'break-all' }}>
                      {h.example}
                    </code>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            No headers match your search.
          </div>
        )}
      </div>
    </div>
  );
}
