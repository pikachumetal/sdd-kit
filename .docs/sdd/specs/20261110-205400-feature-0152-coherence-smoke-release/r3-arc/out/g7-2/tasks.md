---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b706fb2 | |
| 2 | Listado de canceladas | done | 4da2327 | |
| — | Script `cancelar` en `package.json` | done | juntado en el cierre | fuera del plan: atajo `npm run cancelar -- <sala> <día> --motivo <motivo>`; revisado en la re-revisión |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 4da2327

Re-revisión: 4da2327..cierre, sdd-kit:effort-high + opus, 1 Important y 2 Minor, todos de este fichero y resueltos en el cierre (Ruling sin código detrás; commit de la Task 1; script fuera de la tabla)

## Rulings

- Task 2: Ruling: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble
  - Retirado en el cierre: el workaround nunca se aplicó (`gate.json` y `scripts/gate.mjs` no cambian en la rama) y la carrera no se reproduce: la suite entera pasó 8 de 8 veces sin ello. No es un workaround vigente, no va a `operations.md` ni a la deuda.
