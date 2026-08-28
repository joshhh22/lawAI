'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, ShieldCheck, Scale, Search, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function EditorialLoader() {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const stages = language === 'en' ? [
    { step: '01', title: 'ANALYZING ISSUE', desc: 'Extracting key facts, legal domain, and jurisdiction...', icon: Search },
    { step: '02', title: 'SEARCHING STATUTES', desc: 'Scanning peraturan.bpk.go.id, statutes, and codes...', icon: BookOpen },
    { step: '03', title: 'VERIFYING LAW STATUS', desc: 'Validating in-force articles & statutory amendments...', icon: ShieldCheck },
    { step: '04', title: 'PREPARING VERDICT', desc: 'Formulating legal reasoning & actionable recourse...', icon: Scale }
  ] : [
    { step: '01', title: 'MENELAAH ISU HUKUM', desc: 'Mengekstrak fakta pokok, domain hukum, dan yurisdiksi...', icon: Search },
    { step: '02', title: 'MENELUSURI REGULASI', desc: 'Memindai database peraturan.bpk.go.id, UU, PP, KUHP...', icon: BookOpen },
    { step: '03', title: 'VERIFIKASI KEBERLAKUAN', desc: 'Memvalidasi status pasal berlaku & relasi perubahan...', icon: ShieldCheck },
    { step: '04', title: 'MERUMUSKAN TELAAH', desc: 'Menyusun analisis yuridis & langkah praktis hukum...', icon: Scale }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 500);
    const timer2 = setTimeout(() => setCurrentStep(2), 1100);
    const timer3 = setTimeout(() => setCurrentStep(3), 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-white swiss-border p-5 sm:p-7 my-4 shadow-sm rounded-2xl animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between swiss-border-b pb-3.5 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#fef2f2] text-[#c2410c] flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-[#c2410c]" />
          </div>
          <div>
            <span className="font-bold text-xs sm:text-sm text-neutral-900 tracking-wide font-mono uppercase block">
              {language === 'en' ? 'AI Legal Research in Progress...' : 'Menelusuri Korpus Regulasi Pemerintah RI...'}
            </span>
            <span className="text-[10.5px] font-mono text-neutral-500 block -mt-0.5">
              Gemini 3.6 Flash · peraturan.bpk.go.id
            </span>
          </div>
        </div>

        <span className="hidden sm:inline-block px-2.5 py-1 bg-neutral-100 text-neutral-600 text-[10px] font-mono font-bold rounded-full uppercase">
          {language === 'en' ? 'Reasoning' : 'Penalaran Hukum'}
        </span>
      </div>

      {/* 4-Step Animated Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((s, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const StepIcon = s.icon;

          return (
            <div
              key={s.step}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                isCurrent
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-[1.02]'
                  : isDone
                  ? 'bg-emerald-50/50 text-neutral-800 border-emerald-200'
                  : 'bg-[#fafafa] text-neutral-400 border-neutral-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <StepIcon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#f97316]' : isDone ? 'text-emerald-600' : 'text-neutral-400'}`} />
                  <span className={`font-bold ${isCurrent ? 'text-[#f97316]' : isDone ? 'text-emerald-700' : 'text-neutral-400'}`}>
                    [{s.step}]
                  </span>
                </div>

                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#f97316] animate-ping" />
                ) : null}
              </div>

              <h5 className="font-bold text-[11px] tracking-wider mb-0.5 uppercase font-mono truncate">
                {s.title}
              </h5>
              <p className={`text-[10px] leading-snug font-mono ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
