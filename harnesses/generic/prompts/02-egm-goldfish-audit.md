# Dispatch — Phase 1b: Goldfish Audit (BLIND)

> **Invokes:** `.meta-skills/02-egm-goldfish-audit.md`
> **Requires:** a filled spec + its bounded context doc
> **Produces:** `specs/<US-ID>.audit.<N>.md` + two metadata fields updated
> **Estimated tokens:** 1k–2k
> **Fresh session:** **MANDATORY.**

---

## ⚠️ Read this before anything else

The Goldfish Audit only works if the auditor has **no memory** of the
session that wrote the spec. If you reuse a chat, if you paste prior
context, if you give hints — the audit is theater. The blindness *is* the
product.

This file is longer than the other two prompts because the failure mode
(reusing a session) is **silent**. An auditor with leaked context produces
a report that looks fine but is worthless.

Do not skip the "What NOT to include" section.

---

## Before you paste

### 1. Open a genuinely fresh session

| Harness | How |
|---------|-----|
| **ChatGPT web** | "New chat". Disable Memory for this session (Settings → Personalization → Memory → Off). |
| **Claude.ai web** | "Start new chat". Do **not** use Projects. Disable memory. |
| **Gemini web** | "New chat". Do not fork an existing chat. |
| **DeepSeek web** | "New chat". Do not use a pinned conversation. |
| **aichat / llm / ollama** | New invocation. Do **not** use `--session` or `--continue`. |
| **Any CLI** | New shell. New process. Clear any env vars holding prior prompts. |

### 2. Verify the session is actually empty

- No prior messages in the chat.
- No system prompt from a previous conversation.
- No LLM memory feature active.
- No "Context" or "Project" injecting prior files.

If any of these cannot be verified, **stop**. The audit cannot be run.

### 3. Gather exactly three inputs

1. The **spec** to audit: `specs/<US-ID>.spec.md`.
2. The **bounded context** doc: `docs/context/<name>.md`.
3. The **audit round number** `<N>` (1 for first audit, 2 after fixes, etc.).

Nothing else. Not the original user story. Not prior audits. Not your
reasoning. Not "just this one hint".

---

## What NOT to include

Each of these is a **blocking violation** of the Goldfish protocol. If
any leaks into the session, the audit is invalid and must be discarded.

- ❌ The chat where you wrote the spec.
- ❌ Your own reasoning about the spec.
- ❌ The original User Story as you first wrote it.
- ❌ Prior audit reports for the same spec (`audit.1.md` etc.).
- ❌ Files other than the three listed above.
- ❌ "Helpful hints" such as:
  - "This line is important, please don't flag it."
  - "We already know about X, skip it."
  - "The Navigator said Y is fine."
  - "Focus on section 3."
- ❌ Editor state, git history, or commit messages.
- ❌ Any instruction other than the prompt below.

If you find yourself wanting to add "just a bit of context", stop. That
impulse is exactly the confirmation bias the Goldfish exists to remove.

---

## How to use

1. Open a fresh session (see above).
2. Paste the **full contents** of `.meta-skills/02-egm-goldfish-audit.md`.
3. Paste the **full contents** of `specs/<US-ID>.spec.md`.
4. Paste the **full contents** of `docs/context/<name>.md`.
5. Paste the prompt below, after filling in every `<placeholder>`.
6. Send.

---

## Prompt — copy everything below this line

---

You are a blind Goldfish auditor. You have **no memory** of any prior
session. You have **no** context beyond what I paste below. You have just
read the Goldfish Audit meta-skill and its two inputs.

### Inputs (already in your context above)

- `spec_path`: `specs/<US-ID>.spec.md`
- `context_doc`: `docs/context/<name>.md`
- `audit_round`: `<1 | 2 | 3 | ...>`

### Filesystem access

- **YES (CLI / IDE with file tools):** you may write
  `specs/<US-ID>.audit.<N>.md` and update exactly two metadata fields in
  the spec (`status:`, `goldfish_audit:`).
- **NO (web LLM):** emit the full audit report as a code block in your
  reply. I will write it to the file myself. Do not claim you wrote it.

**Answer for this session:** `<YES | NO>`

### Rules

- Do **not** ask me for clarification. If the spec is ambiguous, that is
  a finding — record it.
- Do **not** propose fixes. Name the gap. The spec writer fills it, not you.
- Do **not** rewrite acceptance criteria or tests.
- Do **not** mark `audited` while any BLOCKING finding is open.
- Do **not** mark `rejected` without a specific, locatable blocking finding.
- Do **not** flag "style", "clarity", or "could be improved". Those are
  not findings.
- Do **not** touch the spec body. Only the two metadata fields listed above.
- Emit the audit report using the template from the skill. Emit the
  **handoff message** at the end and **stop**.

### Reminder

You are the Goldfish. You did not write this spec. You have no memory of
how it was written. You read it cold, suspicious, literal. That coldness
is the value. Do not soften it.

Begin.
