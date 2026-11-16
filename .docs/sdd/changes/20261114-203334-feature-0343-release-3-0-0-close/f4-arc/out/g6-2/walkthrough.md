---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (9b0492e).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas: `src/app.js`, `test/cancel.test.js` (37e709a).
- Capacidad `bookings` creada con los dos requisitos de la spec: `.docs/sdd/capabilities/bookings.md`.
- Sin ADR candidata.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya (Task 2) — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- El gate de cierre (`node scripts/gate.mjs run bookings:test rooms:test --affected`) corre en el merge de sincronización del paso 6 (hay otra rama abierta, `feature/0011-others`, y `develop` va por delante); su línea `Gate:` y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · smoke 4/4 THEN con ejecución real · suite en el merge de sincronización · revisión final Spec y Código limpias sobre 37e709a (HEAD solo añade `tasks.md`, sin re-revisión) · no probado: persistencia entre procesos (las reservas viven en memoria hasta la 0014)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelar y `canceladas` en el mismo proceso) |

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden de los tests: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso: `canceladas` solo enseña lo cancelado en el mismo proceso hasta la 0014 → ya dicho en la spec (§Approach), sin destino nuevo.

Retro: sin señales

## 6. Adendas

- _Ninguna_
