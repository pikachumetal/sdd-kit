# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | (ver git log) |
| 2 — Listado de canceladas | hecha | (ver git log) |

## Rulings

- Task 2: el commit e2d48f1 salió con un SyntaxError (escape mal hecho al editar); lo arregla 69cf85b — coste: un commit intermedio en rojo.
- Task 1: se actualizó el test «cancelar sin reserva» para pasar un motivo válido; se valida el motivo antes que la reserva — coste: si se quería «sin reserva» primero, se invierte el orden.
- Task 2: el test de canceladas importa una instancia nueva del módulo — coste: ninguno en producción.

Revisión final: autorrevisión del hilo (sin herramienta de subagentes), sin hallazgos, sobre 69cf85b
