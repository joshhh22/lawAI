'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, ExternalLink, ShieldCheck, Scale, ArrowLeft } from 'lucide-react';
import { LegalArticle, LegalDocument, RegulationType } from '@/lib/types';
import LegalSourceCard from '@/components/LegalSourceCard';
import Link from 'next/link';

const REGULATION_TYPES: (RegulationType | 'Semua')[] = [
  'Semua',
  'UU',
  'PP',
  'KUHP',
  'KUHPerdata',
  'Perpres',
  'Permen'
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<RegulationType | 'Semua'>('Semua');
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [articles, setArticles] = useState<LegalArticle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async (q: string, type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${type}`);
      const data = await res.json();
      setDocuments(data.documents || []);
      setArticles(data.articles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(query, selectedType);
  }, [selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchResults(query, selectedType);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3 swiss-border-b pb-6">
        <div className="flex items-center gap-2 editorial-meta text-[#c2410c]">
          <Search className="w-3.5 h-3.5" />
          <span>02 / PENCARIAN DATABASE HUKUM & PASAL</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#111215]">
          Pencarian Regulasi & Naskah Peraturan
        </h1>
        <p className="text-sm font-mono text-neutral-600 max-w-2xl">
          Cari bunyi pasal eksak, nomor undang-undang, istilah hukum, atau topik spesifik dalam korpus hukum Indonesia yang terverifikasi.
        </p>
      </div>

      {/* Search Input & Filters */}
      <div className="bg-white swiss-border p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ketik nomor pasal, kata kunci (misal: '378', 'ijazah', 'PKWT', 'pencemaran', 'wanprestasi')..."
              className="w-full pl-10 pr-4 py-3 bg-[#fbfbfa] swiss-border text-sm font-mono focus:outline-none focus:bg-white focus:ring-1 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-[#111215] text-white text-xs font-mono uppercase tracking-wider font-bold hover:bg-[#c2410c] transition cursor-pointer"
          >
            Cari Regulasi
          </button>
        </form>

        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
          <span className="editorial-meta text-neutral-500 mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            JENIS:
          </span>
          {REGULATION_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 text-xs font-mono transition cursor-pointer ${
                selectedType === type
                  ? 'bg-[#111215] text-white font-bold'
                  : 'bg-[#fbfbfa] swiss-border text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-8">
        {/* Articles Matched */}
        <div className="space-y-4">
          <div className="flex items-center justify-between swiss-border-b pb-2">
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-900">
              PASAL & KETENTUAN TERKAIT ({articles.length})
            </h3>
            <span className="editorial-meta text-neutral-500">
              STATUS RESMI BERLAKU
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-neutral-500">
              Memuat data regulasi...
            </div>
          ) : articles.length > 0 ? (
            articles.map((article, idx) => (
              <LegalSourceCard key={article.id || idx} article={article} index={idx} />
            ))
          ) : (
            <div className="p-8 bg-white swiss-border text-center text-xs font-mono text-neutral-500">
              Tidak ditemukan pasal yang cocok dengan kriteria pencarian.
            </div>
          )}
        </div>

        {/* Document Metadata Cards */}
        {documents.length > 0 && (
          <div className="space-y-4 pt-6 swiss-border-t">
            <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-900">
              DOKUMEN UNDANG-UNDANG INDUK ({documents.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white swiss-border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="editorial-meta font-bold text-[#c2410c]">
                      {doc.type} NO. {doc.number} TAHUN {doc.year}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {doc.status.toUpperCase()}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-[#111215] leading-snug">
                    {doc.title}
                  </h4>

                  <p className="text-xs font-mono text-neutral-600 leading-relaxed">
                    {doc.description}
                  </p>

                  <div className="pt-2 swiss-border-t flex items-center justify-between text-xs font-mono text-neutral-500">
                    <span>{doc.articles.length} Pasal Terindeks</span>
                    <a
                      href={doc.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-neutral-900 hover:text-[#c2410c] font-semibold"
                    >
                      <span>JDIH Resmi</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
