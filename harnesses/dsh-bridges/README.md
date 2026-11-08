# DeepSeek Harness via `dsh-bridges`

> **No shims. No `.dsh` file. No install step.**
> `dsh-bridges` auto-detects the three specific harnesses already in this
> repo. This directory exists only to document that fact.

## What this is

[`dsh-bridges`](https://github.com/deepseek-ai/dsh-bridges) is a community
plugin for DeepSeek Harness that bridges projects already configured for
Claude Code, OpenCode, Codex, Gemini CLI, or Cursor. It reads the existing
adapter layout and exposes it to DeepSeek Harness without migration.

Keel Nav ships three specific adapters:

- `harnesses/opencode/` — 6 native `SKILL.md` shims
- `harnesses/claude-code/` — `CLAUDE.md` directive file
- `harnesses/cursor/` — `.cursorrules` directive file

**`dsh-bridges` picks all three up automatically.** There is no
`harnesses/deepseek/` directory and there should not be — writing one would
duplicate the three adapters above, and duplicates rot.

## What this is not

- **Not a harness implementation.** This directory contains no shims, no
  `.dsh` file, no config. It is a single README.
- **Not a DeepSeek-specific fork.** The methodology is harness-agnostic; if
  DeepSeek Harness ever ships a native skill-loading primitive, we will add
  a proper adapter. Until then, `dsh-bridges` is the correct integration.

## How to use Keel Nav in DeepSeek Harness

### 1. Install one of the existing adapters

Follow the install guide for whichever you prefer:

- [`../opencode/README.md`](../opencode/README.md) — native shims (recommended;
  Phase 1b has mechanical fresh-session enforcement)
- [`../claude-code/README.md`](../claude-code/README.md) — single directive file
- [`../cursor/README.md`](../cursor/README.md) — single rules file

This creates `.meta-skills/` at your project root and either
`.opencode/skills/`, `CLAUDE.md`, or `.cursorrules`.

### 2. Install `dsh-bridges` per its own docs

See the [`dsh-bridges` repository](https://github.com/deepseek-ai/dsh-bridges)
for installation and configuration.

### 3. Invoke a phase

`dsh-bridges` will have auto-detected the adapter you installed in step 1.
DeepSeek Harness sees the same dispatch surface as the underlying harness:

- **With `harnesses/opencode/`** → `/context-bootstrap`, `/sdd-spec-writer`,
  `/egm-goldfish-audit`, `/tdd-cycle`, `/odd-vertical-slice`,
  `/drift-control`.
- **With `harnesses/claude-code/`** → conversational dispatch (`/phase-0`
  etc. are recognized patterns, not native commands).
- **With `harnesses/cursor/`** → natural-language dispatch ("run Phase 0").

The Goldfish fresh-session rule applies regardless of harness: Phase 1b
must run in a session with no prior spec context. See
[`../../.meta-skills/02-egm-goldfish-audit.md`](../../.meta-skills/02-egm-goldfish-audit.md)
§"Blind isolation protocol".

## Why no dedicated adapter

Two reasons:

1. **`dsh-bridges` already does the work.** Re-implementing it here would
   be a fork with no value added.
2. **Keel Nav's agnosticism is the product.** The moment we ship a
   `harnesses/deepseek/` with its own shims, we become harness-specific and
   the thesis ("runs anywhere Markdown runs") weakens. `dsh-bridges`
   proves the thesis: three unrelated adapters, one bridge, zero changes
   to Keel Nav.

## Updating

Nothing to update in this directory. When Keel Nav updates
`harnesses/opencode/`, `harnesses/claude-code/`, or `harnesses/cursor/`,
`dsh-bridges` sees the changes on its next read. If DeepSeek Harness adds a
native skill primitive, we add a proper adapter and this README is
replaced with an install guide.

## See also

- [`AGENTS.md`](../../AGENTS.md) — canonical behavioral contract.
- [`harnesses/generic/`](../generic/) — no-plugin fallback for any web LLM.
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §4 — adapter rules.
