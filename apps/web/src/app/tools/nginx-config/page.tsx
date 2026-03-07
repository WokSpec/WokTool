import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Nginx Config Generator — WokTool',
  description: 'Generate complete nginx server block configuration for your use case.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="nginx-config" label="Nginx Config Generator" description="Generate complete nginx.conf server blocks for static sites, reverse proxies, PHP, and Node.js." icon="⚙️">
      <Client />
    </ToolShell>
  );
}
