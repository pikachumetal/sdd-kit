# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree enlazado ya existente (feature/0010-cancel-reason); env:setup corrido (.sdd-env.json active); línea base `node --test` en worktree detached → 4/4 pass, retirado.
Método: Native (Ejecución: native; execution: native en sdd-kit.json). Perfil: delegate.

## Pre-flight scan

| Par / task | Qué produce vs qué consume / coherencia propia | Hallazgo | Ruling |
| --- | --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 guarda el motivo en la reserva cancelada; T2 lista las de estado cancelled y lee ese motivo | El campo no lo nombra el plan | Ruling: el campo es `reason` en la reserva, lo fija T1 y T2 lo lee — nombre interno, no cambia salida observable — coste si falla: renombrar |
| Task 1 ↔ Task 2 (estado de test) | `bookings` es estado de módulo compartido entre tests; el test de T1 cancela Norte lun y el GIVEN de T2 es esa misma reserva cancelada | Test de T2 depende del orden/estado de T1; no se puede cancelar dos veces | Ruling (aplica en T2): el test de T2 no cancela otra vez; lee el estado dejado por el test de T1 en el mismo fichero, y un test de listado vacío no se escribe — coste: acoplo de orden entre tests, aceptado en un fichero |
| Task 1 (texto propio) | El test existente «cancelar una reserva activa» espera «cancelada Norte lun» sin motivo; la spec dice que sin --motivo responde «motivo no válido: …» | Contradicción test viejo ↔ THEN/AND de la spec | Ruling: el test viejo se actualiza a la spec (con --motivo "sala ocupada"); la spec manda — coste: ninguno, el fichero está en la task |
| Task 1 (texto propio) | El test existente «cancelar sin reserva lo dice» llama sin motivo y espera «sin reserva Sur mar»; la spec no ordena motivo vs reserva inexistente | Orden de validación no dicho | Ruling: primero se busca la reserva, luego se valida el motivo; la AND «sin --motivo» se lee con el GIVEN de una reserva existente — mantiene verde ese test sin tocar su salida — coste si falla: cambiar el orden y reescribir ese test |
| Task 2 (texto propio) | Verificación `node --test test/cancel.test.js` cubre solo su fichero | Coherente con «Dónde se prueba» | sin hallazgos |
| Plan global | Plan sin pasos Expected; restricciones: castellano — T1/T2 lo cumplen; Review Focus: ninguno | La spec numera sus decisiones 1 y 3 (falta la 2): erratas en spec, no cambia contrato | Ruling: no se toca la spec aprobada; se avisa en el informe — coste: ninguno |
