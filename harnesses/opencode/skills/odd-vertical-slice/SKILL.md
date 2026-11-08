---
name: odd-vertical-slice
description: Keel Nav Phase 3 — wire the TDD-tested logic into a real end-to-end slice and hand it to the Navigator for direct observation. The only phase with a mandatory human gate.
---

# Keel Nav — Phase 3: ODD Vertical Slice

**Read `.meta-skills/04-odd-vertical-slice.md` at the project root first.**
That file is the protocol. This file is only the OpenCode entry point.

## Invocation

> `/odd-vertical-slice specs/US-042.spec.md specs/US-042.audit.2.md`

## Required state

The skill will **refuse** unless all three:

- Spec `status:` is `implemented`.
- Spec Section 6 (Observation Notes) is non-empty.
- Audit `effective_verdict:` is `audited`.

If Section 6 is empty, the spec is a horizontal increment. The skill will
skip Phase 3 and tell you to go to Phase 4.

## Execution

1. Read the meta-skill.
2. Execute its 7-step protocol: slice thickness check → wiring plan
   (proposes files, waits for approval) → wiring code → e2e RED/GREEN →
   freeze Phase 2 (verify no regression) → **observation gate (blocks on
   you)** → metadata update.
3. The agent will **pause** at the observation gate and wait for your
   `approved` / `failed: <item>: <obs>` / `cannot observe: <reason>` reply.
4. On approval, metadata is updated to `status: observed`. On failure, the
   skill escalates. On deferral, it stops, documents the deferral, and
   leaves `observed_at` unset for Phase 4 to flag.

## Outputs

Infrastructure and wiring code, e2e tests, and spec metadata updated to
`status: observed` on Navigator approval.

Full protocol: `.meta-skills/04-odd-vertical-slice.md`
