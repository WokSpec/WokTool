import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'JSON Schema Generator — WokTool',
  description: 'Generate JSON Schema (draft-07) from any JSON sample automatically.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="json-schema" label="JSON Schema Generator" description="Paste any JSON to auto-generate a JSON Schema (draft-07). Infers types, required fields, and more." icon="📐">
      <Client />
    </ToolShell>
  );
}
