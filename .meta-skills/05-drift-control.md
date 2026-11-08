---
name: drift-control
phase: 4
version: 0.1.0
description: Final certification. Compare the implemented code against the
  audited spec, line by line, to certify no-drift (or reject). Closes the
  Keel Nav flow. Does not fix, does not re-audit, does not re-test.
compatible_with: [opencode, claude-code, cursor, copilot-cli, gemini-cli, generic]
inputs:
  - spec_path: "specs/<US-ID>.spec.md (status must be implemented or observed)"
  - audit_path: "specs/<US-ID>.audit.<N>.md (effective_verdict: audited, possibly via overrides)"
  - test_plan_path: "test plan derived from spec Section 4"
  - code_scope: "git-diff base=<sha> OR files=<explicit list>"
  - observation_report: "spec Section 6 (required if status=observed)"
outputs:
  - specs/<US-ID>.drift.<N>.md
  - side-effect: "spec metadata (status: certified | unchanged, drift_report: path)"
estimated_tokens: 2000-3000
requires: [03-tdd-cycle]
blocks: []
---

# Meta-Skill 05 — Drift Control (Final Certification)

## Objective

Certify that the implemented code **matches the audited spec** and that no
hidden scope, no missing behavior, and no orphan test exists. This is the
only phase that closes the loop: after drift certification, the spec is
**done** and the artifact can ship.

> **Golden rule:** drift is not "did the tests pass". Drift is "does the
> codebase say exactly what the spec says, and nothing more". A green test
> suite with 20 lines of unreferenced code is drift. A spec AC with no test
> is drift. A test with no AC is drift. A refactor that changed a public
> signature without updating the spec is drift.

## What "drift" means (5 categories)

| Category | Definition | Example |
|----------|------------|---------|
| **SPEC_DRIFT** | Code implements behavior not declared in the spec. | A `billing/utils.py` helper no AC justifies. |
| **CODE_DRIFT** | Spec declares behavior not implemented in code. | AC-3 promised an event; no emitter exists. |
| **TEST_DRIFT** | Test exists with no AC, or AC with no test. | `T-4` asserts idempotency; no AC mentions it. |
| **CONTRACT_DRIFT** | Section 3 interface differs from actual implementation. | Spec says `202 Accepted`; code returns `200 OK`. |
| **OBSERVATION_DRIFT** | Phase 3 observation no longer matches current code. | Navigator approved behavior A; code now does B. |

A **sixth special state**, not a category:

- **OBSERVATION_BLOCKED** — Phase 3 was blocked (no runnable environment)
  and no Navigator override exists. The code may be correct but was never
  witnessed by a human. This prevents certification.

## When to use

- After Phase 2 (`status: implemented`) for specs without Phase 3.
- After Phase 3 (`status: observed`) for specs with Phase 3.
- Whenever the Navigator suspects the spec and code have diverged (refactor,
  bug fix, dependency upgrade that changed behavior).
- Before tagging a release that ships the artifact.

Do **not** use when:

- `status` is `draft` or `audited` → not implemented yet.
- `goldfish_audit` is missing → Phase 1 was skipped → escalate.
- The spec has unimplemented ACs → that is a Phase 2 problem, not drift.

## Agent role

You are the **Drift Auditor**. You are allowed to:

- Read the spec, the audit report (including `## Navigator overrides`), the
  test plan, and every file in the declared code scope.
- Read git metadata (log, diff, blame) to establish the code scope and
  check whether files existed before the spec.
- Write exactly one file: `specs/<US-ID>.drift.<N>.md`.
- Update exactly two metadata fields in the spec: `status:`, `drift_report:`.

You are **forbidden** to:

- Modify production code.
- Modify tests.
- Modify the spec's body (only the two metadata fields).
- Propose fixes. Name drift; the Navigator routes the fix.
- Re-audit the spec (that is Goldfish's job; if drift suggests spec quality
  issues, escalate back to Phase 1, do not re-audit inline).
- Re-run the test suite and certify "it passes" as drift-free. A passing
  suite is a prerequisite, not a certification.
- Read files outside the code scope. Code outside scope is not checked.
- Reuse a prior drift report as a starting point. Each report is fresh.
- Mark `certified` while any blocking finding lacks an override.

## Protocol (7 steps)

### Step 1 — Load & gate (cost: ~300 tokens)

1. Read `spec_path`. Locate Section 8 metadata.
2. Read `audit_path`. Locate the verdict and any `## Navigator overrides`.
3. Verify:

| Check | Required | If fails |
|-------|----------|----------|
| `spec.status` ∈ {`implemented`, `observed`} | yes | Escalate (Phase 2 or 3 not done). |
| Audit `effective_verdict:` is `audited` | yes | Escalate to Navigator. |
| `spec.goldfish_audit` points to an existing file | yes | Escalate. |
| If `spec.status = observed`, Section 6 is non-empty | yes | Escalate (inconsistent state). |
| `code_scope` is provided (git-diff or files) | yes | Ask Navigator in Step 2. |

**Escalation message:**

```
🛑 Escalation — Phase 4
Check failed: <which>
Reason: <one line>
Proposed Navigator action: <finish Phase 2/3 / resolve audit / provide code scope>
```

### Step 2 — Establish code scope (cost: ~200 tokens)

The code scope is the audit's boundary. Nothing outside scope is checked.
Nothing inside scope is skipped.

**Preferred method (git available):**

1. Ask the Navigator for a base commit, or derive it:
   - Look for the commit that first added the spec's Section 4 test files.
   - `git log --diff-filter=A -- <test-file>` returns the first commit.
2. `git diff --stat <base>..HEAD` gives the full code scope.
3. Emit:

```
Code scope established:

Base: <sha> (<date>)

Head: <sha> (<date>)

Files in scope: <N>
<list>
Proceed? (y/n)
```

**Fallback (no git, or Navigator prefers explicit list):**

1. Ask the Navigator: "Provide the list of production and test files to
   audit, or approve the derived list below."
2. Derive the list from:
   - Files mentioned in spec Section 3 (interface contracts).
   - Files mentioned in the test plan (test inventory).
   - Files in the bounded context directory matching the stack's conventions.
3. Emit the derived list, wait for approval.

**If the Navigator cannot provide a code scope**, stop. Do not silently
scan the whole repo. That is not a drift audit; that is a code review.

### Step 3 — Forward check: spec → code (cost: ~1000 tokens)

For each AC in spec Section 2 and each contract in Section 3:

1. Locate the implementation (grep for the function name, endpoint path,
   event name). Record `file:line`.
2. Locate the test that asserts it. Record `Test ID`.
3. Classify:

| Condition | Verdict |
|-----------|---------|
| Implementation exists AND test exists AND test asserts the AC's observable result | `match` |
| Implementation exists AND test exists BUT test asserts something weaker/different | `drift` (TEST_DRIFT) |
| Implementation exists AND no test | `drift` (TEST_DRIFT — no coverage) |
| No implementation | `drift` (CODE_DRIFT) |
| Implementation exists but does not match the declared contract (verb, status, payload) | `drift` (CONTRACT_DRIFT) |

4. Populate template §3.1 (ACs) and §3.2 (contracts).

**Verification discipline:** for the `match` verdict, **open the test** and
read its assertion. Do not infer from the test's name. A test named
`test_retry_succeeds` that asserts `assert result is not None` is not
matching an AC that says "returns 202 with body `{retries: 3}`". The
mismatch is a TEST_DRIFT.

### Step 4 — Backward check: code → spec (cost: ~500 tokens)

For each **production** file in scope:

1. Find the spec section that justifies it. Justification anchors:
   - Section 3 (interface contracts) for API endpoints, functions, events.
   - Section 6 (observation notes) for UI components and observability.
   - Nothing justifies pure infrastructure (migrations, DI) — those are
     derived from Section 3 and are "justified by derivation".
2. If no anchor exists → **`UNJUSTIFIED (scope creep)`**. Populate §4 and
   add a BLOCKING finding under SPEC_DRIFT.

**Rules:**

- A helper file referenced only by justified files is justified **if** its
  content is trivially inferable from the parent's contract (type definitions,
  constant enums). Otherwise, it needs its own anchor.
- A test helper / fixture file is not production and is not subject to
  this check (it is subject to §5).
- A migration that implements a Section 3 persistence contract is justified
  by derivation. A migration for a table no contract mentions is
  UNJUSTIFIED.

### Step 5 — Test traceability check (cost: ~500 tokens)

For every test in scope:

1. Map it to exactly one AC (or one Section 6 observation, for e2e tests).
2. Classify:

| Condition | Verdict |
|-----------|---------|
| Test maps to exactly one AC AND asserts that AC's behavior | `match` |
| Test maps to zero ACs | `ORPHAN` (TEST_DRIFT) |
| Test maps to multiple ACs | `OVERLOADED` (TEST_DRIFT — the test is doing too much) |
| Test exists but is skipped / commented out | `DISABLED` (BLOCKING TEST_DRIFT) |

3. Populate template §5.

**Rule:** an `ORPHAN` test is drift even if it passes. It either signals a
missing AC (spec gap) or scope creep (code gap). Both are drift.

### Step 6 — Observation traceability check (cost: ~300 tokens, conditional)

**Only if** `spec.status = observed`. Skip otherwise.

For each observation in spec Section 6:

1. Confirm it is covered by an e2e test (from Phase 3).
2. Confirm the e2e test still passes on the **current** code (rerun it).
3. Classify:

| Condition | Verdict |
|-----------|---------|
| Covered by e2e AND still passing AND Navigator approved on record | `match` |
| Covered but test now fails | `drift` (OBSERVATION_DRIFT) |
| Not covered by any e2e | `drift` (OBSERVATION_DRIFT) |
| Navigator status was `deferred` or `blocked` | `OBSERVATION_BLOCKED` |

4. Populate template §6. If any observation is `OBSERVATION_BLOCKED` or
   drifted, add a finding.

**If `spec.status = observed` and Section 6 was later edited** (e.g., new
observations added after Phase 3), those observations are unobserved →
OBSERVATION_DRIFT. Do not assume the Navigator approved the edits.

### Step 7 — Compute verdict, write report, update metadata (cost: ~300 tokens)

**Verdict computation** (mechanical, do not negotiate):

Let `B` = count of blocking findings (§7.1), `O` = count of blocking findings
that have a Navigator override (§8), `A` = count of blocking findings without
override (`A = B - O`).

| Condition | Verdict | New spec status |
|-----------|---------|-----------------|
| `B = 0` | `no-drift` | `certified` |
| `B > 0` and `A = 0` | `drifted-accepted` | `certified` |
| `B > 0` and `A > 0` | `drifted` | unchanged |
| `OBSERVATION_BLOCKED` present and no override | `observation-blocked` | unchanged |

**Do not mark certified** while `A > 0` or an observation is blocked without
override.

**Write the drift report** using `templates/drift-report.template.md`.

**Update exactly two fields in the spec's Section 8:**

- `status:` → `certified` if verdict ∈ {`no-drift`, `drifted-accepted`},
  otherwise unchanged.
- `drift_report:` → `specs/<US-ID>.drift.<N>.md`.

**Do not touch anything else in the spec.**

## Navigator overrides (formal mechanism)

An override records that the Navigator has **accepted a blocking finding as
known, acceptable drift**. The finding stays in §7.1 — the override does
not delete it. This preserves the audit's evidence while recording the
Navigator's decision.

**Where overrides live:**

- In the drift report, §8 (`## Navigator overrides`). Populated by the
  Navigator, not by the Drift Auditor.
- In audit reports (Skill 02), §8 (`## Navigator overrides`), with the
  same structure. There, an override also sets `effective_verdict:` to
  `audited` and lets the Navigator flip the spec's `status:` from `draft`
  to `audited`. The Goldfish's `verdict:` stays immutable.

**What an override must contain:**

| Field | Required | Purpose |
|-------|----------|---------|
| Overrides finding | yes (finding ID) | Traceability |
| Navigator | yes (name) | Accountability |
| Date | yes | Temporal record |
| Justification | yes (one sentence) | Why accepted |
| Scope | yes (which file/AC/duration) | Limitation |

An override without a justification or scope is not an override. It is an
unrecorded decision, and the Drift Auditor must reject it as invalid.

**Re-audit trigger:** an override has a scope. If the scope is "this file
until refactor", a future drift report checks whether the refactor happened.
If not, the override is still valid. If yes, the finding may be re-checked
and the override retired.

## Quality gates (self-check before closing)

| Gate | Criterion | Blocking |
|------|-----------|----------|
| G1 | `spec.status` was `implemented` or `observed` at load | yes |
| G2 | Audit verdict `audited` OR every blocking finding has an override | yes |
| G3 | Code scope was declared and Navigator-approved (§2) | yes |
| G4 | Every AC in Section 2 appears in the forward traceability table | yes |
| G5 | Every production file in scope appears in the backward table | yes |
| G6 | Every test in scope appears in the test traceability table | yes |
| G7 | Every finding has a category, location, and one-sentence body | yes |
| G8 | Verdict computed mechanically from §7 and §8 counts | yes |
| G9 | `spec.status` and `spec.drift_report` updated per the verdict table | yes |
| G10 | No file outside `specs/` and the spec's metadata was modified | yes |
| G11 | Report body ≤ 250 lines | yes |
| G12 | No fix proposed, no code modified, no test modified | yes |

## Anti-patterns (forbidden)

- ❌ Marking `certified` because "the tests pass". A green suite is a
  prerequisite, not drift certification.
- ❌ Skipping the backward check (§4) because "everything looks justified".
  Files without an anchor are drift until proven otherwise.
- ❌ Treating an `ORPHAN` test as harmless. It signals a missing AC or
  scope creep — both drift.
- ❌ Skipping the observation check when `status: observed`. A stale
  observation is drift.
- ❌ Reading test names instead of assertions to decide `match`. A test's
  name is not evidence.
- ❌ Re-auditing the spec ("the Goldfish missed this"). Escalate to Phase 1,
  do not audit inline.
- ❌ Modifying code or tests "to make the drift go away". The Drift Auditor
  reports; the Navigator routes.
- ❌ Bypassing the code scope ("I'll just check this one extra file"). Scope
  is the audit's boundary. Outside scope is not checked, period.
- ❌ Recording an override without justification or scope. That is an
  unrecorded decision, not an override.
- ❌ Certifying with a blocking finding that lacks an override.
- ❌ Producing a second drift report in the same invocation. One report per
  audit round.

## Invocation example

**Navigator (OpenCode):**

> Run `.meta-skills/05-drift-control.md` on `specs/US-042.spec.md`.
> Audit: `specs/US-042.audit.2.md`.
> Code scope: `git-diff base=1a2b3c4 head=HEAD`.

**Agent:**

1. **Step 1:** spec `status: observed`, audit `audited` with one override
   on W2, Section 6 has 3 observations. All gates pass.
2. **Step 2:** code scope: `git diff --stat 1a2b3c4..HEAD` → 6 files
   (3 production, 3 test). Emits scope, Navigator approves.
3. **Step 3:** forward check:
   - AC-1 → `billing/retry.py:retry_charge` + `test_first_retry` → `match`
   - AC-2 → `billing/retry.py:retry_charge` (2s branch) + `test_second_retry` → `match`
   - AC-3 → `billing/events.py:emit_charge_failed` + `test_third_retry` → `match`
   - Section 3.2 event payload → implemented → `match`
4. **Step 4:** backward check:
   - `billing/retry.py` → Section 3.1 → justified
   - `billing/events.py` → Section 3.2 → justified
   - `billing/utils.py` → **no anchor** → UNJUSTIFIED → **B1 SPEC_DRIFT**
5. **Step 5:** test traceability:
   - `test_first_retry` → AC-1 → match
   - `test_second_retry` → AC-2 → match
   - `test_third_retry` → AC-3 → match
   - `test_idempotency` → **no AC** → **B2 TEST_DRIFT (ORPHAN)**
6. **Step 6:** observation check:
   - All 3 observations covered by e2e, all still passing → match.
7. **Step 7:** verdict: `B = 2`, `O = 0` (no override in §8) → `drifted`
   (`A = 2`). Writes `specs/US-042.drift.1.md`. Metadata unchanged
   (`status: observed`). Handoff emitted with "rejected — route back to
   Phase 2 for `utils.py` cleanup and idempotency AC clarification".

**Then the Navigator decides:**

- **Path A:** route back to Phase 2 (delete `utils.py`, add idempotency
  AC via spec revision + Goldfish round, then rerun Phase 2 for the new AC).
- **Path B:** accept `utils.py` and `test_idempotency` as overrides —
  opens the drift report, adds `## Navigator overrides` for B1 and B2 with
  justification, reruns skill 05. New verdict: `drifted-accepted`. Status
  → `certified`.

## Handoff messages

**On `no-drift`:**

```
✅ Drift certified: specs/<US-ID>.drift.<N>.md (0 blocking).
📁 Spec status: certified. Report: specs/<US-ID>.drift.<N>.md.
🎉 Keel Nav flow complete for <US-ID>. The artifact is certified.
```

**On `drifted-accepted`:**

```
✅ Drift certified with overrides: specs/<US-ID>.drift.<N>.md
(<B> blocking findings, <O> overridden).
📁 Spec status: certified. Report: specs/<US-ID>.drift.<N>.md.
⚠️ Overrides recorded in §8. Review them at refactor time.
🎉 Keel Nav flow complete for <US-ID>.
```

**On `drifted`:**

```
🛑 Drift rejected: specs/<US-ID>.drift.<N>.md
(<B> blocking findings, <O> overridden, <A> unaddressed).
📁 Spec status: unchanged. Code and spec diverged.
➡️ Next: Navigator routes fixes.

SPEC_DRIFT (unjustified code) → delete code or add an AC to spec.

CODE_DRIFT (missing impl) → Phase 2 re-run.

TEST_DRIFT (orphan test or uncovered AC) → Phase 1 spec revision + new audit round.

CONTRACT_DRIFT → Phase 1 spec revision.

OBSERVATION_DRIFT → Phase 3 re-observation.
After fixes: new drift round (N+1).
```

**On `observation-blocked`:**

```
🛑 Drift blocked: specs/<US-ID>.drift.<N>.md
Observation gate was not passed (status: deferred/blocked).
📁 Spec status: unchanged.
➡️ Next: Navigator either (a) runs Phase 3 observation to completion,
or (b) adds a Navigator override accepting the observation gap and
reruns Phase 4.
```

## Design notes (for contributors)

- **Why is drift not "did tests pass"?** Because a green suite plus dead code
  plus orphan tests is exactly what "vibe coding" produces. Keel Nav's entire
  point is that green tests are necessary but not sufficient. Drift control
  closes that gap.
- **Why compare both directions?** Spec → code catches missing implementation.
  Code → spec catches scope creep. A one-directional check misses half the
  drift. The two-directional check is the whole reason this phase exists.
- **Why is the Navigator override kept in §7.1?** Because deleting a finding
  after overriding it destroys the historical record. If the override's scope
  expires (e.g., "until refactor"), a future drift report must see the finding
  again to re-check it. Deleting would lose that. Override is additive, not
  subtractive.
- **Why the `observation-blocked` verdict?** Because certifying un-observed
  behavior is a lie. If Phase 3 was blocked and the Navigator hasn't accepted
  that, drift cannot certify. Honest default.
- **Why require code scope declaration?** Because "audit the codebase" is
  unbounded. A precise scope (git range or file list) lets both sides agree
  what was audited. Findings outside scope are always "not checked, by
  declaration" — no ambiguity.
- **Why not fix issues inline?** Because the Drift Auditor is a witness, not
  a participant. Once the auditor fixes code, the audit's verdict is
  self-serving. The Navigator routes; the auditor reports.
- **Why is the drift report > the audit report in allowed size?** Because
  drift checking is more comprehensive — it traces both directions plus
  tests plus observations. The 250-line ceiling vs 200 for audit reflects
  that difference, not a lower standard.

## Known gaps (documented debt)

- **Dead code detection:** this skill finds unjustified files, not unused
  functions within justified files. A future enhancement could leverage
  per-language linters. Out of scope for v0.1.0.
- **Complexity thresholds:** no formal check for "this function is 500 lines
  and no AC justifies the length". A manual review by the Navigator catches
  the worst cases; a future linter integration could formalize. Out of scope.
- **Dependency audit:** no check for unused `package.json` / `pyproject.toml`
  entries. Out of scope for v0.1.0.
- **Multi-round override retirement:** overrides have a `scope` field, but
  no automatic mechanism retires them when the scope is satisfied. The
  Navigator must explicitly retire them in the next drift report. Manual
  for v0.1.0; could be automated later.
- **Cross-context drift:** if a spec touches two bounded contexts and one
  context's code was modified after certification, this report does not
  re-audit the other context. Multi-spec drift coordination is a
  future-project concern.
