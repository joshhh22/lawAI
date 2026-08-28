'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, AlertCircle, Scale, Menu, X, Code2 } from 'lucide-react';
import DisclaimerModal from './DisclaimerModal';

export default function Header() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <DisclaimerModal 
        forceOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />

      {/* Top Editorial Metadata Strip */}
      <div className="bg-[#111215] text-[#d4d2cb] text-[11px] font-mono uppercase tracking-widest px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between gap-2 swiss-border-b">
        <div className="flex items-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>REPUBLIK INDONESIA · SISTEM INFORMASI HUKUM DIGITAL</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-neutral-400">
          <span>SUMBER: JDIHN · BPK · PERATURAN.GO.ID · MA · MK</span>
          <span>•</span>
          <span>MODEL: GEMINI 3.6 FLASH</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-[#fbfbfa] swiss-border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-4">
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#111215] text-white flex items-center justify-center font-bold text-lg tracking-tighter group-hover:bg-[#c2410c] transition">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[#111215] group-hover:text-[#c2410c] transition">
                  HUKUMAI
                </span>
                <span className="editorial-meta bg-neutral-200 text-neutral-800 px-1.5 py-0.5 text-[9px] font-semibold">
                  cekhukum.web.id
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 font-mono tracking-tight hidden sm:block">
                Pahami hukum. Temukan dasar hukumnya.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-mono uppercase tracking-wider text-neutral-700">
            <Link href="/" className="hover:text-[#c2410c] transition py-1">
              01 / Analisis Kasus
            </Link>
            <Link href="/search" className="hover:text-[#c2410c] transition py-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              02 / Cari Regulasi
            </Link>
            <Link href="/regulations" className="hover:text-[#c2410c] transition py-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              03 / Katalog Hukum
            </Link>
            <button
              onClick={() => setShowDisclaimer(true)}
              className="hover:text-[#c2410c] transition py-1 flex items-center gap-1.5 text-neutral-600 hover:underline cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              Batasan AI
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="https://github.com/joshhh22/lawAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider swiss-border hover:bg-white transition text-neutral-800"
            >
              <Code2 className="w-3.5 h-3.5 text-neutral-600" />
              <span>GitHub</span>
            </a>
            <Link
              href="/search"
              className="px-4 py-2 bg-[#111215] text-[#fbfbfa] text-xs font-mono uppercase tracking-wider hover:bg-[#c2410c] transition"
            >
              Pencarian
            </Link>
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-800 hover:text-black"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden swiss-border-t bg-[#fbfbfa] px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono uppercase py-2 px-2 hover:bg-neutral-100"
            >
              01 / Analisis Kasus
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono uppercase py-2 px-2 hover:bg-neutral-100"
            >
              02 / Cari Regulasi
            </Link>
            <Link
              href="/regulations"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-mono uppercase py-2 px-2 hover:bg-neutral-100"
            >
              03 / Katalog Hukum
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowDisclaimer(true);
              }}
              className="w-full text-left text-sm font-mono uppercase py-2 px-2 text-amber-700 hover:bg-amber-50 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Peringatan & Batasan AI
            </button>
            <div className="pt-2 swiss-border-t flex gap-2">
              <a
                href="https://github.com/joshhh22/lawAI"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono uppercase swiss-border bg-white"
              >
                <Code2 className="w-4 h-4 text-neutral-600" />
                GitHub Repository
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
