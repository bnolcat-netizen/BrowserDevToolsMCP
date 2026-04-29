# BrowserDevToolsMCP -- Progress Tracker

*Updated: 2026-04-29 (Phase 1 complete). Used to orient Claude Code at session start.*

> **Spec:** See BUILD_PLAN.md for full build plan.

---

## Completed

### Housekeeping
- Template placeholders filled in (CLAUDE.md, PROGRESS.md, README.md)

### Phase 1 — Project scaffold and core infrastructure
- `package.json` + `tsconfig.json` + `.gitignore`
- `src/buffers.ts` — ring buffer (newest-first, configurable via `CDP_BUFFER_SIZE`)
- `src/cdp-client.ts` — CDP connection singleton, event wiring for console/WS
- `src/index.ts` — MCP server entry point, all 7 tools registered
- `src/tools/` — all 7 tool handlers implemented
- Build verified: `tsc` compiles clean, server starts up

---

## What's Next

### Phase 2 — Live testing against a real browser

#### To do next
- Register in a project's `.claude/settings.json` as `browser-devtools` MCP server
- Run `/mcp` in Claude Code to load the tools
- Connect to a real browser tab and exercise each tool
- Fix any issues found during live testing

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
