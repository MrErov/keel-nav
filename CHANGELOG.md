# Changelog

All notable changes to Keel Nav are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Pre-1.0 releases use `0.x.y-alpha` per [Semantic Versioning](https://semver.org/)
with the understanding that:

- The **major** number is `0` until the methodology and all harnesses have
  been used by external adopters in production.
- The **minor** number increments on shipped feature milestones.
- The **patch** number increments on fixes to a shipped milestone.
- The `-alpha` suffix means: the API (meta-skill protocol, template sections,
  frontmatter fields) may change between minor versions without a deprecation
  cycle.

## [Unreleased]

### Changed

- **Compressed `.meta-skills/02-egm-goldfish-audit.md`** from 490 to
  300 lines. All 5 protocol steps, G1–G9 gates, and anti-patterns
  preserved. `effective_verdict` mechanism and `## Navigator overrides`
  section intact.
- **Compressed `.meta-skills/05-drift-control.md`** from 491 to 300
  lines. All 7 protocol steps, G1–G12 gates, and anti-patterns preserved.
  Navigator overrides mechanism intact. "Known gaps" section moved to
  `docs/known-limitations.md`.

### Added

- **Second real Goldfish audit** (`examples/todo-api/specs/US-001.audit.2.md`)
  run blind on `v0.1.1`. Verdict: `rejected` with 3 blocking findings —
  more blocking findings than round 1's audit of `v0.1.0` (2). Demonstrates
  empirically that a fabricated correction against a fabricated audit
  produces a spec that a real audit rejects more strongly, not less.
- **`docs/known-limitations.md`** — consolidates the 11 live gaps across
  skills 03, 04, and 05. Each row lists the gap, its workaround, and
  (implicitly) the release where it might be addressed.
- **`examples/todo-api/`** — constructed walkthrough of the five phases,
  explicitly labeled as not a live run. Includes the pre-audit spec, four
  real audit rounds (all rejected; Phase 1 closed via Navigator overrides),
  the drift report, 5 unit tests, and 2 e2e tests (7/7 pass).
- **Third and fourth real Goldfish audits**
  (`examples/todo-api/specs/US-001.audit.3.md` and `.audit.4.md`). Round 3
  rejected v0.1.2 with 2 blocking (test traceability: T-4/T-5 mapped to
  the wrong ACs, AC-3 scenarios split). Round 4 rejected v0.1.3 with 1
  blocking (round 2's deferred W2 promoted to blocking) plus 4 warnings
  about tests weaker than their ACs.
- **Walkthrough reframed around the 4-round audit history.**
  `examples/todo-api/README.md` rewritten to reflect the actual result:
  four real audits, four rejections, and the six findings the four
  rounds produced about the method (convergence without termination,
  category progression, residual promotion, test plan weaknesses, the
  120-line constraint, and the cost of fabrication). Phase 1 then
  closed via the Navigator override mechanism.
- **Spec v0.1.3** (`examples/todo-api/specs/US-001.spec.md`) — the
  human-authored fixes for round 3's findings, audited and rejected by
  round 4; Phase 1 closed via Navigator overrides. `status: audited`,
  `goldfish_audit: specs/US-001.audit.4.md`.
- **Phase 1 closed with Navigator overrides.** `audit.4.md` §8 now
  contains 5 overrides (1 blocking + 4 warning) with full justification
  and scope. `US-001.spec.md` is now `status: audited` with
  `effective_verdict: audited`. This is the first time Phase 1 closes
  in the walkthrough, and it closes via the override mechanism, not via
  approval. The 3 warning overrides (W2, W3, W4) shift precision from
  the spec to the test suite, which will be verified in Phase 2.
- **Phase 2 executed against v0.1.3.** `tests/test_todos.py` rewritten to
  use the HTTP layer (TestClient) instead of calling `create_todo`
  directly, matching v0.1.3's "integration" typing. Strong assertions per
  Navigator overrides O3-O5: T-1 asserts `id` matches the persisted row
  and `created_at` is fresh (< 60s); T-2 and T-3 assert the exact
  `error == "title_required"` code. All 5 tests pass against the existing
  `src/todos.py` and `src/main.py`. **Note:** the code predates the tests
  by several rounds, so TDD's RED-first ordering is not verifiable in this
  walkthrough. The tests are spec-derived, not code-derived, and are
  demonstrably non-tautological against the assertions O3-O5 add.
- **Phase 3 test scaffolding** — `tests/conftest.py` (fixes `pytest` path
  resolution: plain `pytest tests/` now works without `python -m`),
  `tests/test_e2e.py` rewritten to cover the 4 observations in v0.1.3 §6
  (id monotonicity, created_at distinct across seconds, 422 has no id,
  response time informational). **No `src/` changes needed:** the app was
  already wired to file-backed SQLite via `src/db.get_conn`. Phase 3's
  "wiring" was done in Phase 2 for this project; the boundary between
  phases is the §6 observations, not the infrastructure.

### Removed

- **Skill 04 gap #4** — the `status: observed` bullet was obsolete
  (`templates/spec.template.md` already includes `observed` in the enum
  as of v0.2.0-alpha).

### Docs

- **`CONTRIBUTING.md` §3.1** — added a YAML quoting note (values
  containing `': '` must be quoted). References the YAML guide comment
  in `templates/spec.template.md` §8.
- **`docs/designs/`** — three retrospective design specs
  (`effective-verdict`, `blind-audit-protocol`, `skill-compression`) with
  commit provenance and alternatives considered. `source: retrospective`
  records that they document decisions already implemented.

### Deferred

- **Priority 3 (CI).** Declined as a speculative preventive. The manual
  mechanical check has 20+ turns of clean data; the defects that mattered
  in this project (semantic spec/audit mismatches) are not caught by CI
  anyway. Deferred pending one of the documented triggers in
  `docs/known-limitations.md`.

## [0.2.0-alpha] - 2026-11-08

### Added — Harness adapters

- **`harnesses/opencode/`** — 6 thin shims (`SKILL.md` per phase) + install
  guide. Native `/context-bootstrap` … `/drift-control` invocation. Phase 1b
  (Goldfish) has *mechanical* fresh-session enforcement: the shim refuses if
  the session has prior spec context.
- **`harnesses/claude-code/`** — `CLAUDE.md` directive file (single file)
  + install guide. Dispatch is conversational (`/phase-0` etc. are
  recognized but not native commands).
- **`harnesses/cursor/`** — `.cursorrules` directive file (single file)
  + install guide. Dispatch is natural language ("run Phase 0" etc.).
- **`harnesses/dsh-bridges/`** — documentation only. `dsh-bridges` auto-
  detects the three specific adapters above; no shims needed.

### Changed

- `README.md` — harness tree fully marked ✅; compatibility table includes
  `DeepSeek Harness` via `dsh-bridges`; "~50 lines" claim clarified to
  distinguish thin shims from persistent directive files.
- `CONTRIBUTING.md` §4 — adapter types are now explicitly two:
  (a) per-phase shims (≤50 lines, no protocol copy) and (b) persistent
  directive files (larger, still no protocol copy). Both must reference
  `.meta-skills/` and `AGENTS.md`, neither may embed the protocol.

### Known limitations

- Phase 1b's fresh-session rule is *mechanically* enforced only by the
  OpenCode harness. Claude Code and Cursor rely on the agent honoring a
  directive; the READMEs document this and recommend OpenCode for Phase 1b
  if mechanical enforcement is required.
- The generic harness (`harnesses/generic/`) has dispatch prompts for
  Phases 0, 1a, and 1b only. Phases 2–4 can be invoked by pasting the
  meta-skill directly; dedicated prompts are tracked but not shipped.

## [0.1.0-alpha] - 2026-11-08

### Added — Methodology

- **`.meta-skills/00-context-bootstrap.md`** — Phase 0: map a repo
  (brownfield or greenfield) into `docs/context/` before planning.
  Elephant Memory. DDD-lite bounded context discovery.
- **`.meta-skills/01-sdd-spec-writer.md`** — Phase 1a: turn one User Story
  into one bounded spec by filling `templates/spec.template.md`. Refuses
  under-specified stories and stories with >7 acceptance criteria.
- **`.meta-skills/02-egm-goldfish-audit.md`** — Phase 1b: blind audit of
  a draft spec by a sub-agent with no chat memory. Produces a verdict
  (`audited` / `rejected`) and an audit report. `effective_verdict` field
  allows Navigator overrides without erasing the Goldfish's evidence.
- **`.meta-skills/03-tdd-cycle.md`** — Phase 2: strict Red-Green-Refactor.
  Batch RED (write all tests first), incremental GREEN (minimum code per
  test), conditional REFACTOR. Anti-over-engineering enforcement: if a
  not-yet-targeted test goes GREEN, the agent over-wrote.
- **`.meta-skills/04-odd-vertical-slice.md`** — Phase 3: wire the TDD-
  tested logic into a real end-to-end slice and hand it to the Navigator
  for observation. **The only phase with a mandatory human gate.**
- **`.meta-skills/05-drift-control.md`** — Phase 4: final certification.
  Bidirectional check (spec → code, code → spec), test traceability,
  observation traceability. Produces a verdict (`no-drift` /
  `drifted-accepted` / `drifted` / `observation-blocked`).

### Added — Templates

- **`templates/spec.template.md`** — universal spec template. 8 sections,
  120-line hard cap. Sections 1–4 and 7–8 mandatory; 5–6 optional.
- **`templates/test-plan.template.md`** — projection of spec Section 4 for
  human reviewers and Phase 4 auditors.
- **`templates/drift-report.template.md`** — 9-section drift report with
  formal `## Navigator overrides` section.

### Added — Governance

- **`AGENTS.md`** — canonical behavioral contract for any AI agent
  operating in the repo. Overrides harness-specific files (`CLAUDE.md`,
  `.cursorrules`) on conflict.
- **`CONTRIBUTING.md`** — contribution protocol. Token-impact block
  mandatory in PRs. Meta-skill changes require a pre-approved issue.
- **`LICENSE`** — MIT.
- **`.gitignore`** — harness-aware defensive rules (agent caches, token
  logs, drafts, personal notes).
- **`docs/context/00-overview.md`** — Phase 0 self-applied to Keel Nav
  itself. Dogfooding proof.
- **`README.md`** — five-phase flow, three-role metaphor (Navigator /
  Helmsman / Keel), comparison to `spec-kit`, `elephant-goldfish-model`,
  `OpenSpec`, `gsd-core`.

### Added — Generic harness

- **`harnesses/generic/`** — no-plugin fallback. Two-paste pattern (meta-
  skill first, dispatch prompt second). Dispatch prompts for Phases 0,
  1a, 1b. Fresh-session guidance per harness (ChatGPT web, Claude.ai
  web, Gemini web, DeepSeek web, `aichat`/`llm`/`ollama`, any IDE).

### Fixed

- Phase count inconsistency in `AGENTS.md` §1 and `CONTRIBUTING.md` §1
  (said "6 phases" where the flow has 5 phases / 6 meta-skills because
  Phase 1 has two skills).
- YAML frontmatter values containing `': '` without quotes broke parsing
  in skills 03 and 04. Added YAML guide to `templates/spec.template.md`
  §8 and `templates/test-plan.template.md` §8.
- Markdown table pipes inside cell content broke rendering in
  `templates/test-plan.template.md` (cells like `<RED | GREEN>`). Escaped
  as `\|`.
- `spec.template.md` `status:` enum was missing `observed` and
  `certified`. Both added.

### Changed

- `templates/spec.template.md` translated from Spanish to English to keep
  the repo single-language.
- Skill 01 headings realigned to English after translation.
- Navigator override mechanism formalized across skills 02, 03, 04, 05:
  `verdict:` is immutable (Goldfish's evidence), `effective_verdict:` is
  Navigator-mutable (governance), with the invariant that
  `effective_verdict` may only be `audited` if §8 has an override for
  **every** blocking finding.

### Known limitations

- No CI. Quality gates are enforced by human review and by the agent
  following `AGENTS.md`. A future release may add automated validation
  of frontmatter, fence balance, and token budgets.
- Skill 05 known gaps (documented in its §"Known gaps"): dead code
  detection, complexity thresholds, dependency audit, override retirement,
  cross-context drift. All out of scope for v0.1.0.

[Unreleased]: https://github.com/MrErov/keel-nav/compare/v0.2.0-alpha...HEAD
[0.2.0-alpha]: https://github.com/MrErov/keel-nav/releases/tag/v0.2.0-alpha
[0.1.0-alpha]: https://github.com/MrErov/keel-nav/releases/tag/v0.1.0-alpha
