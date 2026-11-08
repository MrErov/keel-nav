---
name: drift-control
description: Keel Nav Phase 4 — final certification. Compare implemented code against the audited spec in both directions and certify no-drift (or reject).
---

# Keel Nav — Phase 4: Drift Control

**Read `.meta-skills/05-drift-control.md` at the project root first.**
That file is the protocol. This file is only the OpenCode entry point.

## Invocation

> `/drift-control specs/US-042.spec.md specs/US-042.audit.2.md`
> `/drift-control specs/US-042.spec.md --code-scope git-diff:main..HEAD`

## Required state

- Spec `status:` is `implemented` or `observed`.
- Audit `effective_verdict:` is `audited`.
- A code scope declared (git diff range or explicit file list). The skill
  will ask if you do not provide one.

## Execution

1. Read the meta-skill.
2. Execute its 7-step protocol: gate → code scope (waits for approval) →
   forward check (spec → code) → backward check (code → spec) → test
   traceability → observation traceability → verdict + report.
3. Compute the verdict mechanically from §7 (findings) and §8
   (Navigator overrides) of the drift report.
4. Emit the handoff for the verdict: `no-drift` / `drifted-accepted` /
   `drifted` / `observation-blocked`.

## Outputs

`specs/<US-ID>.drift.<N>.md`. Spec metadata updated to `status: certified`
on `no-drift` or `drifted-accepted`; unchanged otherwise.

Full protocol: `.meta-skills/05-drift-control.md`
