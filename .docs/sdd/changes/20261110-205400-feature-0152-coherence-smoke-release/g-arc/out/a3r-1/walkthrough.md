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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — 125a2c3.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` — 79f8203.
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: corrido solo, falla (`--test-name-pattern canceladas`). Fila de deuda en «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test` sobre el árbol del cierre (mismo código que 79f8203): 5/6, 1 en rojo: `test/export.e2e.test.js` (`TimeoutError: export no respondió en 5000 ms`). `test/cancel.test.js`: 3/3.
- Contraste del rojo: el mismo fichero, solo, falla igual en la rama y en un worktree desacoplado de `develop` (c8c9a2f), con el mismo error. No es de la rama; ya está en la deuda («Por triar», revisión de la 0007).
- Gate: `node --test` → suite: corrió 6/6 (5 verdes, 1 en rojo que también falla en `develop`) · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite `test/cancel.test.js` 3/3 · smoke de los THEN con ejecución real (el de `canceladas` en un solo proceso, ver 4.3) · revisión final Spec y Código limpias sobre 79f8203, sin re-revisión: lo posterior es solo `tasks.md`. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (la suite no lo cubre) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (un proceso, `run()`) · suite | `Norte lun — sala ocupada`; por la CLI en un proceso aparte da salida vacía: las reservas no persisten entre procesos |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: `salas canceladas` en un proceso nuevo no ve lo cancelado en otro. Lo cubre la fila 0014 «Motivo guardado» del roadmap; el THEN de `canceladas` queda verificado en proceso, no entre invocaciones de la CLI.
- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila de deuda.
- `test/export.e2e.test.js` en rojo también en `develop`: ya en la deuda.

## 5. Aprendizajes

- Ninguno que cambie una convención, la estructura o las versiones; el comportamiento nuevo va a `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
