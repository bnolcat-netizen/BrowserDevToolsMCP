# BrowserDevToolsMCP -- Progress Tracker

*Updated: 2026-04-29. Used to orient Claude Code at session start.*

> **Spec:** See BUILD_PLAN.md for full build plan.

---

## Completed

### Housekeeping
- Template placeholders filled in (CLAUDE.md, PROGRESS.md, README.md)

---

## What's Next

### Phase 1 -- Project scaffold and core infrastructure

#### To build next
- `package.json` + `tsconfig.json`
- `src/buffers.ts` — ring buffer for console logs and WS frames
- `src/cdp-client.ts` — CDP connection lifecycle, target selection
- `src/index.ts` — MCP server entry point, tool registration

#### Then (Phase 2 -- Tools)
- `src/tools/list-targets.ts`
- `src/tools/connect.ts`
- `src/tools/evaluate.ts`
- `src/tools/console-logs.ts`
- `src/tools/ws-frames.ts`
- `src/tools/event-listeners.ts`
- `src/tools/clear-buffers.ts`

#### Deferred
- None

---

## Decisions Already Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js + TypeScript | CDP clients most naturally written in JS/TS; canonical `chrome-remote-interface` is a Node package |
| CDP client | `chrome-remote-interface` | Canonical library for CDP over WebSocket |
| MCP framework | `@modelcontextprotocol/sdk` | Standard MCP server framework |
| Buffer size | 500 entries (configurable via `CDP_BUFFER_SIZE`) | Enough history for an investigation session |
| Browser management | User-launched, server attaches | User navigates to target app before connecting |

---

## Open Questions / Decisions

- None at project start

---

## Reference

- CDP debugging endpoint: `http://localhost:9222/json`
- Browser launch flag: `--remote-debugging-port=9222 --remote-debugging-address=127.0.0.1`
- MCP registration target: `decisions-investigations` project `.claude/settings.json`
