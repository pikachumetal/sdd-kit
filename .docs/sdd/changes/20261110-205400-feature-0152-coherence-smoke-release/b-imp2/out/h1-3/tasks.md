# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | hecha | ba2327d |
| 2 — Listado de canceladas | hecha | 202d6fc |

Revisión final: autorrevisión del hilo (sin herramienta de subagentes), sobre c369c42
Pasada de fix: c369c42, 1 hallazgo (CRLF) sin test, suite 7/7

## Rulings

Task 1: Ruling: el test existente «cancelar una reserva activa» (sin --motivo) contradice el AND «sin --motivo responde motivo no válido» de la spec — se actualiza para usar --motivo; la spec manda — si me equivoco, se pierde la cobertura del caso sin motivo (queda cubierto por el nuevo test).
Task 1: Ruling: trabajo en la propia rama feature/0010-cancel-reason sin worktree extra — rama limpia, no es main; baseline `node --test` 4/4 verde en worktree desacoplado — coste: ninguno.
Task 2: Ruling: el test de `canceladas` depende del estado del módulo (la reserva la cancela el test 1) — no hay reinicio de estado en app.js y la spec no pide uno — si el orden de los tests cambia, falla; comentado en el test.
Final: Ruling: autorrevisión en vez de ejes con subagentes — el harness no expone herramienta de subagentes — coste: sin contextos frescos, puede haber puntos ciegos del autor
