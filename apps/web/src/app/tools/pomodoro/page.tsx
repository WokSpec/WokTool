import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
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
