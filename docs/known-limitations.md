# Known Limitations

> Gaps in the Keel Nav methodology that are **documented, accepted, and
> out of scope for the current alpha (`v0.2.0-alpha`)**. These are not
> bugs; they are places where the method deliberately stops so it can
> stay small.
>
> If you hit one of these while using Keel Nav, the workaround is listed
> inline. If the workaround is not enough, open an issue with the exact
> context where the gap bit you.

---

## [Skill 03 — TDD Cycle](../.meta-skills/03-tdd-cycle.md)

| # | Gap | Workaround |
|---|-----|------------|
| 1 | **Test framework selection.** The skill does not prescribe a test framework. It relies on the repo's existing convention; if none, the agent picks the most standard option for the language and declares it. | State the framework in the spec's Section 7 (Exit Gate) or in the phase's invocation. |
| 2 | **Coverage threshold.** No numeric threshold is enforced. The skill uses manual per-line traceability ("cite the test") as a substitute. | Use tool coverage as a supplement; never as a certification. |
| 3 | **Cross-context tests.** A test exercising two bounded contexts is out of scope for Phase 2 (it belongs to Phase 3's vertical slice). | Declare cross-context tests in the spec's Section 6 (Observation Notes) and cover them in Phase 3. |

## [Skill 04 — ODD Vertical Slice](../.meta-skills/04-odd-vertical-slice.md)

| # | Gap | Workaround |
|---|-----|------------|
| 4 | **UI test tool selection.** The skill does not prescribe Playwright/Cypress/RTL. It follows repo convention. | Declare the tool in the spec's Section 7 or in the phase's invocation. |
| 5 | **DB migration convention.** The skill does not prescribe Alembic/Prisma/raw SQL. It follows repo convention. | If the repo has no precedent, ask the Navigator before choosing. |
| 6 | **Observation checklist persistence.** The checklist is emitted as chat text. There is no `observation-report.template.md` yet. | The Navigator's `approved`/`failed`/`cannot observe` reply IS the record; it appears in the chat log. |

## [Skill 05 — Drift Control](../.meta-skills/05-drift-control.md)

| # | Gap | Workaround |
|---|-----|------------|
| 7 | **Dead code detection.** The skill finds unjustified *files*, not unused *functions* within justified files. | Manual review of justified files during Phase 4. A per-language linter could formalize this later. |
| 8 | **Complexity thresholds.** No formal check for "this function is 500 lines and no AC justifies the length". | Manual review by the Navigator. A linter integration could formalize. |
| 9 | **Dependency audit.** No check for unused `package.json` / `pyproject.toml` entries. | Manual review. Out of scope for the current alpha. |
| 10 | **Override retirement.** Overrides have a `scope` field, but no automatic retirement when the scope is satisfied. | The Navigator explicitly retires them in the next drift report. |
| 11 | **Cross-context drift.** If a spec touches two contexts and one context's code was modified after certification, the report does not re-audit the other context. | Multi-spec drift coordination is a future concern. For now, run Phase 4 per spec. |

---

## Not gaps, by design

The following are **not** in this list because they are deliberate
non-goals, not limitations:

- **No CI.** The repo lives in Markdown. A linter for frontmatter, fence
  balance, and links would be cheap to add, and it is deferred — not
  rejected — pending a trigger. **Triggers for adding it:** an external
  PR appears, or a mechanical defect (broken fence, bad YAML quote, broken
  link) reaches `main` undetected, or a second contributor joins, or the
  repo grows past ~15 meta-skills. Until a trigger fires, the Helmsman's
  manual check is the CI.
- **No `README.es.md`.** Single-language repo. Duplicating README doubles
  maintenance without adding methodological value.
- **No prompts for Phases 2–4 in `harnesses/generic/`.** The two-paste
  pattern (paste meta-skill + paste dispatch) works for Phases 2–4
  without a dedicated prompt. The prompt is convenience, not capability.
- **Phase 1b enforcement is mechanical only in OpenCode.** Claude Code
  and Cursor rely on the agent honoring a directive. Documented in each
  harness's README. Not a gap — a limitation of the underlying harness.

---

## How these gaps evolve

Each item is a candidate for a future release. The pattern:

1. A gap becomes a **blocker** when a real pilot project hits it twice.
2. It becomes a **feature** when the workaround stabilizes into a shape
   that is general, not repo-specific.
3. It becomes a **spec** (Phase 1a) before it becomes code.

Until then, this file is the authoritative record.
