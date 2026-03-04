import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'IP Lookup — WokTool',
  description: 'Look up IP address geolocation, ISP, timezone, and ASN information.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="ip-lookup" label="IP Lookup" description="Look up any IP address. Geolocation, ISP, timezone, ASN, and more. Fetches from your browser." icon="🔍">
      <Client />
    </ToolShell>
  );
}
