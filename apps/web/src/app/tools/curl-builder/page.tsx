import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'cURL Command Builder — WokTool',
  description: 'Build cURL commands visually with headers, auth, body, and more.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="curl-builder" label="cURL Builder" description="Build cURL commands with a visual form. Live preview." icon="🌐">
      <Client />
    </ToolShell>
  );
}
