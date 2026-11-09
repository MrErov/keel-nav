# Educational walkthrough: `todo-api`

> ⚠️ **This is a walkthrough of a failed Phase 1 closure.**
>
> **Four audit reports are real.** `audit.1.md`, `audit.2.md`,
> `audit.3.md`, and `audit.4.md` are the output of four real, blind
> Goldfish sessions run in fresh OpenCode sessions on 2026-11-08 and
> 2026-11-09. **All four returned `rejected`.**
>
> The other artifacts are either **authored** (`v0.1.0`, the original
> draft; `v0.1.2` and `v0.1.3`, the corrections) or **fabricated**
> (`audit.1.FABRICATED.md`, `audit.2.FABRICATED.md`, the `v0.1.1`
> correction, and `drift.1.md`).
>
> **What this walkthrough IS useful for:** understanding the shape of
> the audit artifact, and seeing what four rounds of real audit look
> like when they do not converge on approval.
>
> **What it is NOT useful for:** proving the methodology works end to
> end. Of the methodology's phases, only Phase 1b (audit) produced
> independent, real outputs. Phase 1 was attempted four times and never
> closed. Phases 2, 3, and 4 were never run as methodology phases.

---

## The fictional project

A single-endpoint REST API for creating todo items.

- **Stack:** Python 3.11 · FastAPI · SQLite · pytest
- **Scope:** one user story (`US-001`), one endpoint (`POST /todos`),
  one table (`todos`).
- **Explicitly out of scope:** authentication, listing, updating,
  deleting, any UI, internal whitespace normalization.

---

## Four real Goldfish audits, four rejections

| Round | Spec version | Verdict | Blocking | Warning | Info | Dominant category |
|-------|--------------|---------|----------|---------|------|-------------------|
| 1 | v0.1.0 | `rejected` | 2 | 5 | 3 | Spec logic (contradiction, hidden assumption) |
| 2 | v0.1.1 | `rejected` | **3** | 3 | 3 | Spec vs. contract (AC-vs-§3.2, test taxonomy) |
| 3 | v0.1.2 | `rejected` | 2 | 1 | 2 | Test traceability (test↔AC mapping, split ACs) |
| 4 | v0.1.3 | `rejected` | **1** | 4 | 3 | Residual promotion (W2 from round 2 → B1) |

**Blocking findings fell after round 2** (2 → 3 → 2 → 1) but **warnings
fluctuated** (5 → 3 → 1 → 4). The spec converged on *what the endpoint
does* but not on *tests that verify it*.

Full reports: `audit.1.md`, `audit.2.md`, `audit.3.md`, `audit.4.md`.

---

## State machine

| File | Spec version | Status at that point | Verdict it records |
|------|--------------|---------------------|-------------------|
| `US-001.spec.v0.1.0.md` | 0.1.0 | `draft` | Audited by round 1 → `rejected` |
| `US-001.spec.md` (history: v0.1.1) | 0.1.1 | `draft` (was `audited`, corrected) | Audited by round 2 → `rejected` |
| `US-001.spec.md` (history: v0.1.2) | 0.1.2 | `draft` | Audited by round 3 → `rejected` |
| `US-001.spec.md` (current: v0.1.3) | 0.1.3 | `draft` | Audited by round 4 → `rejected` |
| `US-001.audit.2.FABRICATED.md` | — | — | Fabricated "approval" (preserved) |
| `US-001.drift.1.md` | 0.1.1 | — | Fabricated drift report (no real Phase 4) |

The current spec is `v0.1.3`, `status: draft`. It has never been approved.

---

## Read order (15 minutes)

1. **This README** (5 min).
2. `US-001.spec.v0.1.0.md` — the first draft.
3. `audit.1.md` — round 1 rejection (2 blocking: whitespace, idempotency).
4. `audit.1.FABRICATED.md` — the fabricated version (3 findings; find what it missed).
5. `US-001.spec.md` — current v0.1.3 (the accumulated result of 4 corrections).
6. `audit.4.md` — round 4 rejection (1 blocking: the round-2 residual).

Rounds 2 and 3 are in the directory for completeness; rounds 1 and 4
alone tell the arc.

**Note:** round 2's audit (`audit.2.md`) is **real**, not the fabricated
"approval" the walkthrough originally showed. The fabricated version is
preserved as `audit.2.FABRICATED.md`.

---

## Full directory map

```text
examples/todo-api/
├── README.md (this file)
├── requirements.txt
├── docs/context/ (Phase 0 output)
│   ├── 00-overview.md
│   ├── 01-dependency-map.md
│   ├── 02-risk-register.md
│   └── todos.md
├── specs/ (Phase 1 artifacts; the drift report is fabricated)
│   ├── US-001.spec.v0.1.0.md (original draft, round 1 rejected)
│   ├── US-001.audit.1.md (real round 1, rejected)
│   ├── US-001.audit.1.FABRICATED.md (fabricated, preserved)
│   ├── US-001.spec.md (current, v0.1.3)
│   ├── US-001.audit.2.md (real round 2, rejected)
│   ├── US-001.audit.2.FABRICATED.md (fabricated "approval", preserved)
│   ├── US-001.audit.3.md (real round 3, rejected)
│   ├── US-001.audit.4.md (real round 4, rejected)
│   └── US-001.drift.1.md (fabricated drift report)
├── src/ (walkthrough code, not real Phase 2/3 output)
│   ├── todos.py (business logic)
│   ├── main.py (FastAPI app)
│   └── db.py (SQLite bootstrap)
└── tests/ (walkthrough tests)
    ├── test_todos.py (5 unit/integration tests)
    └── test_e2e.py (2 e2e tests)
```

---

## What you should notice

1. **The first rejection is the most instructive.** Round 1 found 2
   blocking findings, including a real contradiction (T-4 assumed
   idempotency while §3.2 specified autoincrement). Without the audit,
   Phase 2 would have written tests against a contradictory contract.

2. **The fabricated correction made it worse.** Round 2 rejected the
   "corrected" v0.1.1 with **3 blocking** (one more than v0.1.0). The
   fabrication was written against the fabricated audit's findings, not
   the real ones. See the four-round analysis below.

3. **The residuals come back.** Round 2's W2 (missing/null/non-string
   title) was left open as a non-blocking warning. It became round 4's
   **B1**, the *only* blocking finding of the final round.

4. **The method does not terminate.** Four rounds, four rejections.
   Blocking findings decreased, but no round produced `audited`.

5. **The tests are weaker than the ACs.** Round 4 found that T-1, T-2,
   and T-3 would pass on implementations that violate their ACs (no `id`
   match check, no `error` value check, no `created_at` freshness check).
   The test plan is a scope contract in name, but not in practice.

---

## What four rounds of real audit taught us

This is the empirical result of the walkthrough.

### 1. The method converges, but does not terminate

Blocking findings per round: **2 → 3 → 2 → 1**. After round 2 the
counter decreases, but four rounds produced zero approvals. A spec that
starts at "obviously reasonable" needs at least four adversarial passes
to reach "still one thing wrong."

### 2. Findings change category, not just count

- Rounds 1–2: **spec logic** (contradictions, hidden assumptions,
  contract shape).
- Round 3: **test traceability** (tests mapped to the wrong ACs,
  tests too weak to verify their ACs).
- Round 4: **residual promotion** (W2 declared "acceptable" in round 2
  became blocking in round 4).

The category progression is the real signal: the audit is not finding
"the same thing repeatedly". It is finding *different layers* of the
same problem as earlier layers get cleaned.

### 3. Deferring a gap does not close it

The round-2 W2 was documented as a non-blocking warning and left for a
later revision. Round 4 promoted it to blocking. The method is telling
us: **you can decide not to fix a finding, but the finding stays live.**
The intervening revisions did not retire it.

### 4. Test plans need their own audit pass

Rounds 1–2 focused on spec logic and contract shape, with the test plan
as a secondary concern. Rounds 3–4 rejected the assumption that "the
ACs are right, so the tests will be right." Tests can be
weaker than their ACs, mapped to the wrong ACs, or too vague to falsify
the behavior they describe. The template's §4 is not enough — a
dedicated "test audit" pass would catch it earlier.

### 5. The 120-line template is a hard constraint that bites

Later versions were trimmed or compressed to fit the limit. Rounds 3
and 4 each required cutting text to make room for the fix. The template
caps at 120 lines; the audit pressure wants more. For a single endpoint
with one AC-3-level behavior, 120 lines is the ceiling, not the budget.

**Implication for the methodology:** either the template needs more
room (contradicting "lightweight"), or the "small user story" scope
needs to be smaller, or the test plan needs its own section with its
own line cap.

### 6. Fabrication is not a shortcut

`audit.1.FABRICATED.md` (3 findings) vs. `audit.1.md` (10 findings).
The real Goldfish found **3.3× more findings**, including the exact
category the fabrication missed: tests that don't verify their ACs.

The fabricated correction (v0.1.1) was written against the fabricated
audit's findings and **increased the blocking count** from 2 to 3.
There is no fabrication shortcut that produces a spec a real audit
approves.

---

## Why the walkthrough stops here

Four rounds is enough to demonstrate the method's convergence pattern
and its non-termination. A fifth round would produce more data, not
new categories of evidence. The honest result is:

> **Phase 1 does not close in 4 rounds. Phase 2 cannot start from
> `status: draft`. The walkthrough is a failed closure experiment, and
> the finding is that the method improves specs but does not approve
> them within this template's constraints.**

Closing further would require either (a) writing the round-4 fix to
v0.1.4 and running round 5 (which would require reauthorizing a fifth
round), or (b) using the Navigator override mechanism to declare
`effective_verdict: audited` and proceed to Phase 2 with a spec known
to be imperfect. Both are legitimate follow-on projects, not
continuations of this walkthrough.

---

## A note on fabrication

| Artifact | Provenance | Description |
|----------|-----------|-------------|
| `US-001.spec.v0.1.0.md` | Authored | Pre-audit draft. Audited once by round 1 → rejected. |
| `US-001.audit.1.md` | **Real** | Blind session, round 1. Verdict: `rejected`. 10 findings (2/5/3). |
| `US-001.audit.1.FABRICATED.md` | Fabricated | Original walkthrough version. 3 findings (1/2/0). Preserved for comparison. |
| `US-001.spec.md` (v0.1.1, historical) | Fabricated | Human-authored "fix" against the fabricated audit. Audited by round 2 real → rejected with 3 blocking (one more than v0.1.0). |
| `US-001.audit.2.md` | **Real** | Blind session, round 2, audits v0.1.1. Verdict: `rejected`. 9 findings (3/3/3). |
| `US-001.audit.2.FABRICATED.md` | Fabricated | Original "approval" round. Preserved for comparison. |
| `US-001.spec.md` (v0.1.2, historical) | Authored | Human fixes against round 2's real findings. Audited by round 3 → rejected. |
| `US-001.audit.3.md` | **Real** | Blind session, round 3, audits v0.1.2. Verdict: `rejected`. 5 findings (2/1/2). |
| `US-001.spec.md` (v0.1.3, current) | Authored | Human fixes against round 3's findings. Audited by round 4 → rejected. |
| `US-001.audit.4.md` | **Real** | Blind session, round 4, audits v0.1.3. Verdict: `rejected`. 8 findings (1/4/3). |
| `US-001.drift.1.md` | Fabricated | Scripted drift report. No real Phase 4 run. |

---

## What this walkthrough does not prove

- It does not prove Phase 1 closes end-to-end. It proves Phase 1 was
  attempted four times and never closed.
- It does not prove Phase 2, 3, or 4 work. None of those phases was run.
- It does not prove the audit produces approved specs on "reasonable"
  input. The input was a single endpoint with a single user story, and
  it produced 4 consecutive rejections.

What it does prove:

- Phase 1b works: 4 real blind audits caught issues the author missed.
- Fabrication is not a shortcut: `audit.1.FABRICATED.md` was strictly
  weaker than `audit.1.md` and missed the exact category round 4 would
  later flag.
- The method does not terminate: the convergence pattern is real but the
  counter never reaches zero.

---

## Running the code (not the methodology)

The code in `src/` and `tests/` is real, runnable Python:

```bash
cd examples/todo-api
pip install -r requirements.txt
pytest tests/ -v
```

7 tests pass. That is a sanity check on the code, not a validation of
Keel Nav. The methodology's correctness is measured by the audits above,
not by running pytest.

## See also

- [`AGENTS.md`](../../AGENTS.md) — behavioral contract.
- [`../../.meta-skills/`](../../.meta-skills/) — the six meta-skills.
- [`../../docs/designs/`](../../docs/designs/) — real design specs with
  provenance.
- [`../../docs/known-limitations.md`](../../docs/known-limitations.md) —
  the 11 live gaps in the methodology.
- [`../../harnesses/generic/`](../../harnesses/generic/) — how to invoke
  Keel Nav without a plugin.
