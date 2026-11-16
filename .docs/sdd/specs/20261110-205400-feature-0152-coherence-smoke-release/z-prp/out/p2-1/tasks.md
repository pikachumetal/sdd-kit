# Tasks — 0010 Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | completa | c61101a |
| Task 2 — Listado de canceladas | completa | 6936152 |

Revisión final: Spec opus+high, con arreglos (2 Important) · Código sonnet+high, con arreglos (2 Important) · Arquitectura no (plan), sobre 6936152
Pasada de fix: cdce0c0, 2 hallazgos RED→GREEN
Re-revisión: 6936152..cdce0c0, sdd-kit:effort-high + opus, todos arreglados, sin rotura nueva

## Rulings

Setup: Ruling: trabajo en el checkout actual (ya en feature/0010-cancel-reason, sin worktree aparte) — delegate, sin consentimiento para crear otro — coste si falla: ninguno, rama aislada de main. Baseline: node --test 4/4 y lint verde.
Pre-flight: Ruling: el plan sugiere exportar bookings para sembrar, pero el estado en memoria se comparte entre tests (y el test existente ya cancela Norte lun) — decido que los tests nuevos importen una instancia fresca del módulo con `import('../src/app.js?<tag>')`, sin tocar producción — coste si falla: reescribir el arranque de los tests.
Task 1: Ruling: 'cancelar sin motivo no guarda motivo' pasó en RED (fija la conducta actual, retrocompat) — se conserva como test de regresión — coste si falla: ninguno
Task 2: Ruling: el test de anuladas asserta '' (no solo 'no contiene') — alinea con la decisión 4 del plan; sin motivo no se lista — coste si falla: ajustar un assert
Final: Ruling: texto de la línea sin motivo = «Norte lun — sin motivo» — la spec no lo fija; el Approach exige listar toda cancelada y el formato «sala día — X» ya existe — si falla: cambiar una cadena y un assert; queda para confirmar con el dev-lead
Final: Ruling: plan decisión 3 (omitir canceladas sin motivo) queda revocada por el arreglo anterior — la spec manda sobre el plan
Final: minor (deferred): test `cancelar sin motivo no guarda motivo` solo comprueba la respuesta (cubierto ahora por `canceladas lista una cancelada sin motivo`)
Final: minor (deferred): test de anuladas pasaría sin el filtro de estado si anular algún día guarda motivo (0011)
Final: minor (deferred): falta test de motivo inválido con reserva inexistente (decisión 2 del plan)
Final: minor (deferred): `reason !== undefined` evaluado 3 veces en cancelBooking; MOTIVOS exportado sin uso
Final: minor (deferred): canceladas vacío imprime línea vacía (decisión 4, sin texto fijado por la spec)
Final: minor (deferred): `cancelar --motivo x` con el flag primero toma el flag como sala
