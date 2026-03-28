# Claude Code Instructions

## Constraints
- Ask before creating any new files not established in the project spec
- Ask before installing any new packages
- Make small, focused commits -- one feature at a time
- Do not proceed to the next project phase without confirmation

## Context
- See PROGRESS.md for current state (if present)
- See [SPEC_FILE] for full project spec

## File Reading Priority
Start each session by reading `PROGRESS.md` only. Consult the spec file only when you need chapter content details or scope clarification. Do not ingest the full spec on every session start.

## Session Health & Context Management

You are responsible for monitoring context bloat and flagging it proactively.

### Warn me when:
- The conversation has grown long (many back-and-forth turns)
- You've read many files in this session (rough signal: 10+ distinct files)
- A tool call produces very verbose output (large test runs, log dumps, etc.)
- I ask you to do something you already did earlier in the session (sign of drift)
- You catch yourself re-reading a file already in context

### How to warn me:
Prepend your response with:

> ⚠️ **Context check:** [brief reason]. Consider running `/compact` or `/clear` if switching tasks.

### Anti-patterns to call out:
- Vague requests like "improve this" or "look through the codebase" -- push back and ask me to scope it
- Requests to run tests or fetch docs inline -- suggest using a subagent instead
- Completing a distinct feature or fix without a `/compact` prompt

## Model Routing

When suggesting a model for a task, check available models with `/model` first if unsure,
then recommend the appropriate tier and include the switch command.

**Tiers by task:**
- **Haiku** (fastest/cheapest): file reads, summaries, simple edits, one-off scripts
- **Sonnet** (balanced): pipeline logic, debugging, moderate refactors, most feature work
- **Opus** (most capable): architecture decisions, complex prompt engineering, major redesigns

Use the latest available model in the appropriate tier. Format your recommendation as:
"Recommended: **Sonnet** -- `/model <model-string>`"

If unsure which model strings are available, run `/model` before recommending.
