---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 399d4aa | La fila citaba c7d8a85 (la task 2); corregido en el cierre |
| 2 | Listado de canceladas | done | c7d8a85 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre c7d8a85
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos de registro (commit de la task 1 y Ruling), corregidos en el cierre

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No aplicado**: `gate.json` sigue con `node --test <ficheros>` sin la opción (comprobado en el cierre); el workaround queda como deuda, no como decisión en vigor.
