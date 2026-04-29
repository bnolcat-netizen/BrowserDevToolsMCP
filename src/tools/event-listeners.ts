import { getClient } from '../cdp-client.js';

export async function handleGetEventListeners(selector: string): Promise<string> {
  const client = getClient() as any;

  const evalResult = await client.Runtime.evaluate({
    expression: `document.querySelector(${JSON.stringify(selector)})`,
    returnByValue: false,
  });

  if (evalResult.exceptionDetails) {
    throw new Error(evalResult.exceptionDetails.text ?? 'Evaluation error');
  }

  const objectId = evalResult.result?.objectId;
  if (!objectId) {
    return `No element matched selector: ${selector}`;
  }

  const listenersResult = await client.DOMDebugger.getEventListeners({ objectId });
  const listeners = listenersResult.listeners ?? [];

  if (listeners.length === 0) {
    return `No event listeners found on element matching: ${selector}`;
  }

  const simplified = listeners.map((l: any) => ({
    type: l.type,
    useCapture: l.useCapture,
    passive: l.passive,
    once: l.once,
    scriptLocation: l.location
      ? `${l.location.scriptId}:${l.location.lineNumber}:${l.location.columnNumber}`
      : undefined,
  }));

  return JSON.stringify(simplified, null, 2);
}
