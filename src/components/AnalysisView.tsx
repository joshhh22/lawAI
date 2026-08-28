'use client';

import React, { useState } from 'react';
import { CaseAnalysis } from '@/lib/types';
import LegalSourceCard from './LegalSourceCard';
import EvidenceQualityBadge from './EvidenceQualityBadge';
import { 
  Copy, 
  Check, 
  Share2, 
  Printer, 
  AlertTriangle, 
  HelpCircle, 
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Scale
} from 'lucide-react';
import Link from 'next/link';

interface AnalysisViewProps {
  analysis: CaseAnalysis;
  onReset?: () => void;
}

export default function AnalysisView({ analysis, onReset }: AnalysisViewProps) {
  const [copied, setCopied] = useState(false);
  const [reported, setReported] = useState(false);

  const handleCopyAll = () => {
    const fullText = `=== HUKUMAI ANALISIS HUKUM (${analysis.caseNumber}) ===
Domain: ${analysis.domain}
Isu: ${analysis.identifiedIssue}
Tanggal: ${new Date(analysis.createdAt).toLocaleDateString('id-ID')}

01 / RINGKASAN:
${analysis.summary}

02 / DASAR HUKUM:
${analysis.legalBases.map((b) => `- ${b.documentTitle} Pasal ${b.articleNumber}: "${b.content}"`).join('\n')}

03 / ANALISIS:
${analysis.analysis}

04 / LANGKAH YANG DAPAT DILAKUKAN:
${analysis.actionableSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

05 / KETIDAKPASTIAN & BATASAN:
${analysis.uncertainties.map((u) => `- ${u}`).join('\n')}

Sumber resmi: law.web.id (Diverifikasi berdasarkan Hukum Positif RI)`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `HukumAI - ${analysis.identifiedIssue}`,
        text: analysis.summary,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopyAll();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Editorial Case Banner */}
      <div className="bg-white swiss-border p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onReset && (
            <button
              onClick={onReset}
              className="p-2 swiss-border hover:bg-neutral-100 transition text-neutral-700"
              title="Kembali ke input kasus"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="editorial-meta font-bold text-[#c2410c]">
                {analysis.caseNumber}
              </span>
              <span className="text-neutral-400">•</span>
              <span className="editorial-meta text-neutral-600">
                {new Date(analysis.createdAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111215] mt-1">
              {analysis.identifiedIssue}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase swiss-border hover:bg-neutral-100 transition text-neutral-800"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Laporan'}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase swiss-border hover:bg-neutral-100 transition text-neutral-800"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan</span>
          </button>
          <button
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase swiss-border hover:bg-neutral-100 transition text-neutral-800"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak</span>
          </button>
        </div>
      </div>

      {/* 12-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Rail (4 Columns on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata Block */}
          <div className="bg-white swiss-border p-5 space-y-4">
            <div>
              <span className="editorial-meta block mb-1">DOMAIN HUKUM</span>
              <span className="text-sm font-bold font-mono text-[#111215] bg-neutral-100 px-2.5 py-1 inline-block">
                {analysis.domain}
              </span>
            </div>

            <div className="swiss-border-t pt-3">
              <span className="editorial-meta block mb-1">STATUS ANALISIS</span>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                <span>TERVERIFIKASI KORPUS RESMI</span>
              </div>
            </div>

            <div className="swiss-border-t pt-3">
              <span className="editorial-meta block mb-1">MODEL REASONING</span>
              <span className="text-xs font-mono text-neutral-600">
                Gemini 2.5 Flash + Google Grounding
              </span>
            </div>
          </div>

          {/* Evidence Audit Card */}
          <EvidenceQualityBadge evidence={analysis.evidence} />

          {/* Report Issue Button */}
          <div className="bg-[#fbfbfa] swiss-border p-4 text-xs font-mono text-neutral-600 space-y-2">
            <div className="flex items-center justify-between">
              <span>Menemukan kekeliruan kutipan?</span>
              <button
                onClick={() => setReported(true)}
                className="text-[#c2410c] hover:underline font-semibold cursor-pointer"
              >
                {reported ? 'Terima Kasih!' : 'Laporkan Kesalahan'}
              </button>
            </div>
            {reported && (
              <p className="text-[11px] text-emerald-700 font-mono">
                Laporan Anda telah dicatat untuk audit akurasi korpus.
              </p>
            )}
          </div>
        </div>

        {/* Main Content Editorial Flow (8 Columns on Desktop) */}
        <div className="lg:col-span-8 space-y-8">
          {/* 01 / RINGKASAN */}
          <section className="bg-white swiss-border p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 editorial-meta text-[#c2410c] swiss-border-b pb-2">
              <span>01</span>
              <span>/</span>
              <span>RINGKASAN EKSEKUTIF</span>
            </div>
            <p className="text-[16px] leading-relaxed text-[#111215] font-serif">
              {analysis.summary}
            </p>
          </section>

          {/* 02 / FAKTA YANG DIBERIKAN & 03 / YANG BELUM DIKETAHUI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-white swiss-border p-5 space-y-3">
              <div className="editorial-meta text-neutral-700 swiss-border-b pb-2 flex items-center justify-between">
                <span>02 / FAKTA DIBERIKAN</span>
                <span className="text-[10px] bg-neutral-100 px-1.5 py-0.5">USER INPUT</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-neutral-800 list-disc list-inside">
                {analysis.givenFacts.map((fact, idx) => (
                  <li key={idx} className="font-mono text-[12px]">{fact}</li>
                ))}
              </ul>
            </section>

            <section className="bg-[#fbfbfa] swiss-border p-5 space-y-3">
              <div className="editorial-meta text-neutral-700 swiss-border-b pb-2 flex items-center justify-between">
                <span>03 / YANG BELUM DIKETAHUI</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5">PERLU DIKLARIFIKASI</span>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-neutral-700 list-disc list-inside">
                {analysis.unknownFacts.map((fact, idx) => (
                  <li key={idx} className="font-mono text-[12px]">{fact}</li>
                ))}
              </ul>
            </section>
          </div>

          {/* 04 / DASAR HUKUM & CITATIONS */}
          <section className="space-y-4">
            <div className="flex items-center justify-between swiss-border-b pb-2">
              <div className="flex items-center gap-2 editorial-meta text-[#c2410c]">
                <span>04</span>
                <span>/</span>
                <span>DASAR HUKUM & PASAL TERKAIT</span>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                {analysis.legalBases.length} Regulasi Ditemukan
              </span>
            </div>

            {analysis.legalBases.length > 0 ? (
              analysis.legalBases.map((article, idx) => (
                <LegalSourceCard key={article.id || idx} article={article} index={idx} />
              ))
            ) : (
              <div className="bg-amber-50 swiss-border border-amber-300 p-4 text-xs font-mono text-amber-900">
                Dasar hukum spesifik belum ditemukan dalam korpus lokal. Merujuk pada asas hukum umum.
              </div>
            )}
          </section>

          {/* 05 / ANALISIS HUKUM */}
          <section className="bg-white swiss-border p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 editorial-meta text-[#c2410c] swiss-border-b pb-2">
              <span>05</span>
              <span>/</span>
              <span>ANALISIS SUBSTANSI HUKUM</span>
            </div>
            <div className="text-[15px] leading-relaxed text-neutral-900 whitespace-pre-line space-y-3 font-sans">
              {analysis.analysis}
            </div>
          </section>

          {/* 06 / YANG DAPAT DILAKUKAN */}
          <section className="bg-white swiss-border p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 editorial-meta text-[#c2410c] swiss-border-b pb-2">
              <span>06</span>
              <span>/</span>
              <span>LANGKAH PRAKTIS YANG DAPAT DILAKUKAN</span>
            </div>
            <div className="space-y-3">
              {analysis.actionableSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-[#fbfbfa] swiss-border">
                  <span className="editorial-number text-sm text-[#c2410c] font-mono px-2 py-0.5 bg-white border border-neutral-300">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-mono">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 07 / KETIDAKPASTIAN & BATASAN */}
          <section className="bg-neutral-50 swiss-border p-5 space-y-3">
            <div className="flex items-center gap-2 editorial-meta text-neutral-800 swiss-border-b pb-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>07 / KETIDAKPASTIAN & FAKTOR PERUBAHAN HUKUM</span>
            </div>
            <ul className="space-y-2 text-xs font-mono text-neutral-700 list-disc list-inside leading-relaxed">
              {analysis.uncertainties.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* 08 / PERTANYAAN LANJUTAN (FOLLOW-UP) */}
          {analysis.followUpQuestions && analysis.followUpQuestions.length > 0 && (
            <section className="bg-white swiss-border p-5 space-y-3">
              <div className="flex items-center gap-2 editorial-meta text-[#1e3a8a] swiss-border-b pb-2">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>08 / PERTANYAAN KLARIFIKASI LANJUTAN</span>
              </div>
              <p className="text-xs text-neutral-600 font-mono">
                Agar analisis lebih tepat dan presisi, klarifikasi terhadap pertanyaan berikut akan sangat membantu:
              </p>
              <div className="space-y-2">
                {analysis.followUpQuestions.map((q, idx) => (
                  <div key={idx} className="text-xs font-mono bg-[#f9f9f6] p-2.5 border border-neutral-200 text-neutral-800">
                    ❓ {q}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 09 / LIVE GROUNDING SOURCES (IF ANY) */}
          {analysis.groundingSources && analysis.groundingSources.length > 0 && (
            <section className="bg-white swiss-border p-5 space-y-3">
              <div className="editorial-meta text-neutral-800 swiss-border-b pb-2">
                <span>09 / RUJUKAN DOKUMEN WEB TERVERIFIKASI (GOOGLE SEARCH GROUNDING)</span>
              </div>
              <div className="space-y-2">
                {analysis.groundingSources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 swiss-border hover:bg-neutral-50 transition text-xs font-mono text-neutral-800"
                  >
                    <span className="font-semibold truncate mr-2">{src.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
