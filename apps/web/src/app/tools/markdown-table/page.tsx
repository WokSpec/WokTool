import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
export const metadata: Metadata = {
  title: 'Markdown Table Builder — WokTool',
  description: 'Visually build and export markdown tables. Import from CSV.',
};
export default function Page() {
  return (
    <ToolShell id="markdown-table" label="Markdown Table Builder" description="Visually build and export markdown tables. Import from CSV, align columns, live preview." icon="📊">
      <Client />
    </ToolShell>
  );
}
