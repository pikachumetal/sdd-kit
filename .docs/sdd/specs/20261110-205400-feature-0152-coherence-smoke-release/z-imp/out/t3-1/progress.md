# SDD ledger — plan: .docs/sdd/specs/20261009-150000-feature-0017-reactivate/plan.md

Pre-flight scan:
| Task | Pares (fichero/interfaz compartida) | Coherencia propia | Hallazgo |
| --- | --- | --- | --- |
| 1 | única task; sin pares | tests de `test/reactivar.test.js` y código de `src/app.js` coinciden con la spec (THEN + AND) | limpio |

Setup: Ruling: trabajo en el checkout actual (rama feature/0017-reactivate, no main) sin crear otro worktree — el dev-lead pidió empezar aquí — coste si me equivoco: ninguno, la rama está aislada de main/develop.
Setup: Ruling: baseline rojo (2 tests: app.test.js «libres excluye…», cancel.test.js «cancelar una reserva activa») que falla igual en develop (la semilla de bookings deja Norte cancelada); no es de la rama; sigo — coste si me equivoco: el gate de cierre `node --test` seguirá rojo por esos 2 hasta que se arreglen en otra feature; se anota en la deuda.
Setup: Ruling: sin Review Focus ni «Verificación visual»; base check limpio (ROADMAP y ficheros sin cambios en develop) — coste: ninguno.
Task 1: complete (commits 0f4a594..d0631d7, tests: node --test test/reactivar.test.js → ℹ duration_ms 85.7512)
Final: Final review: self-review (no subagent tool) — ejes Spec y Código pasados por mí sobre d0631d7; sin revisor de contexto fresco
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (una función en src/app.js, sin módulo, dependencia, contrato ni datos nuevos) → no sale
Final: Spec: el ADDED y su AND están en src/app.js y en test/reactivar.test.js; sin hallazgos
Final: Código: sin hallazgos; sin comentarios en el diff
Final: Ruling: declined to judge (Spec) — reactivar con una activa ya en la misma sala/día/franja dejaría dos activas — hoy `reservar` no crea reservas en app.js, es inalcanzable; la spec no lo pide y «No entra: cambiar otros comandos» — coste si me equivoco: doble reserva cuando `reservar` cree reservas reales
Final: Ruling: declined to judge (Código) — `libres` compara solo sala y franja, no el día — es el comportamiento previo de otra capacidad, fuera de la spec — coste si me equivoco: reactivar un día bloquea la sala en esa franja cualquier día
Final: Ruling: la suite `node --test` queda con 2 rojos previos (app.test.js «libres excluye…», cancel.test.js «cancelar una reserva activa»), idénticos a los del baseline en develop — no se tocan, «No entra: cambiar otros comandos» — coste si me equivoco: el gate de cierre no queda en verde por esta feature
