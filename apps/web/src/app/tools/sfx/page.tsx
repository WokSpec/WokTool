import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'SFX & Sound Browser — WokTool',
  description: 'Search and preview thousands of free, CC0 sound effects for your projects.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="sfx" label="SFX Browser" description="Search 500k+ CC0 sound effects from the Freesound database. Find the perfect audio for your games or projects." icon="🔊">
      <Client />
    </ToolShell>
  );
}
