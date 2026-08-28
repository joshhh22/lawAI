'use client';

import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Trash2,
  Globe,
  Code2
} from 'lucide-react';
import { ChatSession } from '@/lib/types';
import { getSavedSessions, deleteSession, formatTimeAgo } from '@/lib/chatStorage';
import { useLanguage } from '@/context/LanguageContext';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeSessionId?: string | null;
  onSelectSession?: (sessionId: string) => void;
  onNewChat?: () => void;
  onOpenDisclaimer?: () => void;
  onOpenSettings?: () => void;
}

export default function AppSidebar({
  collapsed,
  onToggle,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onOpenDisclaimer,
  onOpenSettings
}: AppSidebarProps) {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  
  // Collapsible sub-menus
  const [showTopicsAccordion, setShowTopicsAccordion] = useState(false);
  const [showJdihAccordion, setShowJdihAccordion] = useState(false);

  const quickTopics = [
    { label: t.preset1Label, icon: '📄', text: t.preset1Text },
    { label: t.preset2Label, icon: '⚖️', text: t.preset2Text },
    { label: t.preset3Label, icon: '🛡️', text: t.preset3Text },
    { label: t.preset4Label, icon: '🔒', text: t.preset4Text },
    { label: t.preset5Label, icon: '🛒', text: t.preset5Text },
    { label: t.preset6Label, icon: '📑', text: t.preset6Text }
  ];

  // Load sessions from storage
  const loadSessions = () => {
    setSessions(getSavedSessions());
  };

  useEffect(() => {
    loadSessions();

    const handleStorageChange = () => loadSessions();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [activeSessionId]);

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteSession(id);
    loadSessions();
    if (activeSessionId === id && onNewChat) {
      onNewChat();
    }
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchHistoryQuery.toLowerCase())
  );

  return (
    <aside
      className={`bg-[#111215] text-[#fbfbfa] border-r border-neutral-800 transition-all duration-300 flex flex-col z-30 shrink-0 select-none ${
        collapsed ? 'w-16' : 'w-72'
      }`}
    >
      {/* Top Header with Logo and Collapse icon */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-800">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-sm tracking-tighter group-hover:bg-[#c2410c] group-hover:text-white transition rounded-md">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-[#c2410c] transition">
                  {t.appName}
                </span>
                <span className="text-[9px] font-mono bg-neutral-800 text-neutral-300 px-1 py-0.2 rounded uppercase">
                  {language}
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 block -mt-0.5">
                {t.appSubtitle}
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="mx-auto" title="CekHukum Home">
            <div className="w-8 h-8 bg-white text-black hover:bg-[#c2410c] hover:text-white flex items-center justify-center font-bold text-sm transition rounded-md">
              <Scale className="w-4 h-4" />
            </div>
          </Link>
        )}

        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer rounded-md"
            title="Sembunyikan Sidebar"
            aria-label="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Top Navigation Items */}
      <div className="p-3 pb-2 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase transition rounded-lg ${
            pathname === '/' && !activeSessionId
              ? 'bg-white text-black font-bold shadow-xs'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
          } ${collapsed ? 'justify-center px-0' : ''}`}
          title={t.navChat}
        >
          <MessageSquare className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t.navChat}</span>}
        </Link>

        <Link
          href="/search"
          className={`flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase transition rounded-lg ${
            pathname === '/search'
              ? 'bg-white text-black font-bold shadow-xs'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
          } ${collapsed ? 'justify-center px-0' : ''}`}
          title={t.navSearch}
        >
          <Search className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t.navSearch}</span>}
        </Link>

        <Link
          href="/regulations"
          className={`flex items-center gap-3 px-3 py-2 text-xs font-mono uppercase transition rounded-lg ${
            pathname === '/regulations'
              ? 'bg-white text-black font-bold shadow-xs'
              : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
          } ${collapsed ? 'justify-center px-0' : ''}`}
          title={t.navCatalog}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          {!collapsed && <span>{t.navCatalog}</span>}
        </Link>
      </div>

      <div className="mx-3 border-b border-neutral-800" />

      {/* New Consultation CTA Button */}
      <div className="p-3">
        {onNewChat ? (
          <button
            onClick={onNewChat}
            className={`w-full py-2.5 px-3 bg-[#1c2826] hover:bg-[#253633] text-emerald-300 border border-emerald-900/60 transition font-mono uppercase text-xs font-bold flex items-center justify-center gap-2 cursor-pointer rounded-lg shadow-xs active:scale-98 ${
              collapsed ? 'w-10 h-10 p-0 rounded-full mx-auto' : ''
            }`}
            title={t.newChat}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{t.newChat}</span>}
          </button>
        ) : (
          <Link
            href="/"
            className={`w-full py-2.5 px-3 bg-[#1c2826] hover:bg-[#253633] text-emerald-300 border border-emerald-900/60 transition font-mono uppercase text-xs font-bold flex items-center justify-center gap-2 cursor-pointer rounded-lg shadow-xs active:scale-98 ${
              collapsed ? 'w-10 h-10 p-0 rounded-full mx-auto' : ''
            }`}
            title={t.newChat}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{t.newChat}</span>}
          </Link>
        )}
      </div>

      {/* Search Chat History */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchHistoryQuery}
              onChange={(e) => setSearchHistoryQuery(e.target.value)}
              placeholder={t.searchHistoryPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 bg-[#17181c] border border-neutral-800 text-xs font-mono text-neutral-200 placeholder:text-neutral-500 rounded-lg focus:outline-none focus:border-neutral-600"
            />
          </div>
        </div>
      )}

      {/* Scrollable Center: CHAT HISTORY */}
      <div className="flex-1 overflow-y-auto px-3 space-y-4">
        {!collapsed && (
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="editorial-meta text-neutral-500 text-[10px]">
                {t.historyTitle} ({filteredSessions.length})
              </span>
            </div>

            {filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-[11px] font-mono text-neutral-500 bg-[#17181c] rounded-lg border border-neutral-800/60">
                {searchHistoryQuery ? t.historyEmptySearch : t.historyEmpty}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredSessions.map((session) => {
                  const isActive = activeSessionId === session.id;

                  return (
                    <div
                      key={session.id}
                      onClick={() => onSelectSession && onSelectSession(session.id)}
                      className={`group flex items-start justify-between p-2.5 rounded-lg text-left transition cursor-pointer border ${
                        isActive
                          ? 'bg-neutral-800 border-neutral-700 text-white'
                          : 'bg-transparent border-transparent hover:bg-neutral-900 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-neutral-500 group-hover:text-white" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono truncate leading-snug font-medium">
                            {session.title || 'Konsultasi Hukum'}
                          </p>
                          <span className="text-[10px] font-mono text-neutral-500 block mt-0.5">
                            {formatTimeAgo(session.updatedAt)}
                          </span>
                        </div>
                      </div>

                      {/* Delete individual session icon */}
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-neutral-500 transition cursor-pointer"
                        title="Hapus Riwayat"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* COLLAPSIBLE ACCORDION 1: TOPIK KASUS POPULER */}
        {!collapsed && (
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => setShowTopicsAccordion(!showTopicsAccordion)}
              className="w-full flex items-center justify-between p-1.5 text-neutral-400 hover:text-white transition text-left cursor-pointer rounded"
            >
              <span className="editorial-meta text-neutral-400 text-[10px]">
                {t.popularTopics}
              </span>
              {showTopicsAccordion ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {showTopicsAccordion && (
              <div className="space-y-0.5 mt-1 animate-in fade-in slide-in-from-top-1">
                {quickTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (onNewChat) onNewChat();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-[11px] font-mono text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center justify-between group cursor-pointer rounded"
                  >
                    <span className="truncate">{topic.icon} {topic.label}</span>
                    <ChevronRight className="w-3 h-3 text-neutral-600 group-hover:text-neutral-300 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COLLAPSIBLE ACCORDION 2: PORTAL JDIH PEMERINTAH */}
        {!collapsed && (
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => setShowJdihAccordion(!showJdihAccordion)}
              className="w-full flex items-center justify-between p-1.5 text-neutral-400 hover:text-white transition text-left cursor-pointer rounded"
            >
              <span className="editorial-meta text-neutral-400 text-[10px]">
                {t.officialJdihSources}
              </span>
              {showJdihAccordion ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>

            {showJdihAccordion && (
              <div className="space-y-1 mt-1 text-[11px] font-mono text-neutral-400 px-2 animate-in fade-in slide-in-from-top-1">
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
            )}
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
              <div className="flex items-center justify-between pt-1">
                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    className="flex items-center gap-1 text-neutral-300 hover:text-white transition cursor-pointer font-bold"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#c2410c]" />
                    <span>{t.settings}</span>
                  </button>
                )}

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
            
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-1 text-neutral-400 hover:text-white transition cursor-pointer"
                title={t.settings}
              >
                <Settings className="w-4 h-4 text-[#c2410c]" />
              </button>
            )}

            {onOpenDisclaimer && (
              <button
                onClick={onOpenDisclaimer}
                className="p-1 text-neutral-400 hover:text-amber-400 transition cursor-pointer"
                title="Legal Disclaimer"
              >
                <AlertCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
