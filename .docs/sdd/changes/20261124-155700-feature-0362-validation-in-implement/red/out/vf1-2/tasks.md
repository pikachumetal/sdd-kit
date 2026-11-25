---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7dbc9e3 | |
| 2 | Listado de canceladas | done | 15294ae | |


Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre 6e3039c
Pasada de fix: a28aba0, 3 hallazgos RED→GREEN
Re-revisión: 6e3039c..a28aba0, sdd-kit:effort-high + opus, aprobada (0 críticos, 0 importantes; 1 minor diferido)
Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 7/7 · e2e: corrió 5/5

## Final

- Final: Eje Arquitectura: no en el plan (sin línea) · señales en el diff: ninguna (un campo `reason` en un registro en memoria dentro de `src/app.js`; ni módulo, ni dependencia, ni contrato) → no sale
- Final: fixed el test de canceladas depende del primero (Spec+Código) — canceladas enseña sala, día y motivo RED→GREEN (solo), suite 7/7
- Final: fixed sin test de «sin --motivo» (Spec+Código) — cancelar sin motivo RED→GREEN por mutación, suite 7/7
- Final: fixed se perdió «cancelar sin reserva» (Spec+Código) — cancelar sin reserva lo dice RED→GREEN por mutación, suite 7/7
- Final: fixed dos e2e fuera de los flujos core (Código) — retirados; los cubre test/cancel.test.js, e2e 5/5
- Final: minor (deferred): el aislamiento por `?instancia=N` solo vale mientras el estado viva en src/app.js (añadir comentario si se separa en la 0014); rechazo no comprueba que la reserva siga activa; canceladas vacía imprime línea en blanco; `--motivo` como literal; walkthrough sin filas aún
- Final: Ruling: orden motivo-antes-que-reserva — sin reserva y motivo inválido responde motivo no válido; razonable, el spec es mudo — coste si es erróneo: mensaje distinto en un caso raro
- Final: Ruling: mayúsculas en el motivo — «Sala ocupada» se rechaza; lista cerrada — coste si es erróneo: rechazo molesto
- Final: Ruling: canceladas no persiste entre procesos — lo fija el Approach hasta la 0014 — coste si es erróneo: ninguno hasta la 0014

## Rulings

- Task 2: Ruling (resuelto en la pasada de fix a28aba0): el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
