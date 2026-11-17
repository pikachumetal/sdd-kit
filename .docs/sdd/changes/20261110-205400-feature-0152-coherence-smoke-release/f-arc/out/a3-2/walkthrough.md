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

- `cancelar <sala> <día> --motivo <motivo>` pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro). Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro» (`src/app.js`, `test/cancel.test.js`, 9909810).
- El comando `canceladas` lista las reservas canceladas con su motivo: «Norte lun — sala ocupada» (`src/app.js`, `test/cancel.test.js`, 4d89ada).
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en `debt.md`, «Por triar»).

## 4. Verificación

### 4.1 Builds

- Gate de cierre del plan: `node --test`. Corre una sola vez, sobre el merge de sincronización del paso 6 del cierre, porque `develop` lleva un commit que la rama no tiene y la `0011` está abierta. Su resultado y su sha van en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real sobre el commit de cierre (el cierre solo añade documentación) · revisión final Spec y Código limpia sobre 4d89ada, re-revisión limpia del commit de registro que le siguió · la suite corre en el merge de sincronización (ver 4.1).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (sin test propio en `test/cancel.test.js`: solo lo cubre este smoke) |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelar y `canceladas` en el mismo proceso, porque el estado vive en memoria) |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests: fila en «Por triar» de `debt.md`.
- Falta un test del escenario «sin `--motivo`»: lo vio la re-revisión; va en la misma fila de deuda.

## 5. Aprendizajes

- Un cambio de comportamiento observable → `capabilities/bookings.md`, fusionado desde la spec.

Retro: sin señales

## 6. Adendas

- _Ninguna_
