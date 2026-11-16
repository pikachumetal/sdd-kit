---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» — `src/app.js`, `test/cancel.test.js`, commit e868506 (task 1).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>» — `src/app.js`, `test/cancel.test.js`, commit 1070fd6 (task 2).
- Capacidad nueva `bookings` fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Sin `estimation.md` en el proyecto, no hay sección de tiempo.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` a secas pasó 3 de 3 veces, así que el workaround no hizo falta para que el gate pase; el gate del plan y de la constitución sigue siendo `node --test`.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → suite: corrió 5/5, pass 5, fail 0 · 0,15 s · configuración: la del gate (también una pasada con `--test-concurrency=1`, verde, y tres con `node --test` a secas, verdes) · sobre el commit de cierre (el commit de cierre solo añade `.docs/` y `*.md`; el código es el de 1070fd6, revisado).
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre 1070fd6; Arquitectura no (plan). `HEAD` solo añadió `tasks.md`, sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · verificada por el agente: suite 5/5 · smoke con ejecución real de 4 de los 5 THEN/AND, el de `canceladas` no reproducible desde la CLI (ver abajo) · revisión final limpia sobre 1070fd6. El dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | cumple |
| AND un motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real + suite | cumple |
| AND sin `--motivo` responde lo mismo | ejecución real (la suite no lo cubre) | cumple |
| `canceladas` responde «Norte lun — sala ocupada» | suite; ejecución real: no probado | **no se cumple desde la CLI**: cada `node src/app.js …` arranca con el almacén vacío, así que `canceladas` en un proceso nuevo responde vacío. Solo pasa en la suite porque comparte proceso con el test anterior |

### 4.3 Residuales / deuda generada

- El listado de canceladas no es utilizable de verdad hasta que el motivo y la cancelación se guarden entre ejecuciones: es la fila 0014 «Motivo guardado» del roadmap, que ya existía. No se arregla aquí: el spec no pedía persistencia.
- Los tests de `test/cancel.test.js` dependen del orden y del estado compartido en memoria (el test de `canceladas` usa la cancelación del primero): fila de deuda en el roadmap.

## 5. Aprendizajes

- Un THEN visto en la CLI con estado en memoria no se puede dar por verificado con la suite: hay que ejecutarlo en proceso nuevo → ninguno nuevo para los docs vivos; queda en este walkthrough y en la fila 0014.
- Revisión de skills: `.claude/skills/` no existe en el proyecto; este trabajo no revela un patrón reutilizable → no aplica.
- `tech-stack.md`, `constitution.md`: sin cambios; el comportamiento observable vive en `capabilities/bookings.md`.

## 6. Adendas

- _(ninguna)_
