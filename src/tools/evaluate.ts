import { getClient } from '../cdp-client.js';

export async function handleEvaluateJs(expression: string): Promise<string> {
  const client = getClient();
  const result = await (client as any).Runtime.evaluate({
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    const ex = result.exceptionDetails;
    const msg = ex.exception?.description ?? ex.text ?? 'Unknown error';
    return JSON.stringify({ error: msg }, null, 2);
  }

  const value = result.result?.value;
  if (value === undefined) {
    return JSON.stringify({ type: result.result?.type, description: result.result?.description }, null, 2);
  }
  return JSON.stringify(value, null, 2);
}
