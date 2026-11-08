# Repository Overview — keel-nav

> This file is the output of Meta-Skill `00-context-bootstrap` applied to
> **keel-nav itself**. It exists to prove the methodology works on its own
> repository, and to give any future contributor (or agent) a fast mental
> model of the project.

---

## Stack

- **Language(s):** Markdown (only). No compiled or interpreted code.
- **Frameworks:** None. Pure Markdown with optional standard YAML frontmatter.
- **Package manager:** None. There is nothing to install.
- **Build step:** None. Artifacts are the source.
- **Test suite:** None in the traditional sense. Quality is enforced by
  per-phase quality gates declared inside each `.meta-skills/*.md`.

## Bounded contexts

Keel Nav is a small repo, but it has clear bounded contexts. They are grouped
by **responsibility in the methodology**, not by file type.

| # | Context | Path | Purpose (one sentence) |
|---|---------|------|------------------------|
| 1 | **Core methodology** | `.meta-skills/` | The 5-phase flow (0–4), encoded as portable Markdown. The product. |
| 2 | **Artifact templates** | `templates/` | Universal, fillable artifacts the flow produces (specs, test plans, drift reports). |
| 3 | **Harness adapters** | `harnesses/` | Thin shims that wire the methodology into each CLI/IDE. ~50 lines each. |
| 4 | **Context documentation** | `docs/context/` | Elephant Memory produced by Phase 0. Self-documenting by design. |
| 5 | **Governance** | `AGENTS.md`, `CONTRIBUTING.md`, `LICENSE`, `README.md` | The rules of engagement for both humans and agents. |

### Dependency relationships

```
┌───────────────────────┐
│   Core methodology    │
│   (.meta-skills/)     │
└───────────┬───────────┘
            │ consumed by
   ┌────────┼────────┐
   ▼        ▼        ▼
┌────────────┐ ┌──────────┐ ┌─────────────────┐
│  Artifact  │ │ Harness  │ │     Context     │
│  templates │ │ adapters │ │ documentation   │
│(templates/)│ │(harnesses│ │ (docs/context)  │
└────────────┘ └──────────┘ └─────────────────┘
                     │
                     │ governed by
                     ▼
            ┌───────────────────┐
            │    Governance     │
            │ (AGENTS/CONTRIB)  │
            └───────────────────┘
```

- `harnesses/` depends on `.meta-skills/` and `AGENTS.md`. Never the reverse.
- `templates/` are referenced by `.meta-skills/` but stand alone as universal
  artifacts.
- `docs/context/` is produced *by* the methodology, so it depends on
  `.meta-skills/00-context-bootstrap.md`. But it also documents the repo
  itself, forming a light dogfooding loop.

## Global commands

There are no build/test/run commands. The only operations are:

- **Copy a meta-skill into a harness:**

  ```bash
  cp -r .meta-skills/ harnesses/<harness>/.opencode/skills/
  ```

- **Invoke a phase (example, OpenCode):**

  > "Run .meta-skills/00-context-bootstrap.md on this repository."

- **Validate Markdown links (optional, local):**

  ```bash
  # e.g. with markdown-link-check, if the contributor has it
  npx markdown-link-check README.md CONTRIBUTING.md AGENTS.md
  ```

- **Lint frontmatter (optional, local):** Any standard YAML linter works, since
  frontmatter is standard YAML.

## Risk register (observed at Phase 0 of keel-nav itself)

| ID | Context | Risk | Evidence | Severity |
|----|---------|------|----------|----------|
| R1 | Core methodology | Methodology drift — a contributor adds a new phase or gate "just for their case" | No automated gate exists yet to prevent it | High |
| R2 | Core methodology | Token-budget inflation — skills grow beyond declared budgets | No CI check on estimated_tokens consistency | Medium |
| R3 | Harness adapters | Adapter proliferation — each new harness becomes a small fork | `harnesses/` has no size limit policy beyond CONTRIBUTING | Medium |
| R4 | Context documentation | Stale context — `docs/context/*` drifts behind the actual skills | No scheduled re-run of Phase 0 | Low (self-correcting on each Phase 0 invocation) |
| R5 | Governance | `AGENTS.md` ambiguity — an agent interprets a rule loosely | Single-source canonical file, but natural language | Medium |
| R6 | Governance | `CONTRIBUTING.md` scope creep — the file grows into a book | Currently ~200 lines; enforce ceiling in PR review | Low |

## Uncovered zones

- **No CI.** The repo relies entirely on human review. This is deliberate
  (see `CONTRIBUTING.md` §8: "Keel Nav is small by design"), but it means
  R1 and R2 are not caught mechanically today.
- **No versioning tags yet.** Meta-skills declare version in frontmatter,
  but there is no release process. Acceptable for `v0.1.0-alpha`.

## Change hotspots

- `.meta-skills/02-egm-goldfish-audit.md` — the differential of the repo.
  Expect this file to attract the most PRs.
- `AGENTS.md` — highest-leverage file; small edits have large behavioral
  consequences for every harness.
- `README.md` — the marketing entry point; more churn than the rest.

## Phase 0 status (self-applied)

- [x] Reconnaissance (stack, structure)
- [x] Bounded contexts detected (5)
- [x] Per-context documentation (this file is the entry point; per-context
      files are not yet created because Keel Nav is small enough that this
      overview suffices — will be split if the repo grows)
- [x] Dependency map (above)
- [x] Risk register (6 risks, 0 critical, 2 high)

## Handoff → Phase 1 (when the Navigator invokes it)

Mandatory reading for `01-sdd-spec-writer` when working on keel-nav itself:

- `AGENTS.md` (behavioral contract)
- `CONTRIBUTING.md` §3 (rules for `.meta-skills/` content)
- This file (`docs/context/00-overview.md`)
- The specific meta-skill being modified, and its declared inputs/outputs

## Notes for contributors

- This file is self-documentation, not a template. It follows the shape of
  `00-context-bootstrap.md`'s output, applied to keel-nav.
- If Keel Nav grows past ~10 meta-skills, this overview should be split
  into per-context files (`meta-skills.md`, `templates.md`,
  `harnesses.md`, `governance.md`).
- If you edit this file, run it through the same quality-gate self-check that
  Phase 0 requires (see `.meta-skills/00-context-bootstrap.md` §Quality gates).
