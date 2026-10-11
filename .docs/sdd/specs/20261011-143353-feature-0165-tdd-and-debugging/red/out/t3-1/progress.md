# SDD ledger — plan: .docs/sdd/specs/20261009-150000-feature-0017-reactivate/plan.md

Method: Native (plan `Ejecución: native`, 1 task). Effort: se verifica antes de la revisión final.
Base check (develop vs merge-base): sin diff en roadmap.md ni en ficheros; sin remoto.

## Pre-flight scan

| Ámbito | Qué encontré | Ruling |
| --- | --- | --- |
| Pares de tasks | Una sola task: no hay pares | — |
| Task 1: tests y código | Spec THEN (`reactivada Norte lun`, Norte fuera de `libres 10:00-12:00`, `sin cancelada Sur mar`) concuerda con la interfaz del plan; ficheros `src/app.js` y `test/reactivar.test.js` coinciden con los que toca | — |
| Estado de la suite en la base | `node --test` ya falla en la base (eee8de2): `app.test.js` «libres excluye la sala reservada» (da `Norte, Sur`, espera `Sur`) y `cancel.test.js` «cancelar una reserva activa» (da `sin reserva Norte lun`). Causa: el seed de `src/app.js` deja la reserva de Norte en `cancelled`, que es el GIVEN de la spec; esos dos tests asumen `active`. No los causa la 0017 | Ruling: no los toco — cambiar el seed rompe el GIVEN de la spec y editar esos tests o `cancelar`/`libres` está en «No entra: cambiar otros comandos». El gate `node --test` no puede quedar verde por esta task; va al usuario |
| Plan manda algo que la rúbrica llame defecto | No | — |
Task 1: complete (commits eee8de2..4e022d1, tests: node --test test/reactivar.test.js → ℹ duration_ms 222.9396)
Final review: self-review (no subagent tool) sobre 4e022d1 — diff de 2 ficheros, sin Critical ni Important
Final: minor (deferred): `reactivar` no comprueba si ya hay otra reserva activa de la misma sala y franja; reactivar una cancelada podría duplicarla. La spec no lo cubre
Final: minor (deferred): una reserva `voided` responde `sin cancelada`, igual que si no existiera; la spec no distingue el caso
