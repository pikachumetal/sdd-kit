---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 2c5fb27 | |
| 2 | Listado de canceladas | done | 7ab4723 | |

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 7ab4723
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN
Re-revisión: 7ab4723..juntada en el cierre, sdd-kit:effort-high + opus, 1 Important (el trim sin test) arreglado con su test, 2 Minor con ruling

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Final: Ruling: el fix del trim reescribió `src/app.js` de CRLF a LF entero, ocultando una línea real en 48+/48- — se queda así: un commit nuevo para devolver el CRLF reescribiría la historia ya revisada, y el contenido es el mismo — coste si está mal: `git blame` de `src/app.js` apunta a un solo commit; la fila de deuda de los finales de línea lo recoge
- Final: Ruling: la spec y la capacidad `bookings` no dicen que el motivo se recorta de espacios — no se enmienda en el cierre porque no cambia ningún THEN (tras recortar solo pasan los tres valores de la lista) — coste si está mal: la capacidad no describe que `"  otro  "` se acepta; el test la fija y va a ✋
