# BrowserDevToolsMCP

An MCP server that connects to a running Chrome/Edge browser via the Chrome DevTools Protocol (CDP) and exposes browser runtime inspection as tools Claude Code can call.

Primary use case: investigating live web applications — observing WebSocket/SignalR frames, running JS in the page context, and reading console output — without needing a full build-deploy-test cycle to test a hypothesis.

## Setup

### Prerequisites

- Node.js 20+
- Chrome or Edge

### Installation

```bash
npm install
npm run build
```

### Browser launch

Chrome or Edge must be started with remote debugging enabled before using any tools:

```
chrome.exe --remote-debugging-port=9222 --remote-debugging-address=127.0.0.1
```

### MCP registration

Add to your project's `.claude/settings.json` under `mcpServers`:

```json
"browser-devtools": {
  "command": "node",
  "args": ["C:\\projects\\BrowserDevToolsMCP\\dist\\index.js"],
  "env": {
    "CDP_PORT": "9222",
    "CDP_BUFFER_SIZE": "500"
  }
}
```

Restart Claude Code (or run `/mcp`) after registering.

## Usage

1. Launch browser with remote debugging enabled (see above)
2. Navigate to the target application and log in
3. In Claude Code: call `list_targets` to see open tabs
4. Call `connect` with the target ID to attach
5. Use `evaluate_js`, `get_console_logs`, `get_ws_frames`, `get_event_listeners`, `clear_buffers` as needed

## Architecture

```
src/
├── index.ts            # MCP server entry point, tool registration
├── cdp-client.ts       # CDP connection lifecycle, target selection singleton
├── buffers.ts          # Ring buffers for console logs and WS frames
└── tools/
    ├── list-targets.ts
    ├── connect.ts
    ├── evaluate.ts
    ├── console-logs.ts
    ├── ws-frames.ts
    ├── event-listeners.ts
    └── clear-buffers.ts
```

The server attaches to an already-running browser rather than launching one. Connection state is a module-level singleton — one active target at a time. CDP domains `Runtime` and `Network` are enabled on connect; events push into in-memory ring buffers immediately so logs accumulate before you call a tool.

## Development

```bash
npm run dev    # tsc --watch
npm run build  # tsc → dist/
node dist/index.js  # verify startup
```
