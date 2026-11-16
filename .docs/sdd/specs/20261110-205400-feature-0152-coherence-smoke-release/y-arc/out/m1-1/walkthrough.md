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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (91d13e7).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>»: `src/app.js`, `test/cancel.test.js` (6d773cf).
- `.docs/sdd/steering/architecture.md`: su línea de estructura dice que `src/app.js` también valida el motivo al cancelar.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Una decisión de ejecución, abajo.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado: solo, falla con `actual: ''`; deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test`: 5/5 verde sobre el código de las dos tasks, antes de la fusión de sincronización con `develop`. La suite del cierre corre sobre esa fusión y su resultado va en el mensaje final.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (el último, solo en un único proceso) · suite 5/5 sobre el código de las dos tasks · revisión final Spec y Código limpia sobre el commit de cierre · no probado: que el motivo sobreviva entre comandos.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real (ningún test lo cubre) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, en un solo proceso | `Norte lun — sala ocupada` |
| `canceladas` por la CLI, en otro proceso que la cancelación | ejecución real | salida vacía: el estado vive en memoria |

### 4.3 Residuales / deuda generada

- El motivo no sobrevive entre comandos: `node src/app.js cancelar …` y después `node src/app.js canceladas` da una lista vacía. La spec no pide persistencia; la cubre la 0014 «Motivo guardado», que ya está en el roadmap.
- El test de `canceladas` depende del orden: fila en «Por triar» de `debt.md`.
- Ningún test cubre cancelar sin `--motivo`: lo cubrí en el smoke, y va en la misma fila de deuda.

## 5. Aprendizajes

- La línea de estructura de `architecture.md` dice quién valida el motivo → `.docs/sdd/steering/architecture.md`.
- El comportamiento observable (motivo de la lista, listado de canceladas) → `capabilities/bookings.md`, por `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
