import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'ENV File Formatter — WokTool',
  description: 'Format, validate, and convert .env files in your browser.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="env-formatter" label="ENV File Formatter" description="Format, validate, extract keys, and convert .env files. All client-side." icon="📄">
      <Client />
    </ToolShell>
  );
}
