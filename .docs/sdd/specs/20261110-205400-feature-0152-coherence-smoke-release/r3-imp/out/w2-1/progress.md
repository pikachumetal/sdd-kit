# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: ya en worktree enlazado `wt`, rama feature/0010-cancel-reason; sin dependencias que instalar; `env:setup` hecho; baseline `node --test` en worktree detached: 4/4 verde. Método Native. Base check (ROADMAP y ficheros) contra develop: sin diferencias.

## Pre-flight scan

| Par / task | Qué produce frente a qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 | Comparten `src/app.js` y `test/cancel.test.js`. T1 deja `status: 'cancelled'` + el motivo en la reserva; T2 lo lee para `canceladas` | El motivo debe guardarse en la reserva (Approach); T2 no inventa otra fuente. El estado `bookings` es de módulo (en memoria): los tests de un mismo fichero comparten reservas; Norte lun solo se puede cancelar una vez por proceso |
| Task 1 (texto) | Verificación `node --test test/cancel.test.js` frente a los tests | El test existente `cancelar una reserva activa` espera `cancelada Norte lun` sin motivo: contradice la spec (sin `--motivo` → «motivo no válido…»); T1 lo actualiza como parte del delta |
| Task 1 (texto) | Ficheros del plan: `test/cancel.test.js`; el RED del dev-lead está en `test/rooms-half.test.js` (sin commitear) | PENDIENTE de decidir con el dev-lead: la Verificación no ejecuta ese fichero |
| Task 2 (texto) | `canceladas` frente a Norte lun cancelada en T1 | GIVEN requiere Norte lun cancelada con «sala ocupada» en el mismo proceso: el test debe cancelarla él mismo; excluir `voided` del listado |
| Plan vs spec | Spec «Decisiones» numera 1 y 3 (falta la 2) | Sin efecto en el código; anotado |
