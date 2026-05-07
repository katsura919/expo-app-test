export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function toDateStr(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function today(): string {
  return toDateStr();
}
