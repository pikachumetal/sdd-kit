---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — `7b6daf9`.
- Comando `canceladas`: lista las reservas canceladas como «sala día — motivo». `src/app.js`, `test/cancel.test.js` — `3469bd5`.
- La capacidad `bookings` nace en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta.

## 2. Tiempo y coste

No existe `.docs/sdd/estimation.md`: sin estimado ni fila en el estimation-log.

- Esfuerzo real: 0,05 h — reloj de 2 sesiones 0,05 h desde 2026-10-16T11:37Z, sin 0 min de espera al dev-lead (0 esperas)
- Tokens del hilo: 856.379 — claude-sonnet-5-5 856.379
- Tokens de subagentes: no aplica
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Dos tasks, Native, como el plan.
- Al cerrar: `bookings` no tenía fichero en `capabilities/` y la spec la declaraba «Modificadas»; `sdd capability merge` lo rechazó. Pasa a «Nuevas» en el bloque «Capacidades» de la spec, con una enmienda fechada. El delta no cambió.
- `tasks.md` apuntaba la Task 1 al commit `3469bd5`; el suyo es `7b6daf9`. Corregido.

### Decisiones tomadas sin el dev-lead

- Task 2: gate de tests con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria, hasta aislar el almacén por test — coste si está mal: la suite tarda el doble. Fila en la deuda técnica del roadmap.
- Cierre: pasar `bookings` de «Modificadas» a «Nuevas» en la spec ya aprobada (ver sección 3). No cambia el comportamiento aprobado, solo la declaración de la capacidad.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pasan, 0 fallan · 0,15 s, sobre `982a9e9` (mismo código que `3469bd5`: el commit posterior solo toca `tasks.md`). Verificado por el agente.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · verificación del agente: suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre 3469bd5, limpia (HEAD solo añade `tasks.md`, sin re-revisión). Nadie del equipo ha probado el cambio a mano: todo lo de abajo lo verificó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real (`node src/app.js …`) | ok |
| Motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| Sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | suite · ejecución real en un solo proceso (`run` de `src/app.js`) | ok |

### 4.3 Residuales / deuda generada

- El almacén de reservas es un array en memoria: cada ejecución de `node src/app.js` empieza de cero, así que `canceladas` por la CLI solo enseña algo en el mismo proceso. Ya está cubierto por la fila 0014 del roadmap («Motivo guardado»).
- Los tests comparten el almacén y exigen `--test-concurrency=1` → fila en la deuda técnica del roadmap.
- Sin test para «sin `--motivo`»: lo cubre el mismo camino que el motivo fuera de lista, pero la spec lo promete aparte. Anotado en la misma fila de deuda.

## 5. Aprendizajes

- El comportamiento observable de cancelar con motivo → `capabilities/bookings.md` (creada al cerrar, con `sdd capability merge`).
- La carrera de los tests sobre el almacén en memoria → deuda técnica del roadmap; no se escribe en `tech-stack.md`, que no declara gate de tests.
- Revisión de skills: `.claude/skills/` no existe en el proyecto y el trabajo no reveló un patrón reutilizable → no aplica.

## 6. Adendas

- (ninguna)
