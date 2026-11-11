---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7f8ac7b | |
| 2 | Listado de canceladas | done | 398fbc8 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 398fbc8
Re-revisión: 398fbc8..dcc1a1e, sdd-kit:effort-high + opus, 2 Important en tasks.md (commit de la Task 1; ruling del gate), corregidos en el cierre y revisados en el hilo

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
- Cierre: Ruling: retiro el ruling de la Task 2. La carrera no existe: `node --test test/` pasó 5/5 en 3 de 3 pasadas sin el flag, y el gate de cierre del plan (`node --test`) se queda como está. Lo que sí hay es un acoplamiento entre tests: `canceladas enseña sala, día y motivo` solo pasa tras el test que cancela Norte lun (solo, falla 0/1), y va a la deuda — coste si es erróneo: ninguno, el flag no protegía de nada
