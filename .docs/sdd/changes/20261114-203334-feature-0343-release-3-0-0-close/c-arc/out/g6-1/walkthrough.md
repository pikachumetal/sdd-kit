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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 74462c8): el motivo es de la lista cerrada «cambio de planes, sala ocupada, otro»; fuera de ella, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». La reserva cancelada guarda su motivo.
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, 4226aab): lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso.
- Capacidad nueva `capabilities/bookings.md`, mezclada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- La suite de cierre (`node --test`, la del plan) corre una sola vez sobre el merge de sincronización del paso 6, porque `develop` lleva un commit por delante y hay otra rama abierta (`feature/0011-others`). Su resultado y su sha van en el mensaje final, porque este walkthrough está dentro del commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · smoke 4/4 THEN con ejecución real (`node src/app.js`, y `run` en un solo proceso para `canceladas`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 4226aab · suite pendiente del merge de sincronización · `canceladas` desde un proceso nuevo da salida vacía: las reservas viven en memoria hasta la 0014 (lo dice la spec), no probado con persistencia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso, `run('cancelar', …)` y `run('canceladas', [])`) y `suite` | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primero de `test/cancel.test.js`: deuda en «Por triar».

## 5. Aprendizajes

- Las reservas viven en memoria del proceso: `canceladas` solo enseña lo cancelado en el mismo proceso hasta la 0014 → ya dicho en la spec (Approach) y en la 0014 del roadmap; sin destino nuevo.

Retro: sin señales

## 6. Adendas

- Ninguna.
