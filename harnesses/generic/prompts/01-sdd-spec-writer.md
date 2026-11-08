# Dispatch — Phase 1a: SDD Spec Writer

> **Invokes:** `.meta-skills/01-sdd-spec-writer.md`
> **Requires:** `docs/context/` from Phase 0 + a User Story from the Navigator
> **Produces:** `specs/<US-ID>.spec.md`
> **Estimated tokens:** 2k–4k
> **Fresh session:** recommended, not mandatory.

---

## Before you paste

You need three things ready:

1. The bounded-context doc for the affected area (e.g.
   `docs/context/billing.md`). If it does not exist, **stop** and run
   `00-context-bootstrap` first. Skill 01 will refuse without it.
2. The User Story, written by you (the Navigator) in natural language.
3. A User Story ID (e.g. `US-042`). If absent, the skill may propose one.

---

## How to use

1. Open a chat with any LLM. Fresh session recommended.
2. Paste the **full contents** of `.meta-skills/01-sdd-spec-writer.md`.
3. Paste the prompt below, after filling in every `<placeholder>`.
4. Send.

---

## Prompt — copy everything below this line

---

You have just read the Keel Nav "SDD Spec Writer" meta-skill. Execute it
now on my repository.

### Inputs

- `user_story`:

```
<paste the User Story in plain language.
Example:
"As a billing admin, I want to retry a failed invoice charge up to 3
times with exponential backoff, so that transient payment gateway
failures don't require manual intervention.">
```

- `us_id`: `<US-XXX, or "propose one">`
- `context_doc`: `docs/context/<name>.md`

### Filesystem access

- **YES (CLI / IDE with file tools):** read `context_doc`,
  `docs/context/00-overview.md`, `docs/context/01-dependency-map.md`, and
  `templates/spec.template.md` yourself.
- **NO (web LLM):** the contents of `context_doc` and
  `templates/spec.template.md` are pasted below. Do not ask for files I
  have already pasted.

**Answer for this session:** `<YES | NO>`

### Context doc (for web LLMs only)

```
<paste the full content of docs/context/<name>.md here>
```

### Spec template (for web LLMs only)

```
<paste the full content of templates/spec.template.md here>
```

### Rules

- Do not skip Step 2 (story readiness check). If any check fails, emit
  the escalation message and stop.
- Do not expand the template. Do not add sections. Do not exceed 120 lines.
- Do not write tests. Do not write code. Do not audit the spec yourself.
- Emit the **handoff message** at the end and **stop**.
- Do not invoke the Goldfish. The Navigator dispatches the blind auditor
  in a separate session.

Begin.
