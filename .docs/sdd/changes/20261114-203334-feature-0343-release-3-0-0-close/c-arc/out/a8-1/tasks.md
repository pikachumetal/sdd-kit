---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 29efa3f | |
| 2 | Listado de canceladas | done | 4bbf9cc | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 4bbf9cc

Pasada de fix: juntada en el cierre, 1 hallazgos RED→GREEN
Re-revisión: 4bbf9cc..juntada en el cierre, sdd-kit:effort-high + opus, necesita arreglos (1 Important arreglado en la pasada de fix, 2 Minor)

## Ledger de la revisión final

- Final: fixed el fix de la validación (`.trim()` del motivo) no tenía test — "el motivo se acepta sin espacios alrededor", "un motivo solo de espacios no es válido", "cancelar sin --motivo no es válido" RED→GREEN, suite 8/8
- Final: minor (deferred): el fix de la validación volteó `src/app.js` de CRLF a LF (96 líneas de diff para 1 real) — a `debt.md`, es una decisión aparte
- Final: minor (deferred): el fix de la validación no tenía fila ni ruling en `tasks.md`; queda aquí y en el walkthrough

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
