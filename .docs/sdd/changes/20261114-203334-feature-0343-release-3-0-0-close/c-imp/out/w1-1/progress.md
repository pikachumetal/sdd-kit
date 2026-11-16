# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree enlazado `wt` en `feature/0010-cancel-reason` (base 7d8db2f); `env:setup` hecho (marcador `.sdd-env.json` active, sin trackear); baseline `node --test` en worktree desacoplado: 4/4 verde, retirado.
Spec aprobada (Laura, 2026-10-08), profile delegate, Ejecución native.

## Pre-flight scan

| Par / task | Qué produce vs qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (`src/app.js`, `test/cancel.test.js`) | T1 deja `cancelBooking` con motivo y la reserva `cancelled` con `reason`; T2 lista las `cancelled` y lee `reason` | Estado de módulo compartido (`bookings`): el test de T2 depende del orden si no monta su GIVEN. Ver Ruling A |
| Task 1 consigo misma | Spec: `cancelar` sin `--motivo` → «motivo no válido…»; el test existente `cancelar una reserva activa` espera `cancelada Norte lun` sin motivo | El test existente contradice la spec. Ver Ruling B |
| Task 1 consigo misma | `cancelar` sin reserva y sin motivo: la spec no dice cuál de los dos errores gana; el test existente espera `sin reserva Sur mar` | Ver Ruling C |
| Task 2 consigo misma | THEN `Norte lun — sala ocupada`; ficheros ya existen, ninguno se crea | Limpia |
| Plan ↔ Constitution | Texto de interfaz en castellano; gate `node --test` | Sin conflicto |
| Plan ↔ Scope | `anular` (voidBooking, estado `voided`) queda fuera: no entra en `canceladas` | Sin conflicto |

Task 0: Ruling A: el test de T2 monta su GIVEN cancelando Norte lun con «sala ocupada» y todos los tests del fichero usan ese mismo motivo — un orden distinto no cambia el resultado — si falla, el test de T2 sale rojo en vez de dar verde falso
Task 0: Ruling B: T1 actualiza el test existente `cancelar una reserva activa` para pasar `--motivo "sala ocupada"` y esperar `cancelada Norte lun (sala ocupada)` — la spec manda sobre el test viejo — coste si se equivoca: un test reescrito que debía conservarse
Task 0: Ruling C: la reserva se busca antes de validar el motivo; `sin reserva Sur mar` se conserva sin motivo — es el cambio mínimo sobre el comportamiento existente y la spec solo fija el error de motivo con reserva existente — coste si se equivoca: sin reserva y sin motivo debería decir «motivo no válido…»
