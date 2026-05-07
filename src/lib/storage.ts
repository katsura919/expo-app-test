import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Task, FocusSession, AppState } from './types';

const KEYS = {
  tasks: '@dailyos/tasks',
  focusSessions: '@dailyos/focus_sessions',
  appState: '@dailyos/app_state',
} as const;

async function get<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T) : null;
}

async function set<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  tasks: {
    get: () => get<Task[]>(KEYS.tasks),
    set: (v: Task[]) => set(KEYS.tasks, v),
  },
  focusSessions: {
    get: () => get<FocusSession[]>(KEYS.focusSessions),
    set: (v: FocusSession[]) => set(KEYS.focusSessions, v),
  },
  appState: {
    get: () => get<AppState>(KEYS.appState),
    set: (v: AppState) => set(KEYS.appState, v),
  },
};
