---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (ddb53f6).
- `canceladas`: lista «sala día — motivo» de las reservas canceladas — `src/app.js`, `test/cancel.test.js` (c608725).
- Capacidad nueva `bookings` fusionada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- Sin `.docs/sdd/steering/estimation.md`: el proyecto no mide tiempo.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 tests verdes, 0 fallos, sobre el commit de cierre (el código es el de la Task 2; solo cambió documentación después).
- Gate: sin «Suites» ni gate declarados (el proyecto no tiene `operations.md`): `node --test` · saltada (sin gate).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus, high) y Código (sonnet, high) limpias sobre c608725; Arquitectura no (plan). No probado: persistencia entre procesos (las reservas viven en memoria hasta la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | OK |
| motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | OK |
| sin `--motivo` responde lo mismo | ejecución real | OK |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» (mismo proceso) | ejecución real | OK |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests: deuda en «Por triar».
- `canceladas` solo ve lo cancelado en el mismo proceso: lo resuelve la 0014 (fila ya en el roadmap).

## 5. Aprendizajes

- Las reservas viven en memoria: el comando `canceladas` desde la CLI en un proceso nuevo sale vacío → ya recogido en la spec (Approach) y en la 0014.

Retro: sin señales

## 6. Adendas

- _Ninguna_
