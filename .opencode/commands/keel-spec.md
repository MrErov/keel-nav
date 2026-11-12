---
description: Keel Nav — Fase 1: SDD + auditoría Goldfish (anti-sesgo)
---

# `/keel-spec` — Fase 1: SDD + auditoría Goldfish

Orquesta la **Fase 1** del flujo Keel Nav: convertir una User Story del Navigator en una spec acotada y auditable, y hacerla auditar por el sub-agente `@reviewer` bajo el patrón Goldfish (anti-sesgo, sin memoria del contexto de redacción).

## Entrada obligatoria
- Una **User Story** proporcionada por el Navigator (rol + capacidad + beneficio).
- `docs/context/` de la Fase 0 ya generado (especialmente `docs/context/00-overview.md` y el `<contexto>.md` afectado).

## Tu trabajo

1. **Invoca al sub-agente `@planner`** para escribir la spec:
   - Archivo: `specs/<US-ID>.spec.md` (relleno de `templates/spec.template.md`, Secciones 1–4 + 7–8).
   - El `US-ID` lo propone el agente o lo da el Navigator (ej. `US-001`).
   - Solo el QUÉ y el POR QUÉ. Nada de stack, arquitectura ni nombres de archivo.

2. **Invoca al sub-agente `@reviewer`** para la auditoría Goldfish:
   - Sub-agente ciego (sin chat memory, sin contexto de redacción de la spec).
   - Recibe: `specs/<US-ID>.spec.md` y `docs/context/<contexto>.md`.
   - Genera: `specs/<US-ID>.audit.<N>.md`.
   - Efecto secundario: actualiza en la spec los campos `status:` y `goldfish_audit:`.

3. **Estado de la spec tras la Fase 1:** `audited` (o `approved` tras veredicto del Navigator).

## Reglas
- ❌ No escribir código todavía.
- ❌ El `@reviewer` no conoce el contexto de redacción (anti-sesgo).
- ✅ La spec debe ser acotada y auditable; longitud dentro del límite del template.

## Entrega
Ruta de `specs/<US-ID>.spec.md` + `specs/<US-ID>.audit.<N>.md` + resumen de ≤5 líneas (veredicto Goldfish, siguiente paso: `/keel-tdd`).
