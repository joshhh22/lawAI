import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'HukumAI · law.web.id | Asisten & Pencarian Hukum Indonesia',
  description: 'Pahami hukum Indonesia dan temukan dasar hukumnya dengan AI berbasis korpus resmi JDIHN, BPK, Peraturan.go.id, Mahkamah Agung, dan MK.',
  keywords: ['hukum indonesia', 'undang-undang', 'pasal kuhp', 'uu cipta kerja', 'uu ite', 'uu pdp', 'konsultasi hukum ai', 'jdihn'],
  authors: [{ name: 'HukumAI Team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="h-screen w-screen overflow-hidden bg-[#fbfbfa] text-[#111215] selection:bg-[#c2410c] selection:text-white">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
