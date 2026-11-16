---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0fc3dea | |
| 2 | Listado de canceladas | done | 26eca93 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 26eca93
Re-revisión: 26eca93..406ff44, sdd-kit:effort-high + opus, con hallazgos solo de documentación (sin cambios en src/ ni test/): commit de la Task 1 corregido, ruling del gate aclarado, filas 0009 y 0016 del dev-lead sin tocar

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **Desmentido en el cierre**: `node --test` sin el flag da 5/5 en tres pasadas seguidas sobre 406ff44, así que el gate sigue siendo `node --test` (constitution §2); lo que queda es que `canceladas` depende de que antes corra el test de cancelar (deuda en el roadmap).
