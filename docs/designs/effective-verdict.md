---
title: Effective verdict — separating auditor evidence from navigator governance
author: Keel Nav core team
status: Implemented
source: retrospective
implemented_in: 9f69f7f
date: 2026-11-08
---

# Effective verdict — separating auditor evidence from navigator governance

## Problem

Skill 02 (Goldfish Audit) produces a verdict of `audited` or `rejected`.
Skill 05 (Drift Control) accepts a `## Navigator overrides` section that
records the Navigator's acceptance of specific blocking findings.

Before this design, the two mechanisms were inconsistent: skill 02 had no
formal override section, so an `audited`-needed spec that the Navigator
wanted to accept "anyway" had no legitimate path. The workaround was to
either soften findings (dishonest) or bypass Phase 1b entirely (breaks
the methodology).

The underlying tension: **the Goldfish's verdict is evidence; the
Navigator's decision is governance.** A single field cannot carry both.
If `verdict: rejected` is mutable by the Navigator, the evidence is
erased. If it is immutable, the Navigator cannot exercise authority.

## Proposed solution

Split the verdict into two fields:

- **`verdict:`** — written by the Goldfish, **immutable**. Records what
  the auditor actually assessed. Never changed after the report is
  written.
- **`effective_verdict:`** — written by the Goldfish equal to `verdict:`
  initially. **The Navigator may change it** from `rejected` to `audited`
  only if §8 (`## Navigator overrides`) contains an entry for **every**
  blocking finding, each with all four required fields (Navigator, Date,
  Justification, Scope).

The finding itself stays in the report's blocking-findings table after
the override. The override does not delete evidence; it records a
decision on top of it.

### Invariant

> `effective_verdict: audited` **iff** every blocking finding has a
> complete §8 override. Otherwise, `effective_verdict` must equal
> `verdict` (`rejected`).

This invariant is enforced by anti-pattern in skill 02 (a Goldfish
cannot set `effective_verdict: audited` while a §8 override is
incomplete) and by gate G9.

### Who writes what

| Field | Goldfish | Navigator |
|-------|----------|-----------|
| `verdict:` | writes | **never touches** |
| `effective_verdict:` | writes (equal to `verdict:`) | may change if invariant holds |
| `status:` in the spec | writes per `verdict:` | may flip to `audited` after override |
| §8 Navigator overrides | leaves as `None.` | may add entries |

## Alternatives considered

### Alternative A — merge into a single mutable `verdict`

Rejected. Overwriting the Goldfish's evidence destroys the audit trail.
A future Drift Control would not be able to tell whether the spec was
ever `rejected` and later accepted, or `audited` from the start.

### Alternative B — delete overridden findings from §7.1

Rejected. If the scope of an override expires (e.g., "accepted until
refactor"), a future drift check needs the original finding visible to
re-check it. Deleting the finding loses that.

### Alternative C — add a third state `audited-with-overrides`

Rejected as redundant. `effective_verdict: audited` already carries that
meaning when §8 is non-empty. A third state adds bookkeeping without
adding information.

### Alternative D — no overrides at all

Rejected. Blocking findings sometimes must be accepted by the Navigator
for reasons unrelated to spec quality (business constraints, external
dependencies, time pressure). A methodology that forbids this forces
users to bypass the flow entirely, which is worse than a formal override.

## Impact

- Skill 02 gained `## Navigator overrides` and the `effective_verdict`
  field (commit 9f69f7f).
- Skill 03's gate now checks `effective_verdict` instead of `verdict`.
- Skill 04's gate was updated for the same reason (found during the
  same commit, not in the original plan).
- Skill 05's override mechanism (pre-existing) now matches skill 02's.

## Open questions

None. Implemented and in production as of v0.2.0-alpha.

## See also

- `.meta-skills/02-egm-goldfish-audit.md` §"Step 4 — Verdict pass"
- `.meta-skills/05-drift-control.md` §"Navigator overrides"
- `templates/drift-report.template.md` §8
