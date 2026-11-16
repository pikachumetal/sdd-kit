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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es de una lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — b5ed73d.
- `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso. `src/app.js`, `test/cancel.test.js` — a10331d.
- Capacidad nueva `bookings` (delta de la spec fusionado en `capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, sobre el commit de cierre (salida guardada completa antes de leerla).
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 3/3 THEN con ejecución real (el del listado, en un solo proceso) · revisión final Spec y Código limpias sobre a10331d; el commit posterior solo cambia `tasks.md`, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, cancelar y listar en el mismo proceso (`node -e`) | ok |

`canceladas` lanzado como proceso aparte no ve nada: las reservas viven en memoria hasta la 0014, como dice la spec.

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden de los tests → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Hasta la 0014 las reservas viven en memoria: `canceladas` solo ve lo cancelado en el mismo proceso → ya lo recoge la spec y la fila 0014; sin destino nuevo.

Retro: sin señales

## 6. Adendas

- _Ninguna_
