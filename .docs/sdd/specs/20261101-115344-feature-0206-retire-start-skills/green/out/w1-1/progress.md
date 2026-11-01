# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree wt on feature/0010-cancel-reason (ya aislado, no creado); env:setup ejecutado (.sdd-env.json active); baseline en worktree detached e33d1f1: `node --test` → 4/4 pass; baseline retirado, env:clean ejecutado. Método: Native (plan `Ejecución: native`, sdd-kit.json `execution: native`). Perfil: delegate. sdd-tdd cargada; decálogo de calidad leído.

## Pre-flight scan

| # | Filas | Qué produce / consume | Hallazgo | Ruling |
| --- | --- | --- | --- | --- |
| P1 | Task 1 ↔ Task 2 (`src/app.js`) | T1 cambia `cancelBooking`/`run('cancelar')` y guarda el motivo en la reserva; T2 añade `canceladas` y lee ese motivo + `status: 'cancelled'` | Interfaz compatible, pero el plan no nombra el campo: T1 lo fija (`reason`) y T2 lo lee. `voided` (anular, 0011) no debe aparecer en `canceladas` | Ruling: campo `reason` en la reserva; `canceladas` filtra solo `status === 'cancelled'` — spec «Approach» y «No entra» — coste si falla: un renombrado |
| P2 | Task 1 ↔ Task 2 (`test/cancel.test.js`) | `bookings` es estado de módulo: el THEN de T1 y el GIVEN de T2 usan la misma reserva (Norte lun) | Tras cancelar en T1, Norte lun ya no está activa; un test de T2 que cancele otra vez recibe «sin reserva». T2 depende del estado que deja el test de T1 | Ruling: el test de `canceladas` se escribe después del de cancelar con motivo en el mismo fichero y depende de su orden (node:test es secuencial dentro del fichero); sin hook de reset en producción — coste si falla: test frágil si se reordena |
| P3 | Task 1 (`test/cancel.test.js`) | Los 2 tests existentes esperan `cancelada Norte lun` sin motivo | Contradicen el THEN de la spec (sin `--motivo` → «motivo no válido…») | Ruling: la spec manda; el test «cancelar una reserva activa» se reescribe al THEN con motivo (es el RED de la task) y «sin reserva» pasa a llevar un motivo válido — coste si falla: el reviewer ve un test existente modificado, documentado aquí |
| P4 | Task 1 | Orden de validación (motivo vs. reserva inexistente) no fijado | Spec y plan callan | Ruling: se valida primero el motivo, luego la reserva — coste si falla: un mensaje distinto en un caso que la spec no cubre |
| P5 | Task 1 consistencia interna | «Ficheros» (`src/app.js`, `test/cancel.test.js`) concuerda con lo que construye | Sin pasos ni líneas `Expected:` en las tasks: la fuente de los RED son los THEN de la spec; sin «Crear/Modificar» (el cruce con la base usa «Ficheros») | sin conflicto |
| P6 | Task 2 consistencia interna | idem | idem; «Review Focus: ninguna: comprobado» → ningún RED extra por Review Focus | sin conflicto |
| P7 | Plan ↔ Restricciones | «De código»: texto de la interfaz en castellano; constitution art. 4 coincide | Mensajes de la spec ya en castellano | sin conflicto |
| P8 | Plan ↔ revisión | Nada mandado por el plan que el rubric trate como defecto | — | sin conflicto |

Notas sin ruling: la spec numera sus decisiones 1 y 3 (falta la 2); el plan solo lista la 1. Errata editorial, no cambia el contrato.

Ruling: efecto del entorno — `.sdd-env.json` queda sin trackear y sin ignorar; los commits usan `git add` de rutas explícitas y nunca lo incluyen — coste si falla: un fichero de entorno en el historial
Ruling: effort — esta sesión no tiene herramienta de subagentes ni los tipos `sdd-kit:effort-*`: las axes de la revisión final de `sdd-verify` heredarían el esfuerzo de la sesión («effort: no disponible en este harness, hereda el de la sesión») — coste si falla: revisión final con esfuerzo distinto del previsto
