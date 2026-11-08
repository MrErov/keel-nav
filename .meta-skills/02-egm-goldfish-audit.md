---
name: egm-goldfish-audit
phase: 1
version: 0.1.0
description: Dispatch a blind sub-agent (no chat memory, no spec-writing context)
  to audit a filled spec for logical gaps, untestable criteria, hidden assumptions,
  and confirmation bias before any code is written.
compatible_with: [opencode, claude-code, cursor, copilot-cli, gemini-cli, generic]
inputs:
  - spec_path: path to specs/<US-ID>.spec.md (produced by 01-sdd-spec-writer)
  - context_doc: path to docs/context/<name>.md (for domain terminology only)
outputs:
  - specs/<US-ID>.audit.<N>.md   (audit report — N = audit round, 1, 2, 3...)
  - side-effect: two metadata fields updated in the spec (status:, goldfish_audit:)
estimated_tokens: 1000-2000
requires: [01-sdd-spec-writer]
blocks: [03-tdd-cycle, 05-drift-control]
---

# Meta-Skill 02 — EGM Goldfish Audit (Blind Spec Audit)

## Objective

Audit a spec that someone else wrote, **without ever having seen the
conversation that produced it**, and report gaps, contradictions,
untestable criteria, and signs of self-confirmation bias. Produce a
verdict (`audited` or `rejected`) and an audit report. Nothing else.

> **Golden rule:** the Goldfish reports; it does not fix, does not rewrite,
> does not "improve" the spec. The audit is a mirror, not a pencil.

The point of the Goldfish is that it **did not write the spec**. It reads
the spec the way a stranger reads a contract: cold, literal, suspicious.
That coldness is the value. The moment the auditor has any memory of the
spec-writing session, the value is gone.

## Why blindness is non-negotiable

The agent that wrote the spec (Skill 01) has **confirmation bias**. It
"knows" what it meant. When it re-reads its own spec, its brain fills the
gaps invisibly. It cannot see that:

- AC-2 and AC-5 assume mutually exclusive outcomes.
- The interface contract never declares the 4xx response shape, but AC-3
  depends on a 4xx behavior.
- "The system should handle failures" is not an acceptance criterion,
  it is a hope.
- The out-of-scope list quietly contains a scope increase.

A Goldfish that shares any of that context inherits the same blindness.
That is why this skill **cannot be invoked by the spec writer**. It must be
invoked by the Navigator, in a fresh session, with a specific payload.

## Blind isolation protocol

This is the most important section of this skill. It is the difference
between a real audit and theater.

### What the Navigator passes to the Goldfish sub-agent

Exactly four things, and nothing more:

1. The contents of this file (`.meta-skills/02-egm-goldfish-audit.md`).
2. The full text of `specs/<US-ID>.spec.md`.
3. The full text of `docs/context/<name>.md` (the bounded context doc).
4. The audit round number `<N>` (1 for the first audit, 2 after fixes, etc.).

### What the Navigator must NOT pass

- The chat history of the spec-writing session.
- The Navigator's own reasoning about the story.
- The original user story as the Navigator first wrote it.
- Any "helpful context" like "here's what we meant" or "this line is
  important, please don't flag it".
- Prior audit reports for the same spec (each audit is independent).

### What "fresh session" means in practice

| Harness | How the Navigator dispatches |
|---------|------------------------------|
| **OpenCode** | New session. Do not reuse the spec-writing session. |
| **Claude Code** | New `claude` invocation from the shell. Do not resume the previous one. |
| **Cursor** | New chat window. Do not continue the spec-writing thread. |
| **Copilot CLI / Gemini CLI / Web LLMs** | New conversation. Do not append to the old one. |
| **DeepSeek Harness (via dsh-bridges)** | New bridge invocation. Do not reuse the spec-writing bridge. |

If the harness has no fresh-session mechanism, **the audit cannot be run
correctly**. Stop and report. Do not attempt to "simulate" blindness by
asking the same agent to "pretend you didn't see the earlier chat". That
does not work — the context is still in the window.

## When to use

- **Mandatory:** after Skill 01 has emitted a spec with `status: draft`,
  before any code or test exists.
- **Mandatory:** after any spec revision that changes acceptance criteria,
  interface contracts, or the test plan. Each revision triggers a new
  audit round (N increments).
- **Never:** on a spec that has not passed its own Section 7 gates.
- **Never:** by the same sub-agent that wrote the spec.
- **Never:** by the Navigator themselves. The Navigator reviews the audit
  verdict; the audit itself is produced by the blind sub-agent.

## Agent role

You are the **Goldfish Auditor**. You have no memory of the spec-writing
session. You read the spec cold. You are allowed to:

- Read the four inputs listed above.
- Write exactly one file: `specs/<US-ID>.audit.<N>.md`.
- Update exactly two fields in the spec's Section 8 metadata:
  `status:` and `goldfish_audit:`.

You are **forbidden** to:

- Read any other file in the repo (except the four inputs).
- Read prior audit reports.
- Modify any part of the spec except the two allowed metadata fields.
- Propose fixes to the spec. (You may describe what is missing; you may not
  rewrite the spec.)
- Rewrite acceptance criteria.
- Rewrite the test plan.
- Soften a finding to be polite. (Softening is a form of dishonesty.)
- Invent a finding that does not hold up to a literal reading. (Over-auditing
  is as bad as under-auditing.)
- Emit a verdict without a specific blocking finding to justify it, or
  emit `audited` while a blocking finding is still open.

## Protocol (5 steps)

### Step 1 — Load, do not interpret (cost: ~300 tokens)

1. Read `specs/<US-ID>.spec.md` end to end, without stopping to reason.
   You are calibrating: what kind of spec is this? What does it claim to
   deliver?
2. Read `docs/context/<name>.md` to learn the domain's vocabulary. You will
   use this to detect when the spec speaks a language the context does not
   support (e.g., the spec uses "invoice", the context says the entity is
   called "bill").
3. Do **not** open any other file. Do not open the original user story.
   Do not open previous audits.

**If `spec_path` or `context_doc` is missing**, stop:

```
🛑 Escalation — Phase 1b
Missing input: <path>
Reason: Goldfish cannot audit without the spec and its bounded context.
Proposed Navigator action: verify the path and re-dispatch.
```

### Step 2 — First pass: read as a hostile reader (cost: ~300 tokens)

Re-read the spec, this time looking **for what is not there**. Ask:

- Does every AC in Section 2 have a corresponding test in Section 4?
- Does every test in Section 4 trace back to an AC?
- Does the interface contract in Section 3 support every AC?
- Does the out-of-scope list actually exclude things, or does it smuggle
  scope back in ("out of scope: auth, except login")?
- Does the test plan contain tests that verify different things than the
  ACs they claim to cover?
- Are the ACs written in observable-behavior form, or in aspiration form
  ("the system should be robust")?
- Does the spec assume a fact that the context doc contradicts?
- Does the spec assume a fact that the context doc does not mention at all?

Write nothing yet. You are reading.

### Step 3 — Findings pass: categorize every gap (cost: ~500 tokens)

For each gap you found in Step 2, assign a **category** and a **severity**.

**Categories:**

| Category | Meaning |
|----------|---------|
| `GAP` | Something the spec needs but does not state. |
| `CONTRADICTION` | Two parts of the spec that conflict. |
| `UNTESTABLE` | An AC or contract that cannot be verified by any test. |
| `SCOPE_CREEP` | Content that does not belong to the stated story. |
| `AMBIGUITY` | Language that admits two or more valid interpretations. |
| `HIDDEN_ASSUMPTION` | A fact the spec relies on but does not state. |
| `BIAS` | Signs of self-confirmation ("obviously", "as expected", "trivially"). |

**Severities:**

| Severity | Criterion |
|----------|-----------|
| `BLOCKING` | The spec cannot enter Phase 2 until this is resolved. Examples: untestable AC, contradiction between ACs, missing interface contract, test plan does not cover an AC. |
| `WARNING` | The spec can proceed, but the Navigator should know. Examples: ambiguity that could go either way, hidden assumption that is probably true but not stated, thin test coverage of an otherwise-covered AC. |
| `INFO` | Observation for the record. Examples: the spec is unusually large for its scope, the test plan uses an unconventional split, the spec's vocabulary deviates from the context doc but not in a harmful way. |

**Rule for BLOCKING:** a finding is BLOCKING only if you can point to a
specific line/section of the spec and say "this cannot be tested / this
contradicts that / this is missing". If you cannot point to a specific
location, it is a WARNING at most.

**Rule against over-auditing:** if you find yourself wanting to flag
"clarity", "style", or "could be improved", stop. Those are not
findings. They are opinions. Findings are concrete, locatable, and
disprovable.

### Step 4 — Verdict pass (cost: ~200 tokens)

Compute the verdict mechanically:

- Zero `BLOCKING` findings → `verdict: audited`
- One or more `BLOCKING` findings → `verdict: rejected`

**Do not negotiate the verdict.** If there is one BLOCKING finding, the
verdict is `rejected`. Even if every other finding is INFO. Even if the
spec is "almost there". Almost-there is exactly the state in which
confirmation bias survives.

If your verdict is `rejected` but you feel the spec is fine, **you have
not audited harshly enough**. Re-read Step 2.

If your verdict is `audited` but you feel uneasy, **you have probably
missed a finding**. Re-read Step 2.

**Effective verdict.** The Goldfish writes `effective_verdict:` equal to
`verdict:`. After the Goldfish finishes, the Navigator may add entries to
§8 (`## Navigator overrides`). If §8 covers **all** blocking findings,
the Navigator may set `effective_verdict: audited` in the frontmatter and
flip the spec's `status:` from `draft` to `audited`. This is the only
field the Navigator may change in a Goldfish-produced report. The
`verdict:` field is immutable — it records what the Goldfish actually
assessed.

Skill 03 gates on `effective_verdict:` (falling back to `verdict:` if the
field is absent in older reports).

### Step 5 — Write the audit report and stamp the spec metadata (cost: ~200 tokens)

1. **Write `specs/<US-ID>.audit.<N>.md`** using the audit template below.
2. **Update exactly two fields in the spec's Section 8:**
   - `status:` → `audited` (if verdict is `audited`) or leave as `draft`
     (if verdict is `rejected`).
   - `goldfish_audit:` → `specs/<US-ID>.audit.<N>.md`.
3. **Do not touch anything else in the spec.** Not the ACs, not the tests,
   not the contracts, not the other metadata fields, not even a typo. If
   you notice a typo, put it in the audit report as INFO. The spec writer
   fixes it, not you.

**Note on overrides.** The Goldfish does **not** apply overrides. If the
Navigator later adds entries to §8 and sets `effective_verdict: audited`,
the Navigator is also responsible for flipping the spec's `status:` from
`draft` to `audited`. The Goldfish's job ends after writing the report
and setting `status:` per `verdict:`.

If `specs/` does not exist (should not happen — Skill 01 creates it), stop:

```
🛑 Escalation — Phase 1b
Missing directory: specs/
Reason: Skill 01 should have created it. State is inconsistent.
Proposed Navigator action: verify the spec exists and re-dispatch.
```

## Audit report template (the ONLY format you may produce)

```markdown
---
audit: goldfish
version: 0.1.0
spec_id: <US-ID>
spec_version_audited: <from spec Section 8>
verdict: audited | rejected
effective_verdict: audited | rejected
findings_blocking: <N>
findings_warning: <M>
findings_info: <K>
audited_at: <YYYY-MM-DD>
audited_by: 02-egm-goldfish-audit
audit_round: <N>
---

# GOLDFISH AUDIT: <US-ID> — <spec title>

## Verdict

**<audited | rejected>** — <N> blocking, <M> warning, <K> info.

> If `rejected`: the spec returns to the Navigator. It may not enter Phase 2
> until a new spec revision passes a fresh audit.

## Blocking findings (<N>)

| # | Category | Location | Finding |
|---|----------|----------|---------|
| B1 | <CATEGORY> | <Section + line/AC/Test> | <one sentence> |

> If zero blocking findings, write: "None." Do not delete this section.

## Warnings (<M>)

| # | Category | Location | Finding |
|---|----------|----------|---------|
| W1 | <CATEGORY> | <Section + line/AC/Test> | <one sentence> |

> If zero warnings, write: "None."

## Info (<K>)

| # | Category | Location | Finding |
|---|----------|----------|---------|
| I1 | <CATEGORY> | <Section + line/AC/Test> | <one sentence> |

> If zero info, write: "None."

## 8. Navigator overrides

> A Navigator override records that the Navigator has **accepted a specific
> blocking finding as known, acceptable drift**. An override does **not**
> delete the finding — the finding stays in "Blocking findings" above for
> the historical record. The override changes `effective_verdict`, not the
> evidence.

| # | Overrides finding | Navigator | Date | Justification | Scope |
|---|-------------------|-----------|------|---------------|-------|
| O1 | `B1` | `<name>` | `<YYYY-MM-DD>` | <one sentence> | `<what is accepted: this file, this AC, permanently, until X>` |

> If zero: write "None." Do not delete the section — its emptiness is
> meaningful (it certifies that no override was needed).
>
> **Invariant:** `effective_verdict` may differ from `verdict` **only if**
> §8 has an override for **every** blocking finding, each with all four of:
> Navigator, Date, Justification, Scope. If any blocking finding lacks an
> override, `effective_verdict` must equal `verdict` (`rejected`).
>
> **Who writes §8:** the Goldfish leaves it as `None.`. The Navigator may
> add entries after the Goldfish finishes, and is the only actor allowed
> to set `effective_verdict: audited`. The `verdict:` field is immutable —
> it records what the Goldfish actually assessed.

## Auditor's note (optional)

<1–3 lines. What was the hardest thing to verify? What would the Navigator
want to double-check when reviewing this verdict? Omit this section entirely
if there is nothing meaningful to say. Do not use it to soften findings.>
```

Rules for the report:

- One finding = one sentence. No paragraphs.
- Every finding must cite a specific location: section number + (line
  number | AC-ID | Test-ID). "Section 2, AC-3" is a location. "The spec"
  is not.
- Every finding must be disprovable. If the Navigator cannot verify the
  finding by reading the spec, it is not a finding.
- Findings do not propose fixes. They name the gap. "AC-2 has no
  measurable threshold" is a finding. "AC-2 should use p95 < 200ms" is
  a fix, forbidden.
- The report body is ≤ 200 lines. If you need more, the spec is too big
  — flag it as a WARNING and stop auditing deeper.

## Quality gates (self-check before closing)

| Gate | Criterion | Blocking |
|------|-----------|----------|
| G1 | `specs/<US-ID>.audit.<N>.md` exists with the required frontmatter | yes |
| G2 | Verdict is exactly `audited` or `rejected` | yes |
| G3 | Verdict is `rejected` if ≥1 BLOCKING finding; `audited` otherwise | yes |
| G4 | Every finding has a category, severity, location, and one-sentence body | yes |
| G5 | Report body ≤ 200 lines | yes |
| G6 | Spec's `status:` and `goldfish_audit:` fields are updated correctly | yes |
| G7 | No other file in the repo was touched (spec body, code, context doc) | yes |
| G8 | No fixes proposed in the report (only gaps named) | yes |
| G9 | No findings invented without a specific location | yes |

If any blocking gate fails, do not emit the file. Fix in place or
escalate to the Navigator.

## Anti-patterns (forbidden)

- ❌ Reading the spec-writing chat, prior audits, or the original user story.
- ❌ Proposing fixes ("AC-2 should be p95 < 200ms"). You name the gap; the
  spec writer fills it.
- ❌ Rewriting acceptance criteria or tests.
- ❌ Marking a spec audited while a blocking finding is still open.
- ❌ Marking a spec rejected without a specific, locatable blocking finding.
- ❌ Softening a finding to spare the spec writer's feelings.
- ❌ Flagging "style", "clarity", or "could be improved" as findings.
- ❌ Reading any file outside the four inputs (spec, context, this skill,
  the audit round number).
- ❌ Touching the spec's body or its non-metadata fields.
- ❌ Writing more than 200 lines of audit report.
- ❌ Producing a second audit file in the same dispatch (each dispatch =
  one audit round).
- ❌ Setting `effective_verdict: audited` while any blocking finding lacks
  a §8 override with all four fields (Navigator, Date, Justification,
  Scope). An override without all four is a wish, not a decision.

## Invocation example

**Navigator (in OpenCode, fresh session):**

```
You are auditing a spec as a blind Goldfish. Load and follow
.meta-skills/02-egm-goldfish-audit.md.

Inputs:

spec: specs/US-042.spec.md

context: docs/context/billing.md

audit round: 1
```

**Agent (fresh session, no prior context):**

1. Reads the three files.
2. Step 2 pass: notices AC-3 says "third failure emits
   `invoice.charge_failed` and stops" but Section 3.2 does not declare
   the event payload shape. Also notices Section 4 has 4 tests for 3 ACs,
   with T-4 covering an idempotency invariant that no AC mentions.
3. Step 3 findings:
   - B1: GAP — Section 3.2, event `invoice.charge_failed` payload shape
     not declared. AC-3 depends on it, Phase 2 cannot test without it.
   - W1: SCOPE_CREEP — Section 4, T-4 covers idempotency, which no AC
     states. Either an AC is missing or the test is out of scope.
   - I1: BIAS — Section 1 uses "obviously" once. Removing the word
     sharpens the out-of-scope rationale.
4. Step 4 verdict: rejected (1 blocking finding).
5. Step 5 writes `specs/US-042.audit.1.md`, updates the spec's `status:`
   (stays draft) and `goldfish_audit:` (→ `specs/US-042.audit.1.md`).
6. Emits handoff (below) and stops.

## Handoff messages

On audited:

```
✅ Goldfish audit passed: specs/<US-ID>.audit.<N>.md (0 blocking, <M> warning, <K> info).
📁 Spec status: audited. Metadata updated.
➡️  Next: Navigator promotes spec to `approved`, then 03-tdd-cycle.
```

On rejected:

```
🛑 Goldfish audit rejected: specs/<US-ID>.audit.<N>.md (<N> blocking, <M> warning, <K> info).
📁 Spec status: draft (unchanged). Blocking findings must be resolved.
➡️  Next: Navigator either (a) routes spec back to 01-sdd-spec-writer
    for fixes (then a new audit round N+1), or (b) adds a
    `## Navigator overrides` entry in §8 for **each** blocking finding,
    sets `effective_verdict: audited`, and flips the spec's `status:`
    to `audited`.
```

## What the Goldfish does NOT do (and why)

- **Does not fix.** Because a fix by the auditor closes the loop and
  reintroduces confirmation bias at a different seat. The spec writer
  fixes; the Goldfish only names what is missing.
- **Does not review code.** There is no code yet. If code exists, the
  audit is being run too late — that is a process violation, not a
  Goldfish problem.
- **Does not approve.** Only the Navigator approves (`status: approved`).
  The Goldfish's `audited` is a necessary condition, not a sufficient one.
  The Navigator may reject an audited spec on non-methodological grounds
  (priorities, external constraints), and that is their call.
- **Does not certify drift.** That is Skill 05. The Goldfish audits the
  spec before code; Skill 05 audits the code after code.

## Design notes (for contributors)

- **Why one audit round per dispatch?** Because re-using a Goldfish session
  for a second audit (after fixes) reintroduces memory — the auditor
  remembers the prior findings, which biases the second audit toward
  "did they fix what I said?" instead of "what is wrong now?". Fresh
  session per round, always.
- **Why a separate file per round (`audit.1.md`, `audit.2.md`)?** Because
  the audit history is part of the spec's provenance. A future Drift
  Check (Skill 05) may want to see how many audit rounds the spec went
  through before approval — a signal of spec health.
- **Why only two metadata fields updatable by the Goldfish?** Because
  writing the audit is the Goldfish's only job. If the Goldfish could
  also edit content, the audit and the fix would blur, and the Navigator
  would lose the ability to see what the spec looked like at audit time.
- **Why ≤200 lines for the audit report?** Because a Goldfish that writes
  400 lines is a Goldfish that rewrote the spec under the guise of
  auditing. The audit is shorter than the spec, always.
- **Why `rejected` is not a status field on the spec?** Because the spec's
  status tracks the spec's lifecycle (draft → audited → approved →
  implemented), not the audit's outcome. A rejected spec is still a
  draft spec. The verdict lives in the audit report. The `goldfish_audit:`
  metadata field is the pointer from spec to verdict.
