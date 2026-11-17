---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6aa5e26 | |
| 2 | Listado de canceladas | done | 25b35b5 | |

Revisión final: Spec opus+high, con cambios (1 Important) · Código sonnet+high, aprobado (6 Minor) · Arquitectura no (plan), sobre f7a5cea
Pasada de fix: 0e74602, 1 hallazgo RED→GREEN
Re-revisión: f7a5cea..0e74602, sdd-kit:effort-high + opus, hallazgo resuelto, sin rotura nueva

## Rulings

- Task 2: Ruling: recuperación tras corte por cuota — informe task-2-report.md completo (DONE, 25b35b5); paso a su revisión sin redespachar el implementador — si el informe mintiera, la revisión lo exhibe
- Task 2: Ruling: 2 Minor del revisor sin arreglar — el test de `canceladas` depende del estado del test anterior y no cubre vacío/varias; el spec no lo exige — coste si me equivoco: test frágil al reordenar
- Task 2: Ruling: el informe decía 4/4 y la ejecución real da 3/3 — error de recuento, no de código; verificado con `node --test test/cancel.test.js` — coste: ninguno
- Final: Ruling: Eje Arquitectura no — decidido al despachar por no haber línea en el plan — coste si me equivoco: un hallazgo de fronteras sin revisar
- Final: minor (deferred): se perdió el test «cancelar sin reserva lo dice» (Task 1) y la rama `sin reserva` no tiene test con motivo válido
- Final: minor (deferred): el test de `canceladas` depende del estado del test anterior; sin caso de vacío ni de varias
- Final: minor (deferred): `canceladas` sin canceladas devuelve cadena vacía, sin mensaje
- Final: minor (deferred): `cancelar` sin `--motivo` es cambio incompatible del CLI; sin nota en docs
- Final: Ruling: declined «motivo obligatorio u opcional» — decisión de spec, la spec lo fija obligatorio — coste: ninguno
- Final: Ruling: declined «estado en memoria como arquitectura» — eje Arquitectura no sale, sin cambio de fronteras — coste: ninguno
- Final: minor (deferred): el test del motivo inválido usa Sur mar (sin reserva) y no el GIVEN Norte lun; no prueba que la reserva siga activa
- Final: Ruling: declined «persistencia entre invocaciones de la CLI» — el estado en memoria ya era así antes de la feature y la spec no pide almacenamiento — coste: `canceladas` en otro proceso sale vacío
- Final: Ruling: declined «--motivo antes de sala/día» y «capitalización del motivo» — la spec fija la sintaxis posicional y la lista cerrada literal — coste: ninguno
- Final: Ruling: no verificado «gate completo node --test» — lo corro yo en la validación de sdd-archive — coste: ninguno
- Final: minor (deferred): el test «cancelar sin motivo» usa Norte lun, ya cancelada por el primer test; depende del orden de validación y del estado compartido
