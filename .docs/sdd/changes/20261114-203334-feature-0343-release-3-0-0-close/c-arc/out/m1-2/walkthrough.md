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

- **Task 1 — Cancelar con motivo** (`eee672c`): `src/app.js` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)». Un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro». Test en `test/cancel.test.js`.
- **Task 2 — Listado de canceladas** (`046e720`): comando `canceladas` en `src/app.js`, que lista sala, día y motivo de las reservas canceladas («Norte lun — sala ocupada»). Test en `test/cancel.test.js`.
- **Docs vivos** (commit de cierre): la línea de `.docs/sdd/steering/architecture.md` que dice que `src/app.js` valida el motivo al cancelar, y la capacidad nueva `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Pasa a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre. Salida completa guardada fuera del repo.
- Gate: `node --test` → suite del proyecto: corrió 5/5 · 0,2 s · configuración: la del proyecto, sin añadidos · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (un solo proceso, porque las reservas viven en memoria) · revisión final Spec y Código limpia · sin probar: nada. Nadie del equipo ha probado la feature a mano: es verificación del agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con «porque sí») |
| sin `--motivo` responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: `canceladas` necesita la cancelación del primer test. Fila en «Por triar» de `debt.md`.
- `canceladas` solo enseña lo cancelado en el mismo proceso, porque las reservas viven en memoria hasta la 0014 (ya en el roadmap).

## 5. Aprendizajes

- La línea de «Estructura» dice ahora que `src/app.js` también valida el motivo al cancelar → `steering/architecture.md`
- Cancelar pide un motivo de la lista y `canceladas` lo enseña → `capabilities/bookings.md`, fusionada de la spec con `sdd capability merge`

Retro: sin señales

## 6. Adendas

- _Ninguna_
