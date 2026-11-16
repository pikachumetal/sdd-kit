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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, 678d34f): el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …».
- `canceladas` (`src/app.js`, 970f41e): lista las reservas canceladas como «<sala> <día> — <motivo>». Las reservas viven en la memoria del proceso hasta la 0014.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- La suite no corre antes del merge: con `feature/0011-others` abierta a la vez, corre una vez en el merge de sincronización del cierre y su `Gate:` va en el mensaje final.
- Revisión final: Spec (opus + high) y Código (sonnet + high) limpias sobre 970f41e; Arquitectura no, por el plan. HEAD solo añadió `tasks.md` después.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · smoke 4/4 THEN con ejecución real (`node src/app.js …` y, para el listado, un solo proceso con `run`) · revisión final limpia sobre 970f41e · suite pendiente del merge de sincronización · no probado: `canceladas` entre procesos distintos (la memoria del proceso lo impide hasta la 0014).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

Todo lo anterior lo verificó el agente; el dev-lead no ha reportado nada propio.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila en «Por triar» de la deuda.

## 5. Aprendizajes

- Las reservas viven en memoria: `canceladas` solo enseña lo cancelado en el mismo proceso → ROADMAP, 0014 (Motivo guardado).

Retro: sin señales

## 6. Adendas

- _Ninguna_
