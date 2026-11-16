# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree enlazado (feature/0010-cancel-reason), sin dependencias, env:setup hecho. Baseline en worktree detached: `node --test` → 4/4 verde. Base (main) sin cambios desde el merge-base: sin frenos de alcance.

## Pre-flight scan

| Par / task | Qué produce vs qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 guarda el motivo en la reserva cancelada; T2 lo lee para `canceladas` | Coherente: T2 depende del campo que guarda T1 (mismo nombre, `reason`). |
| Task 1 (propia) | Test de cancelar sin motivo vs tests existentes de cancel.test.js | `cancelar una reserva activa` espera «cancelada Norte lun» sin motivo: contradice el THEN nuevo; T1 lo actualiza (está en sus Ficheros). `cancelar sin reserva` (Sur mar, sin motivo) espera «sin reserva Sur mar»: la spec no dice el orden entre motivo y reserva. |
| Task 2 (propia) | `canceladas` vs estado `voided` de `anular` | Solo lista `cancelled`; las anuladas (0011) no entran. Coherente con el No entra. |
| Plan ↔ test/rooms-half.test.js | El RED que escribe el dev-lead está fuera de los Ficheros del plan | La Verificación (`node --test test/cancel.test.js`) no lo ejecuta. |

Task 1: Ruling: motivo se valida después de comprobar que existe la reserva — mantiene «sin reserva Sur mar» sin tocar ese test y la spec solo define el motivo con la reserva dada — si es al revés, se invierte el orden y se ajusta ese test.
Task 1: Ruling: el RED del dev-lead vive en test/rooms-half.test.js y la Verificación solo corre test/cancel.test.js — su contenido pasa a test/cancel.test.js al commitear (Ficheros del plan) — si prefiere otro nombre, se amplía la Verificación.
