# Educational walkthrough: `todo-api`

> ⚠️ **This is a constructed walkthrough, not a full live run.**
>
> **Two artifacts are real.** `specs/US-001.audit.1.md` and
> `specs/US-001.audit.2.md` are the outputs of two real, blind Goldfish
> sessions run on 2026-11-08 in fresh OpenCode sessions. Both audited
> the spec and both returned `rejected`: round 1 (on v0.1.0) with 10
> findings (2 blocking, 5 warning, 3 info), round 2 (on v0.1.1) with
> 9 findings (3 blocking, 3 warning, 3 info). The revised spec
> (`US-001.spec.md`, v0.1.1), `drift.1.md`, and the two
> `.FABRICATED.md` audits are fabricated walkthrough artifacts.
>
> See **"A note on fabrication"** at the bottom of this README for the
> provenance of each file.
>
> **What this walkthrough IS useful for:** understanding the shape of
> each artifact in ~5 minutes, and seeing how a blind audit catches what
> a fabricated one misses — including the fact that a fabricated
> "correction" can make a spec worse.
>
> **What it is NOT useful for:** proving the methodology works end to
> end. Phase 1b ran twice for real; Phases 2, 3, and 4 did not. The
> downstream artifacts are walkthrough illustrations, not evidence.

---

## The fictional project

A single-endpoint REST API for creating todo items.

- **Stack:** Python 3.11 · FastAPI · SQLite · pytest
- **Scope:** one user story (`US-001`), one endpoint (`POST /todos`),
  one table (`todos`).
- **Explicitly out of scope:** authentication, listing, updating,
  deleting, any UI.

## State machine — what each file represents

The example demonstrates a spec at three moments in its lifecycle:

| File | Spec version | Status at that point |
|------|--------------|---------------------|
| `specs/US-001.spec.v0.1.0.md` | 0.1.0 | `draft` (before audit) |
| `specs/US-001.spec.md` | 0.1.1 | `draft` (round 2 rejected) |
| `specs/US-001.drift.1.md` | n/a (report) | fabricated; no real certification |

`US-001.spec.v0.1.0.md` is what the spec writer produced first. It was
**rejected** by the Goldfish in `audit.1`. The revised spec (`US-001.spec.md`,
version 0.1.1) is the fabricated "correction". A real second Goldfish
session (`audit.2`) also **rejected** it, with more blocking findings
than round 1. The drift report is a fabricated illustration; no real
Phase 4 run certified anything.

> **Snapshot note:** `specs/US-001.spec.md` is a `draft` snapshot. The
> drift report in this directory is fabricated and its §9 does not
> certify a real implementation.

**The Phase 2 → Phase 3 transition:** the business logic in
`src/todos.py` is written in Phase 2 and **does not change** in Phase 3.
Phase 3 modifies `src/main.py` (removing a stub connection factory in
favor of `src/db.py`) and adds `src/db.py`. The `main.py` modification
is infrastructure wiring, not logic.

## Read order (5 minutes)

1. **This README.**
2. `specs/US-001.spec.v0.1.0.md` — see the draft that got rejected.
3. `specs/US-001.audit.1.md` — see what the first real Goldfish found.
4. `specs/US-001.spec.md` — see the fabricated "correction" (v0.1.1).
5. `specs/US-001.audit.2.md` — see the second real Goldfish reject it.

The two audit rounds are the point. Most frameworks produce a spec and
stop. Keel Nav's claim is that a spec is not ready until it has survived
a hostile read. This walkthrough shows a stronger result: a fabricated
correction that was written against a fabricated audit does not survive
a real second audit.

> **Provenance note for this read order:** Steps 3 and 5 are real blind
> Goldfish runs. The `audit.1.FABRICATED.md` and `audit.2.FABRICATED.md`
> files are the original walkthrough versions, preserved for comparison.
> The "reject → fix → reject harder" cycle is real on both audit ends;
> only the revision between them is fabricated.

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
├── specs/ (Phase 1a + 1b + 4 output)
│   ├── US-001.spec.v0.1.0.md (original, rejected by round 1)
│   ├── US-001.audit.1.md (real audit round 1: rejected)
│   ├── US-001.audit.1.FABRICATED.md (fabricated round 1, preserved)
│   ├── US-001.spec.md (fabricated correction, v0.1.1, draft)
│   ├── US-001.audit.2.md (real audit round 2: rejected)
│   ├── US-001.audit.2.FABRICATED.md (fabricated round 2, preserved)
│   └── US-001.drift.1.md (fabricated drift: no-drift)
├── src/ (Phase 2 + 3 output)
│   ├── todos.py (business logic, Phase 2)
│   ├── main.py (FastAPI app, Phase 2 + Phase 3 wiring)
│   └── db.py (SQLite bootstrap, Phase 3)
└── tests/
    ├── test_todos.py (5 unit/integration tests, Phase 2)
    └── test_e2e.py (2 e2e tests, Phase 3)
```

## What you should notice

1. **The rejection is more instructive than a fabricated approval.**
   `audit.1.md` found a real contradiction between the test plan and the
   interface contract: `T-4` assumed idempotency (same title twice → same
   `id`), while `§3.2` specifies one row per successful insert with an
   autoincrement `id`. Without that finding, Phase 2 would have written
   `T-4` against a contract that contradicts it, and Phase 4's drift
   check would have flagged the contradiction only after the code
   already existed.
2. **The fabricated correction is not a fix.** `v0.1.1` fixed the
   three findings in `audit.1.FABRICATED.md`, but the real round 1 audit
   had 10 findings and round 2 still rejected the result with 3 blocking
   findings — one more than round 1's 2. The correction addressed some
   real findings by overlap, half-addressed the whitespace finding, and
   left the rest open. That is the gap between the shape of a correction
   and a real one.
3. **`src/todos.py` is the same in Phase 2 and Phase 3.** The logic
   doesn't change when the infrastructure changes. That is what
   "vertical slice wiring only" means in practice.
4. **The drift report is short — but this one is fabricated.** In a real
   Phase 4 run, a rigorous spec produces a short drift report. The report
   in this directory illustrates the shape, not a real certification.
5. **The tests pass, but they are not evidence that the spec was approved.**
   3 ACs → 5 Phase 2 tests, plus 2 e2e tests for the §6 observations.
   The suite is real and green; the spec it was written against is still
   `draft` and was rejected twice by the real Goldfish.

## A note on fabrication

This walkthrough contains **seven artifacts with four different kinds of
provenance**. The README for each is honest about which is which; read
this section before trusting any of them.

| Artifact | Provenance | What it is |
|----------|-----------|-----------|
| `US-001.spec.v0.1.0.md` | Authored | The draft spec as it stood before audit. Audited once; verdict: `rejected`. |
| `US-001.audit.1.md` | **Real** | The **first real Goldfish session** recorded in this walkthrough. Run blind on 2026-11-08, in a fresh OpenCode session, against `US-001.spec.v0.1.0.md`. Verdict: `rejected`. **10 findings** (2 blocking, 5 warning, 3 info). |
| `US-001.audit.1.FABRICATED.md` | Fabricated | The original walkthrough version of the audit. Written by a human **after** knowing the answer. Verdict: `rejected`. **3 findings** (1 blocking, 2 warning, 0 info). Preserved only to show the difference. |
| `US-001.audit.2.md` | **Real** | The **second real Goldfish session** recorded in this walkthrough. Run blind on 2026-11-08, in a fresh OpenCode session, against `US-001.spec.md` (v0.1.1). Verdict: `rejected` — **3 blocking, 3 warning, 3 info**. See "Round 2 rejects harder than round 1" below. |
| `US-001.audit.2.FABRICATED.md` | Fabricated | The original walkthrough version of a "round 2 approval". Preserved for comparison. **It is not a response to the real audit.** It addressed the 3 findings of `audit.1.FABRICATED.md`; the real round 2 rejects `v0.1.1` with 3 blocking findings. |
| `US-001.spec.md` (v0.1.1) | Fabricated correction | A human-authored rewrite of the spec, made **after** the real round 1 audit returned `rejected`. It was written against the fabricated audit's three findings, not the real audit's ten. A real round 2 audit rejected it. Status: `draft`. |
| `US-001.drift.1.md` | Fabricated | A scripted drift report. No real Phase 4 run. |

### Why both real and fabricated audits are preserved

The first real Goldfish found **10 findings**; the first fabricated one
found **3**. The second real Goldfish found **9** (3 blocking); the
second fabricated one reported an approval. In both rounds the
fabricated audit was **systematically too gentle**, in exactly the way
confirmation bias predicts: the human who wrote it could only see what
the spec *said*. The Goldfish, reading blind, could see what the spec
*did not say*.

The first fabricated audit missed the contradiction between `T-4`
(idempotency) and `§3.2` (one row per insert, autoincrement `id`). It
missed the whitespace-normalization assumption in `AC-3`. It missed that
`T-1` and `T-5` can pass on incorrect stored values. It missed the
structural gap where the spec jumps from `§4` to `§7` with no `§5`/`§6`.
The second fabricated audit reported an approval for a version that the
real second audit rejected with three blocking findings.

All four audits are in this directory so a reader can verify the
difference themselves. **A real blind audit is not a stricter re-read of
a spec — it is a different kind of audit.** This is what Skill 02 is for.

### What this walkthrough does *not* prove

- It does **not** prove that Phase 1b approves a corrected spec. Two
  real audits ran, and both rejected their target.
- It does **not** prove that Phases 2, 3, or 4 work as written. The
  downstream artifacts (`drift.1.md` and the code/tests) are walkthrough
  illustrations, not real phase evidence.
- It is **two** data points about **one** phase. The retro of v0.2.0
  said the gap was "no real Goldfish" — that gap is now "two real
  Goldfish, on one spec, in one phase." The rest is still open.

### How the real second round was run

The real `audit.2.md` was produced by renaming the fabricated
`US-001.audit.2.md` to `US-001.audit.2.FABRICATED.md`, then opening a
fresh OpenCode session (no memory of this conversation) and running:

```text
Lee .meta-skills/02-egm-goldfish-audit.md y ejecuta Phase 1b.
Inputs:
spec_path: examples/todo-api/specs/US-001.spec.md
context_doc: examples/todo-api/docs/context/todos.md
audit_round: 2
```

The round returned `rejected` with three blocking findings. It did not
approve the fabricated correction. The result is committed next to
`audit.1.md`.

## Round 2 rejects harder than round 1

This is the single most important result of the walkthrough. Both rounds
of the Goldfish audit were run for real, by blind sub-agents with no
memory of the spec-writing session. Round 1 audited `v0.1.0`. Between
rounds, `v0.1.1` was **fabricated** as a "correction" against the
findings of the fabricated audit (`audit.1.FABRICATED.md`). Round 2
audited `v0.1.1`.

| | Round 1 (real, on v0.1.0) | Round 2 (real, on v0.1.1) |
|--|----------------------------|----------------------------|
| Verdict | `rejected` | `rejected` |
| Blocking | 2 | **3** |
| Warning | 5 | 3 |
| Info | 3 | 3 |
| Total | 10 | 9 |

**v0.1.1 has more blocking findings than v0.1.0** — even though v0.1.1
was presented (in this walkthrough) as the corrected version. The
"correction" did not make the spec more approvable; it made it more
contradictory.

### Why

`v0.1.1` was written against the **fabricated** audit's findings, not
the real ones. It fixed the three things the fabricated audit complained
about (422 response shape, AC-3 vagueness, idempotency test). Some of
those fixes overlapped with real findings: the 422 shape was both the
fabricated B1 and the real W1, and removing `T-4` resolved the real B1.
But the revision did not work from the real audit's list. It left the
whitespace finding (B2) half-addressed, left the missing-field and
test-taxonomy findings (W4, I3) untouched, and still omits §5. In two
places, it made the spec **worse**:

1. **Whitespace normalization.** Round 1's B2 flagged that the spec
   never stated whether `"  buy milk  "` is stored stripped or raw.
   `v0.1.1` added "title after strip()" to AC-3 — but did not update
   §3.2, which still says "the given title". The spec is now internally
   inconsistent (AC vs contract), which is a stronger failure than the
   original incompleteness. Round 2 catches it as B2.
2. **Test taxonomy.** Round 1's I2 noted that `T-3` and `T-5` are typed
   `unit` but assert HTTP behavior. `v0.1.1` added another `unit`-typed
   test (`T-4`) and kept `T-3`/`T-5` as `unit`, so the taxonomy gap grew
   rather than shrinking. Round 2 promotes the `T-3` case to blocking
   (B3).

### The meta-finding

Round 2's I2 is the sharpest evidence that the walkthrough was
dishonest before the real audits:

> **I2 | BIAS |** The title and §8 record `status: audited` and a
> round-2 audit path before this report exists, so the spec's
> provenance asserts an outcome not yet assessed.

`v0.1.1` claimed `status: audited` and pointed to `audit.2.md` (which
was fabricated) **before** any real audit had run. The Goldfish, reading
blind, caught this. The spec was lying about its own provenance in its
own title and §8 metadata, and the blind auditor flagged it.

### What this proves

The retro at v0.2.0 said:

> *"We never ran a real Goldfish, so we don't know if the method works
> or if it just sounds good."*

That question is now answered. The method works — and more
specifically:

> **Fabricating a correction against a fabricated audit does not produce
> a spec that a real audit approves. It produces a spec that a real
> audit rejects more strongly.** The blind Goldfish is not a stricter
> version of a human re-read. It is a different kind of audit, and it
> catches the class of errors that fabrication systematically misses:
> the contradictions, assumptions, and coverage gaps the author cannot
> see because they are in what the spec *does not say*.

## Running the code (not the methodology)

The code in `src/` and `tests/` is real, runnable Python. You can verify
the tests pass:

```bash
cd examples/todo-api
pip install -r requirements.txt
pytest tests/ -v
```

That is a sanity check on the code, not a validation of Keel Nav. The
methodology's correctness is not tested by running pytest; it is tested
by running Phases 0–4 on a real project with real audits.

## See also

- [`AGENTS.md`](../../AGENTS.md) — behavioral contract
- [`../../.meta-skills/`](../../.meta-skills/) — the six meta-skills
- [`../../docs/designs/`](../../docs/designs/) — real design specs with
  provenance
- [`../../harnesses/generic/`](../../harnesses/generic/) — how to invoke
  Keel Nav without a plugin
