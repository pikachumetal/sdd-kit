# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

## Pre-flight
| Filas | Produce / consume | Hallado |
| --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 guarda el motivo en la reserva; T2 lo lee | Sin contradicción; comparten estado de módulo en los tests: el orden importa |
| Task 1 (coherencia) | test existente «cancelar una reserva activa» sin motivo contra el AND «sin --motivo» | Choca: manda la spec, ver ruling |
| Task 2 (coherencia) | THEN con una cancelada; la spec no fija `canceladas` sin canceladas | Freno de salida observable, ver Task 2 |
Task 0: Ruling: trabajo en la rama feature/0010-cancel-reason sin worktree aparte — el dev-lead está ausente, la rama está limpia y no es main — si se equivoca: mover la rama a un worktree, sin coste de código
Task 1: Ruling: el test «cancelar una reserva activa» (sin motivo) se sustituye por los escenarios de la spec — el AND «sin --motivo» lo contradice y la spec manda — si se equivoca: restaurar un test
Task 1: Ruling: sin reserva activa responde «sin reserva <sala> <día>» aunque falte el motivo o no sea válido — la spec da el rechazo con la reserva presente (GIVEN) y calla en este caso, así la salida sigue como hoy y el test «cancelar sin reserva lo dice» no cambia — si se equivoca: invertir dos comprobaciones
Task 1: complete (commits cc5949c..bdf785f, tests: node --test test/cancel.test.js → ℹ duration_ms 88.2918)
Task 2: base comprobada, sin cambios en develop; no iniciada: freno de salida observable — la spec no fija qué responde `canceladas` sin canceladas; pregunta al dev-lead
