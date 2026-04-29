import { listTargets } from '../cdp-client.js';

export async function handleListTargets(): Promise<string> {
  const targets = await listTargets();
  if (targets.length === 0) {
    return 'No inspectable targets found. Is the browser running with --remote-debugging-port=9222?';
  }
  return JSON.stringify(targets, null, 2);
}
