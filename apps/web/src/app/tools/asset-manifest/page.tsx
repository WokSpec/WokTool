import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'Asset Manifest Builder — WokTool',
  description: 'Generate Phaser/Pixi/Unity-compatible asset manifests.',
};

import Client from '@/components/tools/AssetManifestTool';

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
