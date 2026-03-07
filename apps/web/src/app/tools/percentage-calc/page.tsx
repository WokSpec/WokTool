import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
export const metadata: Metadata = {
  title: 'Percentage Calculator — WokTool',
  description: 'Percentage calculations, tip calculator, percentage change, and more.',
};
export default function Page() {
  return (
    <ToolShell id="percentage-calc" label="Percentage Calculator" description="Percentage calculations, tip calculator, percentage change, and more." icon="💯">
      <Client />
    </ToolShell>
  );
}
