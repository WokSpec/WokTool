import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'YAML / JSON / TOML Converter — WokTool',
  description: 'Convert between YAML, JSON, and TOML formats in your browser.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="yaml-json" label="YAML / JSON / TOML Converter" description="Convert between YAML, JSON, and TOML formats. All client-side." icon="🔄">
      <Client />
    </ToolShell>
  );
}
