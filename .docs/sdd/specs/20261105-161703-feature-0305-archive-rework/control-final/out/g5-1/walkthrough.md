---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-06
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (c511412).
- `canceladas` lista las reservas canceladas con su motivo, «Norte lun — sala ocupada»: `src/app.js`, `test/cancel.test.js` (fed6731).
- Capacidad `bookings` creada con los dos requisitos: `.docs/sdd/capabilities/bookings.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. La bandera no está en `gate.json` ni en ningún fichero de la rama: solo consta en `tasks.md`. El gate del cierre corrió sin ella y pasó 5/5; queda en la deuda.

## 4. Verificación

### 4.1 Builds

- Suite: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 1/2 (5 pasados, 0 fallos) · rooms:test: saltada (el filtro no la ve afectada: la rama no toca `src/rooms.js` ni `test/rooms.test.js`) · 1 s · configuración: la del gate · sobre el commit de cierre
- La base trae un cambio de `test/rooms.test.js` (4 líneas): lo comprueba el paso 6 del cierre, no esta corrida.

### 4.2 Smoke / tests

Validación en campo: 2026-11-06 · suite `bookings:test` 5/5 · smoke 5/5 THEN con ejecución real · revisión final de Spec y Código sobre fed6731, limpia; HEAD solo añadió `tasks.md` (documentación). No probado: el listado tras una cancelación en procesos separados, porque el almacén es memoria de proceso y cada llamada de la CLI parte de cero.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real (`--motivo "porque sí"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde «motivo no válido: …» | ejecución real (`cancelar Norte lun`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (cancelar y listar en un mismo proceso) | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- Workaround del almacén compartido en memoria: aislarlo por test y retirar la bandera `--test-concurrency=1` → fila en la deuda técnica del roadmap.
- Anulaciones del responsable de sala: 0011, fuera de scope.

## 5. Aprendizajes

- El comportamiento observable (motivo obligatorio, lista cerrada, listado) vive en la capacidad `bookings` → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
