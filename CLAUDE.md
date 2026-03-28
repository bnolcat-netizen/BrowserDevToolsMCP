# Claude Code Instructions

## Constraints
- Ask before creating any new files not established in the project spec
- Ask before installing any new packages
- Make small, focused commits — one feature at a time
- Do not proceed to the next project phase without confirmation

## Context
- See PROGRESS.md for current state (if present)
- See [SPEC_FILE] for full project spec

## File Reading Priority
Start each session by reading the primary context file (e.g. PROGRESS.md) only. Consult
other files only when you need specific implementation details. Do not ingest the full
codebase on every session start.

## Model Routing

**At the start of every non-trivial task, state which tier fits and include the switch
command — before doing any work.** Do not wait to be asked.

| Tier | Use for | Switch |
|------|---------|--------|
| **Haiku** | File reads, summaries, simple edits, one-off scripts, checking git status | `/model claude-haiku-4-5-20251001` |
| **Sonnet** | Pipeline logic, debugging, moderate refactors, most feature work, committing | `/model claude-sonnet-4-6` |
| **Opus** | Architecture decisions, complex prompt engineering, major redesigns, cross-file overhauls | `/model claude-opus-4-6` |

Format: "Recommended: **Haiku** — `/model claude-haiku-4-5-20251001`" then wait for
confirmation before proceeding if switching would save meaningful cost.

If unsure which model strings are available, run `/model` first.

## Session Health & Context Management

You are responsible for monitoring context bloat and flagging it proactively.

### Hard thresholds — warn immediately when:
- **15+ distinct files** read in this session
- **25+ tool calls** made in this session
- A single tool call returns **500+ lines** of output
- You catch yourself re-reading a file already in context
- I ask you to do something you already did earlier in the session (drift signal)

### Soft triggers — suggest `/compact` when:
- A commit is made (natural session boundary)
- A feature or fix is fully complete and tested
- The task is switching topic (e.g., implementation → review → new feature)

### How to warn:
Prepend your response with:
> ⚠️ **Context check:** [specific reason, e.g. "16 files read"]. Run `/compact` before
> continuing, or `/clear` if switching to a new task.

### Subagent routing
Protect the main context window by delegating to subagents when:
- Exploring unfamiliar parts of the codebase (5+ files to read)
- Running scripts or tests whose output you don't need inline
- Fetching or summarizing external documentation

### Anti-patterns to call out:
- Vague requests like "improve this" or "look through the codebase" — push back and ask
  to scope it
- Reaching for a full pipeline/test run inline — suggest a background subagent instead
- No `/compact` after completing a distinct feature or after a commit
