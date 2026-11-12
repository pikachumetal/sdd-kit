---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 11f2b1c | `node --test test/cancel.test.js` → 2/2 |
| 2 | Listado de canceladas | done | 46240a3 | `node --test test/cancel.test.js` → 3/3 |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → 2/2 pass (ledger)
- [x] Task 2 — `node --test test/cancel.test.js` → 3/3 pass (ledger)

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 46240a3
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 3/3 resueltos, 2 Minor del fix
Sin revisar: cambio tras la re-revisión, juntado en el cierre — devuelve el test de canceladas a cancel.test.js con su GIVEN y restaura CRLF (tras la re-revisión)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Revisión final: 3 hallazgos de tests (sin --motivo, sin reserva, canceladas dependiente) | tests de la Task 1 y 2 sin cubrir esos casos | pasada de fix | cierre |
| Re-revisión: test fuera del fichero de la spec y CRLF→LF | la pasada de fix | devolverlo a cancel.test.js | cierre |

## Rulings

- Final: Ruling: la spec declaraba `bookings` en «Modificadas» sin fichero en capabilities/ (el proyecto no tiene ninguna); la paso a «Nuevas» para que `sdd capability merge` la cree — no toca requisitos, THEN ni Scope — si estaba mal, bookings vivía en otro sitio no indexado y habría que fusionarla a mano allí
- Final: Ruling: tasks.md no se escribió antes de la Task 1 (plan de 2 tasks); lo escribo en el cierre desde el ledger y git log — coste si está mal: ninguno en el código, solo el registro llega tarde
- Final: Ruling: [Código I3 = Spec M4] `canceladas` vacío imprime una línea en blanco — se queda así: un mensaje nuevo es salida observable que la spec no fija, y añadirlo cambia el delta (freno de alcance); reclasificado a Minor (la orden no falla, solo no da aviso) y propuesto como fila de deuda en el cierre — si está mal, el usuario ve una salida vacía hasta la próxima feature
- Final: Ruling: [Código M1] sin --motivo da el mismo mensaje que un motivo inválido — el código se queda: es literalmente el tercer AND de la spec — ninguno
- Final: minor (deferred): [Código M2] los estados 'cancelled'/'active' repetidos como literales; constantes evitarían erratas
- Final: minor (deferred): [Código M3] cancelledList (src/app.js:36) mezcla filtrar, formatear y unir en una línea larga
- Final: minor (deferred): [Spec M5] ningún test comprueba que un motivo no válido deja activa una reserva real
- Final: minor (deferred): [Spec M6] la lista «Decisiones que he tomado yo» de la spec salta del 1 al 3
- Final: Ruling: [Spec M6] ADDED frente a MODIFIED — se queda ADDED: el proyecto no tenía capacidad viva `bookings` y el bloque «Capacidades» ya va como «Nuevas» — si estaba mal, el historial pierde que `cancelar` sin motivo funcionaba antes
- Final: Ruling: [Código, declined] los tests de cancel.test.js cambiados en 11f2b1c — son tests previos del molde cuyo comportamiento cambia esta feature, reescritos en el commit de su propia task; no son RED de otra task — ninguno
- Final: Ruling: [Código, declined] canceladas sin motivo — desde 11f2b1c toda cancelación exige motivo y el estado es en memoria, así que no hay canceladas sin motivo — ninguno
- Final: Ruling: [Código y Spec, declined] voidBooking/anular sin motivo — fuera del Scope (0011) — ninguno
- Final: Ruling: [Código, declined] rama `--cada-semana` de run — ajena al diff — ninguno
- Final: Ruling: [Spec, declined] las reservas no persisten entre invocaciones del CLI, así que `cancelar` y luego `canceladas` en dos procesos no enseña nada — ya pasaba en todo el molde y la spec no pide persistencia; se propone como fila de deuda en el cierre — si está mal, el listado no sirve fuera de los tests
- Final: Ruling: [Spec, declined] posición de --motivo, motivos de varias palabras sin comillas y regla de las 24 h — la spec fija la forma con comillas y no pide la regla — ninguno
- Final: Ruling: [Spec, no verificado] si el test borrado era la regresión de patch-0007 — patch.md no nombra el test, no se puede verificar; se restaura igualmente por el I2 — ninguno
- Final: Ruling: [Spec, no verificado] el orden de ejecución de node:test — deja de importar al aislar el test de canceladas en su propio fichero — ninguno
- Final: Ruling: el test de canceladas pasa a test/cancelled-list.test.js, fuera de los «Ficheros» del plan — node --test aísla cada fichero en su proceso, así que el GIVEN se prepara sin exportar un reset del estado en src/app.js — si está mal, hay un fichero de test más que mantener
- Final: Ruling: el último commit del cierre se corrigió con --amend para fijar CRLF en el índice antes de presentarlo — local y sin publicar, evita un commit solo de finales de línea — ninguno

> Superados en el cierre: los rulings del fichero test/cancelled-list.test.js y del orden de node:test (el test vuelve a cancel.test.js preparando su GIVEN).
