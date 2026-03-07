import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Docker Run Builder — WokTool',
  description: 'Build docker run commands visually with port mappings, volumes, env vars, and more.',
};

import Client from './_client';

export default function Page() {
  return (
    <ToolShell id="docker-gen" label="Docker Run Builder" description="Build docker run commands visually. Live preview of the generated command." icon="🐳">
      <Client />
    </ToolShell>
  );
}
