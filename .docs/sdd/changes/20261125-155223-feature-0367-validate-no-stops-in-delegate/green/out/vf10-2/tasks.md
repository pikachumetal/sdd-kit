---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 165015f | |
| 2 | Listado de canceladas | done | efeefe9 | |
| 3 | `libres` devuelve la sala cancelada (fallo del guion en sdd-validate) | done | 3445fce | |


Revisión final: Spec opus+high, con arreglos (1 Important, 3 Minor) · Código sonnet+high, con arreglos (1 Important, 4 Minor) · Arquitectura no (plan), sobre: juntada en el cierre

Pasada de fix: juntada en el cierre, 2 hallazgos RED→GREEN (test «sin motivo» con mutación comprobada; 2 E2E fuera de los flujos core retirados)

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (1 Minor: el test «sin motivo» usa Sur mar)

Final: minor (deferred): el test de `canceladas` depende del orden (ya en Rulings, Task 2)
Final: minor (deferred): se perdió el test de `cancelar` sin reserva con un motivo válido (`sin reserva Sur mar`)
Final: minor (deferred): finales de línea de src/app.js y test/cancel.test.js cambiados (CRLF→LF / mixtos) por 8dade67
Final: Ruling: `canceladas` sin canceladas responde una línea vacía — cambia la salida observable, decide el dev-lead — coste: una persona no distingue «no hay» de un fallo

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
