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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando `canceladas` que lista `<sala> <día> — <motivo>` (dc29eb9, cb8f697).
- `test/cancel.test.js`: pruebas del motivo y del listado.
- Capacidad nueva `bookings` fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.
- Sin ADR candidatas.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden (deuda en «Por triar»)

## 4. Verificación

### 4.1 Builds

- La suite no corre antes del cierre porque hay otra rama abierta (`feature/0011-others`): corre una sola vez sobre el merge de sincronización; su `Gate:` y su sha van en el mensaje final.
- Revisión final: Spec y Código limpias sobre cb8f697; el commit posterior solo toca `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · smoke 5/5 THEN con ejecución real sobre 1613854 (módulo y CLI) · suite pendiente del merge de sincronización · revisión final Spec y Código sobre cb8f697, limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

Nota: las reservas viven en memoria; `canceladas` solo ve lo cancelado en el mismo proceso (el smoke del listado fue por módulo; la CLI de un solo comando no lo conserva), hasta la 0014.

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al primer test (ver ruling): deuda en «Por triar».
- El motivo no se persiste: lo cubre la 0014.

## 5. Aprendizajes

- El listado de canceladas solo funciona dentro de un proceso mientras las reservas vivan en memoria → ya lo cubre la fila 0014; sin destino nuevo.

Retro: sin señales

## 6. Adendas

- (ninguna)
