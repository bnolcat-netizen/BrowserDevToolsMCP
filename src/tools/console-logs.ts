import { consoleLogs } from '../buffers.js';

export function handleGetConsoleLogs(limit = 50, level?: string): string {
  let entries = consoleLogs.toArray();

  if (level) {
    entries = entries.filter((e) => e.level === level);
  }

  entries = entries.slice(0, limit);

  if (entries.length === 0) return 'No console log entries in buffer.';
  return JSON.stringify(entries, null, 2);
}
