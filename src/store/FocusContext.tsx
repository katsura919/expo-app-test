import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { genId } from '@/lib/utils';
import type { FocusSession } from '@/lib/types';

interface FocusContextValue {
  sessions: FocusSession[];
  activeSession: FocusSession | null;
  startSession: (taskId?: string, duration?: number) => void;
  completeSession: () => Promise<void>;
  cancelSession: () => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);

  useEffect(() => {
    storage.focusSessions.get().then((saved) => {
      if (saved) setSessions(saved);
    });
  }, []);

  function startSession(taskId?: string, duration: number = 25) {
    setActiveSession({
      id: genId(),
      taskId,
      duration,
      startedAt: new Date().toISOString(),
    });
  }

  async function completeSession() {
    if (!activeSession) return;
    const completed = { ...activeSession, completedAt: new Date().toISOString() };
    const next = [...sessions, completed];
    setSessions(next);
    await storage.focusSessions.set(next);
    setActiveSession(null);
  }

  function cancelSession() {
    setActiveSession(null);
  }

  return (
    <FocusContext.Provider value={{ sessions, activeSession, startSession, completeSession, cancelSession }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus must be inside FocusProvider');
  return ctx;
}
