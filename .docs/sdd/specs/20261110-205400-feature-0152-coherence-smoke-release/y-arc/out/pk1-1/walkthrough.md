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

- **Cancelar con motivo** (`a9b2c72`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Un motivo fuera de la lista, o la ausencia de `--motivo`, responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`c2a0e3b`): el comando `canceladas` lista «<sala> <día> — <motivo>» de las reservas canceladas. Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Capacidad**: nace `capabilities/bookings.md` con los dos requisitos del delta, fusionados con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. La spec está aprobada (Laura, 2026-10-08).

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero sobre el código de `c2a0e3b` (el resto son documentos): 5/5 en verde (la salida completa está guardada en el scratchpad de la sesión).
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre (el cierre solo añade documentos a `c2a0e3b`).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código, limpia, sobre `c2a0e3b`; `HEAD` solo añadió `tasks.md`, sin re-revisión · el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con la entrada que falla | ok |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas`, tras cancelar Norte lun con «sala ocupada», responde «Norte lun — sala ocupada» | ejecución real (un solo proceso: el almacén vive en memoria) | ok |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: `canceladas` necesita la cancelación del primer test. Pasa a «Por triar» de la deuda.

## 5. Aprendizajes

- Ninguno estructural ni de convención: el cambio de comportamiento queda en `capabilities/bookings.md`. Sin cambios en `constitution.md` ni `architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna._
