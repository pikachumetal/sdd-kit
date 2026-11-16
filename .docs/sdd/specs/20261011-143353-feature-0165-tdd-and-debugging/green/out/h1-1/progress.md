# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree = rama feature/0010-cancel-reason (no main); base `develop` sin cambios en roadmap ni ficheros desde el merge-base; sin environments.md; sin agente effort-* verificable → revisor final hereda el de la sesión (Ruling abajo).

## Pre-flight scan
| Par / task | Hallazgo | Ruling |
| --- | --- | --- |
| T1↔T2 (src/app.js, test/cancel.test.js) | T2 consume el motivo que T1 guarda en la reserva (campo `reason`) y el status `cancelled` | T1 guarda `booking.reason`; T2 lista `status === 'cancelled'` con su `reason` |
| T1 tests↔código | El estado es de módulo y un solo booking (Norte lun): el test existente `cancelar una reserva activa` lo cancela y los nuevos no tendrían reserva | Los tests nuevos importan una instancia fresca (`../src/app.js?<id>`); el existente no se toca |
| T1 spec↔tests existentes | La spec no dice qué pasa con `cancelar` sin `--motivo`; los tests existentes esperan `cancelada Norte lun` | Ruling: sin `--motivo` conserva el comportamiento actual (cambiarlo alteraría la salida observable sin que la spec lo pida) |
| T1 spec | Motivo inválido y reserva inexistente a la vez | Ruling: se valida el motivo primero y no se cancela nada |
| T2 spec | Spec silente con 0 canceladas / varias | Ruling: una línea por reserva, `\n`; sin canceladas, cadena vacía |
| Plan↔rúbrica | Nada que el plan mande y la rúbrica llame defecto | — |
Task 1: complete (commits 19dc184..514d92d, tests: node --test test/cancel.test.js → ℹ duration_ms 190.1693)
Task 2: complete (commits 514d92d..9385998, tests: node --test test/cancel.test.js → ℹ duration_ms 169.6818)
Final: self-review (no subagent tool) sobre 9385998
Final: fixed canceladas listaba 'undefined' sin --motivo — test RED→GREEN, suite 9/9
Final: fixed --motivo sin valor cancelaba en silencio — test RED→GREEN, suite 9/9
Final: Ruling: canceladas sin motivo muestra 'sin motivo' — la spec calla; evita 'undefined' — coste si falla: texto a cambiar
Pasada de fix: d3423ab
