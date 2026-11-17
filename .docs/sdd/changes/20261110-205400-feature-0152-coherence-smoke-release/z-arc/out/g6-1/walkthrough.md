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

- **Cancelar con motivo** (`bce3a14`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`27b2cdb`): el comando `canceladas` lista las reservas con estado cancelada como «Norte lun — sala ocupada». Ficheros: `src/app.js`, `test/cancel.test.js`.
- El cierre añade `tasks.md` con la revisión final, el walkthrough y la capacidad `bookings`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- La suite y el gate de cierre no corren en este punto: hay otra rama abierta (`feature/0011-others`), así que corren una sola vez sobre el merge de sincronización del paso 6 y esa pasada va en el mensaje final.
- Gate: pendiente de esa pasada (`gate.json`: `bookings:test`, `rooms:test`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (un solo proceso, porque el estado vive en memoria; además la salida de la CLI para los tres `cancelar`) · suite: no corrida aún, ver 4.1 · revisión final Spec y Código limpias sobre 27b2cdb (HEAD solo añadió documentación)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo xx` y `--motivo "porque sí"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

No probado: `cancelar` sobre una reserva inexistente con motivo válido (fuera de la spec).

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests (el ruling de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento nuevo (motivo al cancelar, listado de canceladas) → `capabilities/bookings.md`, con `sdd capability merge`.
- `operations.md` y `estimation.md` no existen en el proyecto: no hay tiempo real ni estimation-log que registrar.

Retro: sin señales

## 6. Adendas

