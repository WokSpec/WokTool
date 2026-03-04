'use client';
import { useState } from 'react';

type ServerType = 'static' | 'proxy' | 'php' | 'node';
type SslType = 'letsencrypt' | 'custom' | 'none';

function generateNginxConfig(
  domain: string, serverType: ServerType, ssl: SslType, rootPath: string,
  proxyPass: string, gzip: boolean, rateLimit: boolean, securityHeaders: boolean, wwwRedirect: boolean
): string {
  const d = domain || 'example.com';
  const root = rootPath || '/var/www/html';
  const proxy = proxyPass || 'http://localhost:3000';
  let cfg = '';

  if (rateLimit) cfg += `# Rate limiting zone\nlimit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;\n\n`;

  if (wwwRedirect) {
    cfg += `server {\n    listen 80;\n    server_name www.${d};\n    return 301 $scheme://${d}$request_uri;\n}\n\n`;
    if (ssl !== 'none') {
      cfg += `server {\n    listen 443 ssl http2;\n    server_name www.${d};\n`;
      if (ssl === 'letsencrypt') {
        cfg += `    ssl_certificate /etc/letsencrypt/live/${d}/fullchain.pem;\n`;
        cfg += `    ssl_certificate_key /etc/letsencrypt/live/${d}/privkey.pem;\n`;
      }
      cfg += `    return 301 https://${d}$request_uri;\n}\n\n`;
    }
  }

  if (ssl !== 'none') {
    cfg += `server {\n    listen 80;\n    server_name ${d};\n    return 301 https://$host$request_uri;\n}\n\n`;
  }

  cfg += `server {\n`;
  if (ssl !== 'none') {
    cfg += `    listen 443 ssl http2;\n    listen [::]:443 ssl http2;\n`;
  } else {
    cfg += `    listen 80;\n    listen [::]:80;\n`;
  }
  cfg += `    server_name ${d};\n\n`;

  if (ssl === 'letsencrypt') {
    cfg += `    # SSL — Let's Encrypt\n`;
    cfg += `    ssl_certificate /etc/letsencrypt/live/${d}/fullchain.pem;\n`;
    cfg += `    ssl_certificate_key /etc/letsencrypt/live/${d}/privkey.pem;\n`;
    cfg += `    include /etc/letsencrypt/options-ssl-nginx.conf;\n`;
    cfg += `    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;\n\n`;
  } else if (ssl === 'custom') {
    cfg += `    # SSL — Custom Certificate\n`;
    cfg += `    ssl_certificate /etc/ssl/certs/${d}.crt;\n`;
    cfg += `    ssl_certificate_key /etc/ssl/private/${d}.key;\n`;
    cfg += `    ssl_protocols TLSv1.2 TLSv1.3;\n`;
    cfg += `    ssl_ciphers HIGH:!aNULL:!MD5;\n\n`;
  }

  if (gzip) {
    cfg += `    # Gzip compression\n`;
    cfg += `    gzip on;\n    gzip_vary on;\n    gzip_min_length 1000;\n`;
    cfg += `    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;\n\n`;
  }

  if (securityHeaders) {
    cfg += `    # Security headers\n`;
    cfg += `    add_header X-Frame-Options "SAMEORIGIN" always;\n`;
    cfg += `    add_header X-Content-Type-Options "nosniff" always;\n`;
    cfg += `    add_header X-XSS-Protection "1; mode=block" always;\n`;
    cfg += `    add_header Referrer-Policy "strict-origin-when-cross-origin" always;\n`;
    cfg += `    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;\n\n`;
  }

  if (rateLimit) {
    cfg += `    # Rate limiting\n    limit_req zone=one burst=20 nodelay;\n\n`;
  }

  if (serverType === 'static') {
    cfg += `    root ${root};\n    index index.html index.htm;\n\n`;
    cfg += `    location / {\n        try_files $uri $uri/ =404;\n    }\n\n`;
    cfg += `    # Cache static assets\n`;
    cfg += `    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|woff2)$ {\n`;
    cfg += `        expires 1y;\n        add_header Cache-Control "public, immutable";\n    }\n`;
  } else if (serverType === 'proxy') {
    cfg += `    location / {\n`;
    cfg += `        proxy_pass ${proxy};\n`;
    cfg += `        proxy_http_version 1.1;\n`;
    cfg += `        proxy_set_header Upgrade $http_upgrade;\n`;
    cfg += `        proxy_set_header Connection 'upgrade';\n`;
    cfg += `        proxy_set_header Host $host;\n`;
    cfg += `        proxy_set_header X-Real-IP $remote_addr;\n`;
    cfg += `        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n`;
    cfg += `        proxy_set_header X-Forwarded-Proto $scheme;\n`;
    cfg += `        proxy_cache_bypass $http_upgrade;\n    }\n`;
  } else if (serverType === 'php') {
    cfg += `    root ${root};\n    index index.php index.html;\n\n`;
    cfg += `    location / {\n        try_files $uri $uri/ /index.php?$query_string;\n    }\n\n`;
    cfg += `    location ~ \\.php$ {\n`;
    cfg += `        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;\n`;
    cfg += `        fastcgi_index index.php;\n`;
    cfg += `        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;\n`;
    cfg += `        include fastcgi_params;\n    }\n\n`;
    cfg += `    location ~ /\\.ht {\n        deny all;\n    }\n`;
  } else if (serverType === 'node') {
    cfg += `    location / {\n`;
    cfg += `        proxy_pass ${proxy};\n`;
    cfg += `        proxy_http_version 1.1;\n`;
    cfg += `        proxy_set_header Upgrade $http_upgrade;\n`;
    cfg += `        proxy_set_header Connection 'upgrade';\n`;
    cfg += `        proxy_set_header Host $host;\n`;
    cfg += `        proxy_cache_bypass $http_upgrade;\n    }\n`;
  }

  cfg += `}\n`;
  return cfg;
}

export default function NginxConfigClient() {
  const [domain, setDomain] = useState('example.com');
  const [serverType, setServerType] = useState<ServerType>('static');
  const [ssl, setSsl] = useState<SslType>('letsencrypt');
  const [rootPath, setRootPath] = useState('/var/www/html');
  const [proxyPass, setProxyPass] = useState('http://localhost:3000');
  const [gzip, setGzip] = useState(true);
  const [rateLimit, setRateLimit] = useState(false);
  const [securityHeaders, setSecurityHeaders] = useState(true);
  const [wwwRedirect, setWwwRedirect] = useState(true);
  const [copied, setCopied] = useState(false);

  const config = generateNginxConfig(domain, serverType, ssl, rootPath, proxyPass, gzip, rateLimit, securityHeaders, wwwRedirect);
  const copy = () => navigator.clipboard.writeText(config).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });

  const inputStyle: React.CSSProperties = {
    padding: '0.45rem 0.7rem', borderRadius: 6, border: '1px solid var(--border)',
    background: 'var(--bg-input)', color: 'var(--text)', fontSize: '0.875rem', width: '100%', outline: 'none',
  };
  const labelStyle: React.CSSProperties = {
    color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.25rem', display: 'block',
  };
  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.25rem' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
      {/* Form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Domain Name</label>
          <input value={domain} onChange={e => setDomain(e.target.value)} style={inputStyle} placeholder="example.com" />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Server Type</label>
          <select value={serverType} onChange={e => setServerType(e.target.value as ServerType)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="static">Static Site</option>
            <option value="proxy">Reverse Proxy</option>
            <option value="php">PHP (FastCGI)</option>
            <option value="node">Node.js App</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>SSL / HTTPS</label>
          <select value={ssl} onChange={e => setSsl(e.target.value as SslType)} style={{ ...inputStyle, cursor: 'pointer' }}>
            <option value="letsencrypt">Let&apos;s Encrypt (Certbot)</option>
            <option value="custom">Custom Certificate</option>
            <option value="none">No SSL (HTTP only)</option>
          </select>
        </div>
        {(serverType === 'static' || serverType === 'php') && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Root Path</label>
            <input value={rootPath} onChange={e => setRootPath(e.target.value)} style={inputStyle} placeholder="/var/www/html" />
          </div>
        )}
        {(serverType === 'proxy' || serverType === 'node') && (
          <div style={fieldStyle}>
            <label style={labelStyle}>Proxy Pass URL</label>
            <input value={proxyPass} onChange={e => setProxyPass(e.target.value)} style={inputStyle} placeholder="http://localhost:3000" />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Options</span>
          {([
            ['gzip', 'Gzip Compression', gzip, setGzip],
            ['rateLimit', 'Rate Limiting', rateLimit, setRateLimit],
            ['secHeaders', 'Security Headers', securityHeaders, setSecurityHeaders],
            ['wwwRedirect', 'WWW → Non-WWW Redirect', wwwRedirect, setWwwRedirect],
          ] as [string, string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]).map(([key, lbl, val, setter]) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <input type="checkbox" checked={val} onChange={e => setter(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              {lbl}
            </label>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>nginx.conf</span>
          <button onClick={copy} className="btn-secondary" style={{ padding: '0.3rem 0.75rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', border: '1px solid var(--border)' }}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <pre style={{ margin: 0, padding: '1rem', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'monospace', fontSize: '0.82rem', whiteSpace: 'pre', overflowX: 'auto', minHeight: 420 }}>
          {config}
        </pre>
      </div>
    </div>
  );
}
