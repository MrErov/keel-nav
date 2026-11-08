# OpenCode Harness

> Thin shims that wire Keel Nav's six meta-skills into OpenCode's native
> skills. No copies. No fork. Update the meta-skill, the shim stays put.

## What this is

Each folder under `skills/` is an OpenCode skill (`SKILL.md`) that:

1. Declares `name` and `description` in YAML frontmatter (OpenCode UI).
2. Points at the full protocol in `.meta-skills/<file>.md`.
3. Tells the agent to read that file and execute it.

The shim is ~20 lines. The protocol lives in `.meta-skills/`. If you edit a
meta-skill, you do not touch the shim.

## What this is not

This is not a fork of Keel Nav. It does not embed the methodology. If you
modify a shim, you are diverging from the source of truth, and the next
`git pull` will fight you.

For the full adapter contract, see [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §4.

## Install

### In your own project

```bash
# 1. Clone Keel Nav somewhere persistent
git clone https://github.com/MrErov/keel-nav.git ~/keel-nav

# 2. From your project root:
mkdir -p .opencode/skills
cp -r ~/keel-nav/harnesses/opencode/skills/* .opencode/skills/
cp -r ~/keel-nav/.meta-skills ./

# 3. Commit both directories (they are part of your repo now)
```

The `.meta-skills/` directory must live at your project root. Every shim
references it as `.meta-skills/<file>.md`.

### In Keel Nav itself (for development)

```bash
cd keel-nav
mkdir -p .opencode/skills
cp -r harnesses/opencode/skills/* .opencode/skills/
```

`.meta-skills/` is already at the repo root, so no second copy is needed.

## Verify

Start OpenCode in your project. Run `/` and confirm the six skills appear:

```text
context-bootstrap
sdd-spec-writer
egm-goldfish-audit
tdd-cycle
odd-vertical-slice
drift-control
```

If any is missing, check that:

- `.opencode/skills/<name>/SKILL.md` exists.
- `.meta-skills/<file>.md` exists at project root.
- The `name:` in the shim's frontmatter matches the folder name.

## Invoking each skill

| Skill | Command | Phase | Fresh session? |
|-------|---------|-------|----------------|
| Context bootstrap | `/context-bootstrap` | 0 | Recommended |
| SDD spec writer | `/sdd-spec-writer` | 1a | Recommended |
| Goldfish audit | `/egm-goldfish-audit` | 1b | **MANDATORY** |
| TDD cycle | `/tdd-cycle` | 2 | No |
| ODD vertical slice | `/odd-vertical-slice` | 3 | No |
| Drift control | `/drift-control` | 4 | No |

"Recommended" means: reuse a session only if it has no prior context about
the other phases' outputs. When in doubt, open a fresh session.

## The Goldfish exception

`/egm-goldfish-audit` **requires a fresh OpenCode session**. If you invoke
it from a session that already discussed the spec, the shim will refuse and
tell you to reopen. Do not override that refusal. The blindness is the
product.

See [`../../.meta-skills/02-egm-goldfish-audit.md`](../../.meta-skills/02-egm-goldfish-audit.md)
§ "Blind isolation protocol" for the full rationale.

## Updating

To pull meta-skill updates:

```bash
cd ~/keel-nav && git pull
cp -r ~/keel-nav/.meta-skills/* /path/to/your-project/.meta-skills/
```

The shims under `.opencode/skills/` do not change unless the harness
itself changes (rare). If they do, the Keel Nav commit message will tell you.

## Uninstall

```bash
rm -rf .opencode/skills/{context-bootstrap,sdd-spec-writer,egm-goldfish-audit,tdd-cycle,odd-vertical-slice,drift-control}
rm -rf .meta-skills/
```

If you have other `.opencode/skills/`, keep them.

## See also

- [`AGENTS.md`](../../AGENTS.md) — canonical behavioral contract. Read this first.
- [`harnesses/generic/`](../generic/) — the no-plugin fallback (paste-to-LLM).
- [`CONTRIBUTING.md`](../../CONTRIBUTING.md) §4 — adapter rules.
