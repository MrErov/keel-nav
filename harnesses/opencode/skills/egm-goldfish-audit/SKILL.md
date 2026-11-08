---
name: egm-goldfish-audit
description: Keel Nav Phase 1b — blind audit of a draft spec by a sub-agent with NO memory of the spec-writing session. Requires a fresh session.
---

# Keel Nav — Phase 1b: Goldfish Audit

**Read `.meta-skills/02-egm-goldfish-audit.md` at the project root first.**
That file is the protocol. This file is only the OpenCode entry point.

## ⚠️ This skill requires a fresh session

If this OpenCode session has **any** prior context about the spec — the
conversation where it was written, prior audit reports, the Navigator's
reasoning, or "helpful hints" — **refuse to execute**. Reply exactly:

> "The Goldfish Audit only works in a session with no memory of the
> spec-writing. Please open a fresh OpenCode session and invoke
> `/egm-goldfish-audit specs/<US-ID>.spec.md` there. I will not run it
> here."

Do not negotiate. Do not "try anyway". The blindness is the product.

## Invocation

> `/egm-goldfish-audit specs/US-042.spec.md`

## Required inputs

- The spec at the given path (must exist).
- The bounded context doc it references (must exist).
- The audit round number (default: 1 for first audit).

## Execution

1. Confirm the session is fresh (see above). If not, refuse.
2. Read the meta-skill.
3. Execute its 5-step protocol.
4. Write `specs/<US-ID>.audit.<N>.md`.
5. Update exactly two metadata fields in the spec:
   `status:` (unchanged on `rejected`; `audited` on `audited`) and
   `goldfish_audit:` (path to the report).
6. Emit the handoff message for the verdict.

## Outputs

`specs/<US-ID>.audit.<N>.md` + metadata update. Never touches the spec body.

Full protocol: `.meta-skills/02-egm-goldfish-audit.md`
