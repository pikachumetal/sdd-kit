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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, d1f11fe): `cancelar <sala> <día> --motivo <motivo>` acepta solo la lista cerrada (cambio de planes, sala ocupada, otro); un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, 354e22c): `canceladas` enseña «sala día — motivo» de las reservas canceladas del mismo proceso.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.
- Sin ADR candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — el test falla si corre solo o en otro orden (Task 2; fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, sin fallos (verificado por el agente, 2026-11-16).
- Gate: `node --test` · sin gate declarado (no hay `operations.md`) → suite completa: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 354e22c; lo posterior (32913dc) solo toca `tasks.md`.

Todo lo de la tabla lo ha verificado el agente; el dev-lead no ha reportado pruebas propias.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con «me aburro») |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, cancelando y listando en el mismo proceso |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: el de `canceladas` usa la cancelación del primero. Fila en «Por triar».
- Las reservas viven en memoria: `canceladas` solo enseña lo cancelado en el mismo proceso, hasta la 0014 (Motivo guardado).

## 5. Aprendizajes

- El comportamiento nuevo (motivo obligatorio y listado) → `capabilities/bookings.md`.
- Sin convención, cambio estructural ni herramienta nueva que volcar en `constitution.md`, `architecture.md` u `operations.md`.

Retro: sin señales
