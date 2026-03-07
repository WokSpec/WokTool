import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Nav from '@/components/Nav';
import './globals.css';
import 'tldraw/tldraw.css';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'WokTool — Professional Engineering Utilities',
    template: '%s | WokTool',
  },
  description:
    'High-fidelity, browser-native developer tools. Open source, private, and engineered for performance.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://tools.wokspec.org'),
  openGraph: {
    siteName: 'WokTool',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased selection:bg-accent/30 selection:text-white`}>
        <Nav />
        {children}
      </body>
    </html>
  );
}
