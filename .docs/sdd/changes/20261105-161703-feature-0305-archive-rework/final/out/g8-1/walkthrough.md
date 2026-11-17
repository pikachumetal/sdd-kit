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

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» — `src/app.js`, `test/cancel.test.js` (7740a13).
- `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada») — `src/app.js`, `test/cancel.test.js` (a33fd76).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_ en lo que hace el código.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Ojo: ese flag no está en `gate.json` ni en `package.json` (`bookings:test` sigue siendo `node --test test/app.test.js test/cancel.test.js`) y `plan.md` fija `node --test`; la re-revisión del cierre lo señaló. El ruling queda como decisión de ejecución no aplicada al repositorio, y la carrera como deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (`--affected`: la rama no toca sus inputs) · 1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

Validación en campo: 2026-11-06 · suite 5/5 en verde · smoke 5/5 THEN con ejecución real (la salida de la CLI, con la entrada que falla para los THEN de fallo; el almacén es en memoria, así que `cancelar` y `canceladas` corrieron en el mismo proceso) · revisión final Spec y Código limpia sobre a33fd76; re-revisión de a33fd76..cierre sin cambios de código y con 2 apuntes de registro, corregidos en el cierre.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (tras cancelar, en el mismo proceso) | `Norte lun — sala ocupada` |

Verificado por el agente: todo lo anterior. Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- Carrera entre tests por el almacén de reservas compartido en memoria → fila en «Deuda técnica» del roadmap.
- `sdd roadmap check` da 2 fallos en líneas que este cierre no escribió (la cabecera de «Deuda técnica» y el título de la release v0.3.0): los arregla el paso «Roadmap en la forma de la plantilla» de la migración v2.3.0.

## 5. Aprendizajes

- El workaround de la carrera de los tests sobre el almacén en memoria → deuda técnica del roadmap (no se escribe en `tech-stack.md`).
- El comportamiento nuevo (motivo de la lista, listado de canceladas) → `.docs/sdd/capabilities/bookings.md`.

ADR: sin candidatas en la spec.

Retro: sin señales

## 6. Adendas

- _Ninguna_
