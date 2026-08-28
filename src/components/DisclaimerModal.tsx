'use client';

import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, X } from 'lucide-react';

interface DisclaimerModalProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export default function DisclaimerModal({ forceOpen, onClose }: DisclaimerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
      return;
    }

    // Check session storage
    const accepted = sessionStorage.getItem('hukumai_disclaimer_accepted');
    if (!accepted) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleAccept = () => {
    sessionStorage.setItem('hukumai_disclaimer_accepted', 'true');
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#fbfbfa] text-[#111215] swiss-border shadow-2xl p-6 sm:p-8 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        {forceOpen && (
          <button
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-black transition"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2 editorial-meta text-[#c2410c] mb-3">
          <AlertTriangle className="w-4 h-4" />
          <span>PERINGATAN RESMI & BATASAN AI</span>
        </div>

        <h2 id="disclaimer-title" className="text-xl sm:text-2xl font-bold tracking-tight text-[#111215] mb-4">
          Penting sebelum menggunakan HukumAI
        </h2>

        <div className="space-y-3.5 text-[14.5px] leading-relaxed text-neutral-700 swiss-border-b pb-6 mb-6">
          <p>
            <strong>HukumAI</strong> adalah alat bantu informasi untuk membantu Anda memahami hukum Indonesia. 
            HukumAI <strong>bukan pengacara, bukan lembaga penegak hukum, dan bukan pengganti nasihat atau pendampingan hukum profesional</strong>.
          </p>
          <p>
            Jawaban AI dapat mengandung kesalahan, tidak lengkap, atau tidak sesuai dengan kondisi kasus tertentu. 
            Selalu periksa dasar hukum dan sumber resmi yang ditampilkan.
          </p>
          <p>
            Untuk perkara yang serius, mendesak, atau memiliki konsekuensi hukum penting, konsultasikan dengan advokat, 
            pos bantuan hukum (Posbakum), atau instansi yang berwenang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Berbasis regulasi positif RI & JDIH resmi</span>
          </div>

          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-6 py-3 bg-[#111215] text-[#fbfbfa] text-xs uppercase font-mono tracking-widest font-semibold hover:bg-[#c2410c] transition duration-150 active:scale-98 text-center"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
