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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de una lista cerrada (cambio de planes, sala ocupada, otro); se guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js` — `0d5014d`.
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — `578a231`.
- Capacidad nueva `capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2).

## 4. Verificación

### 4.1 Builds

- `node --test` sobre `ddcc39d`: 5/5 de la rama en verde; 1 rojo, `test/export.e2e.test.js` («TimeoutError: export no respondió en 5000 ms»), que falla igual sin la rama: contrastado solo, en la rama y en un worktree desacoplado de `develop` (`60e97a6`), ambos `fail 1`. Ya estaba en la deuda («Por triar», 2026-10-06).
- Gate: `node --test` → corrió 6/6 (5 verdes, 1 rojo previo en `develop`) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke de 4 THEN con ejecución real · suite 5/6 (el rojo es el de `develop`) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `578a231`; `HEAD` solo añadió `tasks.md`, sin re-revisión. Verificado por el agente; el dev-lead no ha probado nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista (`"me aburro"`) | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso) | «Norte lun — sala ocupada» |

No probado: `canceladas` desde la CLI en un proceso aparte, tras cancelar en otro. Observado: sale vacío, porque las reservas viven en memoria; lo cubre la fila 0014 («Motivo guardado»), fuera del alcance de esta feature.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primero (ruling de la Task 2) → «Por triar» de la deuda.
- `export.e2e` en rojo también en `develop`: ya en la deuda.

## 5. Aprendizajes

- Ninguno que cambie un documento vivo: lo observable está en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
