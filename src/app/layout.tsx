import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      <body className="min-h-screen flex flex-col bg-[#fbfbfa] text-[#111215] selection:bg-[#c2410c] selection:text-white">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
