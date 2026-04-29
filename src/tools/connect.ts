import { connectTarget } from '../cdp-client.js';

export async function handleConnect(targetId: string): Promise<string> {
  const target = await connectTarget(targetId);
  return `Connected to "${target.title}" (${target.url})`;
}
