import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
export const metadata: Metadata = {
  title: 'Date Calculator — WokTool',
  description: 'Calculate age, date differences, add/subtract dates, and find ISO week numbers.',
};
export default function Page() {
  return (
    <ToolShell id="date-calculator" label="Date Calculator" description="Calculate age, date differences, add/subtract dates, and find ISO week numbers." icon="📅">
      <Client />
    </ToolShell>
  );
}
