# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 55b928b |
| 2 — Listado de canceladas | hecha | f6d4ef2, 5f06650 (fix) |

## Rulings

Task 1: Ruling: los 2 tests actuales de cancelar (sin --motivo) se actualizan a los THEN de la spec; 'sin reserva' pasa a comprobarse con motivo válido — la spec manda — si se equivoca, un test viejo cambia de sentido.
Task 1: Ruling: orden de validación: primero el motivo, luego la existencia de la reserva — la spec no lo fija y así «sin --motivo» siempre responde igual — si se equivoca, una sala inexistente sin motivo da «motivo no válido» en vez de «sin reserva».
Task 2: Ruling: el test de canceladas depende del estado que deja el primer test (módulo con estado, sin reset) — la spec define el GIVEN así y el estado es el del molde — si se equivoca, reordenar tests lo rompe.

Revisión final: self-review por el hilo (sin herramienta de subagentes), Spec: todos los THEN cubiertos, sin hallazgos · Código: sin Critical ni Important · Arquitectura no (plan), sobre 5f06650
Final: minor (deferred): `canceladas` sin ninguna cancelada responde una cadena vacía; la spec no dice qué mostrar.
