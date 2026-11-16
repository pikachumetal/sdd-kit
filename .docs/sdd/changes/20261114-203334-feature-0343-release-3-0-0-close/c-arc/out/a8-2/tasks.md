---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 095f1c3 | |
| 2 | Listado de canceladas | done | f4433af | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre f4433af
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN
Re-revisión: f4433af..juntada en el cierre, sdd-kit:effort-high + opus, 1 Important arreglado (el recorte del motivo sin test), 2 Minor (1 ruling, 1 diferido)

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Ruling: el recorte del motivo (`trim`) se queda sin enmienda a la spec — acepta `--motivo " sala ocupada "` por la CLI, y `cancelBooking` exportada sigue exigiendo el literal — coste si está mal: la CLI y la función se comportan distinto con ese motivo; el dev-lead lo confirma o lo enmienda
- Final: minor (deferred): `src/app.js` pasó de CRLF a LF entera con el commit del recorte; fila en la deuda
