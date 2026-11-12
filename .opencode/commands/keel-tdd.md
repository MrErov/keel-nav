---
description: Keel Nav — Fase 2: TDD ciclo Red-Green-Refactor contra una spec auditada
---

# `/keel-tdd` — Fase 2: TDD (Red → Green → Refactor)

Orquesta la **Fase 2** del flujo Keel Nav: ejecutar un ciclo TDD estricto contra una spec ya auditada, usando el sub-agente `@implementer`.

## Entradas obligatorias
- `specs/<US-ID>.spec.md` con `status: audited` o `approved`.
- `specs/<US-ID>.audit.<N>.md` con `effective_verdict: audited` (vía overrides si aplica).

## Tu trabajo

1. **Invoca al sub-agente `@implementer`** para una tarea concreta de la spec, ciclo **RED → GREEN → REFACTOR**:
   - **RED:** escribir/ajustar el test (declared en Sección 4 del spec) y confirmar que falla.
   - **GREEN:** escribir el código de producción (declared en Sección 3 del spec) suficiente para pasar el test.
   - **REFACTOR:** limpiar sin romper tests verdes.

2. **Salidas:**
   - Test files en las rutas declaradas por la Sección 4 del spec.
   - Código de producción en las rutas declaradas por la Sección 3 del spec.
   - Efecto secundario: actualizar metadata de la spec (`status: implemented`, `drift_report: pending`).

## Reglas
- ❌ No escribir código sin el test correspondiente en el plan de tests del spec.
- ❌ No añadir funcionalidades no pedidas por el Navigator.
- ✅ Un ciclo por invocación; si el ciclo no pasa verde, detener y reportar.

## Entrega
Rutas de test y código modificados + resumen de ≤5 líneas (estado RED/GREEN/REFACTOR, siguiente paso: `/keel-slice`).
