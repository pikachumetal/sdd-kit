---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 379407c | |
| 2 | Listado de canceladas | done | a1df28b | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre a1df28b
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 1 Important y 2 Minor adjudicados

## Rulings

- Task 2: Ruling (corregido en el cierre tras la re-revisión): el ruling original anotaba `--test-concurrency=1` en el gate, pero el gate (`gate.json`) no lo lleva ni hace falta: `node --test` ya aísla cada fichero en su proceso. Lo real es que `canceladas enseña sala, día y motivo` solo pasa si `cancelar con un motivo de la lista` corre antes sobre el almacén en memoria compartido de `test/cancel.test.js` — fila «Por triar» en `debt.md` — coste si está mal: reordenar o filtrar esos tests deja en rojo el de `canceladas`
- Final: Ruling: script `cancelar` de `package.json` fuera del plan, sin test por npm, y `npm run cancelar Norte lun --motivo x` sin `--` pierde el `--motivo` — no cambia la conducta de la spec; se usa `npm run cancelar -- <sala> <día> --motivo <motivo>` (ejecutado en el smoke) — coste si está mal: quien lo lance sin `--` ve «motivo no válido»
