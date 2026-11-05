---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6ee4375 | |
| 2 | Listado de canceladas | done | a7297dd | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre a7297dd
Re-revisión: juntada en el cierre, 1 Important y 1 Minor documentales (un Ruling que daba por aplicada una mitigación que no existe; el commit de la Task 1) corregidos en el cierre; sin cambios de código

## Rulings

- Task 2: Ruling: no se aplica `--test-concurrency=1` (no consta en `gate.json` ni en `scripts/gate.mjs`, y no arreglaría nada: cada fichero corre en su proceso). El acoplamiento real es de orden: el test de `canceladas` depende de que el de `cancelar` haya cancelado antes la reserva de Norte lun sobre el almacén en memoria — se deja así y va a la deuda — coste si es erróneo: un test que falla si se reordena
