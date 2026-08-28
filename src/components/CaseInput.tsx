'use client';

import React, { useState } from 'react';
import { ArrowRight, ShieldAlert, Sparkles, Scale } from 'lucide-react';

interface CaseInputProps {
  onAnalyze: (caseText: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

const PRESET_CASES = [
  {
    label: 'Penahanan Ijazah Kerja',
    text: 'Perusahaan tempat saya bekerja menahan ijazah asli saya dan menolak mengembalikannya saat saya mengundurkan diri. Apakah perusahaan berhak menahan ijazah saya menurut hukum ketenagakerjaan?'
  },
  {
    label: 'Kompensasi PKWT & PHK',
    text: 'Saya bekerja sebagai karyawan kontrak (PKWT) selama 1 tahun penuh dan kontrak saya berakhir tanpa diperpanjang. Apakah saya berhak mendapatkan uang kompensasi menurut UU Cipta Kerja dan PP 35/2021?'
  },
  {
    label: 'Pencemaran Nama Baik di Medsos',
    text: 'Saya memberikan ulasan kritis di media sosial tentang pelayanan sebuah instansi dan diancam dilaporkan menggunakan Pasal 27A UU ITE. Bagaimana batasan hukum pencemaran nama baik dalam revisi UU ITE terbaru?'
  },
  {
    label: 'Penyalahgunaan Data oleh Pinjol',
    text: 'Pihak pinjaman online menghubungi dan menyebarkan data saya kepada seluruh kontak darurat di ponsel saya tanpa persetujuan. Apakah hal ini melanggar UU Perlindungan Data Pribadi (UU PDP)?'
  },
  {
    label: 'Klausula Baku & Barang Rusak',
    text: 'Saya membeli barang yang ternyata cacat tersembunyi, namun toko menolak ganti rugi dengan alasan nota tertulis "Barang yang dibeli tidak dapat ditukar". Apakah klausul sepihak itu sah menurut UU Perlindungan Konsumen?'
  }
];

export default function CaseInput({ onAnalyze, isLoading, initialValue = '' }: CaseInputProps) {
  const [text, setText] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onAnalyze(text.trim());
  };

  return (
    <div className="w-full bg-white swiss-border p-6 sm:p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="case-input" className="editorial-meta font-bold text-neutral-800 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#c2410c]" />
            <span>KASUS / PERTANYAAN HUKUM ANDA</span>
          </label>
          <span className="text-xs font-mono text-neutral-400">
            {text.length} karakter
          </span>
        </div>

        <div className="relative">
          <textarea
            id="case-input"
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ceritakan persoalan hukum Anda dengan bahasa sehari-hari... (Contoh: Perusahaan saya menahan ijazah, atau saya dituntut wanprestasi atas kontrak perjanjian kerja)"
            className="w-full p-4 bg-[#fbfbfa] swiss-border text-[#111215] text-[15px] leading-relaxed placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#111215] focus:bg-white transition resize-y min-h-[140px]"
            required
          />
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2 text-[11.5px] font-mono text-neutral-500 bg-[#f9f9f6] p-3 border border-neutral-200">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Perhatian Privasi:</strong> Jangan memasukkan data pribadi sensitif (seperti NIK, nomor rekening bank, kata sandi) yang tidak diperlukan untuk analisis hukum umum.
          </span>
        </div>

        {/* Action Button & Preset tags */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600">
            <Sparkles className="w-3.5 h-3.5 text-[#c2410c]" />
            <span>Contoh Kasus Cepat:</span>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="px-8 py-3.5 bg-[#111215] text-white hover:bg-[#c2410c] disabled:opacity-50 disabled:cursor-not-allowed transition font-mono uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <span>{isLoading ? 'Menganalisis Kasus...' : 'ANALISIS KASUS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {PRESET_CASES.map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setText(preset.text)}
              className="text-xs font-mono px-3 py-1.5 swiss-border bg-[#fbfbfa] text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-black transition duration-150 cursor-pointer text-left"
            >
              + {preset.label}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
