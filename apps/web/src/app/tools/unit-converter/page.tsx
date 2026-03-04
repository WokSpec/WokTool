import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ToolShell from '@/components/tools/ToolShell';
const Client = dynamic(() => import('./_client'), { ssr: false });
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
