---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `src/app.js`, `test/cancel.test.js` — 2a2b3e3.
- `canceladas` lista las reservas canceladas con su motivo; `src/app.js`, `test/cancel.test.js` — 66c871a.
- Capacidad nueva `bookings` (`capabilities/bookings.md`), fusionada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_ en alcance. El plan pedía como gate de cierre `node --test`; se cerró con el gate de `gate.json` (`bookings:test`, `rooms:test`, filtrado por tareas).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Nota del cierre: `gate.json` no lleva ese flag en sus comandos; el workaround no está en el repo y queda como deuda (ver 4.3).

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus, effort high) limpia · Código (sonnet, effort high) limpia · Arquitectura no (plan) — sobre 66c871a. Lo posterior solo añadió `tasks.md` (17 líneas, documentación): sin re-revisión.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus inputs `src/rooms.js` y `test/rooms.test.js` no cambian en la rama) · 1 s · configuración: la del gate · sobre 66c871a más `tasks.md` (mismo código). Lo corrí yo en el cierre y salió verde.

### 4.2 Smoke / tests

Validación en campo: 2026-10-27 · gate bookings:test 5/5 (rooms:test saltada) · smoke 4/4 THEN con ejecución real (el listado, en un solo proceso) · revisión final Spec y Código limpia sobre 66c871a · no probado: `canceladas` en una invocación aparte de la CLI (el almacén es en memoria, ver 4.3)

Corrección: el borrador de esta línea citaba `--motivo sala-ocupada`, que la app rechaza («motivo no válido»); el smoke de abajo es el que ejecuté con los motivos de la lista.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) + suite | verificado |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | verificado |
| Sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | verificado |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real: `run('cancelar', …)` y `run('canceladas', [])` en un mismo proceso + suite | verificado; `no probado` en dos invocaciones separadas de la CLI |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria: en la CLI, `canceladas` en un proceso aparte no ve lo cancelado en otro. Ya está planificado como 0014 «Motivo guardado».
- El workaround `--test-concurrency=1` (ruling de la Task 2) no está en `gate.json`: fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El workaround de la carrera de tests sobre el almacén compartido es provisional → deuda técnica del roadmap (fila nueva). No se escribe en `tech-stack.md`.
- Revisión de skills: no aplica; miré `.claude/skills/` y el proyecto no tiene.
- Sin `architecture.md` en el proyecto y sin aprendizaje estructural que pida uno.

## 6. Adendas

- _Ninguna_
