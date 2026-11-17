# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: método Native (Ejecución: native). Spec aprobada (dev-lead, 2026-10-08). Baseline `node --test` en worktree separado en 02c5c8e → 4/4 en verde.
Setup: Ruling: trabajo en el checkout de la rama feature/0010-cancel-reason, sin worktree nuevo — la Task 1 ya estaba escrita aquí sin commitear; moverla a otro worktree arriesgaba perderla — si estaba mal, coste nulo: la rama es la misma.

## Escaneo previo

| Fila | Qué produce / qué consume | Hallazgo |
| --- | --- | --- |
| Task 1 ↔ Task 2 (src/app.js, test/cancel.test.js) | T1 guarda booking.reason al cancelar; T2 lo lee para listar | Coherente; T2 depende de que T1 guarde el motivo en la reserva |
| Task 1 | Verificación `node --test test/cancel.test.js` cubre sus ficheros | El plan no detalla los tests: salen del THEN y los 2 AND de la spec |
| Task 2 | Misma Verificación, mismos ficheros | Coherente consigo misma |

Task 1: base comprobada — develop = merge base c7c3f0b, sin cambios en ROADMAP.md ni en los ficheros de la task.
Task 1: Ruling: el test que venía escrito cubría el THEN y el AND «fuera de la lista», pero no el AND «sin --motivo»; lo añado — la spec pide un test por cada THEN y cada AND — si estaba mal, coste: un test de más.
Task 1: Ruling: el test «cancelar sin reserva lo dice» se había borrado; lo recupero como «cancelar con motivo válido y sin reserva lo dice» — el comportamiento sigue existiendo y nada lo cubría — si estaba mal, coste: un test de regresión de más.
Task 1: Ruling: el código ya estaba escrito antes que el test; no lo borro: pruebo el RED con los tests nuevos contra el src/app.js de HEAD en un worktree separado (3 fallan por la razón esperada y el de regresión pasa) y el GREEN aparte (6/6) — así no toco el árbol mientras corre la verificación lenta — si estaba mal, coste: el código no nació test-first, aunque el RED demuestra que los tests detectan su ausencia.
