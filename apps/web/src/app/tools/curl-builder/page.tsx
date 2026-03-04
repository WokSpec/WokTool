import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'cURL Command Builder — WokTool',
  description: 'Build cURL commands visually with headers, auth, body, and more.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="curl-builder" label="cURL Builder" description="Build cURL commands with a visual form. Live preview." icon="🌐">
      <Client />
    </ToolShell>
  );
}
