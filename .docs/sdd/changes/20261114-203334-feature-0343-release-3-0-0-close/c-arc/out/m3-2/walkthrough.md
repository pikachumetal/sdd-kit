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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (30b56b7).
- `src/app.js`: comando `canceladas`, que lista «sala día — motivo» de las reservas canceladas del proceso (6da94b7).
- `test/cancel.test.js`: tests de ambos comandos.
- `migrations/v3.0.0.md`: la línea pasa a «**Escribe**: `sdd-kit.json`, `operations.md`.», como pedía el scope.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test`: 5/5 verdes, sobre el commit de cierre. Sin `operations.md` ni gate declarado: no hay más suites.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (el listado, en el mismo proceso: las reservas viven en memoria hasta la 0014) · revisión final de Spec y Código limpia · no probado: `canceladas` desde un proceso nuevo, que sale vacío por esa misma razón (0014)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelar y listar en el mismo proceso) |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → «Por triar» en `debt.md`.

## 5. Aprendizajes

- Comportamiento observable de cancelar con motivo y del listado → `capabilities/bookings.md`.
- Las reservas viven en memoria hasta la 0014 (ya en el roadmap) → sin destino nuevo.

Retro: sin señales

## 6. Adendas

- _Ninguna_
