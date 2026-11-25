---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | c8235fe | |
| 2 | Listado de canceladas | done | 2ada502 | |
| 3 | Pasada de fix de la revisión final: `libres` libera lo cancelado, tests que faltaban, E2E no core | done | 5add539 | |


Revisión final: Spec opus+high, no (1 Critical, 2 Important) · Código sonnet+high, no (1 Critical, 3 Important) · Arquitectura no (plan), sobre 3ceb327
Pasada de fix: 5add539, 1 hallazgo RED→GREEN (+ 3 tests de cobertura sobre comportamiento existente)
Re-revisión: 3ceb327..c587f89, sdd-kit:effort-high + opus, limpia (7/7 hallazgos resueltos, sin nuevos)

## Final

- Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo, dependencia ni contrato nuevos; solo `src/app.js` y tests) → no sale
- Final: fixed `libres` no libera la sala cancelada (0651177, Critical en ambos ejes) — `libres vuelve a enseñar la sala tras cancelar su reserva` RED→GREEN, suite 8/8; `src/app.js` restaurado a 2ada502 (sin reescritura CRLF→LF)
- Final: fixed `cancelar` sin `--motivo` sin test (Important, Spec) — `cancelar sin motivo responde motivo no válido`, cobertura de comportamiento existente, verde desde el primer run
- Final: fixed rama «sin reserva» de `cancelar` sin test (Important, Spec y Código) — `cancelar una sala sin reserva con un motivo válido lo dice`, verde desde el primer run
- Final: fixed test de `canceladas` dependiente del orden (Important, Código; Minor, Spec) — importa su propia instancia de la app; el Ruling de la Task 2 queda sin efecto
- Final: fixed dos E2E fuera de «Flujos core» (Important, Código) — borrados `rechaza un motivo fuera de la lista` y `la cancelada sale en canceladas con su motivo`; cubiertos en `test/cancel.test.js`
- Final: Ruling: `0651177` metió el cambio de `libres` sin task, sin test y con la línea final de revisión borrada en `3ceb327` — se revierte porque el spec no lo pide y contradice que cancelar libere la sala — coste si era intencionado: hace falta un MODIFIED de `bookings` aprobado por el dev-lead
- Final: minor (deferred): `canceladas` vacío imprime una línea vacía (sin mensaje «sin canceladas»)
- Final: minor (deferred): `cancelar --motivo otro Norte lun` toma `--motivo` como sala (parseo posicional)
- Final: minor (deferred): `cancelledList` queda entre las exportadas y `run`
- Final: minor (deferred): el delta del spec marca ADDED lo que cambia `cancelar` sin motivo (MODIFIED) y la numeración de Decisiones salta del 1 al 3

## Rulings

