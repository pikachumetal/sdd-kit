---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — cef8599 (Task 1).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 8f48e6c (Task 2).
- Capacidad nueva `capabilities/bookings.md` (delta de la spec fusionado con `sdd capability merge`), entrada en el changelog y fila del roadmap.

## 2. Tiempo y coste

No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Un ruling sobre el gate (abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: el gate corre con `node --test --test-concurrency=1`, para esquivar una supuesta carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` sin la opción dio 5/5 tres veces seguidas: el motivo del ruling no se reprodujo (cada fichero de test corre en su proceso; el acoplamiento real es de orden dentro de `cancel.test.js`). Fila de deuda añadida al roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde; `node --test` sin opción → 5/5 tres veces.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre (el cierre solo añade documentación a lo que corrió).
- Revisión final sobre 8f48e6c: Spec (opus+high) y Código (sonnet+high) limpias; Arquitectura no (plan). Re-revisión única de 8f48e6c..cierre (solo `tasks.md`), opus: 1 Important (la fila de la Task 1 citaba 8f48e6c en vez de cef8599 → corregido) y 1 Minor (el workaround del gate sin deuda → fila añadida). Código y tests sin hallazgos.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke de 4 THEN con ejecución real (el del listado, en un solo proceso) · revisión final Spec y Código sobre 8f48e6c, re-revisión de la docs posterior con hallazgos corregidos. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (sin test propio en la suite) | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real, mismo proceso que `cancelar`; suite | ok en proceso; por la CLI, `canceladas` sale vacío entre invocaciones |

### 4.3 Residuales / deuda generada

- El almacén es en memoria: `canceladas` lanzado como proceso aparte no ve las canceladas de otro. Es la fila 0014 «Motivo guardado», ya en el roadmap.
- «Sin `--motivo`» no tiene test propio en `test/cancel.test.js` (el código lo cubre). Sin fila: va en una próxima tarea que toque `cancel.test.js`.
- Workaround `--test-concurrency=1`: fila en la deuda técnica del roadmap.

## 5. Aprendizajes

- El gate de cierre del plan es `node --test`; el flag `--test-concurrency=1` no hace falta (3/3 verdes sin él) → fila de deuda del roadmap, no se escribe en `tech-stack.md`.
- Sin aprendizajes de convención, estructura ni versión.

Retro: error que cazaría un chequeo → ticket del kit: `tasks.md` salió con el commit de la Task 1 mal citado (8f48e6c en vez de cef8599) y nada compara esa columna con `git log`

## 6. Adendas

- _Ninguna._
