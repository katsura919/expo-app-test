export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MED' | 'LOW';
  category?: string;
  dueDate?: string;
  recurring?: 'daily' | 'weekly' | 'monthly' | null;
  completedAt?: string;
  createdAt: string;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  duration: number;
  startedAt: string;
  completedAt?: string;
}

export interface DailyGoal {
  date: string;
  text: string;
  completedAt?: string;
}

export interface AppState {
  onboardingDone: boolean;
  streak: number;
  lastActiveDate: string;
  totalFocusMinutes: number;
  dailyGoals: DailyGoal[];
}
