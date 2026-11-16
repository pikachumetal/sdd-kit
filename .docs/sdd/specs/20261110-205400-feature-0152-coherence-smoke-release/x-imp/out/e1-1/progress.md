# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Base check (Task 1): develop sin cambios desde 824390e; sin remoto. Baseline `node --test` en worktree separado → 4/4 pass.

## Pre-flight scan

| Filas | Qué produce / consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 | T1 guarda `booking.reason` en `src/app.js`; T2 lo lee para `canceladas`. Ambas tocan `test/cancel.test.js` | Coherentes; comparten ficheros → no se solapan en paralelo |
| Task 1 | Verificación `node --test test/cancel.test.js` cubre sus ficheros | Coherente. El código en curso ya cubre el AND «sin --motivo», pero ningún test lo codifica |
| Task 2 | Verificación igual; ficheros iguales | Coherente |

Task 1: Ruling: añado el test «cancelar sin motivo» (AND 3 de «Cancelar pide un motivo de la lista») — la regla es un test por THEN/AND y faltaba — coste si es erróneo: un test de más.
Task 1: Ruling: los tests sustituyen a los dos de `cancel.test.js` de HEAD («cancelar una reserva activa», «cancelar sin reserva lo dice») — la spec obliga a `--motivo`, así que la salida sin motivo cambia; el caso «sin reserva» se conserva con `--motivo otro` (regresión, no es un THEN) — coste si es erróneo: un test de más.
Task 1: RED comprobado en worktree separado sobre HEAD: 3/3 fail (copia en .temp/sdd/plan/red/cancel.test.js).
Task 1: Ruling: no edito ni commiteo `src/app.js`/`test/cancel.test.js` mientras corre la verificación lenta lanzada fuera de esta sesión, y la Task 2 espera porque comparte ficheros — coste si es erróneo: ~10 min de espera.
