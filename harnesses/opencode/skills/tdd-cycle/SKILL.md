---
name: tdd-cycle
description: Keel Nav Phase 2 — strict Red-Green-Refactor against an audited spec. Batch RED, then minimum-code GREEN one test at a time. No code without a failing test.
---

# Keel Nav — Phase 2: TDD Cycle

**Read `.meta-skills/03-tdd-cycle.md` at the project root first.**
That file is the protocol. This file is only the OpenCode entry point.

## Invocation

> `/tdd-cycle specs/US-042.spec.md specs/US-042.audit.2.md`

## Required state

The skill will **refuse** unless both:

- Spec `status:` is `audited` or `approved`.
- Audit `effective_verdict:` is `audited` (falls back to `verdict:` in
  older reports without the field).

If the audit was rejected, the skill sends you back to Phase 1b or to a
Navigator override — it does not start coding.

## Execution

1. Read the meta-skill.
2. Execute its 6-step protocol: gate check → path discovery (emits a path
   table for Navigator review; confirms before writing in greenfield) →
   batch RED → incremental GREEN → conditional REFACTOR → metadata update.
3. Emit the handoff message on success, or the escalation message if a
   gate fails or a Phase 2 test regresses.

## Outputs

Test files and production code at the approved paths.
Spec metadata updated to `status: implemented`, `drift_report: pending`.

Full protocol: `.meta-skills/03-tdd-cycle.md`
