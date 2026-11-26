---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | d5c5acc | |
| 2 | Listado de canceladas | done | 8df9ac0 | |
| 3 | Fix de validación: libres tras cancelar | done | ab883aa | El paso «Se prueba en la aplicación» daba «Sur» en vez de «Norte, Sur»: `1e27a06` cambió `active` por `!== 'voided'` |



Revisión final: Spec opus+high, con arreglos (1 Important, 4 Minor) · Código sonnet+high, con arreglos (3 Important, 4 Minor) · Arquitectura no (plan), sobre 740e5de
Pasada de fix: 754f709, 3 hallazgos Important cerrados (sin --motivo, sin reserva con motivo válido, 2 e2e fuera de flujos core retirados); mutación en rojo antes, suite 8/8 y e2e 5/5

Re-revisión: 740e5de..754f709, sdd-kit:effort-high + opus, limpia (3 de 3 Important resueltos, sin hallazgos nuevos)

Minors aplazados (review.minors no es fix):
- minor (deferred): src/app.js pasó de CRLF a LF en 1e27a06 (diff de 83 líneas para ~15 reales)
- minor (deferred): el test de canceladas depende del primer test del fichero (ruling de la Task 2)
- minor (deferred): canceladas sin canceladas imprime una línea en blanco
- minor (deferred): la regla status === 'active' está escrita en freeRooms y en findBooking

## Rulings

- Task 2: Ruling: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden
- Task 3: Ruling: el test de regresión va en un fichero propio (test/free-after-cancel.test.js) para tener estado fresco de la app — coste si es erróneo: un fichero de test más
- Final: Ruling: los dos e2e retirados (motivo inválido, canceladas) los cubre test/cancel.test.js, que es donde la spec pide probarlos — coste si es erróneo: menos cobertura E2E de la feature, que no es flujo core
- Final: Ruling: spec con ADDED que debería ser MODIFIED y numeración 1→3 de las decisiones — no se toca la spec aprobada — coste si es erróneo: delta impreciso en capabilities
