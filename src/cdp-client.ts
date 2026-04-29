import CDP from 'chrome-remote-interface';
import { consoleLogs, wsFrames } from './buffers.js';

export interface CdpTarget {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface ConnectedState {
  client: CDP.Client;
  target: CdpTarget;
}

let state: ConnectedState | null = null;

// requestId → websocket URL, populated from Network.webSocketCreated
const wsUrls = new Map<string, string>();

const cdpHost = '127.0.0.1';
const cdpPort = parseInt(process.env['CDP_PORT'] ?? '9222', 10);

export async function listTargets(): Promise<CdpTarget[]> {
  const targets = await CDP.List({ host: cdpHost, port: cdpPort });
  return targets
    .filter((t) => t.type === 'page' || t.type === 'iframe')
    .map((t) => ({
      id: t.id,
      title: t.title ?? '(no title)',
      url: t.url,
      type: t.type,
    }));
}

export async function connectTarget(targetId: string): Promise<CdpTarget> {
  if (state) {
    await state.client.close();
    state = null;
    wsUrls.clear();
    consoleLogs.clear();
    wsFrames.clear();
  }

  const targets = await listTargets();
  const target = targets.find((t) => t.id === targetId);
  if (!target) throw new Error(`Target not found: ${targetId}`);

  const client = await CDP({ host: cdpHost, port: cdpPort, target: targetId });

  await Promise.all([
    client.Runtime.enable(),
    client.Network.enable(),
    client.Log.enable(),
  ]);

  client.on('Runtime.consoleAPICalled', (params: any) => {
    const text = params.args
      .map((a: any) => (a.value !== undefined ? String(a.value) : a.description ?? a.type))
      .join(' ');
    consoleLogs.push({
      timestamp: params.timestamp,
      level: params.type,
      text,
      url: params.stackTrace?.callFrames?.[0]?.url,
      lineNumber: params.stackTrace?.callFrames?.[0]?.lineNumber,
    });
  });

  client.on('Log.entryAdded', (params: any) => {
    const entry = params.entry;
    consoleLogs.push({
      timestamp: Date.now(),
      level: entry.level,
      text: entry.text,
      url: entry.url,
      lineNumber: entry.lineNumber,
    });
  });

  client.on('Network.webSocketCreated', (params: any) => {
    wsUrls.set(params.requestId, params.url);
  });

  client.on('Network.webSocketFrameReceived', (params: any) => {
    wsFrames.push({
      timestamp: params.timestamp,
      direction: 'received',
      url: wsUrls.get(params.requestId) ?? params.requestId,
      payloadData: params.response.payloadData,
    });
  });

  client.on('Network.webSocketFrameSent', (params: any) => {
    wsFrames.push({
      timestamp: params.timestamp,
      direction: 'sent',
      url: wsUrls.get(params.requestId) ?? params.requestId,
      payloadData: params.response.payloadData,
    });
  });

  state = { client, target };
  return target;
}

export function getClient(): CDP.Client {
  if (!state) throw new Error('Not connected. Call connect() first.');
  return state.client;
}

export function getConnectedTarget(): CdpTarget | null {
  return state?.target ?? null;
}
