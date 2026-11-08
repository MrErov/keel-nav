# Generic Harness

> The reference adapter for "no plugin, no SDK, no lock-in".
> Works with any CLI, web LLM, or IDE that lets you paste text.

## What this is

Keel Nav is designed to work without a native adapter. This directory proves
it: it contains the **only two things** a Navigator needs to invoke any
Keel Nav phase from any LLM:

1. A **dispatch prompt** per meta-skill (in `prompts/`).
2. The **meta-skill** itself (in `../../.meta-skills/`).

If your harness can read two Markdown files, it can run Keel Nav.

## What this is not

This is not a plugin. It does not auto-detect your repo, does not manage
sessions, does not enforce gates mechanically. Those remain the Navigator's
responsibilities. The generic harness trades convenience for portability.

## How it works: the 2-paste pattern

Every Keel Nav phase is invoked with **two pastes**, in this exact order:

| Paste | Content | Purpose |
|-------|---------|---------|
| **1** | The meta-skill file (`../../.meta-skills/<skill>.md`) | Teaches the LLM the protocol for this phase. |
| **2** | The dispatch prompt (`prompts/<skill>.md`) | Tells the LLM to execute, with this session's inputs. |

The meta-skill defines the *what*. The dispatch prompt defines the *now,
with these inputs*. Separating them means the meta-skill can be updated
without touching any harness, and the harness can be updated without
touching any meta-skill.

## Directory map

```
harnesses/generic/
├── README.md                          (this file)
└── prompts/
    ├── 00-context-bootstrap.md        Phase 0
    ├── 01-sdd-spec-writer.md          Phase 1a
    └── 02-egm-goldfish-audit.md       Phase 1b — BLIND, read carefully
```

Prompts for Phases 2–4 land here when their meta-skills ship.

## Phase invocation order

Do not skip. Do not reorder. The Navigator advances the flow.

```
Phase 0  → prompts/00-context-bootstrap.md
         ↓ (produces docs/context/*.md)
Phase 1a → prompts/01-sdd-spec-writer.md
         ↓ (produces specs/<US-ID>.spec.md)
Phase 1b → prompts/02-egm-goldfish-audit.md   ⚠️ must be BLIND
         ↓ (produces specs/<US-ID>.audit.<N>.md)
Phase 2  → (planned: 03-tdd-cycle)
         ↓
Phase 3  → (planned: 04-odd-vertical-slice)
         ↓
Phase 4  → (planned: 05-drift-control)
```

## The Goldfish exception: it must be blind

The Goldfish Audit (Phase 1b) is the **only** Keel Nav phase that
*requires* a fresh session. Every other phase can reuse the conversation.
The Goldfish cannot. If the auditor has any memory of the spec-writing
session, the audit becomes theater.

See `prompts/02-egm-goldfish-audit.md` for the full dispatch protocol.
That file is deliberately more verbose than the other two, because the
failure mode (reusing a session) is silent and devastating.

## What a "fresh session" means in practice

| Harness | How to open a fresh session |
|---------|----------------------------|
| **ChatGPT web** | "New chat" button. Do not continue an existing thread. |
| **Claude.ai web** | "Start new chat". Clear any Project context. Disable memory. |
| **Gemini web** | "New chat". Do not fork an existing chat. |
| **DeepSeek web** | "New chat". Do not use a pinned conversation. |
| **aichat / llm / ollama** | New invocation. Do not use `--session` / `--continue`. |
| **Any IDE terminal** | New shell. New process. No env vars carrying prior prompts. |

If your tool has **no fresh-session mechanism**, the Goldfish phase
**cannot be run** correctly. Stop and report to the Navigator. Do not
attempt to "simulate" blindness by instructing the same agent to "pretend
you didn't see the earlier chat". That does not work — the context is
still in the window.

## CLI patterns

### Pattern A — Web LLM (ChatGPT, Claude.ai, Gemini, DeepSeek web)

1. Open a **fresh** chat.
2. Paste `.meta-skills/<skill>.md`.
3. Paste `harnesses/generic/prompts/<skill>.md`, filling in every
   `<placeholder>`.

### Pattern B — CLI with `--system` (aichat, llm, ollama, etc.)

```bash
# Phase 0 example (aichat)
aichat \
  --system "$(cat .meta-skills/00-context-bootstrap.md)" \
  "$(cat harnesses/generic/prompts/00-context-bootstrap.md)"
```

### Pattern C — Shell pipe with here-doc

```bash
{
  cat .meta-skills/00-context-bootstrap.md
  echo
  echo "---"
  echo
  cat harnesses/generic/prompts/00-context-bootstrap.md
} | llm
```

### Pattern D — Manual assembly (any harness)

```
1. Copy `.meta-skills/<skill>.md` → paste into chat.
2. Copy `prompts/<skill>.md` → paste after.
3. Replace every `<placeholder>` by hand.
4. Press Send.
```

## Verification checklist (before pressing Send)

Every time you invoke a phase, verify:

- [ ] I am in a fresh chat. (Goldfish: mandatory; others: recommended.)
- [ ] I pasted the meta-skill file first.
- [ ] I pasted the dispatch prompt second.
- [ ] I filled in every `<placeholder>` in the prompt.
- [ ] I did not paste chat history, prior audits, or "helpful hints".
- [ ] For Goldfish: I did not include the spec-writing conversation.
- [ ] Any LLM memory feature (ChatGPT Memory, Claude Projects, etc.) is
      disabled for this session.

If any checkbox is unchecked, do not send. Reopen a fresh chat and start
over. A broken invocation costs more tokens than a restart.

## Compatibility with dsh-bridges

`dsh-bridges` reads existing adapter layouts from Claude Code, OpenCode,
Codex, Gemini CLI, and Cursor. It can auto-detect `harnesses/generic/` and
turn each prompt file into a bridge target. No additional setup beyond
what this README documents.

## Contributing

Harness prompts are thin wrappers, not copies of the meta-skills. A
prompt file must:

- Reference the meta-skill by path, not embed its content.
- Contain exactly one fillable prompt block.
- Declare its "what NOT to include" list (mandatory for Goldfish).
- Be ≤ 150 lines.

See `CONTRIBUTING.md` §4 for the full adapter rules.
