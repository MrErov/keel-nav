---
description: Keel Nav — Fase 3: Vertical slice (ODD) y verificación E2E con MCP Chrome
---

# `/keel-slice` — Fase 3: Vertical Slice / ODD

Orquesta la **Fase 3** del flujo Keel Nav: cablear una spec ya implementada (TDD) en un slice vertical end-to-end y verificarlo con MCP Chrome.

## Entradas obligatorias
- `specs/<US-ID>.spec.md` con `status: implemented`.
- `specs/<US-ID>.audit.<N>.md` con `effective_verdict: audited`.
- Observaciones de la Sección 6 del spec (debe estar no vacía).

## Tu trabajo

1. **Invoca al sub-agente `@implementer`** para un **vertical slice**:
   - Código de infraestructura/cableado: migraciones de BD, rutas API, componentes UI.
   - Tests end-to-end derivados de la Sección 6 del spec.

2. **Verificación con MCP Chrome:**
   - Ejecutar el flujo E2E en navegador real (MCP Chrome) contra el slice implementado.
   - Confirmar que los escenarios de la Sección 6 pasan.

3. **Efecto secundario:** actualizar metadata de la spec (`status: observed`, pendiente de aprobación del Navigator para certificarse).

## Reglas
- ❌ No tocar código que no pertenezca al slice vertical de esta spec.
- ❌ No saltar la verificación E2E con MCP Chrome.
- ✅ Todo lo cableado debe tener su test E2E correspondiente.

## Entrega
Rutas del slice y tests E2E + resumen de ≤5 líneas (resultado MCP Chrome, siguiente paso: `/keel-drift`).
