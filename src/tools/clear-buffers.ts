import { consoleLogs, wsFrames } from '../buffers.js';

export function handleClearBuffers(): string {
  consoleLogs.clear();
  wsFrames.clear();
  return 'Console log and WebSocket frame buffers cleared.';
}
