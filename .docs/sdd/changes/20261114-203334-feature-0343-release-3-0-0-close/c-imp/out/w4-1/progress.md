# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Setup: worktree wt (rama feature/0010-cancel-reason), apertura 98a4318, baseline en worktree desacoplado: node --test → 4/4 verde; env:setup activo (TICKET=0010). Base check: develop = merge-base, sin diff de ROADMAP ni de ficheros.
Método: Native (Ejecución: native; control delegate). Efecto del effort: solo aplica a los ejes de la revisión final.

## Pre-flight scan
| Par / task | Qué produce vs. qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 guarda el motivo en la reserva cancelada (`status: 'cancelled'`); T2 lista las de `status === 'cancelled'` y lee ese motivo | Interfaz compatible: el campo del motivo lo fija T1 (`reason`), T2 lo consume. El estado es en memoria del módulo y se comparte entre tests del mismo fichero: el GIVEN de T2 («Norte lun cancelada con sala ocupada») lo deja el test de T1 que cancela con ese motivo, así que el orden de tests importa. |
| Task 1 (texto propio) | Spec: sin `--motivo` → «motivo no válido…»; los tests existentes `cancelar una reserva activa` (sin motivo → «cancelada Norte lun») y `cancelar sin reserva lo dice` (sin motivo → «sin reserva Sur mar») | Contradicción: ambos tests existentes chocan con el nuevo THEN. |
| Task 2 (texto propio) | `canceladas` lista estado cancelada; existe `voidBooking` con estado `voided` (anular, 0011, fuera del Scope) | Sin conflicto si el filtro es exactamente `cancelled`; las anuladas no aparecen. |
| Plan vs. constitución | Gate `node --test`; textos en castellano | Sin conflicto. |

## Rulings del pre-flight
Task 1: Ruling: los dos tests existentes de cancelar se actualizan para pasar un motivo válido (`--motivo "sala ocupada"`), conservando su intención; el primero es el test del GIVEN/WHEN/THEN de la spec («cancelada Norte lun (sala ocupada)») — el THEN nuevo de la spec sustituye al viejo, no es una desviación — coste si falla: un test existente cambia de aserción y el revisor debe confirmarlo.
Task 1: Ruling: el motivo se valida antes de buscar la reserva (sin `--motivo` o fuera de lista → «motivo no válido: …» aunque no haya reserva) — la spec no fija el orden y el THEN «sin --motivo responde lo mismo» no condiciona a que exista la reserva — coste si falla: «cancelar Sur mar» sin motivo responde «motivo no válido» en vez de «sin reserva».
Task 1: Ruling: el motivo se guarda en el campo `reason` de la reserva cancelada; la lista cerrada es una constante (cambio de planes, sala ocupada, otro) — coste si falla: renombrar el campo toca T2.
Task 2: Ruling: `canceladas` filtra `status === 'cancelled'` (no incluye `voided`) y su test depende del estado que deja el test de T1; se mantiene el orden de tests en test/cancel.test.js — coste si falla: test acoplado por orden, frágil si se reordena.
Nota: «Decisiones tomadas…» de la spec numera 1 y 3 (falta la 2); no cambia el contrato, se menciona al dev-lead.
