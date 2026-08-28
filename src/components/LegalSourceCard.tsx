'use client';

import React, { useState } from 'react';
import { LegalArticle } from '@/lib/types';
import { ExternalLink, Copy, Check, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface LegalSourceCardProps {
  article: LegalArticle;
  index: number;
}

export default function LegalSourceCard({ article, index }: LegalSourceCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = () => {
    const text = `${article.documentTitle} - Pasal ${article.articleNumber}\n\n"${article.content}"\n\nSumber: ${article.officialSource} (${article.officialUrl})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Berlaku':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 border border-emerald-300">BERLAKU</span>;
      case 'Diubah':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-mono font-bold px-2 py-0.5 border border-amber-300">DIUBAH</span>;
      case 'Masa Transisi':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-mono font-bold px-2 py-0.5 border border-blue-300">TRANSISI</span>;
      default:
        return <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono font-bold px-2 py-0.5 border border-neutral-300">{status.toUpperCase()}</span>;
    }
  };

  return (
    <div className="bg-white swiss-border mb-4 transition">
      {/* Header */}
      <div className="bg-[#fbfbfa] swiss-border-b px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="editorial-meta font-bold text-[#c2410c]">
            SOURCE / {String(index + 1).padStart(2, '0')}
          </span>
          <span className="text-xs font-mono font-semibold text-neutral-800">
            {article.documentType} NO. {article.number} TAHUN {article.year}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge(article.status)}
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-neutral-500 hover:text-black transition"
            aria-label="Toggle card"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-4">
        <div>
          <h4 className="font-bold text-base sm:text-lg text-[#111215] tracking-tight">
            {article.documentTitle}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs font-mono text-neutral-600">
            <span className="font-bold text-neutral-900">
              PASAL {article.articleNumber}
            </span>
            {article.paragraphNumber && (
              <span>• AYAT ({article.paragraphNumber})</span>
            )}
          </div>
        </div>

        {expanded && (
          <>
            {/* Exact Quote */}
            <div className="bg-[#f8f7f4] border-l-3 border-[#111215] p-3.5 sm:p-4 text-[13.5px] leading-relaxed text-neutral-900 font-serif italic">
              &ldquo;{article.content}&rdquo;
            </div>

            {/* Official Explanation / Meaning */}
            {article.explanation && (
              <div className="text-xs text-neutral-700 leading-relaxed space-y-1">
                <span className="editorial-meta block text-neutral-500">PENJELASAN PRAKTIS:</span>
                <p>{article.explanation}</p>
              </div>
            )}

            {/* Relation / Amendment Note */}
            {article.relationNote && (
              <div className="bg-amber-50/70 border border-amber-200/80 p-2.5 text-xs text-amber-900 font-mono">
                <strong>Catatan Relasi Regulasi:</strong> {article.relationNote}
              </div>
            )}

            {/* Footer with verification metadata & actions */}
            <div className="swiss-border-t pt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-500">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sumber: <strong>{article.officialSource}</strong></span>
                {article.lastVerifiedAt && (
                  <span className="hidden sm:inline">· Terverifikasi: {article.lastVerifiedAt}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1.5 swiss-border hover:bg-neutral-100 transition text-neutral-800"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>

                <a
                  href={article.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#111215] text-white hover:bg-[#c2410c] transition font-semibold"
                >
                  <span>Buka Sumber Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
