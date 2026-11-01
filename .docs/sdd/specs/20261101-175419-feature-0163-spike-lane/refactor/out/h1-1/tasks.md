# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | 4a860bd |
| 2 — Listado de canceladas | hecha | 768ee87 |

Revisión final: autorrevisión (sin herramienta de subagentes) · Spec sin hallazgos · Código sin hallazgos · Arquitectura no (plan), sobre 768ee87

## Rulings

- Pre-flight 1 — el test `cancelar una reserva activa` codifica el comportamiento viejo que la spec sustituye; se reescribe a la forma con --motivo. Coste si me equivoco: reescribir un test.
- Pre-flight 2 — se comprueba primero que exista la reserva y después el motivo, así `sin reserva Sur mar` no cambia. Coste si me equivoco: intercambiar dos líneas.

## Minors diferidos

- `canceladas` sin canceladas devuelve cadena vacía (la spec no fija el texto).
- El CLI no persiste estado entre procesos; la persistencia es la 0014 del roadmap.
