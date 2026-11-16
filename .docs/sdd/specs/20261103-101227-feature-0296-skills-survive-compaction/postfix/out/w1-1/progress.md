# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree ya aislado (wt, rama feature/0010-cancel-reason). env:setup ejecutado (.sdd-env.json sin trackear: NO commitear). Baseline `node --test` en worktree desacoplado: 4/4 verdes. Método: Native (plan `Ejecución: native`, sdd-kit.json execution: native). Perfil: delegate.
Nota: el plan no trae pasos con `Expected:` ni «Se prueba en la aplicación»; las tasks solo traen Superficies/Verificación/Ficheros. La spec manda.

## Pre-flight scan

| Fila | Qué se comprobó | Hallazgo | Ruling |
| --- | --- | --- | --- |
| T1↔T2 | comparten `src/app.js` y `test/cancel.test.js`; T1 produce el motivo guardado en la reserva cancelada, T2 lo consume en `canceladas` | interfaz coherente: `status:'cancelled'` + campo del motivo; T2 depende de T1 | T1 guarda `reason` en la reserva; T2 lo lee |
| T1 consigo | tests que pide vs código | el test existente «cancelar una reserva activa» (`cancelar Norte lun` sin motivo → «cancelada Norte lun») contradice la spec (sin `--motivo` → «motivo no válido…») | Ruling: ese test se reescribe en T1 con `--motivo` (la spec manda; costaría: nada si la spec es correcta) |
| T1 consigo | «cancelar sin reserva lo dice» (`Sur mar`, sin motivo) vs AND «sin --motivo responde motivo no válido» | la spec solo define los THEN con reserva existente | Ruling: se comprueba primero la reserva, luego el motivo; el test existente queda intacto y la salida sin reserva no cambia — si está mal: `cancelar Sur mar` sin motivo diría «sin reserva» en vez de «motivo no válido» |
| T1 consigo | estado compartido: `bookings` es de módulo y cancel.test.js corre en un proceso | cancelar con éxito muta Norte lun; los tests de motivo inválido/ausente necesitan la reserva aún activa, y T2 la necesita cancelada con «sala ocupada» | Ruling: sin añadir reset (YAGNI); los tests de motivo inválido y ausente van antes del de éxito, y el de T2 depende de la cancelación de T1 con «sala ocupada». Si el orden molesta: dato para la revisión |
| T2 consigo | `canceladas` sin canceladas / formato multi-línea | la spec solo define una cancelada: «Norte lun — sala ocupada» | Pendiente de ruling en T2 (salida vacía: cadena vacía, no se inventa texto); anuladas (`voided`) no entran |
| spec | numeración de «Decisiones» salta del 1 al 3 | cosmético | sin acción; no toca spec |
| plan | Restricciones globales: solo «texto en castellano» | sin artículo de calidad de código; usar el decalogo | sin acción |

Pre-flight: sin contradicción que bloquee.
