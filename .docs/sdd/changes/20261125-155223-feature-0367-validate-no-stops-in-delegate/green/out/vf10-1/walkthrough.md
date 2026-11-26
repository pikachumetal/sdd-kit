---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (6d45faa) y `canceladas` lista las reservas canceladas con su motivo (777d17e).
- `src/app.js`: `libres` cuenta como libre la sala cuya reserva se canceló; solo la reserva `active` la ocupa (4140b9c, Task 3).
- `test/cancel.test.js`, `e2e/cancel.e2e.mjs`: tests por THEN, cada uno con su propia instancia de la app.
- `capabilities/bookings.md`: nueva, con las dos capacidades del delta.

## 3. Desviaciones del plan

- Task 3 añadida al final del plan: el guion de la validación mostró que `libres` seguía dando «Sur» tras cancelar Norte (`freeRooms` solo excluía `voided`), y ningún test lo cubría.
- Pasada de fix de la revisión final: se quitan dos e2e que no son flujo core; se vuelve a cubrir `sin reserva` y `sin --motivo` en unitarios.

### Decisiones tomadas sin el dev-lead

- `canceladas` sin canceladas sigue devolviendo vacío — añadir «sin canceladas» cambia la salida observable y la spec calla — si es erróneo, el CLI imprime una línea en blanco.
- El Ruling de la Task 2 (test de `canceladas` acoplado al primer test) queda cerrado: cada test prepara sus datos.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 8/8 · e2e: corrió 5/5 (30 s de 0,5 min) ·
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:50238/health` → ok, levantado en esta sesión y parado al acabar

### 4.2 Smoke / tests

Validación en campo: 2026-11-25 · gate verde (unit 8/8, e2e 5/5) · smoke de 4 THEN con ejecución real contra el servidor · revisión final Spec y Código, re-revisión limpia; 5 Minor diferidos en el ledger · no probado: salida con caracteres no ASCII en la consola de Windows.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → la misma respuesta | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- `src/app.js` y `test/cancel.test.js` pasaron de CRLF a LF.
- Literales `'active'`/`'cancelled'`/`'voided'` repetidos; `run` crece un `if` por comando; el orden de validación (motivo antes que reserva) sin test.
- El test de la Task 3 perdió el assert del resultado de `cancelar`.

## 5. Aprendizajes

- Un test que reutiliza el estado de otro pasa en el gate y falla solo: cada test prepara sus datos → `operations.md` §Datos (ya lo dice).

Retro: error que cazaría un chequeo → test de `libres` tras cancelar, que prepara su propia reserva (test/cancel.test.js)

## 6. Adendas

- Sin adendas.
