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

- `cancelar <sala> <día> --motivo <motivo>`: pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva — `src/app.js`, `test/cancel.test.js` (68642ea).
- Comando `canceladas`: lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js` (88a4647).
- Capacidad nueva `capabilities/bookings.md`, creada por `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

Sin `.docs/sdd/estimation.md`: el proyecto no usa el módulo de estimación.

- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (en deuda técnica).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 7/7 en 410 ms, sobre el commit de cierre.
- Primera pasada: 6/7. `test/store.test.js` falló con `EBUSY: resource busy or locked, open 'data/bookings.json'`. Contrastado según la receta: el fichero solo pasa en la rama y en una base `develop` desprendida (1/1 en las dos, a la vez), y la suite entera pasó a la segunda (7/7). No se repite y el error es de recurso de máquina: fila de test inestable en la deuda técnica.
- Gate: `node --test --test-concurrency=1` → 7/7 · 410 ms · configuración: la del plan más `--test-concurrency=1` · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 7/7 (tras una pasada con un test inestable contrastado) · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre 88a4647; el commit que solo añade `tasks.md` (17 líneas) revisado en el hilo, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `--motivo "porque sí"`) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, en el mismo proceso que la cancelación (el almacén es en memoria) |

### 4.3 Residuales / deuda generada

- `test/store.test.js` es inestable: falla la primera vez si no existe `store-lock` en el directorio común de git — fila en deuda técnica.
- Workaround `--test-concurrency=1` — fila en deuda técnica.

## 5. Aprendizajes

- Ninguno que cambie una convención, la arquitectura o el stack.

Retro: sin señales

## 6. Adendas

- (ninguna)
