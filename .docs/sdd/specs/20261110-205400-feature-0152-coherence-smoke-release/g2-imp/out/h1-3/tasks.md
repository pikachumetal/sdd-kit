# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | hecha | cc27dfd |
| Task 2 — Listado de canceladas | hecha | d4d78c2 |

Revisión final: self-review (sin herramienta de subagentes); sin Critical ni Important.

## Rulings
Task 0: Ruling: el test existente 'cancelar una reserva activa' (sin motivo) contradice el nuevo THEN de la spec — se actualiza a pasar motivo; validar motivo antes de buscar reserva — la spec dice que sin --motivo responde «motivo no válido» — coste si falla: orden de mensajes distinto en el caso sin reserva y sin motivo
Final: minor (deferred): `canceladas` sin canceladas imprime línea vacía — la spec no dice nada
Final: minor (deferred): el test de `canceladas` depende del estado compartido que deja el primer test (su `cancelar` devuelve «sin reserva»)
