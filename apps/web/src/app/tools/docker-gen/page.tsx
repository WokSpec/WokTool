import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Docker Run Builder — WokTool',
  description: 'Build docker run commands visually with port mappings, volumes, env vars, and more.',
};

const Client = dynamic(() => import('./_client'), { ssr: false });

export default function Page() {
  return (
    <ToolShell id="docker-gen" label="Docker Run Builder" description="Build docker run commands visually. Live preview of the generated command." icon="🐳">
      <Client />
    </ToolShell>
  );
}
