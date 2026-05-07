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
  energyToday: number | null;
  needsBoot: boolean;
  needsEnergyCheckIn: boolean;
  isWeeklyReviewDue: boolean;
  setOnboardingDone: () => Promise<void>;
  updateAppState: (patch: Partial<AppState>) => Promise<void>;
  checkStreak: () => void;
  setTodayGoal: (text: string) => Promise<void>;
  completeTodayGoal: () => Promise<void>;
  setBootDone: () => Promise<void>;
  setEnergyLevel: (level: number) => Promise<void>;
  dismissWeeklyReview: () => Promise<void>;
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

  // Streak freeze: miss 1 day → streak preserved. Miss 2+ days → reset to 1.
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

  async function setBootDone() {
    await updateAppState({ lastBootDate: today() });
  }

  async function setEnergyLevel(level: number) {
    await updateAppState({ energyLevel: level, energyDate: today() });
  }

  async function dismissWeeklyReview() {
    await updateAppState({ lastWeeklyReviewDate: today() });
  }

  const t = today();
  const todayGoal = appState.dailyGoals.find((g) => g.date === t) ?? null;
  const energyToday =
    appState.energyDate === t ? (appState.energyLevel ?? null) : null;
  const needsBoot = appState.lastBootDate !== t;
  const needsEnergyCheckIn = appState.energyDate !== t;
  const isWeeklyReviewDue =
    new Date().getDay() === 0 && appState.lastWeeklyReviewDate !== t;

  return (
    <AppContext.Provider
      value={{
        appState,
        isLoading,
        todayGoal,
        energyToday,
        needsBoot,
        needsEnergyCheckIn,
        isWeeklyReviewDue,
        setOnboardingDone,
        updateAppState,
        checkStreak,
        setTodayGoal,
        completeTodayGoal,
        setBootDone,
        setEnergyLevel,
        dismissWeeklyReview,
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
