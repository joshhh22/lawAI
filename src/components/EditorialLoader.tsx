'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { step: '01', title: 'UNDERSTANDING CASE', desc: 'Mengekstrak fakta, isu hukum, dan yurisdiksi yang relevan...' },
  { step: '02', title: 'SEARCHING REGULATIONS', desc: 'Menelusuri database JDIH, UU, PP, KUHP, dan regulasi positif...' },
  { step: '03', title: 'VERIFYING STATUS', desc: 'Memverifikasi keberlakuan pasal, hierarki hukum, dan relasi perubahan...' },
  { step: '04', title: 'PREPARING EXPLANATION', desc: 'Menyusun analisis editorial objektif berbasis bukti hukum terverifikasi...' }
];

export default function EditorialLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 600);
    const timer2 = setTimeout(() => setCurrentStep(2), 1400);
    const timer3 = setTimeout(() => setCurrentStep(3), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-white swiss-border p-6 sm:p-10 my-8 shadow-xs animate-in fade-in duration-300">
      <div className="flex items-center justify-between swiss-border-b pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-[#c2410c] animate-spin" />
          <span className="editorial-meta font-bold text-base text-neutral-900 tracking-wider">
            RETRIEVING & VERIFYING LEGAL SOURCES
          </span>
        </div>
        <span className="editorial-meta text-neutral-500 font-mono">
          PROSES KORPUS AI
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((s, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={s.step}
              className={`p-4 border transition-all ${
                isCurrent
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-md'
                  : isDone
                  ? 'bg-neutral-50 text-neutral-800 border-neutral-300'
                  : 'bg-transparent text-neutral-400 border-neutral-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2 font-mono text-xs">
                <span className={`font-bold ${isCurrent ? 'text-[#f97316]' : 'text-neutral-500'}`}>
                  {s.step}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-[#f97316] animate-ping" />
                ) : null}
              </div>

              <h5 className="font-bold text-xs tracking-wider mb-1 uppercase font-mono">
                {s.title}
              </h5>
              <p className={`text-[11px] leading-snug ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
