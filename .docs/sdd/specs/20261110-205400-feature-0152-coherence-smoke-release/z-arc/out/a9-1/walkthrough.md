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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (95dae12).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista sala, día y motivo de las reservas canceladas (fd32f91).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, sobre el commit de cierre (el cierre solo añade documentación). Sin «Suites» ni gate declarados: no hay `Gate:`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre fd32f91; lo posterior (tasks.md) es solo documentación · no probado: nada

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con «me aburro») |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (la suite no lo cubre) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelando y listando en el mismo proceso, porque el estado vive en memoria) |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de `debt.md`.
- Los motivos siguen sin traducirse al inglés: la fila de deuda se queda, reescrita a lo que falta.

## 5. Aprendizajes

- Ninguno que cambie una convención, la estructura o las versiones; el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
