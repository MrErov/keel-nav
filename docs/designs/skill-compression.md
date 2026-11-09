---
title: Skill compression — the method must respect its own line limits
author: Keel Nav core team
status: Implemented
source: retrospective
implemented_in: dde397b
date: 2026-11-08
---

# Skill compression — the method must respect its own line limits

## Problem

`templates/drift-report.template.md` declares `max_lines: 250`.
`.meta-skills/05-drift-control.md` was 491 lines — nearly 2× the limit
it prescribes for the artifacts it produces.

`.meta-skills/02-egm-goldfish-audit.md` had the same problem: audit
reports are capped at 200 lines, but the skill itself was 490 lines.

A method that prescribes brevity while being verbose loses credibility.
The first sentence of a skeptical reader's review is "your own skill is
twice as long as the limit you impose." That is a fair observation. The
skill compression commit (dde397b) responds to it.

## Proposed solution

Compress skills 02 and 05 to ≤300 lines each, with the following
preserved, in this priority order:

1. **Frontmatter** — name, description, inputs, outputs, side-effect,
   estimated_tokens, requires, blocks.
2. **Protocol steps** — 5 in skill 02, 7 in skill 05.
3. **Quality gates** — G1–G9 in skill 02, G1–G12 in skill 05.
4. **Anti-patterns** — all preserved, some merged where the criteria
   overlapped.
5. **Handoff messages** — the 3-line contract on success and failure.
6. **`effective_verdict` / Navigator overrides mechanism** — untouched.

Compression was **mechanical, not semantic**:
- Merged redundant explanation paragraphs.
- Tightened tables (combined example rows).
- Moved skill 05's "Known gaps" section to `docs/known-limitations.md`.
- Removed duplicated explanation (e.g., the "why blindness matters"
  paragraph appeared twice).

**No gate was removed. No anti-pattern was removed. No handoff was
changed.**

### When to recut instead of compress

If a skill cannot be compressed under 300 without removing gates or
anti-patterns, **the skill has a design problem, not a length problem**.
The right response is to split the skill (e.g., `02a-goldfish-dispatch.md`
+ `02b-goldfish-report.md`) or to remove scope from the skill. Never to
raise the limit.

## Alternatives considered

### Alternative A — raise the limits

Rejected. The limit is what makes the method usable in a single-pass
agent. Raising it would defer the problem, not solve it — the next
iteration would inflate again.

### Alternative B — split skill 02 into two skills

Rejected for v0.1.0. Dispatch and report generation are one mental
operation. Splitting them would mean a new phase or a compound invocation,
both of which add complexity for the user without adding capability.

### Alternative C — accept the discrepancy

Rejected. The README explicitly pitches Keel Nav against frameworks that
"burn tokens and produce over-engineered documentation". A 490-line
skill that prescribes 200-line reports is the exact failure mode the
method criticizes. Accepting the discrepancy defeats the pitch.

## Impact

- Skill 02: 490 → 300 lines (−39%). All 5 protocol steps, 9 gates, 12
  anti-patterns, and the full Navigator override mechanism preserved.
- Skill 05: 491 → 300 lines (−39%). All 7 protocol steps, 12 gates, 11
  anti-patterns preserved. Known gaps section moved to
  `docs/known-limitations.md`.
- Skill 05's "Known gaps" section was consolidated in a single doc.
  This creates a small redundancy (the doc names each gap; the skill
  links to it) but the doc is the authoritative list going forward.

## Open questions

**What's the right limit for a skill?** 300 lines is the current
prescription but has no empirical basis — it is the limit at which
"skill > audit report" is no longer true. A future pilot project may
suggest a different number. For v0.1.0, 300 is the number.

## See also

- `docs/known-limitations.md` (where skill 05's "Known gaps" section moved)
- Commit `dde397b`
- `CHANGELOG.md` `[Unreleased]` §"Changed"
