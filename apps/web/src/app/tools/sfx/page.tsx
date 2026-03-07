import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'SFX & Sound Browser — WokTool',
  description: 'Search and preview thousands of free, CC0 sound effects for your projects.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="sfx" label="SFX Browser" description="Search 500k+ CC0 sound effects from the Freesound database. Find the perfect audio for your games or projects." icon="🔊">
      <Client />
    </ToolShell>
  );
}
