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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — e6f4d59.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` — fd5257d.
- `test/cancel.test.js`: tests de ambos comandos — e6f4d59, fd5257d.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde (0,13 s), salida guardada en el scratchpad de la sesión.
- Gate: `node --test` → corrió 5/5 · configuración: la del proyecto (constitution, art. 2) · sobre el commit de cierre.
- Revisión final: Spec (opus, high) limpia · Código (sonnet, high) limpia · Arquitectura no (plan), sobre fd5257d; lo posterior es solo `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (el del listado, en un solo proceso, ver 4.3) · revisión final Spec y Código limpias sobre fd5257d · sin probar: `canceladas` entre dos invocaciones separadas de la CLI.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` con `--motivo "me aburro"` |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (módulo, un solo proceso) | `Norte lun — sala ocupada`; con `node src/app.js canceladas` en un proceso nuevo sale vacío |

### 4.3 Residuales / deuda generada

- El estado vive en memoria: desde la CLI, `canceladas` no ve una cancelación hecha en otra invocación. Lo cubre la 0014 «Motivo guardado» (ya en Now); la spec lo daba por implícito.
- El test de `canceladas` depende del primero (ruling de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento nuevo vive en `capabilities/bookings.md`, sin copia en otros documentos → capabilities/bookings.md

Retro: sin señales

## 6. Adendas

- (ninguna)
