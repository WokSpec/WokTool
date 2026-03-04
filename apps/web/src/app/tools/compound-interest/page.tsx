import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Compound Interest Calculator — WokTool',
  description: 'Calculate compound interest with year-by-year breakdown. Compare simple vs compound. Visual growth chart.',
  openGraph: { title: 'Compound Interest Calculator — WokTool', description: 'Calculate compound interest with year-by-year breakdown.', type: 'website' },
};
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="compound-interest" label="Compound Interest Calculator" description="Calculate final amount, total interest, and yearly breakdown. Supports monthly contributions. Visual bar chart." icon="💰">
      <Client />
    </ToolShell>
  );
}
