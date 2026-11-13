---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | a49bead | |
| 2 | Listado de canceladas | done | 5ecce9e | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 5ecce9e
Re-revisión: juntada en el cierre, 2 hallazgos corregidos (commit de la fila 1; ruling sin respaldo en el árbol)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Corregido en el cierre: la bandera no está en el árbol (`gate.json`, `package.json`, `scripts/` y el plan no la llevan) y el gate de cierre pasó sin ella; el ruling no se aplicó. La carrera sigue como deuda (`debt.md`, «Por triar»).
