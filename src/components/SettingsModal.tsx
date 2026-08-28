'use client';

import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Globe, 
  Trash2, 
  AlertTriangle, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useLanguage, Language } from '@/context/LanguageContext';
import { useChat } from '@/context/ChatContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { language, setLanguage, t } = useLanguage();
  const { clearAllChatSessions } = useChat();
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [clearedSuccess, setClearedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirmClear = () => {
    clearAllChatSessions();
    setShowConfirmClear(false);
    setClearedSuccess(true);
    setTimeout(() => {
      setClearedSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white swiss-border rounded-2xl shadow-2xl p-6 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 swiss-border-b mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-800">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-neutral-900 leading-tight">
                {t.settingsTitle}
              </h2>
              <span className="text-[11px] font-mono text-neutral-500">
                law.web.id · Preferences
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black hover:bg-neutral-100 transition rounded-lg cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Options */}
        <div className="space-y-6">
          {/* 1. Language Setting */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#c2410c]" />
                <span className="font-bold text-xs font-mono uppercase text-neutral-800">
                  {t.languageSetting}
                </span>
              </div>
            </div>
            <p className="text-xs font-mono text-neutral-500">
              {t.languageDesc}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setLanguage('id')}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition cursor-pointer ${
                  language === 'id'
                    ? 'border-[#c2410c] bg-[#fff7ed] text-[#c2410c] font-bold shadow-2xs'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">🇮🇩</span>
                  <span>Bahasa Indonesia</span>
                </span>
                {language === 'id' && <Check className="w-4 h-4 text-[#c2410c]" />}
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono transition cursor-pointer ${
                  language === 'en'
                    ? 'border-[#c2410c] bg-[#fff7ed] text-[#c2410c] font-bold shadow-2xs'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-base">🇬🇧</span>
                  <span>English</span>
                </span>
                {language === 'en' && <Check className="w-4 h-4 text-[#c2410c]" />}
              </button>
            </div>
          </div>

          {/* 2. Chat History Management (Clear All) */}
          <div className="pt-4 border-t border-neutral-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                <span className="font-bold text-xs font-mono uppercase text-neutral-800">
                  {t.chatHistorySetting}
                </span>
              </div>
            </div>
            <p className="text-xs font-mono text-neutral-500">
              {t.chatHistoryDesc}
            </p>

            {!showConfirmClear ? (
              <div className="pt-1">
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-mono font-semibold transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t.clearHistoryBtn}</span>
                </button>
                {clearedSuccess && (
                  <p className="text-xs font-mono text-emerald-600 mt-2 flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.historyClearedSuccess}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2 text-red-800 text-xs font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{t.clearHistoryConfirmTitle}</span>
                    <span className="text-[11px] text-red-700 leading-relaxed block mt-0.5">
                      {t.clearHistoryConfirmDesc}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleConfirmClear}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono font-bold transition cursor-pointer"
                  >
                    {t.clearHistoryConfirmBtn}
                  </button>
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-3.5 py-1.5 bg-white swiss-border hover:bg-neutral-100 text-neutral-700 rounded-lg text-xs font-mono transition cursor-pointer"
                  >
                    {t.cancelBtn}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 3. System Model & Grounding Information */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <span className="font-bold text-xs font-mono uppercase text-neutral-800 block">
              {t.systemModelSetting}
            </span>
            <div className="bg-[#fbfbfa] p-3 rounded-xl border border-neutral-200 text-xs font-mono text-neutral-600 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-neutral-900">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Gemini 3.6 Flash
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Terintegrasi dengan basis data resmi JDIHN, BPK RI (peraturan.bpk.go.id), Mahkamah Agung, dan Mahkamah Konstitusi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-mono font-bold rounded-xl transition cursor-pointer shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
