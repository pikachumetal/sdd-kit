# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: apertura commit 5cad3ca (spec, plan, tasks.md). Baseline `node --test` → 4/4 pass. Método: Native (plan `Ejecución`). Perfil: delegate.

## Pre-flight scan

| Par / task | Qué produce vs qué consume | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 (`src/app.js`) | T1 guarda el motivo en la reserva cancelada (`status: 'cancelled'` + motivo); T2 lista las `cancelled` y lee ese motivo | Interfaz compartida: el campo del motivo lo fija T1 (`reason`); T2 lo consume. Sin conflicto. |
| T1 ↔ T2 (`test/cancel.test.js`) | Ambas añaden tests al mismo fichero; el estado (`bookings`) es módulo y se comparte entre tests | La reserva de Norte/lun solo se puede cancelar una vez: el test de T2 (GIVEN Norte lun cancelada con «sala ocupada») depende de que T1 la cancele con ese motivo en el mismo fichero, o de prepararlo él mismo. Ver Ruling 2. |
| T1 | Texto vs spec | El plan no trae steps ni `Expected:`: las tasks son título, superficie, verificación y ficheros. Los steps salen de los THEN de la spec. |
| T1 | Tests existentes vs spec | `cancelar una reserva activa` espera `cancelada Norte lun` sin `--motivo`; la spec dice que sin `--motivo` responde «motivo no válido…». Contradicción → Ruling 1. |
| T1 | `cancelar sin reserva lo dice` | Espera `sin reserva Sur mar` sin motivo; la spec no dice qué gana si faltan ambos → Ruling 3. |
| T2 | Texto vs spec | Coherente: lista reservas `cancelled` (no las `voided`, 0011 queda fuera); salida «Norte lun — sala ocupada». |
| Spec | «Decisiones» salta del 1 al 3 | Falta la 2; irrelevante para el código, se anota. |

Task 0: Ruling 1: el test `cancelar una reserva activa` cambia a `cancelar Norte lun --motivo "sala ocupada"` → `cancelada Norte lun (sala ocupada)` — la spec manda sobre un test que codifica el comportamiento viejo, y la spec lo contradice explícitamente — si me equivoco: un test reescrito de más.
Task 0: Ruling 2: el test del listado prepara su propio estado (cancela con «sala ocupada» dentro del mismo test o depende solo del orden documentado) — el GIVEN de la spec exige la reserva ya cancelada y el estado es de módulo — si me equivoco: un test frágil por orden.
Task 0: Ruling 3: sin reserva se comprueba antes que el motivo (`sin reserva Sur mar` se mantiene) — la spec solo fija el caso con reserva existente y así no se rompe el test vigente — si me equivoco: el dev-lead querría «motivo no válido» primero; es un cambio de una línea.
