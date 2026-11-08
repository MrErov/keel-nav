# Claude Code Harness

> A single directive file (`CLAUDE.md`) that wires Keel Nav into Claude Code.
> Not a shim per skill; a doorway into the meta-skills at project root.

## What this is

`CLAUDE.md` is read by Claude Code at session start and becomes part of
the agent's persistent context. It:

1. Names the six Keel Nav meta-skills and their phases.
2. Defines the dispatch pattern (how the Navigator invokes a phase).
3. Enforces phase boundaries, read/write discipline, and token budgets.
4. Mandates that Phase 1b (Goldfish) runs in a fresh session.

It does **not** embed the protocol. Each phase's actual rules live in
`.meta-skills/<file>.md`, and `CLAUDE.md` instructs the agent to read that
file before executing the phase.

## Why one file instead of six shims

Claude Code's dispatch model is conversational, not command-based: the
Navigator says "run Phase 0" and the agent decides what to do. There is no
`/skill-name` primitive that loads a specific skill on demand. So a shim
per skill would not be invoked by the harness — it would just sit there.

The `CLAUDE.md` file is the correct shape for this harness: an index of
phases + a dispatch pattern + invariants. If Claude Code ever ships
first-class skills (à la OpenCode), we will revisit this design and add
`skills/` shims.

## What this is not

- **Not a fork.** The methodology lives in `.meta-skills/`. If you edit
  `CLAUDE.md` to change behavior, you are diverging from Keel Nav.
- **Not a substitute for `AGENTS.md`.** `AGENTS.md` (if present at project
  root) is the canonical behavioral contract and overrides `CLAUDE.md`
  where they conflict. `CLAUDE.md` is a Claude-Code-specific projection of
  the same rules.

## Install

### In your own project

```bash
# 1. Clone Keel Nav somewhere persistent
git clone https://github.com/MrErov/keel-nav.git ~/keel-nav

# 2. From your project root:
cp ~/keel-nav/harnesses/claude-code/CLAUDE.md ./CLAUDE.md
cp -r ~/keel-nav/.meta-skills ./

# 3. Commit both (they are part of your project now)
```

If your project already has a `CLAUDE.md`, **merge — do not overwrite.**
The Keel Nav directives start with `# CLAUDE.md — Keel Nav directives` and
end at the `## Source of truth` section. Append them to your existing file
or link them from it:

```markdown
## Keel Nav

This project uses Keel Nav for AI-assisted engineering. The directives
live in [`.keel-nav/CLAUDE.md`](.keel-nav/CLAUDE.md). Read that file
before acting on any `/phase-*` invocation.
```

### In Keel Nav itself (for development)

```bash
cd keel-nav
cp harnesses/claude-code/CLAUDE.md ./CLAUDE.md
```

`.meta-skills/` is already at repo root.

## Verify

Open a Claude Code session in your project. Ask:

> "Which Keel Nav phases can you run, and what is the dispatch pattern?"

The agent should list the six phases and describe the `/phase-0` ...
`/phase-4` dispatch. If it does not, `CLAUDE.md` is not being read — check
that it is at the project root, not in a subdirectory.

## Invoking each phase

| Invocation | Phase | Fresh session? |
|------------|-------|----------------|
| `/phase-0` | Context Bootstrap | Recommended |
| `/phase-1a US-NNN` | SDD Spec Writer | Recommended |
| `/phase-1b specs/...` | Goldfish Audit | **MANDATORY** |
| `/phase-2 specs/...` | TDD Cycle | No |
| `/phase-3 specs/...` | ODD Vertical Slice | No |
| `/phase-4 specs/...` | Drift Control | No |

"Recommended" means: reuse a session only if it has no prior context about
other phases' outputs. When in doubt, open fresh.

## Known limitation: Phase 1b enforcement

Unlike the OpenCode harness (which has a physical shim that refuses when
the session is not fresh), the Claude Code harness relies on the agent
honoring a directive. There is no mechanical enforcement.

Mitigations:

1. The directive is stated twice in `CLAUDE.md` — once in the dispatch
   section, once in its own dedicated section.
2. The refusal message is literal and unnegotiable.
3. If the agent fails to refuse and produces an audit anyway, the Navigator
   must discard it. A Goldfish audit from a leaked session is worse than
   no audit.
4. If you need mechanical enforcement, use the OpenCode harness for Phase 1b
   and Claude Code for the other phases. Mixing harnesses is fine — Keel Nav
   is designed for it.

## Updating

```bash
cd ~/keel-nav && git pull
cp ~/keel-nav/harnesses/claude-code/CLAUDE.md /path/to/your-project/CLAUDE.md
cp -r ~/keel-nav/.meta-skills/* /path/to/your-project/.meta-skills/
```

## See also

- [`AGENTS.md`](../../AGENTS.md) — canonical behavioral contract.
- [`harnesses/generic/`](../generic/) — no-plugin fallback.
- [`harnesses/opencode/`](../opencode/) — native skill shims (recommended
  for Phase 1b if you want mechanical enforcement).
