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

- `cancelar <sala> <día> --motivo <motivo>`: la lista de motivos es cerrada (cambio de planes, sala ocupada, otro); un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`) — 8b43898.
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (`src/app.js`, `test/cancel.test.js`) — c3540f3.
- Capacidad nueva `bookings` fusionada en `.docs/sdd/capabilities/bookings.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 0,19 s, sobre el commit de cierre (no toca código).
- Gate: `node --test` (constitution, art. 2) → corrió 5/5 · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código limpias sobre c3540f3 (HEAD solo añade `tasks.md`, sin re-revisión) · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista (`--motivo "me aburro"`) y sin `--motivo` responden «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` en ambos casos |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: las reservas viven en memoria) | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → `steering/architecture.md`.
- Comportamiento de cancelar con motivo y del listado → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
