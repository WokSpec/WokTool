import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
export const metadata: Metadata = {
  title: 'Pomodoro Timer — WokTool',
  description: 'Focus timer with work sessions, short/long breaks, audio notifications, and session history.',
};
export default function Page() {
  return (
    <ToolShell id="pomodoro" label="Pomodoro Timer" description="Focus timer with work sessions, short/long breaks, audio notifications, and session history." icon="⏱️">
      <Client />
    </ToolShell>
  );
}
