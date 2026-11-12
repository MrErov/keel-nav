---
description: Keel Nav — Fase 0: Context Bootstrap (mapea el repo y genera docs/context/)
---

# `/keel-context` — Fase 0: Context Bootstrap

Orquesta la **Fase 0** del flujo Keel Nav: leer el contexto del proyecto y delegar al sub-agente `@explore` para mapear el repositorio antes de escribir cualquier spec o código.

## Entradas (leer solo si existen)
- `AGENTS.md` — contrato behavioral del proyecto.
- `constitution.md` — principios (si existe).
- `memory.md` — estado actual / memoria (si existe).

## Tu trabajo

1. **Confirma la raíz del repo:** el lugar donde está `AGENTS.md`. Todas las rutas son relativas a esa raíz.

2. **Delegación al sub-agente `@explore`:** pídele que mapee el repositorio siguiendo el protocolo de **Context Bootstrap (Meta-Skill 00)**:
   - Reconocimiento pasivo (tree depth 3, manifiestos, señales de framework, comandos de build/test/lint).
   - Descubrimiento de bounded contexts (DDD-lite) y Shared Kernel.
   - Documentación por contexto.
   - Mapa de dependencias (`docs/context/01-dependency-map.md`).
   - Registro de riesgos (`docs/context/02-risk-register.md`).
   - Visión general y entrega (`docs/context/00-overview.md`).

3. **Salidas esperadas** (solo dentro de `docs/context/`):
   - `docs/context/00-overview.md`
   - `docs/context/01-dependency-map.md`
   - `docs/context/02-risk-register.md`
   - `docs/context/<bounded-context>.md` (uno por contexto detectado)

4. **Calidad (gates G1–G6 del Meta-Skill 00):** verificar que existan overview, que cada contexto tenga su `.md`, que el dependency map cubra el 100% de contextos, que el risk register tenga ≥1 fila o un "no risks observed" justificado, y que **no se modifique nada fuera de `docs/context/`**.

## Reglas
- ❌ No escribir código de producción.
- ❌ No proponer refactores ni mejoras.
- ❌ No leer el repositorio entero; solo archivos declarados como entrada o índice/`__init__`/main de cada contexto.
- ✅ Todo el mapeo lo ejecuta `@explore`; este comando solo orquesta y valida las salidas.

## Entrega
Ruta de `docs/context/00-overview.md` + resumen de ≤5 líneas (contextos, riesgos, siguiente paso: `/keel-spec`).
