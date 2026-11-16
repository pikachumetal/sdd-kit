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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (29b8e65).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (d084c38).
- Capacidad nueva `bookings` fusionada desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde, sobre el commit de cierre (solo añade documentos al código de d084c38).
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre · configuración: la del gate de la constitution (art. 2)
- Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre d084c38. HEAD solo se movió con un commit de documentación (tasks.md): sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 5/5 THEN con ejecución real (CLI y `run` en un mismo proceso) · revisión final Spec y Código sobre d084c38, limpia · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso tras cancelar; las reservas viven en memoria) | ok |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → `steering/architecture.md`.
- Comportamiento de cancelar con motivo y del listado → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
