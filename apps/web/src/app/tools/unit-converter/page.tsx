import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';
import Client from './_client';
export const metadata: Metadata = {
  title: 'Unit Converter — WokTool',
  description: 'Convert between units of length, weight, temperature, speed, area, volume, time, data, pressure, and energy.',
};
export default function Page() {
  return (
    <ToolShell id="unit-converter" label="Unit Converter" description="Convert between units of length, weight, temperature, speed, area, volume, time, data, pressure, and energy." icon="📏">
      <Client />
    </ToolShell>
  );
}
