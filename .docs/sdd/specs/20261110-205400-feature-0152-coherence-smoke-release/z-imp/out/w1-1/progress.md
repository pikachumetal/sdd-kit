# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Setup: ya en worktree enlazado (rama feature/0010-cancel-reason); env:setup hecho (.sdd-env.json sin ignorar: no se añade, se commitea por ruta); baseline 'node --test' en worktree desvinculado: 4/4 verde. ROADMAP/base: develop == merge-base, sin diff.
Spec aprobada (Laura, 2026-10-08), perfil delegate, Ejecución native. Efecto: effort-<level> no aplica hasta la revisión final.

## Pre-flight scan
| Par/Task | Produce / consume | Hallazgo |
| --- | --- | --- |
| T1 ↔ T2 (src/app.js, test/cancel.test.js) | T1 cambia cancelBooking (motivo, estado cancelled + reason); T2 lee las canceladas | T2 depende del campo motivo guardado en la reserva por T1; ambos cancelan la única reserva activa Norte lun en el mismo módulo con estado en memoria |
| T1 | Texto vs spec: test existente 'cancelar una reserva activa' espera 'cancelada Norte lun' sin motivo | Contradice el AND «sin --motivo → motivo no válido»: T1 lo actualiza |
| T1 | Spec no dice el orden motivo/reserva inexistente (test existente: 'cancelar Sur mar' → 'sin reserva Sur mar') | Ver Ruling 2 |
| T2 | Texto consistente con spec; ficheros ya creados por T1 | sin hallazgo |
Task 1: Ruling: el test existente 'cancelar una reserva activa' se reescribe con --motivo (lo exige el AND de la spec) — cuesta: si Laura quería conservar la salida sin motivo, hay que revertir ese test
Task 1: Ruling: con motivo ausente/inválido y SIN reserva activa se mantiene 'sin reserva <sala> <día>' (primero se busca la reserva, luego se valida el motivo) — la spec solo define el caso con la reserva de Norte; así el test existente 'cancelar sin reserva' sigue intacto y no cambia salida observable no pedida — cuesta: si se quería validar el motivo primero, hay que invertir el orden y adaptar ese test
Task 1: Ruling: los tests importan el módulo fresco por test (import('../src/app.js?<id>')) porque el estado es en memoria y hay una sola reserva activa — evita acoplar T1 y T2 por orden, sin código de test en producción — cuesta: ninguno si es incorrecto salvo reescribir la importación
