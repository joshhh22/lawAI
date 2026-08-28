'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatSession, ChatMessage, CaseAnalysis } from '@/lib/types';
import { 
  getSavedSessions, 
  getSessionById, 
  saveSession, 
  deleteSession as deleteSessionStorage,
  clearAllSessions,
  getActiveSessionId, 
  setActiveSessionId,
  generateSessionTitle 
} from '@/lib/chatStorage';

interface ChatContextType {
  sessions: ChatSession[];
  activeSession: ChatSession | null;
  activeSessionId: string | null;
  createNewChat: () => void;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  clearAllChatSessions: () => void;
  addMessageToActiveSession: (msg: ChatMessage) => void;
  updateActiveSessionWithAnalysis: (userText: string, analysis: CaseAnalysis) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);

  const refreshSessions = () => {
    const loaded = getSavedSessions();
    setSessions(loaded);
  };

  useEffect(() => {
    refreshSessions();
    const storedActive = getActiveSessionId();
    if (storedActive) {
      const sess = getSessionById(storedActive);
      if (sess) {
        setActiveId(sess.id);
        setActiveSession(sess);
      }
    }
  }, []);

  const createNewChat = () => {
    setActiveId(null);
    setActiveSession(null);
    setActiveSessionId(null);
  };

  const selectSession = (id: string) => {
    const sess = getSessionById(id);
    if (sess) {
      setActiveId(sess.id);
      setActiveSession(sess);
      setActiveSessionId(sess.id);
    }
  };

  const deleteSession = (id: string) => {
    deleteSessionStorage(id);
    refreshSessions();
    if (activeSessionId === id) {
      createNewChat();
    }
  };

  const clearAllChatSessions = () => {
    clearAllSessions();
    setSessions([]);
    createNewChat();
  };

  const addMessageToActiveSession = (msg: ChatMessage) => {
    let current = activeSession;
    const now = new Date().toISOString();

    if (!current) {
      current = {
        id: `sess_${Date.now()}`,
        title: generateSessionTitle(msg.text),
        createdAt: now,
        updatedAt: now,
        messages: [msg]
      };
    } else {
      current = {
        ...current,
        updatedAt: now,
        messages: [...current.messages, msg]
      };
    }

    setActiveId(current.id);
    setActiveSession(current);
    saveSession(current);
    refreshSessions();
  };

  const updateActiveSessionWithAnalysis = (userText: string, analysis: CaseAnalysis) => {
    const now = new Date().toISOString();
    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr
    };

    const assistantMsg: ChatMessage = {
      id: `ai_${Date.now()}`,
      sender: 'assistant',
      text: analysis.summary,
      timestamp: timeStr,
      analysis,
      suggestedFollowUps: analysis.followUpQuestions || [
        'Bagaimana prosedur jika mediasi gagal?',
        'Berapa batas waktu penuntutan untuk kasus ini?'
      ]
    };

    let current = activeSession;
    if (!current) {
      current = {
        id: `sess_${Date.now()}`,
        title: generateSessionTitle(userText),
        createdAt: now,
        updatedAt: now,
        domain: analysis.domain,
        messages: [userMsg, assistantMsg]
      };
    } else {
      current = {
        ...current,
        updatedAt: now,
        messages: [...current.messages, userMsg, assistantMsg]
      };
    }

    setActiveId(current.id);
    setActiveSession(current);
    saveSession(current);
    refreshSessions();
  };

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSession,
        activeSessionId,
        createNewChat,
        selectSession,
        deleteSession,
        clearAllChatSessions,
        addMessageToActiveSession,
        updateActiveSessionWithAnalysis
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
