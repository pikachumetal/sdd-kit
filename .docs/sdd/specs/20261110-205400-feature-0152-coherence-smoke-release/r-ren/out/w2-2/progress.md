# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: workspace propio ya en la rama feature/0010-cancel-reason (worktree aislado, sin environments.md → sin env:setup). Spec aprobada (Laura, 2026-10-08), perfil delegate, Native. Baseline: `node --test test/app.test.js test/cancel.test.js` → 4/4 verde (se excluye test/rooms-half.test.js, RED en curso del dev-lead, sintácticamente incompleto).

## Pre-flight scan

| Pareja / task | Qué produce / consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 produce `cancelBooking` con `--motivo` y deja `status: 'cancelled'` + `reason` en la reserva; T2 consume reservas canceladas y su `reason` para `canceladas` | Coherente si T1 guarda `reason` en la reserva (Approach de la spec). Mismo fichero: T2 añade, no reescribe |
| Task 1 (texto contra sí misma) | Verificación = cancel.test.js; el test existente `cancelar una reserva activa` espera `cancelada Norte lun` SIN motivo | Contradice la spec (sin `--motivo` → «motivo no válido…»). Ruling R1 |
| Task 1 (orden de comprobaciones) | La spec no dice qué gana entre «sin reserva» y «motivo no válido» | Ruling R2 |
| Task 1 ↔ RED del dev-lead | El RED vive en `test/rooms-half.test.js`; el plan y «Dónde se prueba» dicen `test/cancel.test.js`; el fichero está cortado en el 2º test (no parsea) | Sin ruling: lo decide el dev-lead (ver informe) |
| Task 2 (texto contra sí misma) | `canceladas` → «Norte lun — sala ocupada»; formato de varias filas no especificado | Ruling R3: una línea por reserva, unidas por salto de línea |

Rulings previstos (se ledgerean al ejecutar la task):
- R1 (Task 1): actualizar `cancelar una reserva activa` para pasar `--motivo`; el comportamiento sin motivo lo cubre el test nuevo. Coste si falla: un test viejo reescrito en vez de borrado.
- R2 (Task 1): comprobar primero la reserva y luego el motivo, para que `sin reserva Sur mar` (test existente, spec silenciosa) siga igual. Coste si falla: una sala sin reserva y sin motivo responde «sin reserva» en vez de «motivo no válido».
- R3 (Task 2): sin canceladas, `canceladas` responde cadena vacía (como `libres`).
