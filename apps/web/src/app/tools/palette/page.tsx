import type { Metadata } from 'next';
import { PaletteClient } from './_client';

export const metadata: Metadata = {
  title: 'Color Palette Generator — WokTool',
  description: 'Generate harmonious color palettes from a base color. Export as CSS variables, JSON, or Tailwind config.',
};

export default function PalettePage() {
  return <PaletteClient />;
}
