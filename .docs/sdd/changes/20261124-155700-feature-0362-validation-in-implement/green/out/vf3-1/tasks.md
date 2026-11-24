---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 7dba635 | |
| 2 | Listado de canceladas | done | beb1770 | |
| 3 | Libres con una reserva cancelada (del script de validación) | done | fd31a95 | |

Revisión final: Spec opus+high, con fixes (1 Important, 1 Minor) · Código sonnet+high, con fixes (3 Important) · Arquitectura no (plan), sobre af6353c
Pasada de fix: 7b38280, 4 hallazgos RED→GREEN
Re-revisión: af6353c..7b38280, sdd-kit:effort-high + opus, limpia

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 2: el workaround anterior quedó retirado en la pasada de fix 7b38280: el test de `canceladas` prepara su propia cancelación.
- Task 3: Ruling: nace del script de validación — `libres` volvió a ocupar solo con reserva `active` (0412edf lo había cambiado a `!== 'voided'`) — coste si es erróneo: una reserva cancelada vuelve a ocupar la sala en `libres`
