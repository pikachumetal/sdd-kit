---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 6d45faa | |
| 2 | Listado de canceladas | done | 777d17e | |
| 3 | Libres según el estado de la reserva | done | 4140b9c | fallo del guion de la validación |



Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no, juntada en el cierre
Pasada de fix: juntada en el cierre, 5 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia (2 Minor diferidos)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Ruling: canceladas sin canceladas sigue devolviendo vacío — añadir «sin canceladas» cambia la salida observable y la spec calla — si es erróneo, el CLI imprime una línea en blanco
