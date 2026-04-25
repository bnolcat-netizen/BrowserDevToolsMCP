# Claude Code Instructions

## Setup Checklist
Complete these steps when first cloning this template:

1. In `CLAUDE.md`, replace `[SPEC_FILE]` with the name of your spec/build plan file
2. In `PROGRESS.md`, replace `[Project Name]`, `[DATE]`, and `[SPEC_FILE]`
3. In `README.md`, replace `[Project Name]` and the description placeholder
4. Delete this Setup Checklist section when done

## Constraints
- Ask before creating any new files not established in the project spec
- Ask before installing any new packages
- Make small, focused commits — one feature at a time
- Do not proceed to the next project phase without confirmation

## Context
- See PROGRESS.md for current state (if present)
- See [SPEC_FILE] for full project spec

## Documentation Maintenance
- Update `README.md` whenever a feature is completed, a setup step changes, or a new usage pattern is introduced
- README sections should reflect what the project can do *today*, not what is planned
- At the end of each phase, confirm README accurately describes setup, usage, and architecture before moving on

## File Reading Priority
Start each session by reading the primary context file (e.g. PROGRESS.md) only. Consult
other files only when you need specific implementation details. Do not ingest the full
codebase on every session start.

<!-- Model Routing and Session Health are defined in ~/.claude/CLAUDE.md -->

## CLAUDE.md Maintenance

Universal instructions (Model Routing, Session Health) live in `~/.claude/CLAUDE.md` and
apply to all projects automatically — do not duplicate them here.

This file should only contain project-specific sections: Setup Checklist, Constraints,
Context, Documentation Maintenance, File Reading Priority. When improving shared
instructions, edit `~/.claude/CLAUDE.md` only.