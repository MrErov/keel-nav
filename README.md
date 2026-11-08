# Keel Nav

> The structural keel for AI-assisted engineering.
> Without it, you drift.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue)]()
[![Agnostic](https://img.shields.io/badge/compatible-opencode%20%7C%20claude--code%20%7C%20cursor%20%7C%20copilot%20%7C%20gemini-green)]()
[![Status](https://img.shields.io/badge/status-v0.1--alpha-orange)]()

---

## The metaphor (and the method)

Three roles, one discipline:

| Role | Who | What they do |
|------|-----|--------------|
| **Navigator** | You, the human | Sets the course: user stories, specs, acceptance criteria, phase transitions. |
| **Helmsman** | The AI agent | Executes within protocol: writes specs, tests, code — never beyond the gate. |
| **Keel** | This repo | The structural spine that keeps the ship upright when the sea gets rough. |

`Keel Nav` is the keel. It gives the Helmsman a protocol and the Navigator a rudder. Without it, autonomous agents drift into vibe coding, context rot, and token burn.

---

## The problem

AI-assisted engineering has split into two unsustainable extremes:

1. **Vibe coding** — loose prompts, no spec, no tests. Silent technical debt compounds until the project capsizes.
2. **Mega-frameworks of autonomous sub-agents** — orchestrators that burn tokens, degrade context ("context rot"), and produce over-engineered code that nobody can audit.

Both fail at the same point: **the human stops being the Navigator** and becomes a spectator to an opaque, expensive process.

## The solution: Keel Nav

Five phases. Each phase is a single meta-skill in pure Markdown. **Human commands, AI executes within bounds.**

| Phase | Name | Goal | Meta-skill |
|-------|------|------|------------|
| 0 | **Context Bootstrap** | Map the repo before planning (Elephant Memory) | `00-context-bootstrap.md` |
| 1 | **Lightweight SDD + Goldfish Audit** | Specs per User Story + blind anti-bias audit | `01-sdd-spec-writer.md`, `02-egm-goldfish-audit.md` |
| 2 | **Strict TDD** | Red → Green → Refactor with minimal code | `03-tdd-cycle.md` |
| 3 | **ODD & Vertical Slices** | DB → API → UI, one slice at a time | `04-odd-vertical-slice.md` |
| 4 | **Drift Control** | Final audit against the original spec | `05-drift-control.md` |

```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Phase 0    │──▶│  Phase 1    │──▶│  Phase 2    │──▶│  Phase 3    │──▶│  Phase 4    │
│  Context    │   │  SDD +      │   │  Strict     │   │  ODD        │   │  Drift      │
│  Bootstrap  │   │  Goldfish   │   │  TDD        │   │  Vertical   │   │  Check      │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
      │               │               │               │               │
  Elephant         Goldfish        Minimal code    Observation     Non-drift
  Memory           (blind)         (no over-eng.)  (human-in-loop) certificate
```

## Principles

1. **Human = Navigator.** The AI never decides *what*; only *how*, within bounds.
2. **Truly agnostic.** Pure Markdown. No SDK, no proprietary YAML, no lock-in.
3. **Token economy as a design constraint.** Every meta-skill declares its estimated cost.
4. **Blind audits (Goldfish).** Context-isolated sub-agents with no chat memory, eliminating self-confirmation bias.
5. **TDD as a scope contract.** No test, no feature. No red, no green.
6. **Anti-over-engineering.** The AI writes the *minimum* code to pass.
7. **Spec ↔ code traceability.** The Drift Check certifies both match.
8. **Context rot prevention.** Per-directory context docs, regenerable and versioned.

## For AI agents

If you are an AI agent reading this README before acting inside this repo:

1. **Stop.** Read [`AGENTS.md`](./AGENTS.md) first. It is the canonical
   behavioral contract. It overrides any harness-specific file
   (`CLAUDE.md`, `.cursorrules`, `harnesses/*`).
2. **Do not vibe-code.** `AGENTS.md` §5 enumerates what counts as a
   blocking violation. The short version: no spec → no code.
3. **Respect phase boundaries.** `AGENTS.md` §4 and §6. You write only
   the outputs declared by the current phase's meta-skill.
4. **Respect token budgets.** `AGENTS.md` §7. If you exceed 150% of a
   skill's declared budget, stop and report.
5. **If a rule is ambiguous, escalate.** `AGENTS.md` §9 has the format.

This section is a doorway, not a copy. The authoritative text lives in
`AGENTS.md`, and it is the only file that may be edited to change agent
behavior.

## Repository structure

```
keel-nav/
├── .meta-skills/                    # Agnostic core (pure Markdown)
│   ├── 00-context-bootstrap.md      ✅ v0.1.0
│   ├── 01-sdd-spec-writer.md        🚧 planned (v0.1.0)
│   ├── 02-egm-goldfish-audit.md     🚧 planned (v0.1.0)
│   ├── 03-tdd-cycle.md              🚧 planned (v0.2.0)
│   ├── 04-odd-vertical-slice.md     🚧 planned (v0.2.0)
│   └── 05-drift-control.md          🚧 planned (v0.2.0)
├── templates/                       # Artifacts produced by the skills
│   ├── spec.template.md             ✅ v0.1.0
│   ├── test-plan.template.md        🚧 planned (v0.1.0)
│   └── drift-report.template.md     🚧 planned (v0.2.0)
├── harnesses/                       # Per-tool adapters (~50 lines each)
│   ├── opencode/                    🚧 planned (v0.1.0)
│   ├── claude-code/                 🚧 planned (v0.1.0)
│   ├── cursor/                      🚧 planned (v0.1.0)
│   └── generic/                     🚧 planned (v0.1.0)
├── docs/context/                    # Phase 0 self-applied (Elephant Memory)
│   └── 00-overview.md               ✅ Phase 0 baseline
├── AGENTS.md                        ✅ Canonical AI behavioral contract
├── CONTRIBUTING.md                  ✅ Contribution protocol
├── LICENSE                          ✅ MIT
├── .gitignore                       ✅
└── README.md                        ✅
```

Legend: ✅ = shipped · 🚧 = planned. The version in parentheses
is the release where the file lands. Files marked 🚧 are referenced
by the methodology but not yet present in the repo — do not link to
them until they ship.

## Quick Start

```bash
# 1. Clone
git clone https://github.com/<org>/keel-nav.git
cd keel-nav

# 2. Copy the meta-skills into your harness
cp -r .meta-skills/ harnesses/opencode/   # or claude-code/, cursor/, generic/

# 3. In your editor/CLI, invoke Phase 0 on your target repo:
#    "Run .meta-skills/00-context-bootstrap.md on this repository"
```

No installer. No `npm i`. Just text your LLM can read.

## Harness compatibility

| Harness | Mechanism | Location |
|---------|-----------|----------|
| OpenCode | Native skills | `harnesses/opencode/.opencode/skills/` |
| Claude Code | `CLAUDE.md` + directives | `harnesses/claude-code/CLAUDE.md` |
| Cursor | `.cursorrules` | `harnesses/cursor/.cursorrules` |
| Copilot CLI / Gemini CLI / Web LLMs | Pasted prompt | `harnesses/generic/prompts/*.md` |
| **DeepSeek Harness** | Via [`dsh-bridges`](https://github.com/deepseek-ai/dsh-bridges) plugin | Auto-detected from `harnesses/*` |

Each harness is a thin adapter (~50 lines), not a fork.

> **Why DeepSeek appears as a bridge and not a directory:** `dsh-bridges`
> is a community plugin that reads existing Claude Code / OpenCode / Cursor
> adapter layouts. Keel Nav doesn't need a `harnesses/deepseek/` directory —
> the moment the other four adapters ship, `dsh-bridges` picks them up.
> That is Keel Nav's agnosticism working as intended.

## Meta-skill reference

| Skill | Phase | Input | Output | Tokens (est.) |
|-------|-------|-------|--------|---------------|
| `00-context-bootstrap` | 0 | Repo root | `docs/context/*.md` | 3k–8k |
| `01-sdd-spec-writer` | 1 | User Story | `specs/<US>.spec.md` | 2k–4k |
| `02-egm-goldfish-audit` | 1 | Spec | `specs/<US>.audit.md` | 1k–2k |
| `03-tdd-cycle` | 2 | Approved spec | Tests + code | 2k–6k |
| `04-odd-vertical-slice` | 3 | Spec + tests | DB → API → UI | 4k–10k |
| `05-drift-control` | 4 | Spec + code | `drift-report.md` | 2k–3k |

## How Keel Nav compares

| Project | What we take | What we avoid |
|---------|--------------|---------------|
| `github/spec-kit` | Plain-Markdown specs | Flow coupled to GitHub |
| `google/elephant-goldfish-model` | Blind sub-agent + Drift Report | Heavy framework |
| `Fission-AI/OpenSpec` | Context-rot prevention | Proprietary DSL |
| `open-gsd/gsd-core` | Phase structure | Runtime dependency |
| **Keel Nav** | Strict TDD + ODD vertical slices | — |

## Token economics

Our thesis: token spend is a symptom of design, not of scale.

- Goldfish Audit runs in a memoryless sub-agent → pays ~1k tokens, not ~15k.
- Strict TDD forces the model to write the minimum → fewer iterations, fewer refactors.
- Per-directory context avoids resending the full tree every turn.
- Drift Check catches deviations early → avoids costly rewrites.

## Contributing

Keel Nav is small by design, and contributions are judged by **clarity,
cost control, and harness agnosticism** — not by lines of code. The full
protocol lives in [`CONTRIBUTING.md`](./CONTRIBUTING.md).

Quick summary:

- **Meta-skill changes** require an issue labeled `accepted-for-pr` before
  a PR opens. Unstable meta-skills are worse than no meta-skills.
- **Harness adapters** are thin shims (~50 lines) that point to
  `AGENTS.md` and `.meta-skills/` — never forks.
- **No external dependencies** inside `.meta-skills/`. Pure Markdown only.
- **Every PR** declares its token impact (`before`, `after`, `delta`,
  justification).

## License

MIT — because methodological knowledge should not have lock-in.
