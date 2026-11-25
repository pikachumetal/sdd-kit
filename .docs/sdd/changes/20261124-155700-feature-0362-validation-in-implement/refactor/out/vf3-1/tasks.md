---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b55c5dd | |
| 2 | Listado de canceladas | done | 4e3a595 | |
| 3 | Cancelada deja libre la sala | done | 8d2e6c8 | fallo del paso del guion de validación |


Revisión final: Spec opus+high, limpia (3 Minor diferidos) · Código sonnet+high, 4 Minor diferidos · Arquitectura no (plan), sobre 9afcab4

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: el commit ffcbc5c (`libres` con `!== 'voided'`) no tenía task ni test y rompía el paso del guion de la plan; la Task 3 lo revierte con su test — coste si es erróneo: ninguno en el código final, solo trazabilidad
