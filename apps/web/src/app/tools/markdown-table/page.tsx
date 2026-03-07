import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
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
