import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { today, daysAgo } from '@/lib/utils';
import type { AppState, DailyGoal } from '@/lib/types';

const DEFAULT: AppState = {
  onboardingDone: false,
  streak: 0,
  lastActiveDate: '',
  totalFocusMinutes: 0,
  dailyGoals: [],
};

interface AppContextValue {
  appState: AppState;
  isLoading: boolean;
  todayGoal: DailyGoal | null;
  setOnboardingDone: () => Promise<void>;
  updateAppState: (patch: Partial<AppState>) => Promise<void>;
  checkStreak: () => void;
  setTodayGoal: (text: string) => Promise<void>;
  completeTodayGoal: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppState>(DEFAULT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage.appState.get().then((saved) => {
      if (saved) setAppState(saved);
      setIsLoading(false);
    });
  }, []);

  async function updateAppState(patch: Partial<AppState>) {
    const next = { ...appState, ...patch };
    setAppState(next);
    await storage.appState.set(next);
  }

  async function setOnboardingDone() {
    await updateAppState({ onboardingDone: true });
  }

  // Streak freeze: miss 1 day → streak preserved. Miss 2+ days → reset.
  function checkStreak() {
    const t = today();
    if (appState.lastActiveDate === t) return;

    const twoDaysAgo = daysAgo(2);
    const newStreak =
      appState.lastActiveDate && appState.lastActiveDate >= twoDaysAgo
        ? appState.streak + 1
        : 1;

    updateAppState({ streak: newStreak, lastActiveDate: t });
  }

  async function setTodayGoal(text: string) {
    const t = today();
    const exists = appState.dailyGoals.some((g) => g.date === t);
    const dailyGoals = exists
      ? appState.dailyGoals.map((g) => (g.date === t ? { ...g, text } : g))
      : [...appState.dailyGoals, { date: t, text }];
    await updateAppState({ dailyGoals });
  }

  async function completeTodayGoal() {
    const t = today();
    const dailyGoals = appState.dailyGoals.map((g) =>
      g.date === t
        ? { ...g, completedAt: g.completedAt ? undefined : new Date().toISOString() }
        : g
    );
    await updateAppState({ dailyGoals });
  }

  const todayGoal = appState.dailyGoals.find((g) => g.date === today()) ?? null;

  return (
    <AppContext.Provider
      value={{
        appState,
        isLoading,
        todayGoal,
        setOnboardingDone,
        updateAppState,
        checkStreak,
        setTodayGoal,
        completeTodayGoal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
