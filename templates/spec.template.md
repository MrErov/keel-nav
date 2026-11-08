---
template: spec
version: 0.1.0
phase: 1
consumed_by: [01-sdd-spec-writer, 02-egm-goldfish-audit, 03-tdd-cycle, 05-drift-control]
estimated_tokens_to_fill: 2000-4000
max_lines: 120
---

# SPEC: `<US-ID>` — <título corto de la User Story>

> **Cómo usar esta plantilla:** rellena solo las secciones marcadas como
> obligatorias (`[M]`). Las secciones marcadas como opcionales (`[O]`) se
> eliminan si no aplican. No añadas secciones nuevas. No superes el límite de
> líneas por sección. Si una sección obligatoria no se puede rellenar, es una
> señal de que la User Story no está lista: detente y devuélvela al Navigator.

---

## 1. [M] User Story

**Como** `<rol>`,
**quiero** `<capacidad>`,
**para** <beneficio de negocio>.

**Contexto delimitado:** `<nombre-del-contexto>` (referencia: `docs/context/<nombre>.md`)

**Fuera de alcance (explícito):**
- <qué NO entra en esta story, para evitar scope creep>

> Límite: 10 líneas. Si necesitas más, la story es demasiado grande: divídela.

---

## 2. [M] Criterios de aceptación

| ID | Dado (contexto) | Cuando (acción) | Entonces (resultado observable) |
|----|-----------------|-----------------|----------------------------------|
| AC-1 | ... | ... | ... |
| AC-2 | ... | ... | ... |
| AC-3 | ... | ... | ... |

> Límite: 3–7 criterios. Cada criterio debe ser **verificable por un test**.
> Si un criterio no se puede traducir a un test, no es un criterio: es una
> aspiración. Reescríbelo o elimínalo.

---

## 3. [M] Contratos de interfaz

> Solo si la story expone o consume una interfaz (API, función pública, evento,
> componente UI). Si no aplica, escribe "N/A — historia interna" y pasa a la
> sección 4.

### 3.1 Contrato de entrada

```text
<verbo> <ruta/firma>
```

Payload / parámetros:

```text
<campo>: <tipo> — <validación>
```

Respuestas:

```text
2xx: <forma>
4xx: <forma>
```

### 3.2 Contrato de salida / efectos secundarios

- <qué se persiste, qué se emite, qué se notifica>

> Límite: 15 líneas. Si el contrato necesita más, la story está mezclando
> demasiadas responsabilidades. Divide.

---

## 4. [M] Plan de tests (TDD seed)

> Esta sección es el **contrato de alcance** para la Fase 2. La IA no escribirá
> código que no esté cubierto aquí.

| Test ID | AC cubierto | Tipo | Descripción breve |
|---------|-------------|------|-------------------|
| T-1 | AC-1 | unit | ... |
| T-2 | AC-2 | integration | ... |
| T-3 | AC-3 | e2e | ... |

**Estado inicial esperado:** todos en **RED** (`FAIL`).

> Límite: 5–10 tests. Si necesitas más, la story es demasiado grande.

---

## 5. [O] Dependencias y riesgos

- **Depende de:** <otras stories, contextos, servicios externos>
- **Riesgo principal:** <qué podría hacer fallar esta story>
- **Mitigación:** <cómo se reduce ese riesgo>

> Si no aplica, elimina esta sección completa.

---

## 6. [O] Notas de observación (ODD)

> Solo para stories con componente visual o de comportamiento observable en
> runtime. Se rellena en Fase 3, no en Fase 1.

- <qué debe observar el Navigator para validar la rebanada vertical>

---

## 7. [M] Gate de salida (autochequeo antes de enviar a Goldfish Audit)

| Gate | Criterio | Estado |
|------|----------|--------|
| G1 | User Story en formato Como/Quiero/Para | [ ] |
| G2 | Fuera de alcance explícito declarado | [ ] |
| G3 | 3–7 criterios de aceptación verificables | [ ] |
| G4 | Cada AC tiene al menos un test en el plan | [ ] |
| G5 | Contratos de interfaz completos o "N/A" justificado | [ ] |
| G6 | Longitud total ≤ 120 líneas | [ ] |
| G7 | No se añadieron secciones fuera de esta plantilla | [ ] |

**Si algún gate falla, la spec NO se envía a Goldfish Audit.**
Vuelve al Navigator con el gate fallido y la razón.

---

## 8. [M] Metadatos de trazabilidad

```yaml
us_id: <US-ID>
spec_version: 0.1.0
created_by: 01-sdd-spec-writer
created_at: <YYYY-MM-DD>
status: draft | audited | approved | implemented
goldfish_audit: <ruta al audit.md o "pending">
drift_report: <ruta al drift-report.md o "pending">
```
