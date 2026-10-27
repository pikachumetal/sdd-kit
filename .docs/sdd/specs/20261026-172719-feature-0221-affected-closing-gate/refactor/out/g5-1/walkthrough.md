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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de una lista cerrada (cambio de planes, sala ocupada, otro); con un motivo fuera de la lista o sin él responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`; Task 1, 2999b26).
- `canceladas`: lista las reservas canceladas con su motivo, «Norte lun — sala ocupada» (`src/app.js`, `src/rooms.js`, `test/cancel.test.js`, `test/rooms.test.js`; Task 2, 2999b26).
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`, fusionada con `sdd capability merge`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre 2999b26 más el commit de documentación de `tasks.md` (juntado en el cierre; no cambia código ni tests).
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base 2999b26` → rooms:test: corrió 1/2 (2 pasan, 0 fallan) · bookings:test: saltada (la base solo trajo `test/rooms.test.js`, que no es entrada suya) · 1 s · configuración: la del gate · sobre la fusión de sincronización 90a8004 (`develop` traía 23e6580).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · smoke por THEN (`node src/app.js cancelar Norte lun --motivo sala-ocupada`) y suite en verde sobre 2999b26 más el commit de documentación de `tasks.md` (juntado en el cierre) · revisión final de Spec y Código limpia sobre 2999b26. Rehecho en el cierre el 2026-10-27 con la tabla de abajo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | verificado por el agente |
| Motivo fuera de la lista (`vacaciones`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | verificado por el agente |
| Sin `--motivo` responde lo mismo | ejecución real + suite | verificado por el agente |
| `canceladas` tras cancelar con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso (`run('cancelar', …)` y `run('canceladas', [])`) + suite; por la CLI en dos procesos sale vacío, porque el almacén es en memoria | verificado por el agente |

### 4.3 Residuales / deuda generada

- El gate de la feature usó `--test-concurrency=1` por la carrera de los tests sobre el almacén en memoria: fila en la deuda técnica del roadmap.
- Los motivos no sobreviven al proceso: es la 0014 «Motivo guardado», ya en el roadmap.

## 5. Aprendizajes

- Comportamiento observable de la cancelación y del listado → `capabilities/bookings.md`.
- Sin convención, cambio estructural ni versión nuevos → `constitution.md`, `architecture.md` y `tech-stack.md` no cambian (`architecture.md` no existe y nada estructural lo pide).
- Revisión de skills: el proyecto no tiene `.claude/skills/` y este trabajo no revela un patrón reutilizable ni desmiente nada: no aplica.

## 6. Adendas

- _Ninguna_
