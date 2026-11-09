---
title: Blind audit protocol — why the Goldfish needs a fresh session
author: Keel Nav core team
status: Implemented
source: retrospective
implemented_in: 57b0908 (skill 02), refined across v0.1.0-alpha
date: 2026-11-08
---

# Blind audit protocol — why the Goldfish needs a fresh session

## Problem

The agent that wrote a spec has confirmation bias. It "knows" what the
spec meant, so when it re-reads its own spec, its brain fills gaps
invisibly. It cannot see that:

- AC-2 and AC-5 assume mutually exclusive outcomes.
- The interface contract never declares the 4xx shape that AC-3 depends on.
- "The system should handle failures" is not an acceptance criterion.
- The out-of-scope list quietly smuggles scope back in.

An audit performed by the same agent, in the same session, inherits the
same blindness. It produces a report that looks like a real audit and
is worthless.

## Proposed solution

The Goldfish Audit requires **a fresh session with no memory of the
spec-writing**, and **exactly four inputs**:

1. The Goldfish Audit meta-skill itself.
2. The spec to audit.
3. The bounded-context doc for the spec's domain.
4. The audit round number.

Nothing else. Not the spec-writing chat, not prior audits, not the
Navigator's reasoning, not "helpful hints".

### Per-harness "fresh session" mechanism

| Harness | Mechanism |
|---------|-----------|
| OpenCode | New session (not reusable) |
| Claude Code | New `claude` invocation (not `--resume`) |
| Cursor | New chat window |
| Copilot/Gemini CLI | New conversation |
| DeepSeek (dsh-bridges) | New bridge invocation |

No fresh-session mechanism → the audit cannot run. The skill refuses.

### What "simulate blindness" does not do

Instructing the same agent to "pretend you didn't see the earlier chat"
**does not work**. The context is still in the window. The agent's
sampling is conditioned on the prior conversation, even if explicitly
asked to ignore it. The protocol exists precisely because the naive
"pretend" approach fails silently.

## Alternatives considered

### Alternative A — same agent, different role prompt

Rejected. Changing the role prompt does not change the context window.
The agent still has access to the spec-writing conversation. Empirical
failure: the agent's findings align too closely with what the spec
already says, missing the exact gaps the audit exists to find.

### Alternative B — multiple agents voting

Rejected for v0.1.0. Adds cost (N audits instead of 1) without solving
the underlying problem — all agents in the same session share the same
context. If the agents run in separate sessions, this is just "run the
Goldfish N times", which is fine but not what "voting" implies.

### Alternative C — human auditor

Rejected for v0.1.0. Works, but eliminates the cost advantage of AI
audits. The Goldfish is a sub-agent that does what a human auditor
would do, at a fraction of the cost. The Navigator can still run a
human audit if they want; the Goldfish is not a replacement.

### Alternative D — no audit at all (trust the spec writer)

Rejected. This is vibe coding. Empirically, spec writers miss the
same class of gaps across projects. The audit is the mechanism that
catches them before code exists.

## Impact

- Skill 02 has a dedicated "Blind isolation protocol" section.
- Each harness README documents the fresh-session requirement.
- The generic harness's dispatch prompt for Phase 1b has a prominent
  warning and an exhaustive list of what not to include.

## Open questions

**Enforcement is uneven.** OpenCode has a physical shim that refuses if
the session is not fresh. Claude Code and Cursor rely on the agent
honoring a directive. This is a known limitation (see
`docs/known-limitations.md`) and the correct next step is a harness-
independent "fresh session check" — but that requires a mechanism the
harnesses do not currently expose.

## See also

- `.meta-skills/02-egm-goldfish-audit.md` §"Blind isolation protocol"
- `harnesses/generic/prompts/02-egm-goldfish-audit.md`
- `harnesses/opencode/skills/egm-goldfish-audit/SKILL.md`
