import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'HMAC Generator — WokTool',
  description: 'Generate and verify HMAC signatures using SHA-1, SHA-256, SHA-384, SHA-512. Web Crypto API, all in-browser.',
  openGraph: { title: 'HMAC Generator — WokTool', description: 'Generate and verify HMAC signatures with SHA-256/512.', type: 'website' },
};
import ToolShell from '@/components/tools/ToolShell';

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="hmac-gen" label="HMAC Generator" description="Generate and verify HMAC signatures with SHA-1/256/384/512. Hex and base64 output." icon="🔑">
      <Client />
    </ToolShell>
  );
}
