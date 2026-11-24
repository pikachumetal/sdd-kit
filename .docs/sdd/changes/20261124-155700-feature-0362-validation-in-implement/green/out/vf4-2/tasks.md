---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 3c248cc | |
| 2 | Listado de canceladas | done | 1097e19 | |

Revisión final: Spec opus+high, con arreglos (1 Important) · Código sonnet+high, con arreglos (3 Important) · Arquitectura no (plan), juntada en el cierre
Pasada de fix: juntada en el cierre, 4 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (superado en la revisión final: ver `Final: fixed` más abajo)

## Final

- Final: Eje Arquitectura: no en el plan (sin línea de eje) · señales en el diff: ninguna (sin módulo ni dependencia nuevos; `package.json` sin cambios de dependencias; el campo `reason` vive en la reserva en memoria) → no sale
- Final: fixed falta el test de `cancelar` sin `--motivo` — `cancelar sin --motivo` RED (mutación: motivo por defecto) →GREEN, suite 7/7
- Final: fixed `canceladas` dependía del orden — `canceladas enseña sala, día y motivo` RED (suelto: actual '') →GREEN, suite 7/7
- Final: fixed cobertura perdida de `sin reserva` con motivo válido — `cancelar sin reserva con un motivo de la lista lo dice` RED (mutación del mensaje) →GREEN, suite 7/7
- Final: fixed dos tests e2e que no nombran un flujo core — quitados `rechaza un motivo fuera de la lista` y `la cancelada sale en canceladas con su motivo` (los cubre `test/cancel.test.js`), e2e 5/5
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía (src/app.js:36-38)
- Final: minor (deferred): `cancelar` sin `--motivo` responde «motivo no válido…» y no «falta el motivo» (src/app.js:56)
- Final: minor (deferred): `reasonOf` lee posicionalmente; extraer un parser de flags cuando haya un tercer comando con flag (src/app.js:50-53)
- Final: Ruling: validar el motivo antes de buscar la reserva — con un motivo malo sobre una reserva inexistente sale el error del motivo — coste si es erróneo: mensaje menos preciso en un caso raro
- Final: Ruling: etiqueta «ADDED» en el delta cuando `cancelar` ya existía (sería MODIFIED) y numeración 1, 3 sin la 2 en «Decisiones» — error del documento de la spec, no del código; el comportamiento nuevo sí está en el delta — coste si es erróneo: ninguno en el código
- Final: Ruling: `anula una reserva` y `anular sin reserva avisa` del e2e tampoco nombran un flujo core — ya estaban antes y no son de esta feature — coste si es erróneo: tiempo de e2e (12 s)
- Final: Ruling: la pasada de fix reescribe `test/cancel.test.js` y `e2e/cancel.e2e.mjs` con saltos de línea LF (estaban en CRLF según el diff) — ruido de historial, sin efecto funcional — coste si es erróneo: diff ruidoso
