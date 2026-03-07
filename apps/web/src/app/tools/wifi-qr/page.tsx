import type { Metadata } from 'next';
import ToolShell from '@/components/tools/ToolShell';

export const metadata: Metadata = {
  title: 'WiFi QR Configurator — WokTool',
  description: 'Generate customized high-fidelity WiFi QR codes for instant network connectivity.',
};

import Client from '@/components/tools/WifiQrTool';

export default function Page() {
  return (
    <ToolShell
      id="wifi-qr"
      label="WiFi QR Configurator"
      description="Professional-grade wireless network onboarding utility. Generate high-resolution, branded matrix codes for seamless broadcast discovery."
      icon="Wifi"
    >
      <Client />
    </ToolShell>
  );
}
