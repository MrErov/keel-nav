# Cursor Harness

> A single rules file (`.cursorrules`) that wires Keel Nav into Cursor.
> Same topology as the Claude Code harness: one doorway file, no shims.

## What this is

`.cursorrules` is read by Cursor at session start and becomes part of the
agent's persistent context. It is a condensed version of the Claude Code
`CLAUDE.md`, adapted to Cursor's constraints:

1. Cursor has no `/phase-*` commands — dispatch is via natural language.
2. Cursor's context budget is smaller than Claude Code's, so the file is
   tighter and refers to `.meta-skills/` for the full protocol.
3. Cursor has no sub-agent primitive, so Phase 1b's blindness relies on
   the agent refusing to execute — same limitation as Claude Code.

## What this is not

- **Not a fork.** The methodology lives in `.meta-skills/`.
- **Not a substitute for `AGENTS.md`.** `AGENTS.md` (project root) is
  canonical and overrides `.cursorrules` on conflict.

## Install

### In your own project

```bash
# 1. Clone Keel Nav somewhere persistent
git clone https://github.com/MrErov/keel-nav.git ~/keel-nav

# 2. From your project root:
cp ~/keel-nav/harnesses/cursor/.cursorrules ./.cursorrules
cp -r ~/keel-nav/.meta-skills ./

# 3. Commit both
```

If your project already has `.cursorrules`, **merge — do not overwrite.**
The Keel Nav block starts with `# Keel Nav — Cursor rules` and ends with
`## Source of truth`.

### In Keel Nav itself (for development)

```bash
cd keel-nav
cp harnesses/cursor/.cursorrules ./.cursorrules
```

## Verify

Open Cursor in your project. Ask the Cursor agent:

> "Which Keel Nav phases can you run, and how do I invoke them?"

The agent should list the six phases and describe the natural-language
dispatch. If it does not, `.cursorrules` is not being read — check that it
is at the project root.

## Invoking each phase

Cursor has no slash commands, so use natural language:

| Phrase | Phase | Fresh session? |
|--------|-------|----------------|
| "run Phase 0" / "bootstrap context" | Context Bootstrap | Recommended |
| "write the spec for US-NNN" | SDD Spec Writer | Recommended |
| "audit the spec" / "goldfish it" | Goldfish Audit | **MANDATORY** |
| "TDD it" / "implement the spec" | TDD Cycle | No |
| "build the slice" / "ODD it" | ODD Vertical Slice | No |
| "drift check" / "certify" | Drift Control | No |

## Known limitation: Phase 1b enforcement

Same as Claude Code: no mechanical enforcement of the fresh-session
requirement. The agent must refuse, and if it fails to, the Navigator must
discard the audit.

For Phase 1b, prefer the OpenCode harness (physical shim enforcement). Or
open a fresh Cursor window and ask the agent to explicitly confirm it has
no prior spec context before invoking.

## Why `.cursorrules` is shorter than `CLAUDE.md`

Cursor's context budget and rules-file rendering are less generous than
Claude Code's. A 400-line `.cursorrules` gets truncated or deprioritized.
The file prioritizes:

1. The six-phase index (must always be visible).
2. Dispatch pattern (must always be visible).
3. Phase 1b blindness rule (must always be visible).
4. Vibe coding prohibitions (must always be visible).

Everything else (read/write discipline, token budgets, self-check) is
condensed. The full rules are in `AGENTS.md` and `.meta-skills/`.

If you need the fuller version inside Cursor, add `@AGENTS.md` to the
Cursor context via @-mention at session start.

## Updating

```bash
cd ~/keel-nav && git pull
cp ~/keel-nav/harnesses/cursor/.cursorrules /path/to/your-project/.cursorrules
cp -r ~/keel-nav/.meta-skills/* /path/to/your-project/.meta-skills/
```

## See also

- [`AGENTS.md`](../../AGENTS.md) — canonical behavioral contract.
- [`harnesses/claude-code/`](../claude-code/) — fuller directive file for
  Claude Code.
- [`harnesses/opencode/`](../opencode/) — native skill shims with
  mechanical Phase 1b enforcement.
- [`harnesses/generic/`](../generic/) — no-plugin fallback.
