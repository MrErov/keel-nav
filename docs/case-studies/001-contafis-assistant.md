# Case Study: Catching a Fail-Open Security Bug in Production

**Project:** `contafis-assistant` (Odoo 19 + LangGraph + FastAPI)
**Date:** 2026-11-09
**Phases Executed:** 0 → 1a → 1b → 2 → (3 skipped) → 4

## The Context

`contafis-assistant` is a production-grade conversational assistant integrated with Odoo. The team adopted Keel Nav to formalize their SDLC and eliminate vibe coding.

## Phase 0: The Discovery

During the Context Bootstrap (Phase 0), the AI mapped the `api` bounded context and generated a Risk Register. It passively discovered a critical vulnerability in `api/security.py`:

> **Risk R2 (Fail-Open):** The `ApiKeyGuard` allows all requests if `API_SHARED_SECRET` is not configured (`verify_api_key` returns `True`). In production, a misconfigured deployment would be completely open to the public.

## Phase 1: Spec & Blind Audit

A User Story (`US-001-api-fail-closed`) was created to fix this. 
The **Goldfish Audit** (Phase 1b) ran blind and found a contradiction in the first draft: the story promised to "warn and continue" in non-production, but an existing host-validation rule required failing if the host was public. The spec was revised (v0.1.1) and approved in Round 2.

## Phase 2: Strict TDD

The AI wrote 13 new tests (all RED). It then implemented the minimal code in `config.py` to make them pass (GREEN). 
- **13 new tests passed.**
- **686 regression tests passed (0 broken).**
- **Total: 699 green tests.**

## Phase 3: Skipped

The change was an internal startup validation (horizontal layer). Per Keel Nav protocol, Phase 3 (ODD) was correctly skipped because there was no UI or runtime endpoint to observe.

## Phase 4: Drift Control

The final drift check compared the implemented code against the audited spec.
- **Verdict:** `no-drift`
- **Findings:** 0 blocking, 0 warning, 0 info.
- **Spec Status:** `certified`.

## Conclusion

Keel Nav prevented a security vulnerability from reaching production by forcing the team to map the system (Phase 0) and rigorously test the fix (Phase 2). The entire flow took less than 2 hours and consumed minimal tokens, proving that rigorous SDD+TDD is not only for greenfield projects.