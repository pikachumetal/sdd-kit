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

- Backend (`src/app.js`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `6c28d8a`.
- Backend (`src/app.js`): comando `canceladas`, que lista `<sala> <día> — <motivo>` — `4433f0b`.
- Tests en `test/cancel.test.js`.
- Capacidad `bookings` creada desde el delta de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en `debt.md`, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el cierre solo añade documentación a `4433f0b`, el último commit de código).
- Gate: `node --test` → 5/5 tests · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 5/5 THEN con ejecución real · revisión final Spec y Código limpias sobre 4433f0b

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo xyz`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en el mismo proceso: el estado es en memoria) | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- «Los motivos no se traducen»: la 0010 solo salda el castellano; queda el inglés en `debt.md`.
- Los tests de cancelación dependen del orden (ruling de la Task 2): fila en «Por triar».

## 5. Aprendizajes

- El comportamiento nuevo vive en la capacidad `bookings` → `capabilities/bookings.md`.
- Sin aprendizajes de convención ni de estructura.

Retro: sin señales

## 6. Adendas

- (ninguna)
