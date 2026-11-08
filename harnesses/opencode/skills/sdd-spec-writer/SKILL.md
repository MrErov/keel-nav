---
name: sdd-spec-writer
description: Keel Nav Phase 1a — turn one User Story into a bounded spec by filling templates/spec.template.md. Refuses under-specified stories.
---

# Keel Nav — Phase 1a: SDD Spec Writer

**Read `.meta-skills/01-sdd-spec-writer.md` at the project root first.**
That file is the protocol. This file is only the OpenCode entry point.

## Invocation

> `/sdd-spec-writer US-042` — followed by the story in plain language
> `/sdd-spec-writer` — agent will ask for the story

## Required inputs

- A User Story (role / capability / benefit) from the Navigator.
- A `docs/context/<name>.md` file for the affected bounded context.
  If it does not exist, the skill **will refuse** — run `/context-bootstrap`
  first.
- `templates/spec.template.md` at the project root.

## Execution

1. Read the meta-skill.
2. Execute its 6-step protocol: load context, validate story readiness,
   fill the template, self-check Section 7 gates, write
   `specs/<US-ID>.spec.md`, hand off.
3. Emit the handoff message.
4. On any blocking gate failure (story too big, under-specified, missing
   context doc), emit the escalation message and **stop**.

## Outputs

`specs/<US-ID>.spec.md`, status `draft`.

Full protocol: `.meta-skills/01-sdd-spec-writer.md`
