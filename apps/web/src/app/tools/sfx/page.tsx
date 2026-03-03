import type { Metadata } from 'next';
import { SfxClient } from './_client';

export const metadata: Metadata = {
  title: 'SFX Library — WokTool',
  description: 'Search 600K+ CC-licensed sound effects from Freesound.org. Browse, preview and download sounds.',
};

export default function SfxPage() {
  return <SfxClient />;
}
