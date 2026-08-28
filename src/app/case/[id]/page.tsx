'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AnalysisView from '@/components/AnalysisView';
import { CaseAnalysis } from '@/lib/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<CaseAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In local demo, check sessionStorage or synthesize
    const saved = sessionStorage.getItem(`hukumai_${params.id}`);
    if (saved) {
      try {
        setAnalysis(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-xs font-mono text-neutral-500">
        <Loader2 className="w-6 h-6 animate-spin text-[#c2410c]" />
        <span>Memuat naskah analisis kasus...</span>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="max-w-2xl mx-auto bg-white swiss-border p-8 text-center space-y-4 my-12">
        <h2 className="text-xl font-bold text-[#111215]">
          Kasus Tidak Ditemukan atau Sesi Telah Berakhir
        </h2>
        <p className="text-xs font-mono text-neutral-600">
          Kasus ini disimpan dalam memori sesi aman lokal dan telah direset demi menjaga privasi data Anda.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111215] text-white text-xs font-mono uppercase font-bold hover:bg-[#c2410c] transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Buat Analisis Kasus Baru</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnalysisView analysis={analysis} onReset={() => router.push('/')} />
    </div>
  );
}
