---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-11
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | d42fdb5 | |
| 2 | Listado de canceladas | done | — | |

Revisión final: Spec opus+high, sin Critical ni Important · Código sonnet+high, sin Critical ni Important · Arquitectura no (plan), sobre c48054b

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 0: Ruling: método SDD (plan `Ejecución: subagent`) sobre `execution: native` del json — el json solo decide en lite — coste si falla: ninguno, mismo ledger
- Task 1: Ruling: el test `cancelar una reserva activa` se reescribe a la spec (con `--motivo`) — la spec es la autoridad — coste: ninguno, es la spec
- Task 1: Ruling: sin reserva activa gana `sin reserva <sala> <día>` antes de validar el motivo — conserva el comportamiento y el test existentes, la spec solo fija el caso con reserva — coste si falla: un test y una línea
- Task 2: Ruling: sin canceladas, `canceladas` responde cadena vacía — la spec no lo fija, sin THEN que lo cubra — coste si falla: una línea
- Task 0: Ruling: implementadores y revisores con `model: sonnet` y `sdd-kit:effort-medium` — el plan no declara Modelo; tasks de 2 ficheros con prosa — coste si falla: una ronda de fix
- Task 1: Ruling: hallazgos solo Minor, sin ronda de fix — revisión limpia — coste si falla: una ronda en la revisión final
- Task 2: Ruling: hallazgos solo Minor, sin ronda de fix — revisión limpia — coste si falla: una ronda en la revisión final
- Final: Ruling: no se hace pase de fix — sin Critical ni Important y `review.minors` sin configurar — coste si falla: Minors pendientes antes de la 0011/0012
- Final: Ruling: «Declined to judge» (regla de 24 h de PRODUCT.md, persistencia del motivo, motivo en anulaciones, mayúsculas del motivo, estructura de readReason/dominio, decisión 3 de la spec) — fuera del Scope de la 0010: persistencia es la 0014, anulaciones la 0011; la lista cerrada es decisión del dev-lead — coste si falla: una feature posterior los recoge
- Final: Ruling: sin re-revisión — no hubo commits de fix tras la revisión final — coste si falla: ninguno

### Minor diferidos

- Task 1: tasks.md entró en el commit de la task (lo pedí yo) — no es defecto
- Task 1: ruido LF/CRLF en test/cancel.test.js; `--motivo` sin valor sin test propio; tests dependientes del orden (estado de módulo, documentado)
- Task 2: test de `canceladas` dependiente del orden del fichero; caso vacío y exclusión de `voided` sin test propio
- Final: `--motivo sala ocupada` sin comillas se rechaza con mensaje confuso
- Final: `canceladas` sin canceladas imprime una línea en blanco
- Final: la exclusión de `voided` en `canceladas` no tiene test (la 0011 toca anulaciones)
- Final: `cancelar --motivo otro Norte lun` toma el flag como sala
- Final: el mensaje de motivo no válido no nombra el flag `--motivo`
- Final: CRLF→LF en test/cancel.test.js ensucia el diff de Task 1
