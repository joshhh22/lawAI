'use client';

import React, { useState } from 'react';
import AppSidebar from './AppSidebar';
import DisclaimerModal from './DisclaimerModal';
import SettingsModal from './SettingsModal';
import { ChatProvider, useChat } from '@/context/ChatContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import { 
  Zap, 
  ChevronDown, 
  Info, 
  Code2, 
  Sparkles,
  PanelLeft,
  Settings as SettingsIcon,
  Globe
} from 'lucide-react';
import { usePathname } from 'next/navigation';

function AppShellContent({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const pathname = usePathname();
  const { activeSessionId, selectSession, createNewChat } = useChat();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbfbfa] text-[#111215]">
      {/* Global Disclaimer Modal */}
      <DisclaimerModal 
        forceOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />

      {/* Global Settings Modal (Language Switcher & Clear History) */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Collapsible Left Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => selectSession(id)}
        onNewChat={() => createNewChat()}
        onOpenDisclaimer={() => setShowDisclaimer(true)}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
        {/* Minimalist Top Bar */}
        <header className="h-14 bg-transparent px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0 z-20">
          {/* Left Model Selector Pill & Sidebar Toggle */}
          <div className="flex items-center gap-3">
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-1.5 swiss-border bg-white hover:bg-neutral-100 transition rounded-lg text-neutral-700 cursor-pointer shadow-2xs"
                title="Buka Menu Sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setShowModelInfo(!showModelInfo)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-xs swiss-border hover:bg-white transition text-xs font-mono font-semibold text-neutral-800 rounded-full shadow-2xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Mode Flash (Gemini 2.5)</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {/* Model Info Dropdown */}
              {showModelInfo && (
                <div className="absolute top-10 left-0 w-72 bg-white swiss-border p-4 shadow-xl text-xs font-mono z-50 animate-in fade-in slide-in-from-top-1 rounded-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100 mb-2">
                    <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#c2410c]" />
                      Gemini 2.5 Flash
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-neutral-600 leading-relaxed text-[11px] mb-3">
                    Terintegrasi dengan Google Search Grounding untuk menelusuri naskah perundang-undangan dan regulasi JDIH pemerintah secara live.
                  </p>
                  <div className="text-[10.5px] text-neutral-500 bg-[#fbfbfa] p-2 border border-neutral-200 rounded space-y-1">
                    <div>✓ Latensi Ultra-Rendah (~400ms)</div>
                    <div>✓ 1 Juta Token Context Window</div>
                    <div>✓ Korpus Regulasi Terverifikasi</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions: Language, Settings, Info & GitHub */}
          <div className="flex items-center gap-2 font-mono text-xs">
            {/* Quick Language Toggle Pill */}
            <button
              onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/80 swiss-border hover:bg-white transition text-xs font-mono text-neutral-700 rounded-full cursor-pointer shadow-2xs"
              title="Ganti Bahasa / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#c2410c]" />
              <span className="font-bold uppercase">{language}</span>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-1.5 text-neutral-600 hover:text-black hover:bg-white/80 transition rounded-full cursor-pointer"
              title={t.settings}
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* Info / Disclaimer Trigger */}
            <button
              onClick={() => setShowDisclaimer(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-neutral-600 hover:text-black hover:bg-white/80 transition cursor-pointer rounded-full text-xs font-mono"
            >
              <Info className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navDisclaimer}</span>
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/joshhh22/lawAI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-neutral-600 hover:text-black hover:bg-white/80 transition rounded-full"
              title="GitHub Repository"
            >
              <Code2 className="w-4 h-4" />
            </a>
          </div>
        </header>

        {/* Scrollable Main Content Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-8 bg-[#fbfbfa] flex flex-col">
          <div className="w-full max-w-5xl mx-auto flex-1 flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ChatProvider>
        <AppShellContent>{children}</AppShellContent>
      </ChatProvider>
    </LanguageProvider>
  );
}
