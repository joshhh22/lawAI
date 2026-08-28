'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  MessageSquare, 
  Search, 
  BookOpen, 
  AlertCircle, 
  Settings, 
  Scale, 
  ExternalLink,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  FileText,
  ShieldCheck,
  Code2
} from 'lucide-react';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onSelectTopic?: (topic: string) => void;
  onNewChat?: () => void;
  onOpenDisclaimer?: () => void;
}

const QUICK_TOPICS = [
  { label: 'Penahanan Ijazah Kerja', icon: '📄' },
  { label: 'Kompensasi PKWT & PHK', icon: '⚖️' },
  { label: 'Pencemaran Medsos (UU ITE)', icon: '🛡️' },
  { label: 'Penyalahgunaan Data (UU PDP)', icon: '🔒' },
  { label: 'Klausula Baku Konsumen', icon: '🛒' },
  { label: 'Wanprestasi & Ganti Rugi', icon: '📑' }
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
      {/* Top Logo & Toggle */}
      <div className="h-16 px-3.5 flex items-center justify-between border-b border-neutral-800">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-sm tracking-tighter group-hover:bg-[#c2410c] group-hover:text-white transition">
              <Scale className="w-4 h-4" />
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
            <div className="w-8 h-8 bg-white text-black hover:bg-[#c2410c] hover:text-white flex items-center justify-center font-bold text-sm transition">
              <Scale className="w-4 h-4" />
            </div>
          </Link>
        )}

        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            title="Sembunyikan Sidebar"
            aria-label="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* New Consultation CTA Button (Screenshot style '+') */}
      <div className="p-3 border-b border-neutral-800 flex justify-center">
        {onNewChat ? (
          <button
            onClick={onNewChat}
            className={`w-full py-2.5 px-3 bg-neutral-800 hover:bg-[#c2410c] text-white transition font-mono uppercase text-xs font-bold flex items-center justify-center gap-2 cursor-pointer rounded-lg ${
              collapsed ? 'w-10 h-10 p-0 rounded-full bg-neutral-800 hover:bg-[#c2410c]' : ''
            }`}
            title="Mulai Konsultasi Baru"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Konsultasi Baru</span>}
          </button>
        ) : (
          <Link
            href="/"
            className={`w-full py-2.5 px-3 bg-neutral-800 hover:bg-[#c2410c] text-white transition font-mono uppercase text-xs font-bold flex items-center justify-center gap-2 cursor-pointer rounded-lg ${
              collapsed ? 'w-10 h-10 p-0 rounded-full bg-neutral-800 hover:bg-[#c2410c]' : ''
            }`}
            title="Mulai Konsultasi Baru"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Konsultasi Baru</span>}
          </Link>
        )}
      </div>

      {/* Main Nav Items (Icon dock in collapsed mode, full list in expanded) */}
      <div className="flex-1 overflow-y-auto p-2 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <span className="editorial-meta text-neutral-500 block px-2 mb-1.5 text-[10px]">
              NAVIGASI UTAMA
            </span>
          )}

          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition rounded-md ${
              pathname === '/'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title="Konsultasi AI (Chat)"
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Konsultasi AI</span>}
          </Link>

          <Link
            href="/search"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition rounded-md ${
              pathname === '/search'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title="Cari Regulasi & Pasal"
          >
            <Search className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Cari Regulasi</span>}
          </Link>

          <Link
            href="/regulations"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition rounded-md ${
              pathname === '/regulations'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            } ${collapsed ? 'justify-center px-0' : ''}`}
            title="Katalog Peraturan Positif"
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Katalog Hukum</span>}
          </Link>

          <Link
            href="/disclaimer"
            className={`flex items-center gap-3 px-3 py-2.5 text-xs font-mono uppercase transition rounded-md ${
              pathname === '/disclaimer'
                ? 'bg-neutral-800 text-white font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            } ${collapsed ? 'justify-center px-0' : ''}`}
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
            <div className="space-y-0.5">
              {QUICK_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => onSelectTopic && onSelectTopic(topic.label)}
                  className="w-full text-left px-2.5 py-1.5 text-[11.5px] font-mono text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center justify-between group cursor-pointer rounded"
                >
                  <span className="truncate">{topic.icon} {topic.label}</span>
                  <ChevronRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER SECTION MOVED DIRECTLY INTO SIDEBAR (PRD Official Sources) */}
        {!collapsed && (
          <div className="space-y-3 pt-4 border-t border-neutral-800">
            <span className="editorial-meta text-[#c2410c] block px-2 text-[10px]">
              PORTAL JDIH PEMERINTAH RESMI
            </span>
            <div className="space-y-1 text-[11px] font-mono text-neutral-400 px-2">
              <a 
                href="https://jdihn.go.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between py-1 hover:text-white transition"
              >
                <span>JDIHN Nasional</span>
                <ExternalLink className="w-3 h-3 text-neutral-600" />
              </a>
              <a 
                href="https://peraturan.bpk.go.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between py-1 hover:text-white transition"
              >
                <span>Database BPK RI</span>
                <ExternalLink className="w-3 h-3 text-neutral-600" />
              </a>
              <a 
                href="https://peraturan.go.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between py-1 hover:text-white transition"
              >
                <span>Peraturan.go.id</span>
                <ExternalLink className="w-3 h-3 text-neutral-600" />
              </a>
              <a 
                href="https://jdih.mahkamahagung.go.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between py-1 hover:text-white transition"
              >
                <span>Mahkamah Agung RI</span>
                <ExternalLink className="w-3 h-3 text-neutral-600" />
              </a>
              <a 
                href="https://mkri.id" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-between py-1 hover:text-white transition"
              >
                <span>Mahkamah Konstitusi</span>
                <ExternalLink className="w-3 h-3 text-neutral-600" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Section in Sidebar */}
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

            <div className="pt-2 border-t border-neutral-800 text-[10.5px] text-neutral-500 space-y-1">
              <p className="leading-snug">
                HukumAI (law.web.id) · Berbasis Hukum Positif RI. Bukan pengganti kuasa advokat.
              </p>
              <div className="flex items-center justify-between pt-1">
                {onOpenDisclaimer && (
                  <button
                    onClick={onOpenDisclaimer}
                    className="text-neutral-400 hover:text-amber-400 transition cursor-pointer underline"
                  >
                    Disclaimer
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
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <button
              onClick={onToggle}
              className="p-2 text-neutral-400 hover:text-white transition cursor-pointer"
              title="Buka Menu Sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
            <span className="w-2 h-2 rounded-full bg-emerald-500" title="Gemini 2.5 Flash Active" />
            {onOpenDisclaimer && (
              <button
                onClick={onOpenDisclaimer}
                className="p-1 text-neutral-400 hover:text-amber-400 transition cursor-pointer"
                title="Legal Disclaimer"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            <a
              href="https://github.com/joshhh22/lawAI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-neutral-400 hover:text-white transition"
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
