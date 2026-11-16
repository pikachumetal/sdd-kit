---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (e83dae6).
- Comando `canceladas`: lista `<sala> <día> — <motivo>` de las reservas canceladas del proceso — `src/app.js`, `test/cancel.test.js` (a5a3439).
- Capacidad nueva `bookings` fusionada desde el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verde, sobre el commit de cierre (lo posterior a la revisión final solo toca `tasks.md`).
- Gate: no declarado (el proyecto no tiene `operations.md` ni «Suites»).
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre a5a3439.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 5/5 THEN con ejecución real (no hubo validación del dev-lead; `validation.mode: field`) · revisión final Spec y Código limpia sobre a5a3439.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (en el mismo proceso: las reservas viven en memoria hasta la 0014) | ok |
| `canceladas` entre procesos distintos | no probado: fuera de alcance hasta la 0014 | — |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Sin aprendizajes nuevos para los docs vivos: el comportamiento observable va a `capabilities/bookings.md` por el delta de la spec.

Retro: sin señales

## 6. Adendas

- _Ninguna_
