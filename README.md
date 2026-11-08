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

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Phase 0 │──▶│ Phase 1 │──▶│ Phase 2 │──▶│ Phase 3 │──▶│ Phase 4 │
│ Context │ │ SDD + │ │ Strict │ │ ODD │ │ Drift │
│ Bootstrap │ │ Goldfish │ │ TDD │ │ Vertical │ │ Check │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
│ │ │ │ │
Elephant Goldfish Minimal code Observation Non-drift
Memory (blind) (no over-eng.) (human-in-loop) certificate

## Principles

1. **Human = Navigator.** The AI never decides *what*; only *how*, within bounds.
2. **Truly agnostic.** Pure Markdown. No SDK, no proprietary YAML, no lock-in.
3. **Token economy as a design constraint.** Every meta-skill declares its estimated cost.
4. **Blind audits (Goldfish).** Context-isolated sub-agents with no chat memory, eliminating self-confirmation bias.
5. **TDD as a scope contract.** No test, no feature. No red, no green.
6. **Anti-over-engineering.** The AI writes the *minimum* code to pass.
7. **Spec ↔ code traceability.** The Drift Check certifies both match.
8. **Context rot prevention.** Per-directory context docs, regenerable and versioned.

## Repository structure

keel-nav/
├── .meta-skills/                 # Agnostic core (pure Markdown)
│   ├── 00-context-bootstrap.md
│   ├── 01-sdd-spec-writer.md
│   ├── 02-egm-goldfish-audit.md
│   ├── 03-tdd-cycle.md
│   ├── 04-odd-vertical-slice.md
│   └── 05-drift-control.md
├── templates/                    # Artifacts produced by the skills
│   ├── spec.template.md
│   ├── test-plan.template.md
│   └── drift-report.template.md
├── harnesses/                    # Per-tool adapters
│   ├── opencode/
│   ├── claude-code/
│   ├── cursor/
│   └── generic/
└── README.md