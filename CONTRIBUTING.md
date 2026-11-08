# Contributing to Keel Nav

> Keel Nav is a methodology, not a codebase. Contributions are judged by
> **clarity, cost control, and harness agnosticism** — not by lines of code.

Thank you for considering a contribution. Before you open a PR, read this
document in full. It is short on purpose.

---

## 1. What belongs in Keel Nav

| Belongs | Does not belong |
|---------|-----------------|
| A new meta-skill that fills a gap in the 5-phase flow (0–4) | A new phase. The flow has 5 phases (0–4); changes to the flow itself need a separate RFC. |
| A template refinement that reduces the fields a spec needs | A richer template with more fields. Keel Nav's value is subtraction. |
| A new harness adapter (~50 lines, thin shim) | A harness that "requires" a plugin, runtime, or SDK. |
| A token-budget refinement with measured data | A token-budget claim without measurement. |
| Clarifications to existing meta-skills | Restructuring an existing meta-skill's protocol. |

**Rule of thumb:** if your change makes the repo *simpler to follow* without
removing capability, it is welcome. If it makes the repo *more powerful at the
cost of more surface area*, it needs an RFC.

---

## 2. How to propose a change to a `.meta-skill/`

The meta-skills are the product. Changing one is a **methodology change**, not
an editorial one. Follow this protocol:

1. **Open an issue first.** Describe:
   - The phase the change affects (0–4).
   - The concrete pain point (with a real example, not hypothetical).
   - The minimal change you propose.
   - The effect on token budget (does it raise it? by how much?).
   - The effect on harness compatibility (does it require anything harness-specific?).
2. **Wait for a maintainer's label** (`accepted-for-pr` or `needs-rfc`).
3. **Open the PR only after the label.** PRs without a linked issue in
   `accepted-for-pr` state will be closed.

This is deliberate. Keel Nav's value is that its methodology is *stable*.
Unstable meta-skills are worse than no meta-skills.

---

## 3. Non-negotiable rules for `.meta-skills/` content

Every meta-skill PR is checked against these. A violation is a blocking review.

### 3.1 Format

- YAML frontmatter is **optional** but, if present, must be standard YAML
  (no anchors, no custom tags, no references to proprietary schemas).
- Protocol steps are **numbered** and ordered.
- Quality gates are **explicit** and each is either `blocking` or `warning`.
- Anti-patterns are **enumerated**. Each anti-pattern names the concrete
  forbidden behavior, not a vague principle.

### 3.2 Token discipline

- The skill must declare `estimated_tokens` in its frontmatter.
- If the skill exceeds the declared budget in practice, the PR must update
  the declaration.
- No skill may instruct the model to read a full file > 300 lines without
  explicit justification in the skill text.

### 3.3 Harness agnosticism

- No references to a specific harness's API, SDK, or config format inside
  `.meta-skills/`.
- No file paths that assume a specific harness's directory layout.
- If the skill needs harness-specific behavior, it must declare it as an
  `optional_harness_extension` in frontmatter, and the base skill must work
  without it.

### 3.4 Writing discipline enforcement

- Every meta-skill that produces artifacts must:
  - Declare its output files explicitly.
  - Declare which files it may *not* modify.
  - Emit a **handoff message** on close (see `AGENTS.md` §6).
  - Emit a **failure message** on gate failure (see `AGENTS.md` §9).

### 3.5 No vibe coding inside the skill itself

- No "the AI should be helpful" or "if reasonable, the AI may…" language.
- No unnumbered suggestions buried in the protocol.
- Every write action is either declared or forbidden.

---

## 4. Harness adapter contributions

Adapters are **thin entry points** that make a harness read `AGENTS.md` and
`.meta-skills/`. They are *not* places to extend the methodology.

### Two adapter shapes

Harnesses come in two dispatch shapes. Pick the one that matches the
harness; do not force one shape onto a harness that does not support it.

| Shape | When to use | Size ceiling | Examples |
|-------|-------------|--------------|----------|
| **Per-phase shims** | Harness loads skills on demand (e.g. `/skill-name`) | ≤50 lines per shim | `harnesses/opencode/skills/*/SKILL.md` |
| **Persistent directive file** | Harness reads one rules file at session start, no per-skill loading | ≤250 lines total; prioritize the six-phase index, dispatch pattern, and Phase 1b blindness rule | `harnesses/claude-code/CLAUDE.md`, `harnesses/cursor/.cursorrules` |

Neither shape may embed the protocol. Both must:

- **Reference** `.meta-skills/` and `AGENTS.md` by path — never copy their
  content.
- Contain exactly one dispatch mechanism (per-phase invocation for shims;
  natural-language pattern for directive files).
- Document the Phase 1b fresh-session requirement, and (if the harness has
  no mechanical enforcement) declare this as a **known limitation** in the
  adapter's README.
- Be documented in a `README.md` in the same directory, with install steps
  and a verification checklist.

### PR requirements for a new adapter

An adapter PR must:

1. Include the README with install steps and verification.
2. State which of the two shapes was chosen and why.
3. Link to a verification session (screenshot, transcript, or a checklist
   the reviewer can run) showing each `/phase-*` (or natural-language
   equivalent) invoking the correct meta-skill.
4. **Not** introduce any code beyond what the harness itself requires to
   load a Markdown file.
5. **Not** duplicate another adapter's content. If two adapters would
   share more than 20% of their content, one of them is redundant —
   escalate before opening the PR.

### Bridges

If a harness can read another harness's adapter (e.g. `dsh-bridges` for
DeepSeek Harness), **do not write a shim** — write a documentation-only
directory (`harnesses/<name>/README.md`) explaining how the bridge works
and which existing adapter to install first. Bridges are the highest form
of Keel Nav agnosticism; duplicating the work they already do is a
regression, not a contribution.

---

## 5. Token economy: the review criterion

Every PR that adds or changes a meta-skill must include a short **token
accounting** block in the description:

```
Token impact:
Before: <X>k (estimated)
After: <Y>k (estimated)
Delta: <+/-Z>k
Justification: <one sentence>
```

A PR with a **positive delta** must justify why the added tokens pay for
themselves (e.g. "reduces Phase 2 iterations by ~30% based on <evidence>").
Unjustified positive-delta PRs are closed.

---

## 6. PR checklist (paste into your PR description)

```
□ Linked issue is labeled accepted-for-pr
□ Does not add a new phase to the flow
□ Does not require an SDK, runtime, or proprietary format
□ Frontmatter (if present) is standard YAML
□ Quality gates declared as blocking or warning
□ Anti-patterns are enumerated, not principled
□ Token impact block included
□ AGENTS.md not modified (unless the PR is about AGENTS.md)
□ Handoff and failure messages included (if skill produces artifacts)
```

---

## 7. Versioning

- Meta-skills use **semver** in their frontmatter: `0.x.y` during alpha,
  `1.x.y` after first public release.
- A change that alters the protocol → **minor** bump.
- A change that alters output file paths, gate semantics, or the handoff
  contract → **major** bump.
- Typos, formatting, and clarifications → **patch** bump.

`README.md`'s compatibility table and each meta-skill's frontmatter must stay
in sync within a PR.

---

## 8. What gets closed without discussion

To save everyone's time:

- PRs that add features to the flow (new phases, new gates, new roles).
- PRs that introduce harness-specific code into `.meta-skills/`.
- PRs that inflate templates ("we should also record X").
- PRs without a linked `accepted-for-pr` issue (except typo fixes).
- PRs that modify `AGENTS.md` without stating which phase's behavior changes.

None of these are personal. Keel Nav is small by design.

---

## 9. License

By contributing, you agree that your contributions are licensed under the
MIT License (see `LICENSE`).

---

*Keel Nav — the structural keel for AI-assisted engineering. Without it, you drift.*
