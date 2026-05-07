import type { Task } from './types';

export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function toDateStr(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function today(): string {
  return toDateStr();
}

export function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return toDateStr(d);
}

export function scoreTask(task: Task): number {
  if (!task.completedAt) return 0;
  const base = task.priority === 'HIGH' ? 30 : task.priority === 'MED' ? 20 : 10;
  const onTime =
    task.dueDate && task.completedAt.split('T')[0] <= task.dueDate ? 10 : 0;
  return base + onTime;
}
