---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-14
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 63068b6 | |
| 2 | Listado de canceladas | done | (en el cierre) | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

Revisión final: Spec opus+high, aprobada (0 Critical, 0 Important) · Código sonnet+high, aprobada (0 Critical, 0 Important) · Arquitectura no (plan: sin línea; diff sin señales), sobre 4757d26

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: los 2 tests existentes de `cancel.test.js` se actualizan pasando `--motivo "sala ocupada"` — la spec manda: sin motivo es «motivo no válido»; el fichero está en «Ficheros» de la task — si me equivoco, un test viejo pierde la comprobación sin motivo (la cubre un test nuevo).
- Task 1: Ruling: el motivo se valida antes de buscar la reserva — la spec dice que sin `--motivo` responde «motivo no válido» sin condiciones — si me equivoco, `cancelar Sur mar` sin motivo diría «sin reserva» en lugar de «motivo no válido».
- Task 1: Ruling: implementador sonnet + `sdd-kit:effort-medium` y revisor sonnet + `effort-medium` — el plan no declara Modelo/effort; la task toca 1 fichero pero se describe en prosa — si me equivoco, más rondas de fix.
- Task 1: Ruling: minor diferido — `cancelar --motivo otro` (flag en lugar de sala) respondería «sin reserva --motivo otro»; fuera de la spec — si me equivoco, mensaje confuso en un uso erróneo.
- Task 2: Ruling: minor del revisor «el test depende del orden» descartado — falso positivo, `node --test --test-name-pattern=canceladas` pasa solo (el test hace su propio cancelar) — si me equivoco, ninguno.
- Task 2: Ruling: minor diferido — sin test de que las anuladas (voided) no salen en `canceladas`, ni de la lista vacía (cadena vacía, la spec no la define) — fuera del RED de la spec — si me equivoco, una regresión en anuladas pasaría sin test.
- Final: Ruling: Eje Arquitectura no — el plan no lo declara y el diff no cruza ninguna frontera — si me equivoco, un acoplamiento entre módulos pasaría sin revisar (hay un único módulo)
- Final: minor (deferred): test de canceladas depende de estado compartido (falso positivo parcial: pasa solo con --test-name-pattern; ya ruled en Task 2)
- Final: minor (deferred): test/cancel.test.js pasó de CRLF a LF (ruido de diff, lo escribió el hilo en los RED)
- Final: minor (deferred): `canceladas` sin canceladas imprime línea vacía (la spec no define el caso)
- Final: minor (deferred): `cancelar --motivo otro Norte lun` lee `--motivo` como sala (parseo posicional frágil, fuera de la spec)
- Final: minor (deferred): sin test de que las anuladas no salen en `canceladas`
- Final: Ruling: matizo el ruling de Task 2 — el revisor Spec acierta en que el test de canceladas depende del motivo del test 1 en la ejecución completa (pasa solo, pero se rompería si cambiara el motivo del test 1) — es fragilidad real y menor — si me equivoco, un cambio futuro de test rompe otro sin aviso
- Final: minor (deferred): test de canceladas depende del motivo del test 1 en la suite completa (volver independiente: comprobar el retorno del cancelar o reiniciar estado)
- Final: minor (deferred): solo se prueba «sala ocupada» como motivo válido; «cambio de planes» y «otro» sin test
- Final: minor (deferred): ningún test fija que un cancelar rechazado deja la reserva activa
- Final: Ruling: Declined to judge — persistencia del motivo entre ejecuciones de la CLI (bookings en memoria desde la base; el ROADMAP lo tiene aparte) — una persona que cancele y liste en dos invocaciones no verá nada — si me equivoco, el listado no sirve fuera de una sesión de tests
- Final: Ruling: Declined to judge — CHANGELOG, README y ROADMAP sin tocar — pertenecen al cierre (sdd-archive) — si me equivoco, la entrega sale sin nota
- Final: Ruling: Declined to judge — CRLF→LF en test/cancel.test.js, tercer parámetro de cancelBooking, partir parseo CLI del dominio — son forma/diseño del Código y la Arquitectura, sin efecto en comportamiento — si me equivoco, ruido de diff y un parseo frágil
- Final: Ruling: no se ejecuta el re-review ni pasada de fix — ningún Critical ni Important en ningún eje — si me equivoco, un defecto pasa sin segunda mirada
