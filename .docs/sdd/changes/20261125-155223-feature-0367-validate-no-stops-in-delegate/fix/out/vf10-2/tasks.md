---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 055fb6b | |
| 2 | Listado de canceladas | done | 1ebdf39 | |
| 3 | Libres según el estado de la reserva (vuelta de la validación: el guion falló) | done | 664b8b5 | |



Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre la última task
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (3/3 resueltos, sin roturas nuevas)

Nota: la Task 3 revierte c26092a, que dejaba ocupada la sala cancelada y rompía «Se prueba en la aplicación».

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos (resuelto en la pasada de fix) — coste si es erróneo: el test falla si corre solo o en otro orden
