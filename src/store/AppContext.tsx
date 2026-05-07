import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import type { AppState } from '@/lib/types';

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
  setOnboardingDone: () => Promise<void>;
  updateAppState: (patch: Partial<AppState>) => Promise<void>;
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

  return (
    <AppContext.Provider value={{ appState, isLoading, setOnboardingDone, updateAppState }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}
