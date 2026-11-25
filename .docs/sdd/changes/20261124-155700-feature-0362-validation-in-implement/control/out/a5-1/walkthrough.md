---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro» (df9b312).
- `src/app.js`: comando `canceladas`, que lista sala, día y motivo de las reservas canceladas del proceso (623f660).
- `test/cancel.test.js`: tests de `cancelar` con motivo, con motivo fuera de la lista y de `canceladas`.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos ADDED de la spec.
- Sin ADR candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` en el cierre: 5 tests, 5 pasan, 0 fallan (verificado por el agente).
- Gate: `node --test` → corrió en `sdd-validate` al acabar las tasks, sobre 623f660; el cierre solo añade documentos, así que no se repite.
- Revisión final: Spec (opus, high) y Código (sonnet, high) limpias sobre 623f660; Arquitectura no, porque el plan no la pedía.

### 4.2 Smoke / tests

Validación en campo: 2026-10-26 · smoke con una fila por THEN y suite en verde

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (agente, en el cierre) · suite | OK |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (agente, con `me aburro`) · suite | OK |
| sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (agente) · sin test propio | OK |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (agente) · suite | OK |

Lo verificado por el agente en el cierre es la ejecución real de las cuatro filas y la suite; la validación en campo es la del dev-lead, de arriba.

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» no tiene test propio: lo cubre el mismo camino que el motivo fuera de la lista. Va a la deuda («Por triar»).
- Los tests de `cancel.test.js` dependen del orden (ruling de la Task 2). Va a la deuda («Por triar»).
- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso. Ya está en la spec («Approach») y la 0014 lo salda.

## 5. Aprendizajes

- Sin aprendizajes que cambien un documento vivo: la capacidad `bookings` lleva el comportamiento nuevo y no hay convención ni cambio estructural.

Retro: sin señales

## 6. Adendas

- _Ninguna_
