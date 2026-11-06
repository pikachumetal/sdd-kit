---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | cff014c | |
| 2 | Listado de canceladas | done | 2dd2d7a | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 2dd2d7a
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, sin hallazgos previos abiertos; 1 Important y 1 Minor sobre este fichero, corregidos en el cierre

## Rulings

- Task 2: Ruling retirado en el cierre: el `--test-concurrency=1` que anotaba no se aplicó nunca (ni `gate.json` ni el plan lo llevan) y no hay carrera entre ficheros, porque `node --test` aísla cada fichero en su proceso. Lo que hay es un acoplamiento por orden dentro de `test/cancel.test.js`: el test de `canceladas` depende de que el primero haya cancelado Norte lun → fila de deuda
