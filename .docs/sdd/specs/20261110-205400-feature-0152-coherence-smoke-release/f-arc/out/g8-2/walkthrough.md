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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando `canceladas` que lista «sala día — motivo» (731c6dd, 5c58a10).
- `test/cancel.test.js`: tests de cancelar con un motivo de la lista, con uno fuera de la lista y del listado (731c6dd, 5c58a10).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (no toca sus inputs) · 1 s · configuración: la del gate · sobre el commit de cierre (el cierre junta un commit de solo `tasks.md`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · verificado por el agente con ejecución real: THEN 1 a 3 por la CLI (`node src/app.js …`); gate en verde; revisión final Spec y Código limpia sobre 5c58a10, re-revisión del commit de solo `tasks.md` tras 5c58a10, limpia. **THEN 4 solo en el mismo proceso**: por la CLI, en una invocación aparte, `canceladas` sale vacío. No consta que el dev-lead dijera qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "me aburro"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, solo en un proceso (importando `run`) | `Norte lun — sala ocupada` tras cancelar en ese proceso. Por la CLI, en un proceso aparte, sale vacío: el estado vive en memoria |

### 4.3 Residuales / deuda generada

- La CLI no conserva el estado entre invocaciones: `canceladas` no enseña lo cancelado en otra invocación. Lo cubre la 0014 (motivo guardado en el almacén); fila en «Por triar».
- Tests de `canceladas` acoplados al orden de los tests: fila en «Por triar».
- El THEN «sin `--motivo`» no tiene test propio (lo notó la re-revisión); lo he verificado con ejecución real. Fila en «Por triar».

## 5. Aprendizajes

- El comportamiento nuevo (motivo al cancelar y listado) → `capabilities/bookings.md`.
- Un THEN que depende de estado previo solo se prueba de verdad en la CLI si el estado sobrevive entre invocaciones → deuda, y la 0014.

Retro: sin señales

## 6. Adendas

- (ninguna)
