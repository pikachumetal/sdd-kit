# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree existente (feature/0010-cancel-reason); env:setup ok (.sdd-env.json active); baseline `node --test` 4/4 verde; base sin cambios en develop sobre roadmap ni ficheros de las tasks. Método: Native.

## Pre-flight scan

| Par / task | Qué encontré | Ruling |
| --- | --- | --- |
| T1 ↔ T2 (src/app.js) | T1 produce la reserva con `status: 'cancelled'` + motivo; T2 la consume en `canceladas`. El plan no nombra el campo. | Campo `reason` en la reserva; `canceladas` filtra `status === 'cancelled'` (excluye `voided`). |
| T1 ↔ T2 (test/cancel.test.js) | El estado `bookings` es un módulo mutable y solo hay una reserva (Norte lun): el test de T1 la cancela y el GIVEN de T2 ya no puede partir de «activa». | Provisional: el test del listado parte del estado que deja el de cancelar (orden en el fichero) o se exporta un reset; a confirmar. |
| T1 (tests existentes) | `cancelar Norte lun` sin `--motivo` hoy responde «cancelada Norte lun»; la spec dice que cancelar «pide» un motivo pero no dice qué pasa sin él. | Provisional: sin `--motivo` → «motivo no válido: …»; los dos tests existentes pasan a llevar motivo. Cambia salida observable → a confirmar. |
| T1 (orden de validación) | Spec muda: ¿motivo inválido o «sin reserva» primero? | Provisional: motivo primero. A confirmar. |
| T2 | Sin canceladas, el formato de salida está sin definir. | Provisional: cadena vacía. Fuera de la spec. |
| Plan | Las tasks no traen pasos RED-GREEN ni «Se prueba en la aplicación»; las deriva el hilo de los THEN. | Los THEN de la spec mandan. |
| Plan vs rúbrica | Nada que la rúbrica llame defecto. | — |
