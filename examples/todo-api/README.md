# Educational walkthrough: `todo-api`

> ⚠️ **Constructed walkthrough, not a live run.**
>
> The artifacts here (spec, audits, drift report) were **written after the
> fact** to demonstrate the shape of each phase's output. They were not
> produced by real Goldfish sessions running blind. The narrative shows
> what the flow *looks like* when it works — it does not prove that the
> flow *was executed* on this project.
>
> If you want a live, unfabricated example of Keel Nav in action, run it
> yourself on your own project. If you want to see a real audit cycle
> with provenance (fresh sessions, real findings, real corrections),
> consult [`docs/designs/`](../../docs/designs/) — those are retrospective
> design specs of decisions actually made in this repo's development,
> not walkthroughs.
>
> **What this walkthrough IS useful for:** understanding the shape of
> each artifact in ~5 minutes, before you generate your own.
>
> **What it is NOT useful for:** proving the methodology works, arguing
> that the audits are real, or serving as a template you can copy without
> running the flow yourself.

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
| `specs/US-001.spec.md` | 0.1.1 | `audited` (after round 2) |
| `specs/US-001.drift.1.md` | n/a (report) | spec → `certified` after this |

`US-001.spec.v0.1.0.md` is what the spec writer produced first. It was
**rejected** by the Goldfish in `audit.1`. The revised spec (`US-001.spec.md`,
version 0.1.1) is what came back after the fix. `audit.2` approved it.
The drift report certified the implementation against v0.1.1.

> **Snapshot note:** `specs/US-001.spec.md` is the pre-drift snapshot
> (`status: audited`). The drift report's §9 records the certification.
> In a real Phase 4 run, skill 05 updates the spec's metadata to
> `status: certified` and `drift_report: 'specs/US-001.drift.1.md'`.

**The Phase 2 → Phase 3 transition:** the business logic in
`src/todos.py` is written in Phase 2 and **does not change** in Phase 3.
Phase 3 modifies `src/main.py` (removing a stub connection factory in
favor of `src/db.py`) and adds `src/db.py`. The `main.py` modification
is infrastructure wiring, not logic.

## Read order (5 minutes)

1. **This README.**
2. `specs/US-001.spec.v0.1.0.md` — see the draft that got rejected.
3. `specs/US-001.audit.1.md` — see what the Goldfish found.
4. `specs/US-001.spec.md` — see the revised version (v0.1.1).
5. `specs/US-001.audit.2.md` — see the approval.

The two audit rounds are the point. Most frameworks produce a spec and
stop. Keel Nav's claim is that a spec is not ready until it has survived
a hostile read.

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
│   ├── US-001.spec.v0.1.0.md (original, rejected)
│   ├── US-001.audit.1.md (audit round 1: rejected)
│   ├── US-001.spec.md (revised, v0.1.1, audited)
│   ├── US-001.audit.2.md (audit round 2: audited)
│   └── US-001.drift.1.md (drift: no-drift)
├── src/ (Phase 2 + 3 output)
│   ├── todos.py (business logic, Phase 2)
│   ├── main.py (FastAPI app, Phase 2 + Phase 3 wiring)
│   └── db.py (SQLite bootstrap, Phase 3)
└── tests/
    ├── test_todos.py (5 unit/integration tests, Phase 2)
    └── test_e2e.py (2 e2e tests, Phase 3)
```

## What you should notice

1. **The rejection is more instructive than the approval.** `audit.1`
   found a real contradiction between an AC and the contract. Without
   that finding, Phase 2 would have written tests against an
   underspecified endpoint.
2. **The revision did not expand the spec.** Fixing the three findings
   in `audit.1` made the existing sections more precise. Section 6 was
   added later, during Phase 3 observation, as the template requires.
3. **`src/todos.py` is the same in Phase 2 and Phase 3.** The logic
   doesn't change when the infrastructure changes. That is what
   "vertical slice wiring only" means in practice.
4. **The drift report is short.** A rigorous spec produces a short
   drift report. A long drift report means the spec was weak, not
   that the audit was thorough.
5. **The tests mirror the spec exactly.** 3 ACs → 5 Phase 2 tests,
   plus 2 e2e tests for the 3 §6 observations. No more, no less.

## A note on fabrication

This walkthrough contains **six artifacts with four different kinds of
provenance**. The README for each is honest about which is which; read
this section before trusting any of them.

| Artifact | Provenance | What it is |
|----------|-----------|-----------|
| `US-001.spec.v0.1.0.md` | Authored | The draft spec as it stood before audit. Audited once; verdict: `rejected`. |
| `US-001.audit.1.md` | **Real** | The **first real Goldfish session** recorded in this walkthrough. Run blind on 2026-11-08, in a fresh OpenCode session, against `US-001.spec.v0.1.0.md`. Verdict: `rejected`. **10 findings** (2 blocking, 5 warning, 3 info). |
| `US-001.audit.1.FABRICATED.md` | Fabricated | The original walkthrough version of the audit. Written by a human **after** knowing the answer. Verdict: `rejected`. **3 findings** (1 blocking, 2 warning, 0 info). Preserved only to show the difference. |
| `US-001.audit.2.md` | Fabricated | A fabricated "approval" round written for the walkthrough. **It is not a response to the real audit.** It addresses the 3 findings of `audit.1.FABRICATED.md`, not the 10 findings of the real audit. No second real Goldfish session was run. |
| `US-001.spec.md` (v0.1.1) | Fabricated correction | A human-authored rewrite of the spec, made **after** the real audit returned `rejected`. It is not a spec that a real Goldfish audited. It has `status: audited` and points to `audit.2.md` — both are walkthrough artifacts, not real audit outcomes. |
| `US-001.drift.1.md` | Fabricated | A scripted drift report. No real Phase 4 run. |

### Why both real and fabricated audits are preserved

The real Goldfish found **10 findings**. The fabricated one found **3**.
The fabricated one missed the contradiction between `T-4` (idempotency)
and `§3.2` (one row per insert, autoincrement `id`). It missed the
whitespace-normalization assumption in `AC-3`. It missed that `T-1` and
`T-5` can pass on incorrect stored values. It missed the structural gap
where the spec jumps from `§4` to `§7` with no `§5`/`§6`.

It was **systematically too gentle**, in exactly the way confirmation
bias predicts: the human who wrote it could only see what the spec
*said*. The Goldfish, reading blind, could see what the spec *did not
say*.

Both audits are in this directory so a reader can verify the difference
themselves. **A real blind audit is not a stricter re-read of a spec —
it is a different kind of audit.** This is what Skill 02 is for.

### What this walkthrough does *not* prove

- It does **not** prove that Phase 1b approves a corrected spec. Only
  one real audit ran, and it ran on the unrevised draft.
- It does **not** prove that Phases 2, 3, or 4 work as written. The
  downstream artifacts (`spec.md` v0.1.1, `audit.2.md`, `drift.1.md`)
  are fabricated corrections of a real audit, not real runs.
- It is **one** data point about **one** phase. The retro of v0.2.0
  says the gap is "no real Goldfish" — that gap is now "one real
  Goldfish, on one spec, in one phase." The rest is still open.

### How to add a real second round yourself

To see a real `audit.2.md`, first rename the existing fabricated
`US-001.audit.2.md` to `US-001.audit.2.FABRICATED.md` so the new round
does not overwrite it. Then open a fresh OpenCode session (no memory of
this conversation) and run:

```text
Lee .meta-skills/02-egm-goldfish-audit.md y ejecuta Phase 1b.
Inputs:
spec_path: examples/todo-api/specs/US-001.spec.md
context_doc: examples/todo-api/docs/context/todos.md
audit_round: 2
```

If the second round returns `audited`, that is a real second data point.
If it returns `rejected` with new findings, that is more useful still —
it means the "correction" in `v0.1.1` did not close what the real audit
opened. Commit the result next to `audit.1.md` and update this section.

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
