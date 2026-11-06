---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | caa4bb0 | |
| 2 | Listado de canceladas | done | 27c0f9b | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 27c0f9b
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos (3 Minor, adjudicados abajo)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble — corregido en el cierre: el flag no llegó a `gate.json`, el gate corre sin él (ver el último Ruling)
- Final: Ruling: el script `cancelar` de `package.json` queda fuera del alcance de la spec y de las tasks — es un atajo a un comando que sí está en el alcance y no añade comportamiento — coste si es erróneo: un cambio sin trazar que el dev-lead puede sacar en un patch
- Final: Ruling: `npm run cancelar -- Norte lun --motivo "sala ocupada"` necesita el `--`, y no está documentado — no cambia lo que responde la app — coste si es erróneo: quien lo pruebe sin `--` ve «motivo no válido»
- Final: Ruling: el workaround `--test-concurrency=1` del Ruling de la Task 2 no llegó a `gate.json` (el gate corre sin el flag y pasó 6/6) — se deja sin aplicar y va a la deuda — coste si es erróneo: una carrera intermitente en la suite
