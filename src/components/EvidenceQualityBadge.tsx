import React from 'react';
import { EvidenceStatus } from '@/lib/types';
import { Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface EvidenceQualityBadgeProps {
  evidence: EvidenceStatus;
}

export default function EvidenceQualityBadge({ evidence }: EvidenceQualityBadgeProps) {
  const getQualityColor = (quality: string) => {
    if (quality.includes('Tinggi')) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (quality.includes('Sedang')) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-neutral-700 bg-neutral-100 border-neutral-300';
  };

  return (
    <div className="bg-white swiss-border p-4 space-y-3.5">
      <div className="flex items-center justify-between swiss-border-b pb-2.5">
        <span className="editorial-meta font-bold text-neutral-800">
          AUDIT KUALITAS BUKTI (EVIDENCE)
        </span>
        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 border font-semibold ${getQualityColor(evidence.evidenceQuality)}`}>
          {evidence.evidenceQuality}
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono">
        <div className="flex items-center justify-between">
          <span className="text-neutral-600">SUMBER TERVERIFIKASI</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <Check className="w-3.5 h-3.5" /> JDIH RESMI
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-600">PASAL DITEMUKAN</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <Check className="w-3.5 h-3.5" /> DITEMUKAN
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-600">STATUS KEBERLAKUAN</span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <Check className="w-3.5 h-3.5" /> POSITIF / AKTIF
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-neutral-600">KELENGKAPAN FAKTA</span>
          <span className={`px-1.5 py-0.2 text-[11px] font-semibold ${
            evidence.factsComplete === 'Lengkap' 
              ? 'text-emerald-700 bg-emerald-50' 
              : 'text-amber-700 bg-amber-50'
          }`}>
            {evidence.factsComplete.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-[10.5px] text-neutral-500 font-mono italic leading-tight pt-1">
        *Kualitas bukti mengukur keterlacakan sumber resmi, bukan probabilitas kemenangan perkara.
      </p>
    </div>
  );
}
