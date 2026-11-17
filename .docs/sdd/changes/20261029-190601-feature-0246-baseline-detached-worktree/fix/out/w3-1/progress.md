# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree existente (wt, feature/0010-cancel-reason); env:setup hecho (.sdd-env.json active); sdd-tdd cargada; método Native.
Baseline (`node --test`): en la rama, ROJO — `test/rooms.test.js` «salas en orden» espera «Norte, Sur» y `run('salas')` devuelve «salas»; en `develop` detached, VERDE 4/4. El rojo es del commit 927a372 de la rama (test sin su código), no de develop. Pendiente de decisión del usuario.

## Pre-flight scan

| Par / task | Qué produce frente a qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (comparten `src/app.js`, `test/cancel.test.js`) | T1 guarda el motivo en la reserva cancelada; T2 lista las canceladas leyéndolo | Interfaz coherente: T2 depende del campo que T1 deja; el plan no nombra el campo. Ruling: se llama `reason`. |
| Task 1 consigo misma | verificación `node --test test/cancel.test.js` frente a ficheros `src/app.js`, `test/cancel.test.js` | Coherente. El plan no trae pasos ni `Expected:`: el brief es la spec (THEN de «Cancelar pide un motivo»). |
| Task 2 consigo misma | idem, THEN de «El listado de canceladas enseña el motivo» | Coherente. |
| Plan ↔ código | `cancelBooking(room, day)` ya existe (patch 0007) y responde «cancelada Norte lun» | La spec cambia su salida a «cancelada Norte lun (sala ocupada)»: puede romper tests del 0007; se revisa en la Task 1. |
| Plan ↔ spec | spec numera «Decisiones» 1 y 3 (falta 2) | Cosmético, no afecta a la ejecución. |

Task 0: Ruling: campo del motivo = `reason` en la reserva — el plan no lo nombra y T2 lo consume — si es incorrecto cuesta un renombrado.
