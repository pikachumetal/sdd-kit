# SDD ledger — plan: .docs/sdd/specs/20261009-150000-feature-0017-reactivate/plan.md
Pre-flight: plan de 1 task, sin pares de tasks que compartan fichero; texto de la task coherente consigo mismo (tests y src/app.js).
Task 1: Ruling: el baseline ya tenía 2 tests en rojo (cancel.test.js «cancelar una reserva activa», app.test.js «libres excluye la sala reservada») porque la semilla de bookings es una reserva cancelada — ajeno a la 0017, no se toca — si falla, el gate node --test no estará verde al cierre
Task 1: complete (commits ea94158..fb12790, tests: node --test test/reactivar.test.js → ℹ duration_ms 81.1302)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (sin módulo, dependencia, contrato ni datos nuevos) → no sale
Final: Revisión final: self-review (no subagent tool) sobre fb12790 — Spec: THEN y AND cubiertos por test/reactivar.test.js; Código: sin comentarios, texto en castellano, sin hallazgos
Final: Ruling: la reserva semilla de bookings está cancelada y el gate node --test sigue con 2 rojos previos a la 0017 — no se arreglan aquí (fuera del Scope «No entra: cambiar otros comandos») — el cierre no tendrá el gate en verde hasta que se resuelva
