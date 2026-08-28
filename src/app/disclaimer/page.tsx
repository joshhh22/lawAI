'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, Scale, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="space-y-3 swiss-border-b pb-6">
        <div className="flex items-center gap-2 editorial-meta text-[#c2410c]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>PERINGATAN RESMI & BATASAN TEKNOLOGI AI</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#111215]">
          Peringatan, Batasan & Etika CekHukum
        </h1>
        <p className="text-sm font-mono text-neutral-600">
          Pedoman transparansi, batasan operasional, dan tanggung jawab hukum penggunaan sistem informasi hukum digital cekhukum.web.id.
        </p>
      </div>

      {/* Main Notice Box */}
      <div className="bg-[#fbfbfa] swiss-border border-l-4 border-l-[#c2410c] p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-[#111215] tracking-tight">
          Bukan Nasihat Hukum Formal (Legal Disclaimer)
        </h2>
        <div className="space-y-3 text-sm text-neutral-800 leading-relaxed font-sans">
          <p>
            <strong>CekHukum (cekhukum.web.id)</strong> adalah sistem berbasis kecerdasan buatan (Artificial Intelligence) 
            yang dirancang sebagai <strong>alat bantu edukasi dan penelusuran informasi hukum publik</strong> di Indonesia.
          </p>
          <p>
            CekHukum <strong>bukan pengacara, bukan advokat, bukan kantor hukum, dan bukan lembaga peradilan</strong>. 
            Segala informasi, analisis, sintesis, atau penjelasan pasal yang disajikan oleh sistem ini 
            <strong> tidak boleh dianggap sebagai nasihat hukum resmi (formal legal advice)</strong>, pendapat hukum resmi (legal opinion), 
            atau jaminan atas hasil putusan perkara di pengadilan.
          </p>
        </div>
      </div>

      {/* 6 Safety Principles (PRD Section 6) */}
      <div className="space-y-6">
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-neutral-900 swiss-border-b pb-2">
          PRINSIP KEAMANAN & INTEGRITAS KORPUS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white swiss-border p-5 space-y-2">
            <span className="editorial-meta text-[#c2410c] block">01 / BEBAS FABRIKASI PASAL</span>
            <h4 className="font-bold text-sm text-[#111215]">
              Tidak Mengarang Dasar Hukum
            </h4>
            <p className="text-xs font-mono text-neutral-600 leading-relaxed">
              Sistem dilarang mengarang nomor undang-undang, pasal, ayat, atau putusan yang tidak tercatat dalam lembaran negara resmi Republik Indonesia.
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2">
            <span className="editorial-meta text-[#c2410c] block">02 / PEMISAHAN FAKTA & OPINI</span>
            <h4 className="font-bold text-sm text-[#111215]">
              Distingsi Elemen Jawaban
            </h4>
            <p className="text-xs font-mono text-neutral-600 leading-relaxed">
              Membedakan secara tegas antara apa yang diceritakan pengguna (fakta), teks peraturan tertulis (hukum positif), analisis logis, dan faktor ketidakpastian.
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2">
            <span className="editorial-meta text-[#c2410c] block">03 / TANPA PREDIKSI KEMENANGAN</span>
            <h4 className="font-bold text-sm text-[#111215]">
              Larangan Garansi Hasil Perkara
            </h4>
            <p className="text-xs font-mono text-neutral-600 leading-relaxed">
              AI tidak pernah menjamin pengguna "pasti menang" atau "pasti terbebas dari tuntutan". Putusan hukum bergantung pada pembuktian alat bukti di muka hakim.
            </p>
          </div>

          <div className="bg-white swiss-border p-5 space-y-2">
            <span className="editorial-meta text-[#c2410c] block">04 / PERLINDUNGAN PRIVASI</span>
            <h4 className="font-bold text-sm text-[#111215]">
              Tanpa Pengumpulan Data Rahasia
            </h4>
            <p className="text-xs font-mono text-neutral-600 leading-relaxed">
              CekHukum tidak meminta atau menyimpan NIK, kata sandi, rekening bank, atau rahasia pribadi yang dapat disalahgunakan.
            </p>
          </div>
        </div>
      </div>

      {/* When to seek professional lawyers */}
      <div className="bg-white swiss-border p-6 sm:p-8 space-y-4">
        <h3 className="font-bold text-base text-[#111215]">
          Kapan Anda Wajib Menghubungi Advokat / Posbakum?
        </h3>
        <ul className="space-y-2 text-xs font-mono text-neutral-700 leading-relaxed list-disc list-inside">
          <li>Anda menerima panggilan resmi kepolisian atau kejaksaan sebagai tersangka atau saksi.</li>
          <li>Menghadapi gugatan perdata di Pengadilan Negeri atau Pengadilan Agama dengan nilai kerugian materiel.</li>
          <li>Menandatangani kontrak komersial bernilai tinggi, akuisisi saham, atau merger bisnis.</li>
          <li>Sengketa hubungan industrial (PHK) yang memerlukan perundingan tripartit dan gugatan PHI.</li>
        </ul>

        <div className="pt-4 flex items-center justify-between swiss-border-t">
          <span className="text-xs font-mono text-neutral-500">
            Pusat Bantuan Hukum Pengadilan Negeri (Posbakum) menyediakan pendampingan gratis bagi masyarakat kurang mampu.
          </span>
          <Link
            href="/"
            className="px-4 py-2 bg-[#111215] text-white text-xs font-mono uppercase hover:bg-[#c2410c] transition font-bold"
          >
            Mulai Analisis
          </Link>
        </div>
      </div>
    </div>
  );
}
