'use client';

import React from 'react';
import { LEGAL_DOCUMENTS } from '@/data/legalCorpus';
import { BookOpen, ExternalLink, ShieldCheck, Scale, FileText } from 'lucide-react';
import Link from 'next/link';

export default function RegulationsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 swiss-border-b pb-6">
        <div className="flex items-center gap-2 editorial-meta text-[#c2410c]">
          <BookOpen className="w-3.5 h-3.5" />
          <span>03 / DIREKTORI REGULASI HUKUM POSITIF RI</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#111215]">
          Katalog Perundang-Undangan Terverifikasi
        </h1>
        <p className="text-sm font-mono text-neutral-600 max-w-2xl">
          Kumpulan naskah undang-undang, kitab hukum, dan peraturan pemerintah yang telah terindeks secara struktural per pasal dalam basis data HukumAI.
        </p>
      </div>

      {/* Regulations Grid */}
      <div className="space-y-8">
        {LEGAL_DOCUMENTS.map((doc, idx) => (
          <div key={doc.id} className="bg-white swiss-border p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 swiss-border-b pb-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="editorial-meta font-bold text-[#c2410c]">
                    REGULASI / {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono bg-neutral-100 text-neutral-800 px-2 py-0.5 font-semibold">
                    {doc.domain}
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#111215] tracking-tight">
                  {doc.title}
                </h2>
                <span className="text-xs font-mono text-neutral-500 block mt-1">
                  Nama Populer: <strong>{doc.shortTitle}</strong> · Berlaku Sejak: {doc.effectiveDate}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300">
                  STATUS: {doc.status.toUpperCase()}
                </span>
                <a
                  href={doc.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111215] text-white text-xs font-mono uppercase hover:bg-[#c2410c] transition font-semibold"
                >
                  <span>Naskah JDIH</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-mono text-neutral-700 leading-relaxed bg-[#fbfbfa] p-4 border border-neutral-200">
              {doc.description}
            </p>

            {/* Articles Breakdown */}
            <div className="space-y-3">
              <span className="editorial-meta block text-neutral-500">
                PASAL-PASAL KUNCI YANG TERINDEX ({doc.articles.length} PASAL):
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doc.articles.map((art) => (
                  <div key={art.id} className="p-4 bg-[#fbfbfa] swiss-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs font-mono text-neutral-900">
                        PASAL {art.articleNumber}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5">
                        {art.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-800 font-serif italic line-clamp-3 leading-relaxed">
                      &ldquo;{art.content}&rdquo;
                    </p>

                    {art.explanation && (
                      <p className="text-[11px] text-neutral-500 font-mono line-clamp-2 pt-1 border-t border-neutral-200">
                        {art.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
