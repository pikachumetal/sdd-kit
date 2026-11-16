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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada (task 1, 76f7062).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas (task 2, 0c22655).
- `test/cancel.test.js`: tres tests, motivo válido, motivo fuera de la lista y listado.
- Docs: capacidad nueva `bookings`, ADR 0003 y este walkthrough.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en las tasks ni en los ficheros.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Comprobado en el cierre: solo, falla (`actual: ''`). Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, ejecutado por el agente en el cierre.
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre (desde 0c22655 solo han cambiado `.docs/`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 5/5 THEN con ejecución real (el de `canceladas` en un solo proceso) · revisión final Spec y Código limpia sobre 0c22655

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | verificado por el agente |
| Sin `--motivo` responde lo mismo | ejecución real (sin la opción); sin test en la suite | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» tras la cancelación | ejecución real en un solo proceso | verificado por el agente |
| Lo mismo desde la CLI, `canceladas` en un proceso nuevo | ejecución real: salida vacía | no cumple por diseño: las reservas viven en memoria ([ADR 0001](../../decisions/0001-bookings-in-memory.md)) y cada llamada de `node src/app.js` empieza de cero |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primero → deuda «Por triar».
- Sin test del `cancelar` sin `--motivo`; solo lo cubre la ejecución real de arriba.

## 5. Aprendizajes

- El motivo vive en la reserva cancelada → ADR 0003 (`decisions/0003-cancel-reason-on-booking.md`).
- Cancelar con motivo y el listado → capacidad `bookings` (`capabilities/bookings.md`).
- ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-on-booking.md
- El ADR 0002 no pasaba `sdd decision check` (faltaba «Confirmación»): añadida en el cierre → `decisions/0002-node-test.md`.

Retro: sin señales

## 6. Adendas

- Ninguna.
