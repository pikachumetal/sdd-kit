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

- `src/app.js` (f837d96): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva; sin motivo o con uno fuera de la lista responde «motivo no válido: …».
- `src/app.js` (1240988): comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas canceladas.
- `test/cancel.test.js`: tests de ambos comandos.
- Capacidad nueva: `.docs/sdd/capabilities/bookings.md`, mezclada con `sdd capability merge`.
- ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-on-booking.md
- `decisions/0002-node-test.md` no tenía «### Confirmación» y `sdd decision check` frenaba el cierre: la añadí («La revisión.»).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`)

## 4. Verificación

### 4.1 Builds

- `node --test`: 5/5 en verde sobre el commit de cierre (el cierre solo añade documentación a `a752e69`, mismo código).
- Gate: sin `operations.md` ni suites declaradas; solo `node --test`.

### 4.2 Smoke / tests

Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (en un solo proceso, porque las reservas viven en memoria) · revisión final Spec y Código limpia sobre 1240988; Arquitectura no (plan). Todo verificado por el agente; el dev-lead no ha probado nada por su cuenta.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| Motivo fuera de la lista (`me aburro`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | ok |
| Sin `--motivo` → el mismo mensaje | ejecución real (sin test) | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real + suite | ok |

### 4.3 Residuales / deuda generada

- `canceladas` solo enseña lo cancelado en el mismo proceso (reservas en memoria hasta la 0014): `node src/app.js canceladas` suelto no muestra nada. Está en la spec.
- Deuda en «Por triar»: test de `canceladas` dependiente del orden; `cancelar` sin `--motivo` sin test propio.

## 5. Aprendizajes

- El motivo vive en la reserva → decisions/0003-cancel-reason-on-booking.md
- Comportamiento observable → capabilities/bookings.md

Retro: sin señales

## 6. Adendas

- _Ninguna_
