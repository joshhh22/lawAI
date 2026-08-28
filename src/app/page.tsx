'use client';

import React, { useState } from 'react';
import LegalChatInterface from '@/components/LegalChatInterface';
import CaseInput from '@/components/CaseInput';
import AnalysisView from '@/components/AnalysisView';
import EditorialLoader from '@/components/EditorialLoader';
import { CaseAnalysis } from '@/lib/types';
import { 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Scale, 
  ArrowRight, 
  Search, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [activeView, setActiveView] = useState<'chat' | 'document'>('chat');
  const [documentAnalysis, setDocumentAnalysis] = useState<CaseAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSwitchToDoc = (analysis: CaseAnalysis) => {
    setDocumentAnalysis(analysis);
    setActiveView('document');
    setTimeout(() => {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }, 100);
  };

  const handleDocumentAnalyze = async (caseText: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setDocumentAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseText }),
      });

      if (!response.ok) {
        throw new Error('Gagal menganalisis persoalan hukum.');
      }

      const data: CaseAnalysis = await response.json();
      setDocumentAnalysis(data);

      setTimeout(() => {
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-16">
      {/* Editorial Hero Header */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="editorial-meta text-[#c2410c] font-bold">
            01 / SISTEM INFORMASI & KONSULTASI HUKUM DIGITAL
          </span>
          <span className="text-neutral-300">•</span>
          <span className="editorial-meta text-neutral-500">
            HUKUM POSITIF INDONESIA
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 swiss-border-b pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111215] uppercase leading-tight">
              Pahami Hukum.<br />
              <span className="font-serif italic font-normal text-neutral-800">Temukan Dasarnya.</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 font-mono pt-1 max-w-xl">
              Asisten AI konsultasi hukum Indonesia berbasis naskah peraturan pemerintah dan rujukan pasal resmi JDIH.
            </p>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-2 bg-[#f4f3ef] p-1 swiss-border self-start md:self-auto">
            <button
              onClick={() => setActiveView('chat')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                activeView === 'chat'
                  ? 'bg-[#111215] text-white shadow-xs'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mode Chat AI</span>
            </button>

            <button
              onClick={() => setActiveView('document')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-bold transition cursor-pointer ${
                activeView === 'document'
                  ? 'bg-[#111215] text-white shadow-xs'
                  : 'text-neutral-700 hover:text-black'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Mode Laporan 12-Kolom</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Interface (Chat vs Document View) */}
      <section className="min-h-[600px]">
        {activeView === 'chat' ? (
          <LegalChatInterface onSwitchToDocumentView={handleSwitchToDoc} />
        ) : (
          <div className="space-y-8">
            <CaseInput onAnalyze={handleDocumentAnalyze} isLoading={isLoading} />

            {errorMessage && (
              <div className="p-4 bg-red-50 swiss-border border-red-300 text-red-900 text-xs font-mono">
                <strong>Terjadi Kendala:</strong> {errorMessage}
              </div>
            )}

            {isLoading && <EditorialLoader />}

            {documentAnalysis && (
              <AnalysisView 
                analysis={documentAnalysis} 
                onReset={() => setDocumentAnalysis(null)} 
              />
            )}
          </div>
        )}
      </section>

      {/* 3 Core Editorial Principles (PRD Section 10) */}
      <section className="swiss-border-t pt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 bg-white swiss-border p-6">
            <span className="editorial-number text-2xl text-[#c2410c] block">
              01
            </span>
            <h3 className="font-bold text-sm uppercase tracking-wider font-mono text-[#111215]">
              BERBASIS SUMBER RESMI
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              HukumAI tidak mengarang pasal. Jawaban dihasilkan berdasarkan rujukan korpus peraturan resmi pemerintah (JDIH, Peraturan.go.id, BPK, MA).
            </p>
          </div>

          <div className="space-y-3 bg-white swiss-border p-6">
            <span className="editorial-number text-2xl text-[#c2410c] block">
              02
            </span>
            <h3 className="font-bold text-sm uppercase tracking-wider font-mono text-[#111215]">
              DAPAT DIVERIFIKASI
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Setiap klaim substansi hukum dilengkapi kartu rujukan pasal asli, status keberlakuan peraturan (aktif/diubah), dan tautan langsung ke naskah asli.
            </p>
          </div>

          <div className="space-y-3 bg-white swiss-border p-6">
            <span className="editorial-number text-2xl text-[#c2410c] block">
              03
            </span>
            <h3 className="font-bold text-sm uppercase tracking-wider font-mono text-[#111215]">
              BAHASA MANUSIA
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-mono">
              Menerjemahkan kerumitan pasal perundang-undangan dan istilah hukum teknis ke dalam penjelasan yang lugas, terstruktur, dan mudah dimengerti.
            </p>
          </div>
        </div>
      </section>

      {/* Official Supported Sources Strip */}
      <section className="bg-[#111215] text-white p-6 sm:p-8 swiss-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="editorial-meta text-[#c2410c] block mb-1">
              DATABASE DOKUMEN HUKUM
            </span>
            <h3 className="text-lg font-bold tracking-tight">
              Terhubung dengan Jaringan Regulasi Nasional
            </h3>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Mencakup UU Cipta Kerja, KUHP Nasional, UU ITE Revisi, UU Perlindungan Data Pribadi, KUHPerdata, dan PP teknis.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/search"
              className="px-4 py-2.5 bg-white text-black hover:bg-[#c2410c] hover:text-white transition text-xs font-mono uppercase font-bold flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari Database Pasal</span>
            </Link>
            <Link
              href="/regulations"
              className="px-4 py-2.5 swiss-border border-neutral-700 text-white hover:bg-neutral-800 transition text-xs font-mono uppercase font-bold flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Katalog Regulasi</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Domain Modules */}
      <section className="space-y-6">
        <div className="flex items-center justify-between swiss-border-b pb-3">
          <div className="flex items-center gap-2 editorial-meta text-neutral-900">
            <span>02</span>
            <span>/</span>
            <span>EKSPLORASI BIDANG HUKUM POPULER</span>
          </div>
          <Link href="/regulations" className="text-xs font-mono text-[#c2410c] hover:underline flex items-center gap-1">
            <span>Lihat Semua</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white swiss-border p-5 space-y-2 hover:border-black transition">
            <span className="editorial-meta text-neutral-500 block">KETENAGAKERJAAN</span>
            <h4 className="font-bold text-sm text-[#111215]">
              UU Cipta Kerja & PP 35/2021
            </h4>
            <p className="text-xs text-neutral-600 font-mono">
              Aturan kompensasi PKWT, pesangon PHK, hak cuti, waktu kerja, dan larangan penahanan ijazah sepihak.
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2 hover:border-black transition">
            <span className="editorial-meta text-neutral-500 block">DIGITAL & ITE</span>
            <h4 className="font-bold text-sm text-[#111215]">
              UU No. 1/2024 (Revisi UU ITE)
            </h4>
            <p className="text-xs text-neutral-600 font-mono">
              Pasal 27A pencemaran nama baik digital, delik aduan, hoaks online, dan batasan kritik di media sosial.
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2 hover:border-black transition">
            <span className="editorial-meta text-neutral-500 block">PRIVASI & DATA</span>
            <h4 className="font-bold text-sm text-[#111215]">
              UU No. 27/2022 (UU PDP)
            </h4>
            <p className="text-xs text-neutral-600 font-mono">
              Perlindungan kebocoran data pribadi, larangan doxxing, dan sanksi teror pinjol sebar kontak darurat.
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2 hover:border-black transition">
            <span className="editorial-meta text-neutral-500 block">PERDATA & KONTRAK</span>
            <h4 className="font-bold text-sm text-[#111215]">
              KUHPerdata (Burgerlijk Wetboek)
            </h4>
            <p className="text-xs text-neutral-600 font-mono">
              Syarat sah perjanjian (Pasal 1320), wanprestasi (Pasal 1243), dan perbuatan melawan hukum PMH (Pasal 1365).
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2 hover:border-black transition">
            <span className="editorial-meta text-neutral-500 block">KONSUMEN & BISNIS</span>
            <h4 className="font-bold text-sm text-[#111215]">
              UU No. 8/1999 Perlindungan Konsumen
            </h4>
            <p className="text-xs text-neutral-600 font-mono">
              Larangan klausula baku sepihak "barang tidak dapat dikembalikan" dan hak ganti rugi barang cacat.
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2 hover:border-black transition">
            <span className="editorial-meta text-neutral-500 block">PIDANA UMUM</span>
            <h4 className="font-bold text-sm text-[#111215]">
              KUHP (Wetboek van Strafrecht)
            </h4>
            <p className="text-xs text-neutral-600 font-mono">
              Pasal 378 penipuan, Pasal 372 penggelapan, Pasal 368 pemerasan, dan ketentuan KUHP Nasional UU 1/2023.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
