---
id: 20260920-100000-task-0007-week-summary
task: 0007
title: Plan de implementación — Resumen semanal de huecos
spec: ./spec.md
status: approved
---

# Plan de implementación — Resumen semanal de huecos

## Decisiones que he tomado yo — valida estas

1. Task 1 y Task 2 por agente, Sonnet medium: interpretan prosa.
2. `formatWeekSummary` reutiliza `isOverlapping` y `slotMinutes`; nada nuevo en `slots.js`.

**Spec**: `./spec.md`

## Restricciones globales

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task).
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación.
- El revisor marca el incumplimiento como Important, no como estilo.
- Política de modelos: modelo y effort explícitos al despachar un subagente. Gama media (Sonnet) como suelo para revisores e implementadores que trabajan desde prosa; el tier más barato solo para transcripción de código ya escrito en el plan. `fable` y `opus xhigh` prohibidos por defecto, salvo justificación escrita en la task.
- Modo de ejecución: `subagent-driven-development`; una task en línea solo si lo declara con motivo.
- `npm test` y `npm run lint` en verde antes de cada commit. Los tests RED los escribe el hilo principal desde los THEN de la spec; el implementador no los modifica.
- Textos visibles en castellano con tildes.

---

## 2. Tasks

### Task 1 — Duración de un hueco

**Modelo**: Sonnet, effort medium — interpreta prosa.
**Tests RED**: hilo principal · `test/duration.test.js`

**Interfaces**:
- Consume: el objeto hueco `{ day, start, end }` de `parseSlot` (minutos del día).
- Produce: `slotMinutes(slot) -> number` en `src/duration.js`.

**Ficheros**: crear `src/duration.js`

- [ ] **Step 1**: `slotMinutes(slot)` devuelve `end - start`.
- [ ] **Step 2**: `npm test` y `npm run lint` en verde.

### Task 2 — Resumen semanal

**Modelo**: Sonnet, effort medium — interpreta prosa.
**Tests RED**: hilo principal · `test/summary.test.js`

**Interfaces**:
- Consume: `isOverlapping(a, b)` de `src/slots.js`; `slotMinutes(slot)` de `src/duration.js`; huecos `{ day, start, end }`.
- Produce: `formatWeekSummary(slots) -> string` en `src/summary.js`.

**Ficheros**: crear `src/summary.js`

- [ ] **Step 1**: sin huecos, «Sin huecos esta semana».
- [ ] **Step 2**: una línea por día, en orden de fecha: `<día>: <n> hueco(s), <minutos> min`, «hueco» en singular si es uno.
- [ ] **Step 3**: dos huecos solapados el mismo día lanzan `Error` con el texto «Huecos solapados el <día>».
- [ ] **Step 4**: `npm test` y `npm run lint` en verde.
