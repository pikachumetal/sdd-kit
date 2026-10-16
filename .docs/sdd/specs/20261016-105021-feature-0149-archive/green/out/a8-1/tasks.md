---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | e061d9c | |
| 2 | Listado de canceladas | done | e061d9c | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre e061d9c
Re-revisión: e061d9c..34e1667, sdd-kit:effort-high + opus, 1 Important (trim sin test ni spec) y 1 Minor (CRLF→LF de src/app.js) adjudicados en Rulings

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Final: Ruling: `d2258a5` recorta con `trim()` el motivo (`src/app.js:16`) sin test ni enmienda de la spec — el código se queda: quien escribe « sala ocupada » espera cancelar, no un «motivo no válido»; la lista cerrada se sigue cumpliendo — coste si es erróneo: se aceptan entradas con espacios que la spec aprobada no contempla; queda a la vista del dev-lead en ✋
- Final: Ruling: `d2258a5` pasó `src/app.js` de CRLF a LF (48/48 líneas en el diff, el cambio real es una) — se queda: no cambia el comportamiento y rehacerlo abriría otro commit sin revisar — coste si es erróneo: `git blame` atribuye el fichero entero y los finales de línea quedan mezclados
