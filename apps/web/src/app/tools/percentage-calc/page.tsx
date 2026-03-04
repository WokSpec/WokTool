import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
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
