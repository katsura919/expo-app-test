import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { genId } from '@/lib/utils';
import type { Task } from '@/lib/types';
import { useApp } from './AppContext';

interface TasksContextValue {
  tasks: Task[];
  addTask: (t: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextValue | null>(null);

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { checkStreak } = useApp();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    storage.tasks.get().then((saved) => {
      if (saved) setTasks(saved);
    });
  }, []);

  async function save(next: Task[]) {
    setTasks(next);
    await storage.tasks.set(next);
  }

  async function addTask(t: Omit<Task, 'id' | 'createdAt'>) {
    await save([...tasks, { ...t, id: genId(), createdAt: new Date().toISOString() }]);
  }

  async function updateTask(id: string, patch: Partial<Task>) {
    await save(tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function deleteTask(id: string) {
    await save(tasks.filter((t) => t.id !== id));
  }

  async function toggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    const completing = !task?.completedAt;

    await save(
      tasks.map((t) =>
        t.id === id
          ? { ...t, completedAt: t.completedAt ? undefined : new Date().toISOString() }
          : t
      )
    );

    if (completing) checkStreak();
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be inside TasksProvider');
  return ctx;
}
