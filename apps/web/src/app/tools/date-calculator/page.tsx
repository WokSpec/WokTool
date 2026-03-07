import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
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
