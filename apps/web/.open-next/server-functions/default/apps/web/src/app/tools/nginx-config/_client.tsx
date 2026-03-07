'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import CodeBlock from '@/components/ui/CodeBlock';
import Switch from '@/components/ui/Switch';

type ServerType = 'static' | 'proxy' | 'php' | 'node';
type SslType = 'letsencrypt' | 'custom' | 'none';

function generateNginxConfig(opts: any): string {
  const { domain, serverType, ssl, rootPath, proxyPass, gzip, rateLimit, securityHeaders, wwwRedirect } = opts;
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
  } else if (serverType === 'proxy' || serverType === 'node') {
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

  const config = useMemo(() => generateNginxConfig({
    domain, serverType, ssl, rootPath, proxyPass, gzip, rateLimit, securityHeaders, wwwRedirect
  }), [domain, serverType, ssl, rootPath, proxyPass, gzip, rateLimit, securityHeaders, wwwRedirect]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Configuration */}
        <div className="space-y-6">
            <Card title="Server Details">
                <div className="space-y-4">
                    <Input label="Domain Name" value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" />
                    <Select 
                        label="Server Type"
                        value={serverType}
                        onChange={e => setServerType(e.target.value as ServerType)}
                        options={[
                            { value: 'static', label: 'Static Site' },
                            { value: 'proxy', label: 'Reverse Proxy' },
                            { value: 'php', label: 'PHP (FastCGI)' },
                            { value: 'node', label: 'Node.js App' },
                        ]}
                    />
                    <Select 
                        label="SSL / HTTPS"
                        value={ssl}
                        onChange={e => setSsl(e.target.value as SslType)}
                        options={[
                            { value: 'letsencrypt', label: "Let's Encrypt (Certbot)" },
                            { value: 'custom', label: 'Custom Certificate' },
                            { value: 'none', label: 'No SSL (HTTP only)' },
                        ]}
                    />
                </div>
            </Card>

            {(serverType === 'static' || serverType === 'php') && (
                <Card title="Path Settings">
                    <Input label="Root Path" value={rootPath} onChange={e => setRootPath(e.target.value)} placeholder="/var/www/html" />
                </Card>
            )}

            {(serverType === 'proxy' || serverType === 'node') && (
                <Card title="Proxy Settings">
                    <Input label="Proxy Pass URL" value={proxyPass} onChange={e => setProxyPass(e.target.value)} placeholder="http://localhost:3000" />
                </Card>
            )}

            <Card title="Optimization & Security">
                <div className="space-y-4">
                    <Switch label="Gzip Compression" checked={gzip} onChange={setGzip} />
                    <Switch label="Security Headers" checked={securityHeaders} onChange={setSecurityHeaders} />
                    <Switch label="Rate Limiting" checked={rateLimit} onChange={setRateLimit} />
                    <Switch label="WWW Redirect" checked={wwwRedirect} onChange={setWwwRedirect} />
                </div>
            </Card>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Generated nginx.conf</h3>
                <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(config)} className="h-7 text-[10px]">Copy Config</Button>
            </div>
            
            <CodeBlock 
                code={config} 
                language="nginx" 
                maxHeight="600px" 
            />

            <div className="p-6 rounded-3xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 font-bold">
                    !
                </div>
                <p className="text-xs text-white/40 leading-relaxed">
                    This tool generates a standard server block. Ensure you have <code>nginx</code> installed and place this configuration in your <code>/etc/nginx/sites-available/</code> directory.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
