---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelBooking(room, day, reason)` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; `--motivo` se lee con `reasonOf`. Nuevo comando `canceladas` que lista `<sala> <día> — <motivo>`. Commit 4dfea76 (Task 1) y 8f63f9c (Task 2).
- `test/cancel.test.js`: tests del motivo válido, del inválido, de la falta de `--motivo` y del listado.
- Capacidad `bookings` creada a partir del delta de la spec (`capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Ojo: `gate.json` no lleva esa opción en sus comandos; el ruling no está aplicado en el gate. Fila de deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus inputs `src/rooms.js` y `test/rooms.test.js` no cambian en la rama, según el gate) · 2 s · configuración: la del gate (`gate.json`) · sobre el commit de cierre (el cierre junta el commit de tasks.md, solo documentación).

### 4.2 Smoke / tests

Validación en campo: 2026-10-29 · verificado por el agente: gate en verde (arriba) y smoke con ejecución real de los 4 THEN de la spec; `no probado`: el listado desde la CLI en dos procesos distintos, porque el almacén es en memoria y `canceladas` solo ve lo cancelado en su mismo proceso (guardarlo es la 0014). El dev-lead no ha dicho qué probó. El borrador anterior citaba `--motivo sala-ocupada`, que la spec rechaza: sustituido por el smoke de abajo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| un motivo fuera de la lista (`--motivo vacaciones`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) y suite | ok; desde la CLI en procesos separados responde vacío (`no probado` así, ver arriba) |

### 4.3 Residuales / deuda generada

- Aislar el almacén por test para quitar el workaround de concurrencia (fila de deuda en el roadmap).
- Persistir el motivo entre procesos: ya es la 0014.

## 5. Aprendizajes

- El almacén de reservas en memoria hace que `canceladas` no sirva entre ejecuciones de la CLI → 0014 (ya en el roadmap), sin cambio en docs vivos.
- Revisión de skills: miré `.claude/skills/` y el proyecto no tiene; ningún patrón reutilizable que lo justifique. No aplica.
- ADR: la spec no declara candidatas.

## 6. Adendas

- _Ninguna_
