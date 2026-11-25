---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | f5449a7 | |
| 2 | Listado de canceladas | done | acbdec6 | |

Revisión final: Spec opus+high, necesita arreglos (1 Critical, 1 Important) · Código sonnet+high, necesita arreglos (1 Important) · Arquitectura no (plan), sobre a6ae0d9
Pasada de fix: 7f27db6, 1 hallazgo RED→GREEN
Re-revisión: a6ae0d9..7f27db6, sdd-kit:effort-high + opus, todo atendido, sin roturas nuevas

## Ledger

- Final: la `Revisión final:` anterior era sobre acbdec6; 4006049 cambió `src/app.js` después y no estaba revisado. Revisada de nuevo sobre a6ae0d9.
- Final: Eje Arquitectura: sin línea en el plan · señales en el diff: ninguna (sin módulo, dependencia, contrato ni dato nuevos) → no sale
- Final: fixed `freeRooms` bloquea la sala cancelada (`b.status !== 'voided'`, Spec Critical + Código Important) — «libres vuelve a enseñar la sala tras cancelarla» RED→GREEN, suite 6/6 y e2e 7/7
- Final: Spec Important (falta test de libres tras cancelar) — cubierto por el test del fix
- Final: minor (deferred): `cancelar` sin `--motivo` sin test
- Final: minor (deferred): se perdió el test unitario de `cancelar` sin reserva
- Final: minor (deferred): `src/app.js` pasó de CRLF a LF en 4006049 (diff ilegible, sin `.gitattributes`)
- Final: minor (deferred): `canceladas` sin canceladas imprime una línea vacía
- Final: minor (deferred): el test de `canceladas` depende del orden (ya en Rulings, Task 2)
- Final: no verificado: retries `2` en CI (no hay config de CI en el árbol)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
