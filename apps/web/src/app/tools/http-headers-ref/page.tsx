import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'HTTP Headers Reference — WokTool',
  description: 'Searchable reference of all common HTTP request and response headers.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="http-headers-ref" label="HTTP Headers Reference" description="Searchable reference of all common HTTP headers with descriptions, examples, and categories." icon="📡">
      <Client />
    </ToolShell>
  );
}
