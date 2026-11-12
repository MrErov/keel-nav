---
description: Keel Nav — Fase 4: Drift Control (audit del código vs spec y drift-report.md)
---

# `/keel-drift` — Fase 4: Drift Control

Orquesta la **Fase 4** del flujo Keel Nav: certificar que el código implementado coincide con la spec y generar el reporte de desviación (`drift-report.md`).

## Entradas obligatorias
- `specs/<US-ID>.spec.md` (`status: implemented` o `observed`).
- `specs/<US-ID>.audit.<N>.md` (`effective_verdict: audited`).
- Test plan derivado de la Sección 4 del spec.
- Alcance de código: `git diff base=<sha>` o lista explícita de archivos.

## Tu trabajo

1. **Invoca al sub-agente `@reviewer`** para auditar el código implementado contra la spec y el audit.

2. **Salida:**
   - `drift-report.md` (equivalente a `specs/<US-ID>.drift.<N>.md` del Meta-Skill 05).
   - Efecto secundario: actualizar metadata de la spec (`status: certified | unchanged`, `drift_report: <ruta>`).

3. **Resultado:**
   - `certified`: código coincide con la spec, no hay deriva.
   - `unchanged`: no hay cambios que certificar.
   - Si hay deriva: reportar y no marcar como certificado.

## Reglas
- ❌ No certificar si hay deriva no resuelta.
- ❌ El `@reviewer` compara contra la spec, no inventa requisitos nuevos.
- ✅ El drift-report debe ser accionable (qué difiere, dónde, cómo corregir).

## Entrega
Ruta de `drift-report.md` + resumen de ≤5 líneas (veredicto certified/unchanged/drift, siguiente paso definido por el Navigator).
