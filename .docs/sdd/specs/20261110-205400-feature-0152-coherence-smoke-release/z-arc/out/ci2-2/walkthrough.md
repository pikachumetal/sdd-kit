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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; comando `canceladas` (fadf315, 1f6ce04).
- `test/cancel.test.js`: tests del motivo válido, del motivo fuera de la lista y del listado.
- `capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 pasan, sobre f0c3c9b (sin cambios de código después de 1f6ce04). `operations.md` no declara «Suites» ni gate: no hay `Gate:` que citar.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 (`node --test`) · smoke 5/5 THEN con ejecución real por la CLI (`node src/app.js …`; `canceladas` en un solo proceso con `cancelar`, porque el estado vive en memoria) · revisión final Spec y Código sobre 1f6ce04, limpia; Arquitectura no (plan) · `no probado`: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real | cumple |
| motivo fuera de la lista (`vacaciones`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | cumple |
| sin `--motivo` → la misma respuesta | ejecución real | cumple |
| `canceladas` tras cancelar con «sala ocupada» → «Norte lun — sala ocupada» | ejecución real | cumple |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden (workaround de la Task 2): fila en «Por triar» de `debt.md`.
- El caso «sin `--motivo`» no tiene test propio, solo smoke real.

## 5. Aprendizajes

- El comportamiento nuevo (motivo obligatorio y listado) → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
