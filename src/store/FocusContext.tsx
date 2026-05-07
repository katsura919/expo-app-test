import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { storage } from '@/lib/storage';
import { genId } from '@/lib/utils';
import type { FocusSession } from '@/lib/types';

export const WORK_DURATIONS = [25, 50, 90] as const;
export type WorkDuration = (typeof WORK_DURATIONS)[number];

const BREAK_MINS: Record<WorkDuration, number> = { 25: 5, 50: 10, 90: 15 };

export type FocusMode = 'idle' | 'work' | 'break';

interface FocusContextValue {
  sessions: FocusSession[];
  mode: FocusMode;
  isRunning: boolean;
  remaining: number;
  workDuration: WorkDuration;
  linkedTaskId: string | null;
  setWorkDuration: (d: WorkDuration) => void;
  setLinkedTaskId: (id: string | null) => void;
  startPause: () => void;
  reset: () => void;
  totalFocusMinutes: number;
  todaySessions: number;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [mode, setMode] = useState<FocusMode>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [workDuration, setWorkDurationState] = useState<WorkDuration>(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [linkedTaskId, setLinkedTaskId] = useState<string | null>(null);

  const sessionStartRef = useRef(new Date().toISOString());

  useEffect(() => {
    storage.focusSessions.get().then((saved) => {
      if (saved) setSessions(saved);
    });
  }, []);

  // Tick
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setRemaining((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // Timer zero handler
  useEffect(() => {
    if (remaining !== 0 || !isRunning) return;

    if (mode === 'work') {
      const session: FocusSession = {
        id: genId(),
        taskId: linkedTaskId ?? undefined,
        duration: workDuration,
        startedAt: sessionStartRef.current,
        completedAt: new Date().toISOString(),
      };
      setSessions((prev) => {
        const next = [...prev, session];
        storage.focusSessions.set(next);
        return next;
      });
      const breakMins = BREAK_MINS[workDuration];
      setMode('break');
      setRemaining(breakMins * 60);
      sessionStartRef.current = new Date().toISOString();
    } else if (mode === 'break') {
      setIsRunning(false);
      setMode('idle');
      setRemaining(workDuration * 60);
    }
  }, [remaining, isRunning, mode, workDuration, linkedTaskId]);

  function startPause() {
    if (mode === 'idle') {
      setMode('work');
      setRemaining(workDuration * 60);
      setIsRunning(true);
      sessionStartRef.current = new Date().toISOString();
    } else {
      setIsRunning((prev) => !prev);
    }
  }

  function reset() {
    setIsRunning(false);
    setMode('idle');
    setRemaining(workDuration * 60);
  }

  function setWorkDuration(d: WorkDuration) {
    if (mode !== 'idle') return;
    setWorkDurationState(d);
    setRemaining(d * 60);
  }

  const completedSessions = sessions.filter((s) => !!s.completedAt);
  const totalFocusMinutes = completedSessions.reduce(
    (sum, s) => sum + s.duration,
    0
  );
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = completedSessions.filter(
    (s) => s.completedAt!.startsWith(todayStr)
  ).length;

  return (
    <FocusContext.Provider
      value={{
        sessions,
        mode,
        isRunning,
        remaining,
        workDuration,
        linkedTaskId,
        setWorkDuration,
        setLinkedTaskId,
        startPause,
        reset,
        totalFocusMinutes,
        todaySessions,
      }}
    >
      {children}
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const ctx = useContext(FocusContext);
  if (!ctx) throw new Error('useFocus must be inside FocusProvider');
  return ctx;
}
