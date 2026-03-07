import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'DNS Lookup — WokTool',
  description: 'Look up DNS records via DNS-over-HTTPS (Cloudflare). A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, CAA records.',
  openGraph: { title: 'DNS Lookup — WokTool', description: 'Look up DNS records via DNS-over-HTTPS (A, MX, TXT, etc.).', type: 'website' },
};
import ToolShell from '@/components/tools/ToolShell';

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="dns-lookup" label="DNS Lookup" description="Query DNS records via Cloudflare DoH. A, AAAA, CNAME, MX, TXT, NS, SOA, PTR, CAA. Multi-record query." icon="🌐">
      <Client />
    </ToolShell>
  );
}
