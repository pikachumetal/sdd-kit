---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | 0daeee9 | |
| 2 | Listado de canceladas | done | ce64b18 | |
| 3 | Libres tras cancelar | done | 8c172bc | fallo de la validación: 95a2304 |



Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre 37e92e7
Pasada de fix: b4bfc0e, 3 hallazgos Important cerrados con su test o por borrado de e2e (unit 8/8, e2e 5/5); el Minor del test de canceladas queda como ruling
Re-revisión: 37e92e7..b4bfc0e, sdd-kit:effort-high + opus, sin Critical ni Important; 1 Minor abierto

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: restauro `src/app.js` entero al de `95a2304^` en vez de editar solo la condición — el commit también cambió los finales de línea de 48 líneas y eso es ruido sin task — coste si es erróneo: se pierde algún cambio de `95a2304` que no fuera la condición (el diff `-w` muestra que solo era esa línea)
