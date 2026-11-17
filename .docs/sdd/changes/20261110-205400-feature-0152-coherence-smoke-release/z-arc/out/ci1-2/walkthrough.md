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

- **Cancelar con motivo** (`aeeb1b2`): `src/app.js` y `test/cancel.test.js`. `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin motivo o con uno fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (`2c95cf3`): `src/app.js` y `test/cancel.test.js`. El comando `canceladas` lista «<sala> <día> — <motivo>».
- Capacidad nueva `bookings` en `capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 0,4 s, sobre el código de `2c95cf3` (lo posterior solo toca ficheros de `.docs/`).
- Gate: `node --test` → corrió 5/5 · 0,4 s · configuración: la del plan (§3, «Gate de cierre») · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · suite 5/5 · smoke 5/5 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `2c95cf3`; lo posterior solo toca documentación, sin re-revisión. Nada `no probado`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` (sin test en la suite) |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con ese motivo | ejecución real | en un solo proceso (el almacén es en memoria): `cancelar` y luego `canceladas` → `Norte lun — sala ocupada` |
| el listado de canceladas enseña el motivo | suite | `test/cancel.test.js`, «canceladas enseña sala, día y motivo» |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primer test de `test/cancel.test.js` (ruling de la Task 2): deuda en «Por triar».
- El THEN «sin `--motivo`» no tiene test en la suite; solo se probó con ejecución real: deuda en «Por triar».

## 5. Aprendizajes

- El motivo de la cancelación y el listado son comportamiento observable → `capabilities/bookings.md` (delta de la spec, fusionado con `sdd capability merge`).
- Sin aprendizajes de convención, estructura ni versión: `constitution.md`, `architecture.md` y `operations.md` sin cambios.

Retro: sin señales

## 6. Adendas

- _Ninguna_
