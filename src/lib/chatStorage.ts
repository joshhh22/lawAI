import { ChatSession, ChatMessage } from './types';

const STORAGE_KEY = 'hukumai_chat_sessions_v1';
const ACTIVE_SESSION_KEY = 'hukumai_active_session_id';

/**
 * Get all saved chat sessions sorted by updatedAt descending
 */
export function getSavedSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: ChatSession[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()) : [];
  } catch (e) {
    console.error('Error loading chat sessions:', e);
    return [];
  }
}

/**
 * Get a specific chat session by ID
 */
export function getSessionById(id: string): ChatSession | null {
  const sessions = getSavedSessions();
  return sessions.find((s) => s.id === id) || null;
}

/**
 * Save or update a chat session
 */
export function saveSession(session: ChatSession): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getSavedSessions();
    const existingIndex = sessions.findIndex((s) => s.id === session.id);

    const updatedSession = {
      ...session,
      updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      sessions[existingIndex] = updatedSession;
    } else {
      sessions.unshift(updatedSession);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    localStorage.setItem(ACTIVE_SESSION_KEY, session.id);
  } catch (e) {
    console.error('Error saving chat session:', e);
  }
}

/**
 * Delete a specific chat session
 */
export function deleteSession(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const sessions = getSavedSessions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    
    if (getActiveSessionId() === id) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  } catch (e) {
    console.error('Error deleting chat session:', e);
  }
}

/**
 * Get the currently active session ID
 */
export function getActiveSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACTIVE_SESSION_KEY);
}

/**
 * Set the currently active session ID
 */
export function setActiveSessionId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id) {
    localStorage.setItem(ACTIVE_SESSION_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
  }
}

/**
 * Format relative time in Indonesian (e.g. "Baru saja", "2 mnt lalu", "1 jam lalu", "Kemarin")
 */
export function formatTimeAgo(isoDate: string): string {
  try {
    const now = new Date();
    const past = new Date(isoDate);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} mnt lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return past.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  } catch {
    return '';
  }
}

/**
 * Create a concise title from user prompt
 */
export function generateSessionTitle(firstPrompt: string): string {
  const clean = firstPrompt.replace(/[^\w\s\(\)\-\/\?]/gi, '').trim();
  if (clean.length <= 32) return clean;
  return clean.slice(0, 30) + '...';
}
