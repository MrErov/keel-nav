# Dispatch — Phase 0: Context Bootstrap

> **Invokes:** `.meta-skills/00-context-bootstrap.md`
> **Produces:** `docs/context/*.md` (overview, dependency map, risk register,
> per-context files)
> **Estimated tokens:** 3k–8k
> **Fresh session:** recommended, not mandatory.

---

## How to use

1. Open a chat with any LLM. Fresh session recommended.
2. Paste the **full contents** of `.meta-skills/00-context-bootstrap.md`.
3. Paste the prompt below, after filling in every `<placeholder>`.
4. Send.

---

## Prompt — copy everything below this line

---

You have just read the Keel Nav "Context Bootstrap" meta-skill. Execute it
now on my repository.

### Inputs

- `repo_root`: `<absolute or relative path to my repository>`
- `optional_scope`: `<subdirectory, or "whole repo">`

### Filesystem access

Do you have filesystem access in this session?

- **YES (CLI / IDE with file tools):** run the reconnaissance commands from
  Step 1 of the skill yourself. Ignore the "Repository snapshot" section
  below.
- **NO (web LLM):** use the "Repository snapshot" section below as your
  Step 1 output. Do not ask me for files I have already pasted.

**Answer for this session:** `<YES | NO>`

### Repository snapshot (for web LLMs only)

```
<paste the output of: tree -L 3 -I 'node_modules|.git|dist|build'>
```

### Manifests detected (for web LLMs only)

```
<paste the content of package.json, pyproject.toml, go.mod, Cargo.toml,
or whichever manifest(s) exist. If multiple, separate with a "---" line.>
```

### Rules

- Follow the protocol exactly. Do not add steps. Do not skip gates.
- Do not read or write any file outside `docs/context/`.
- Do not propose refactors, improvements, or style opinions.
- Emit the **handoff message** at the end and **stop**.
- If a mandatory input is missing or a blocking gate fails, emit the
  **escalation message** and stop. Do not improvise.

Begin.
