---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelBooking` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)»; sin motivo o fuera de la lista responde «motivo no válido: …». Commit `8ea7aec`.
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>». Commit `d244a74`.
- `test/cancel.test.js`: tres tests (motivo válido, motivo fuera de la lista, listado). Commits `8ea7aec` y `d244a74`.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con el delta de la spec fusionado con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en la spec ni en las tasks. `tasks.md` anotaba la Task 1 con el commit `d244a74`; el suyo es `8ea7aec` (corregido en el cierre).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria (workaround hasta aislar el almacén por test) — coste si es erróneo: la suite tarda el doble. Anotado como deuda en «Por triar».

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` sobre el commit de cierre: 5/5 tests verdes, 0 fallos (salida completa guardada en el scratchpad de la sesión).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,15 s · configuración: la del gate del plan más `--test-concurrency=1` (ruling de la Task 2) · sobre el commit de cierre.

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real (un solo proceso, en orden) · revisión final Spec y Código sin hallazgos, sobre d244a74 · el commit de solo `tasks.md` (17 líneas), juntado en el cierre, revisado en el hilo.

Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista (`cancelar Sur mar --motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` (`cancelar Norte lun`) responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El almacén de reservas es compartido en memoria y los tests compiten por él: workaround `--test-concurrency=1` → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Ningún aprendizaje nuevo de convención, estructura o herramienta: el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: documento o skill desmentido → ticket del kit: `final-review-check.md` trata el commit de solo documentación bajo 20 líneas como uno que obliga a la re-revisión, y `sdd-implement` («Every commit of yours») y `sdd-verify` dicen que ese commit se lee en el hilo y no abre ninguna

## 6. Adendas

- _Ninguna._
