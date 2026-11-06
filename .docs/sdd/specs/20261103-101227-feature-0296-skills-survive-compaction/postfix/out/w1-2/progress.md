# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree ya enlazado (feature/0010-cancel-reason); env:setup ok (.sdd-env.json active); baseline `node --test` en worktree desacoplado → 4/4 verde, retirado.
Spec 0010 aprobada (Laura, 2026-10-08); método Native (plan + sdd-kit.json); perfil delegate.

## Pre-flight scan

| Fila | Qué se comprueba | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 | comparten `src/app.js` y `test/cancel.test.js`; T1 produce el motivo guardado en la reserva cancelada, T2 lo consume en `canceladas` | consistente: T1 debe guardar `reason` en la reserva; T2 lista `status === 'cancelled'` (excluye `voided`) |
| T1 | texto vs. sí mismo | los 2 tests actuales de `cancel.test.js` (`cancelada Norte lun` sin motivo; `sin reserva Sur mar` sin motivo) chocan con el nuevo AND «sin `--motivo` → motivo no válido» |
| T2 | texto vs. sí mismo | el almacén es en memoria: el test de `canceladas` cancela y lista en el mismo proceso; sin conflicto |
| Plan vs. restricciones | texto en castellano | sin conflicto |

Rulings del scan:
- Ruling: el test existente «cancelar una reserva activa» se actualiza en T1 a `--motivo "sala ocupada"` → `cancelada Norte lun (sala ocupada)` — la spec (THEN/AND) sustituye el comportamiento antiguo — si me equivoco: un test del comportamiento viejo queda rojo y lo ve el gate.
- Ruling: la validación del motivo va antes que la búsqueda de reserva; el test «cancelar sin reserva lo dice» pasa a llevar un motivo válido — la spec dice que sin `--motivo` responde «motivo no válido» sin matices, y no define el orden con «sin reserva» — si me equivoco: `cancelar Sur mar` sin motivo responde «motivo no válido» en vez de «sin reserva Sur mar».
