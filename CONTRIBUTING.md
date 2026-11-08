# Contributing to Keel Nav

> Keel Nav is a methodology, not a codebase. Contributions are judged by
> **clarity, cost control, and harness agnosticism** — not by lines of code.

Thank you for considering a contribution. Before you open a PR, read this
document in full. It is short on purpose.

---

## 1. What belongs in Keel Nav

| Belongs | Does not belong |
|---------|-----------------|
| A new meta-skill that fills a gap in the 6-phase flow | A new phase. The flow has 6 phases; changes to the flow itself need a separate RFC. |
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
   - The phase the change affects (0–5).
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

Adapters are **thin shims** (~50 lines max). They exist to make a harness read
`AGENTS.md` and `.meta-skills/`. They are *not* places to extend the
methodology.

An adapter PR must:

- Point to `AGENTS.md` and the relevant `.meta-skills/` file — no copies.
- Provide one minimal example invocation.
- Document the harness's expected file paths in `harnesses/<name>/README.md`.
- **Not** introduce any code beyond what the harness itself requires to load
  a Markdown file.

Adapters for `deepseek-harness` should use `dsh-bridges` (the community
plugin that bridges existing Claude Code / OpenCode / Cursor setups). Do not
re-implement the bridge.

---

## 5. Token economy: the review criterion

Every PR that adds or changes a meta-skill must include a short **token
accounting** block in the description:

```text
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

```text
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
