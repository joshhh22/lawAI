'use client';

import React, { useState, useEffect } from 'react';
import AppSidebar from './AppSidebar';
import DisclaimerModal from './DisclaimerModal';
import { 
  PanelLeft, 
  PanelLeftClose, 
  Search, 
  AlertCircle, 
  Code2, 
  ExternalLink,
  Scale,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const pathname = usePathname();

  // On small screens, start collapsed by default
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarCollapsed(true);
    }
  }, []);

  const getPageTitle = () => {
    if (pathname === '/search') return '02 / Cari Regulasi & Pasal';
    if (pathname === '/regulations') return '03 / Katalog Peraturan RI';
    if (pathname === '/disclaimer') return '04 / Peringatan & Batasan AI';
    if (pathname.startsWith('/case/')) return 'Detail Kasus Editorial';
    return '01 / Asisten Konsultasi Hukum AI';
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#fbfbfa] text-[#111215]">
      {/* Global First-Open Disclaimer Modal */}
      <DisclaimerModal 
        forceOpen={showDisclaimer} 
        onClose={() => setShowDisclaimer(false)} 
      />

      {/* Collapsible Left Sidebar */}
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenDisclaimer={() => setShowDisclaimer(true)}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Compact Editorial Top Header Bar */}
        <header className="h-16 bg-white swiss-border-b px-4 sm:px-8 flex items-center justify-between gap-4 shrink-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 swiss-border hover:bg-neutral-100 transition cursor-pointer text-neutral-700"
              title={sidebarCollapsed ? 'Perluas Menu Sidebar' : 'Sembunyikan Sidebar (Perbesar Chat)'}
              aria-label="Toggle Sidebar"
            >
              {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="editorial-meta text-[#c2410c] font-bold hidden sm:inline">
                HUKUMAI
              </span>
              <span className="text-neutral-300 hidden sm:inline">•</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-neutral-800 truncate">
                {getPageTitle()}
              </span>
            </div>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="hidden md:flex items-center gap-2 text-neutral-500 text-[11px] mr-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>JDIHN · PERATURAN.GO.ID · BPK · MA · MK</span>
            </div>

            <Link
              href="/search"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 swiss-border bg-[#fbfbfa] hover:bg-neutral-100 transition text-neutral-700"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari Pasal</span>
            </Link>

            <button
              onClick={() => setShowDisclaimer(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 swiss-border border-amber-300 transition cursor-pointer font-bold text-[11px]"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Batasan AI</span>
            </button>

            <a
              href="https://github.com/joshhh22/lawAI"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#111215] text-white hover:bg-[#c2410c] transition uppercase font-bold text-[11px]"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </header>

        {/* Scrollable Main Application Content (Expands to Full Width when Sidebar is collapsed) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#fbfbfa]">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
