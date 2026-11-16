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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y guarda el motivo con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (9d02051).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso: `src/app.js`, `test/cancel.test.js` (aeff2ca).
- Capacidad nueva `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en la deuda).

## 4. Verificación

### 4.1 Builds

- Gate de cierre: corre sobre el sync merge del paso 6 del cierre (hay otra rama abierta, `feature/0011-others`); su línea `Gate:` y su sha van en el mensaje final, porque este walkthrough está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · smoke 4/4 THEN con ejecución real · suite en el sync merge · revisión final Spec y Código limpia sobre aeff2ca (lo posterior solo toca `tasks.md`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un solo proceso (cancelar y luego `canceladas`) → `Norte lun — sala ocupada`; desde la CLI en procesos separados sale vacío, porque las reservas viven en memoria hasta la 0014 (la spec lo dice) |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2): fila en «Por triar» de la deuda.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso: `canceladas` solo enseña lo cancelado en el mismo proceso hasta la 0014 → ya recogido en la spec y en la fila 0014 del roadmap.
- Comportamiento observable nuevo (motivo al cancelar, listado) → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
