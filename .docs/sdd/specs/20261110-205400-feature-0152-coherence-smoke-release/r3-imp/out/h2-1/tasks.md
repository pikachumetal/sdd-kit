---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | ade43e5 | |
| 2 | Listado de canceladas | done | — | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 0: Ruling: sin línea «Modelo» en el plan, implementador y revisor = sonnet con sdd-kit:effort-medium — tasks de 1 fichero con spec completa pero en prosa — si falla, rondas del fix-loop con escalado
- Task 1: Ruling: con `cancelar` sobre sala/día sin reserva se responde «sin reserva…» antes de validar el motivo — la spec no ordena ambas comprobaciones y así no cambia la salida ya existente — si es al revés, se reordena una línea
- Task 1: Ruling: un motivo no válido o ausente no cancela la reserva — la spec solo da la respuesta; cancelar con motivo inválido dejaría una cancelada sin motivo — se corrige validando antes de mutar
- Task 2: Ruling: `canceladas` sin ninguna cancelada responde cadena vacía — la spec no lo dice y es el patrón de `libres` — si se quiere un texto, es una enmienda
- Task 2: Ruling: `canceladas` solo lista estado `cancelled` (no `voided`) — Approach: «reservas con estado cancelada» — coste nulo
- Final: minor (deferred): test de canceladas depende del estado/orden de los tests anteriores (Spec 1, Code 2)
- Final: minor (deferred): sin test de que canceladas excluye voided (Spec 2)
- Final: minor (deferred): sin test de canceladas vacío; si se quiere un texto es enmienda de la spec (Spec 3, Code 3)
- Final: minor (deferred): EOL de test/cancel.test.js (LF) frente a src/app.js y app.test.js (CRLF) (Code 1)
- Final: minor (deferred): reasonFrom acepta --motivo en cualquier posición pero sala/día son posicionales (Code 4)
- Final: Ruling: persistencia entre procesos de la CLI (Spec, declined) — `bookings` es en memoria desde la base; `cancelar` y `canceladas` en procesos distintos no se ven; la 0014 «Motivo guardado» lo trata — si se quiere ya, es otra feature
- Final: Ruling: motivos con otras mayúsculas o sin comillas (Spec, declined) — se rechazan con la lista válida en el mensaje; decisión 1 fija lista cerrada — coste: un normalizado
- Final: Ruling: flag antes de sala/día, cancelar ya cancelada, varias franjas por sala/día (Spec/Code, declined) — comportamiento previo o fuera de la sintaxis fijada por la spec — coste bajo
- Final: Ruling: sin pasada de fix ni re-revisión — 0 Critical/Important y review.minors no es fix en sdd-kit.json — si el dev-lead quiere los minors, un commit de tests

Revisión final: Spec opus+high, sin hallazgos Critical ni Important · Código sonnet+high, sin hallazgos Critical ni Important · Arquitectura no (plan), sobre 8b1a5d9
