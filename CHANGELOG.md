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

Nothing yet.

## [0.3.0-alpha] - 2026-11-09

### Added

- **First end-to-end walkthrough** (`examples/todo-api/`). Phases 1b, 2,
  3, and 4 executed for real: 4 blind Goldfish audits (all rejected),
  Phase 1 closed via Navigator overrides, TDD against the audited spec,
  human observation against a running uvicorn server, drift certification
  (`no-drift`, 0 blocking). Phase 0 was not executed (context docs were
  authored, not bootstrapped).

- **`docs/designs/`** — 3 retrospective design specs with commit provenance:
  `effective-verdict.md`, `blind-audit-protocol.md`, `skill-compression.md`.

- **`docs/known-limitations.md`** — consolidated 11 live gaps across
  skills 03, 04, and 05. Includes the "not gaps, by design" section that
  distinguishes deliberate non-goals (no CI, no README.es.md) from real
  limitations.

- **YAML quoting note in `CONTRIBUTING.md` §3.1** — string values
  containing `': '` must be quoted.

### Changed

- **Compressed `.meta-skills/02-egm-goldfish-audit.md` and `.meta-skills/05-drift-control.md`**
  from ~490 lines each to 300 lines each. All protocol steps, quality
  gates, anti-patterns, and override mechanisms preserved. Known gaps
  sections moved to `docs/known-limitations.md`.

- **`README.md`** — added `docs/designs/`, `docs/known-limitations.md`,
  and `examples/todo-api/` to the repository tree.

- **`CHANGELOG.md`** — records the 4 real audits, the fabricated pairs
  preserved for comparison, the Phase 1 closure via overrides, and the
  Phase 2-3-4 executions.

### Fixed

- **Obsolete gap in `.meta-skills/04-odd-vertical-slice.md`** — the
  `status: observed` gap was removed (template already includes the
  status).

- **`pytest tests/` failed without `python -m`** in `examples/todo-api/`.
  Added `tests/conftest.py` to insert the project root into `sys.path`.

### Deferred

- **Priority 3 (CI).** Declined as speculative preventive. Four triggers
  documented in `docs/known-limitations.md`: external PR, mechanical
  defect reaching `main`, second contributor, or >~15 meta-skills.

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

[Unreleased]: https://github.com/MrErov/keel-nav/compare/v0.3.0-alpha...HEAD
[0.3.0-alpha]: https://github.com/MrErov/keel-nav/releases/tag/v0.3.0-alpha
[0.2.0-alpha]: https://github.com/MrErov/keel-nav/releases/tag/v0.2.0-alpha
[0.1.0-alpha]: https://github.com/MrErov/keel-nav/releases/tag/v0.1.0-alpha
