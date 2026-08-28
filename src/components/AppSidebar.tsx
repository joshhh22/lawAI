'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquarePlus, 
  Search, 
  BookOpen, 
  AlertCircle, 
  Code2, 
  PanelLeftClose, 
  PanelLeft, 
  Scale, 
  ShieldCheck,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onSelectTopic?: (topic: string) => void;
  onNewChat?: () => void;
  onOpenDisclaimer?: () => void;
}

const QUICK_TOPICS = [
  'Penahanan Ijazah Kerja',
  'Kompensasi PKWT & PHK',
  'Pencemaran Medsos (UU ITE)',
  'Penyalahgunaan Data (UU PDP)',
  'Klausula Baku Konsumen',
  'Wanprestasi & Ganti Rugi'
];

export default function AppSidebar({
  collapsed,
  onToggle,
  onSelectTopic,
  onNewChat,
  onOpenDisclaimer
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`bg-[#111215] text-[#fbfbfa] border-r border-neutral-800 transition-all duration-300 flex flex-col z-30 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-800">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[#c2410c] text-white flex items-center justify-center font-bold text-sm">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-[#c2410c] transition">
                  HUKUMAI
                </span>
                <span className="text-[9px] font-mono bg-neutral-800 text-neutral-300 px-1 py-0.2">
                  law.web.id
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block -mt-0.5">
                Legal AI Assistant
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="mx-auto" title="HukumAI Home">
            <div className="w-8 h-8 bg-[#c2410c] text-white flex items-center justify-center font-bold text-sm">
              H
            </div>
          </Link>
        )}

        <button
          onClick={onToggle}
          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
          title={collapsed ? 'Buka Sidebar' : 'Sembunyikan Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* New Consultation CTA Button */}
      <div className="p-3 border-b border-neutral-800">
        {onNewChat ? (
          <button
            onClick={onNewChat}
            className={`w-full py-2.5 px-3 bg-white text-black hover:bg-[#c2410c] hover:text-white transition font-mono uppercase text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              collapsed ? 'px-0 justify-center' : ''
            }`}
            title="Mulai Konsultasi Baru"
          >
            <MessageSquarePlus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Konsultasi Baru</span>}
          </button>
        ) : (
          <Link
            href="/"
            className={`w-full py-2.5 px-3 bg-white text-black hover:bg-[#c2410c] hover:text-white transition font-mono uppercase text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              collapsed ? 'px-0 justify-center' : ''
            }`}
            title="Mulai Konsultasi Baru"
          >
            <MessageSquarePlus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Konsultasi Baru</span>}
          </Link>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {/* Main Nav */}
        <div className="space-y-1">
          {!collapsed && (
            <span className="editorial-meta text-neutral-500 block px-2 mb-1.5 text-[10px]">
              NAVIGASI UTAMA
            </span>
          )}

          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition ${
              pathname === '/'
                ? 'bg-neutral-800 text-white font-bold border-l-2 border-[#c2410c]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title="Konsultasi AI (Chat)"
          >
            <Scale className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Konsultasi AI</span>}
          </Link>

          <Link
            href="/search"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition ${
              pathname === '/search'
                ? 'bg-neutral-800 text-white font-bold border-l-2 border-[#c2410c]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title="Cari Regulasi & Pasal"
          >
            <Search className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Cari Regulasi</span>}
          </Link>

          <Link
            href="/regulations"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition ${
              pathname === '/regulations'
                ? 'bg-neutral-800 text-white font-bold border-l-2 border-[#c2410c]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title="Katalog Peraturan Positif"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Katalog Hukum</span>}
          </Link>

          <Link
            href="/disclaimer"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition ${
              pathname === '/disclaimer'
                ? 'bg-neutral-800 text-white font-bold border-l-2 border-[#c2410c]'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title="Peringatan & Batasan AI"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            {!collapsed && <span>Batasan AI</span>}
          </Link>
        </div>

        {/* Quick Legal Topics (Expanded mode only) */}
        {!collapsed && (
          <div className="space-y-1.5 pt-3 border-t border-neutral-800">
            <span className="editorial-meta text-neutral-500 block px-2 mb-1 text-[10px]">
              TOPIK KASUS POPULER
            </span>
            <div className="space-y-1">
              {QUICK_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => onSelectTopic && onSelectTopic(topic)}
                  className="w-full text-left px-3 py-2 text-[11.5px] font-mono text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center justify-between group cursor-pointer"
                >
                  <span className="truncate">⚖️ {topic}</span>
                  <ChevronRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom User / Info Strip */}
      <div className="p-3 border-t border-neutral-800 space-y-2 bg-[#0c0d0f]">
        {!collapsed ? (
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-neutral-400 text-[10.5px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Gemini 2.5 Flash</span>
              </span>
              <span className="text-neutral-500">JDIH Grounded</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px]">
              {onOpenDisclaimer && (
                <button
                  onClick={onOpenDisclaimer}
                  className="text-neutral-400 hover:text-amber-400 transition cursor-pointer"
                >
                  Legal Disclaimer
                </button>
              )}
              <a
                href="https://github.com/joshhh22/lawAI"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-neutral-400 hover:text-white transition"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Gemini 2.5 Flash Connected" />
            <a
              href="https://github.com/joshhh22/lawAI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-neutral-400 hover:text-white"
              title="GitHub Repo"
            >
              <Code2 className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </aside>
  );
}
