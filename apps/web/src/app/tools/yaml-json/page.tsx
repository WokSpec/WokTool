import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'YAML / JSON / TOML Converter — WokTool',
  description: 'Convert between YAML, JSON, and TOML formats in your browser.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="yaml-json" label="YAML / JSON / TOML Converter" description="Convert between YAML, JSON, and TOML formats. All client-side." icon="🔄">
      <Client />
    </ToolShell>
  );
}
