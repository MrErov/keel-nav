---
name: context-bootstrap
description: Keel Nav Phase 0 — map a repository's stack, bounded contexts, and risks into docs/context/ before any spec or code is written.
---

# Keel Nav — Phase 0: Context Bootstrap

**Read `.meta-skills/00-context-bootstrap.md` at the project root first.**
That file is the protocol. This file is only the OpenCode entry point.
If this is your first invocation, also read `AGENTS.md` at the project root.

## Invocation

> `/context-bootstrap` — map the whole repo
> `/context-bootstrap scope: src/billing` — map a subdirectory only

## Execution

1. Read the meta-skill.
2. Execute its 6-step protocol with `repo_root` = project root and
   `optional_scope` = the scope you were given (or none).
3. Emit the handoff message at the end.
4. On any blocking gate failure, emit the escalation message from the
   meta-skill and **stop**. Do not improvise.

## Outputs

`docs/context/00-overview.md`, `01-dependency-map.md`,
`02-risk-register.md`, and one `<bounded-context>.md` per detected context.

Full protocol: `.meta-skills/00-context-bootstrap.md`
