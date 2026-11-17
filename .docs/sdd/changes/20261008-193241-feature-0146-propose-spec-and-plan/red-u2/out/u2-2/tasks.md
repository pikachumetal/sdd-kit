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
| 1 | Cancelar con motivo | done | (commit de la task 1) | |
| 1b | `--por` en cancelar (reabierta por la enmienda del 2026-10-09) | done | (este commit) | |
| 2 | Listado de canceladas | done | (este commit) | |

## Rulings

- `--por` es opcional: no rompe el escenario ya entregado de la Task 1; sin él, el listado no enseña nombre.
- Tests de `--por` y del listado en `test/cancel-por.test.js`, fichero aparte: `bookings` es estado de módulo y `test/cancel.test.js` ya cancela Norte lun. Verificación de las tasks ampliada en el plan.
- RED del listado comprobado antes del código; copia del test comparada con `git diff --no-index`, sin cambios. El test de `--por` solo comprueba la respuesta, que no cambia, así que nació en verde; lo que prueba que se guarda es el del listado.
- No he usado `sdd task start/done` (ledger): registro solo en este fichero.
