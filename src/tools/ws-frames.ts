import { wsFrames } from '../buffers.js';

export function handleGetWsFrames(
  limit = 50,
  urlFilter?: string,
  direction?: 'sent' | 'received'
): string {
  let entries = wsFrames.toArray();

  if (urlFilter) {
    entries = entries.filter((e) => e.url.includes(urlFilter));
  }
  if (direction) {
    entries = entries.filter((e) => e.direction === direction);
  }

  entries = entries.slice(0, limit);

  if (entries.length === 0) return 'No WebSocket frames in buffer matching the given filters.';
  return JSON.stringify(entries, null, 2);
}
