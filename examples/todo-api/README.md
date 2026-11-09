# Educational walkthrough: `todo-api`

> ⚠️ **This walkthrough closes Phase 1 with documented Navigator
> overrides. Phases 2–4 are the next steps.**
>
> **Phase 1 closed with 5 findings accepted as overrides** (1 blocking:
> missing/non-string title; 4 warnings: internal whitespace untested,
> 3 weak test descriptions). See `audit.4.md` §8 for the override
> justifications. `effective_verdict: audited`, `status: audited`.
>
> **Phase 2 will run TDD against this audited spec.** The tests are
> written before the implementation, and the three test-related
> overrides (O3–O5) shift precision from the spec to the tests — the
> tests will be stronger than the spec's T-1, T-2, T-3 descriptions,
> deliberately.
>
> **Phase 3 will wire the slice with real infrastructure and requires
> human observation.** Phase 4 will certify no-drift, using the audit's
> overrides as the baseline for what is "in scope".
>
> The purpose of this walkthrough is now to show that **the flow can
> run end-to-end when Phase 1 closes with documented overrides**. It
> does not claim the spec is perfect — it claims the spec is *sufficient
> to proceed* and the imperfections are *visible*.
>
> The four audit reports are real; the v0.1.1 correction, the two
> `.FABRICATED.md` audits, and `drift.1.md` are fabricated. See "A note
> on fabrication" below.

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

Round 4's `verdict` is `rejected`; its `effective_verdict` is `audited`
because the Navigator accepted B1 and W1–W4 as known drift in §8. The
four rejections are the auditor's verdicts; the closure is the
Navigator's decision.

---

## State machine

| File | Spec version | Status at that point | Verdict it records |
|------|--------------|---------------------|-------------------|
| `US-001.spec.v0.1.0.md` | 0.1.0 | `draft` | Audited by round 1 → `rejected` |
| `US-001.spec.md` (history: v0.1.1) | 0.1.1 | `draft` (was `audited`, corrected) | Audited by round 2 → `rejected` |
| `US-001.spec.md` (history: v0.1.2) | 0.1.2 | `draft` | Audited by round 3 → `rejected` |
| `US-001.spec.md` (current: v0.1.3) | 0.1.3 | `audited` (via override) | Audited by round 4 → `rejected`; overridden → `audited` |
| `US-001.audit.2.FABRICATED.md` | — | — | Fabricated "approval" (preserved) |
| `US-001.drift.1.md` | 0.1.1 | — | Fabricated drift report (no real Phase 4) |

The current spec is `v0.1.3`, `status: audited` via Navigator overrides.
The auditor never approved it; the Navigator accepted the remaining
findings as known drift.

---

## Read order (15 minutes)

1. **This README** (5 min).
2. `US-001.spec.v0.1.0.md` — the first draft.
3. `audit.1.md` — round 1 rejection (2 blocking: whitespace, idempotency).
4. `audit.1.FABRICATED.md` — the fabricated version (3 findings; find what it missed).
5. `US-001.spec.md` — current v0.1.3 (the accumulated result of 4 corrections).
6. `audit.4.md` — round 4 rejection (1 blocking: the round-2 residual);
   §8 records the overrides that close Phase 1.

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

4. **The method does not terminate by approval.** Four rounds, four
   rejections. Blocking findings decreased, but no round produced an
   unqualified `audited`. Phase 1 closed only when the Navigator
   overrode the remaining findings.

5. **The tests are weaker than the ACs.** Round 4 found that T-1, T-2,
   and T-3 would pass on implementations that violate their ACs (no `id`
   match check, no `error` value check, no `created_at` freshness check).
   The test plan is a scope contract in name, but not in practice.

---

## What four rounds of real audit taught us

This is the empirical result of the walkthrough.

### 1. The audit converges, but does not terminate by approval

Blocking findings per round: **2 → 3 → 2 → 1**. After round 2 the
counter decreases, but four rounds produced zero approvals. A spec that
starts at "obviously reasonable" needs at least four adversarial passes
to reach "still one thing wrong." The audit never reaches zero; Phase 1
closes via the Navigator override, not via approval.

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
The intervening revisions did not retire it. The override accepts it as
known drift; it does not close it.

### 4. Test plans need their own audit pass

Rounds 1–2 focused on spec logic and contract shape, with the test plan
as a secondary concern. Rounds 3–4 rejected the assumption that "the
ACs are right, so the tests will be right." Tests can be
weaker than their ACs, mapped to the wrong ACs, or too vague to falsify
the behavior they describe. The template's §4 is not enough — a
dedicated "test audit" pass would catch it earlier. The round-4
overrides O3–O5 make the consequence explicit: the Phase 2 tests will
be stronger than the spec descriptions, and Phase 4 must verify that
choice.

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

## Why Phase 1 closes here

Four rounds is enough to demonstrate the audit's convergence pattern
and its refusal to approve. A fifth round would produce more data, not
a different outcome. The Navigator therefore accepts the round-4
findings as known drift and closes Phase 1 via the override mechanism.

The closure is explicit:

- `audit.4.md` records `effective_verdict: audited` and the five
  overrides.
- `US-001.spec.md` records `status: audited`.
- The open findings remain visible: B1 (malformed title), W1 (internal
  whitespace untested), and W2–W4 (weak test descriptions).

Phase 2 can now start against an audited spec. The overrides are the
baseline: Phase 4 will treat behavior covered by them as known drift,
and behavior outside them as potential drift.

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
| `US-001.spec.md` (v0.1.3, current) | Authored | Human fixes against round 3's findings. Audited by round 4 → rejected; overridden → audited. |
| `US-001.audit.4.md` | **Real** | Blind session, round 4, audits v0.1.3. Verdict: `rejected`; effective verdict: `audited` via §8 overrides. 8 findings (1/4/3). |
| `US-001.drift.1.md` | Fabricated | Scripted drift report. No real Phase 4 run. |

---

## What this walkthrough does not prove

- It does not prove the audit can approve a spec. It proves Phase 1 can
  close via the override mechanism after four rejections.
- It does not prove Phase 2, 3, or 4 work. None of those phases has
  been run yet.
- It does not prove the audit produces approved specs on "reasonable"
  input. The input was a single endpoint with a single user story, and
  it produced 4 consecutive rejections; the Navigator, not the audit,
  closed Phase 1.

What it does prove:

- Phase 1b works: 4 real blind audits caught issues the author missed.
- Fabrication is not a shortcut: `audit.1.FABRICATED.md` was strictly
  weaker than `audit.1.md` and missed the exact category round 4 would
  later flag.
- The audit does not terminate by approval: the convergence pattern is
  real but the counter never reaches zero. Phase 1 terminates only via
  the Navigator override.

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
