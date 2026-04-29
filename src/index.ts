import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { handleListTargets } from './tools/list-targets.js';
import { handleConnect } from './tools/connect.js';
import { handleEvaluateJs } from './tools/evaluate.js';
import { handleGetConsoleLogs } from './tools/console-logs.js';
import { handleGetWsFrames } from './tools/ws-frames.js';
import { handleGetEventListeners } from './tools/event-listeners.js';
import { handleClearBuffers } from './tools/clear-buffers.js';

const server = new Server(
  { name: 'browser-devtools', version: '0.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_targets',
      description: 'Lists all inspectable page targets in the connected browser.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
    {
      name: 'connect',
      description: 'Attaches to a browser tab by target ID. Enables Runtime and Network domains and starts buffering console logs and WebSocket frames.',
      inputSchema: {
        type: 'object',
        properties: {
          targetId: { type: 'string', description: 'Target ID from list_targets' },
        },
        required: ['targetId'],
      },
    },
    {
      name: 'evaluate_js',
      description: 'Evaluates a JavaScript expression in the connected page context.',
      inputSchema: {
        type: 'object',
        properties: {
          expression: { type: 'string', description: 'JavaScript expression to evaluate' },
        },
        required: ['expression'],
      },
    },
    {
      name: 'get_console_logs',
      description: 'Returns buffered console output from the connected page, most recent first.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max entries to return (default 50)' },
          level: {
            type: 'string',
            enum: ['log', 'warn', 'error', 'info', 'debug'],
            description: 'Filter by log level (default: all)',
          },
        },
        required: [],
      },
    },
    {
      name: 'get_ws_frames',
      description: 'Returns buffered WebSocket frames from the connected page, most recent first.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max frames to return (default 50)' },
          urlFilter: { type: 'string', description: 'Substring match on WebSocket URL' },
          direction: {
            type: 'string',
            enum: ['sent', 'received'],
            description: 'Filter to sent or received frames only (default: both)',
          },
        },
        required: [],
      },
    },
    {
      name: 'get_event_listeners',
      description: 'Returns event listeners registered on the DOM element matched by a CSS selector.',
      inputSchema: {
        type: 'object',
        properties: {
          selector: { type: 'string', description: 'CSS selector, e.g. "#my-element"' },
        },
        required: ['selector'],
      },
    },
    {
      name: 'clear_buffers',
      description: 'Clears the console log and WebSocket frame ring buffers.',
      inputSchema: { type: 'object', properties: {}, required: [] },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const a = (args ?? {}) as Record<string, unknown>;

  try {
    let text: string;

    switch (name) {
      case 'list_targets':
        text = await handleListTargets();
        break;
      case 'connect':
        text = await handleConnect(a['targetId'] as string);
        break;
      case 'evaluate_js':
        text = await handleEvaluateJs(a['expression'] as string);
        break;
      case 'get_console_logs':
        text = handleGetConsoleLogs(
          a['limit'] as number | undefined,
          a['level'] as string | undefined
        );
        break;
      case 'get_ws_frames':
        text = handleGetWsFrames(
          a['limit'] as number | undefined,
          a['urlFilter'] as string | undefined,
          a['direction'] as 'sent' | 'received' | undefined
        );
        break;
      case 'get_event_listeners':
        text = await handleGetEventListeners(a['selector'] as string);
        break;
      case 'clear_buffers':
        text = handleClearBuffers();
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return { content: [{ type: 'text', text }] };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write('BrowserDevToolsMCP server started\n');
}

main().catch((err) => {
  process.stderr.write(`Fatal: ${err}\n`);
  process.exit(1);
});
