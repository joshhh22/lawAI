import React from 'react';
import Link from 'next/link';
import { ExternalLink, ShieldCheck, Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111215] text-[#d4d2cb] swiss-border-t mt-20">
      {/* Editorial Grid Sources Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 swiss-border-b border-neutral-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <span className="editorial-meta text-[#c2410c] block mb-2">01 / PORTAL SUMBER RESMI</span>
            <h4 className="text-white font-bold text-base tracking-tight mb-2">
              Jaringan Dokumentasi & Informasi Hukum
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              CekHukum merujuk langsung ke basis data regulasi dan putusan resmi kementerian & lembaga peradilan Indonesia.
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <span className="editorial-meta text-neutral-400 block mb-2">JARINGAN NASIONAL</span>
            <a 
              href="https://jdihn.go.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              <span>JDIHN Nasional</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
            <a 
              href="https://peraturan.bpk.go.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              <span>Database Peraturan BPK RI</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
            <a 
              href="https://peraturan.go.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              <span>Peraturan.go.id (Kemenkum)</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <span className="editorial-meta text-neutral-400 block mb-2">LEMBAGA PERADILAN</span>
            <a 
              href="https://jdih.mahkamahagung.go.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              <span>JDIH Mahkamah Agung RI</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
            <a 
              href="https://mkri.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              <span>Mahkamah Konstitusi RI</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
            <a 
              href="https://putusan3.mahkamahagung.go.id" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-between text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              <span>Direktori Putusan MA RI</span>
              <ExternalLink className="w-3 h-3 text-neutral-500" />
            </a>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <span className="editorial-meta text-neutral-400 block mb-2">ETIKA & NAVIGASI</span>
            <Link 
              href="/disclaimer" 
              className="block text-neutral-300 hover:text-amber-400 transition py-1 border-b border-neutral-800"
            >
              Peringatan & Batasan AI
            </Link>
            <Link 
              href="/regulations" 
              className="block text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              Katalog Regulasi
            </Link>
            <Link 
              href="/search" 
              className="block text-neutral-300 hover:text-white transition py-1 border-b border-neutral-800"
            >
              Pencarian Pasal
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Legal Disclaimer Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs font-mono text-neutral-500">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-neutral-400" />
          <span>
            CEKHUKUM (cekhukum.web.id) · Bukan pengganti nasihat hukum advokat profesional.
          </span>
        </div>
        <div>
          <span>Diverifikasi berdasarkan Hukum Positif Republik Indonesia.</span>
        </div>
      </div>
    </footer>
  );
}
