import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Asset Manifest Builder — WokTool',
  description: 'Generate Phaser/Pixi/Unity-compatible asset manifests.',
};

const Client = dynamic(() => import('@/components/tools/AssetManifestTool'), { ssr: false });

export default function Page() {
  return (
    <ToolShell
      id="asset-manifest"
      label="Asset Manifest Builder"
      description="Generate Phaser/Pixi/Unity-compatible asset manifests."
      icon="JSN"
    >
      <Client />
    </ToolShell>
  );
}
