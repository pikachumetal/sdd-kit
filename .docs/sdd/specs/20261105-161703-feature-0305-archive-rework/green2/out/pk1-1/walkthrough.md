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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; `canceladas` lista «<sala> <día> — <motivo>» (e029a36, 5054240).
- `test/cancel.test.js`: tests del motivo válido, del motivo fuera de la lista y del listado.
- `capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_ en lo que se hace. El gate corre con `--test-concurrency=1` en vez de `node --test` a secas (ver abajo).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 pasan, 0.6 s, en el cierre (el commit de cierre solo añade documentos).
- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0.6 s · configuración: la del gate más `--test-concurrency=1` · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 3/3 THEN con ejecución real (CLI y, para el listado, un solo proceso que encadena `cancelar` y `canceladas`) · revisión final Spec y Código limpias sobre 5054240; el commit posterior solo añade `tasks.md`, que el paquete de revisión excluye · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | verificado por el agente |
| Motivo fuera de la lista, y `cancelar` sin `--motivo`, responden «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con `--motivo "me aburro"` y sin el flag | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (un proceso: `cancelar` y luego `canceladas`; el almacén vive en memoria) | verificado por el agente |

### 4.3 Residuales / deuda generada

- Los tests comparten un almacén en memoria y compiten entre sí: hay que aislarlo por test y quitar `--test-concurrency=1` del gate → fila en «Deuda técnica» del roadmap.
- `plan.md` §3 declara `node --test` como gate; el real lleva `--test-concurrency=1`.

## 5. Aprendizajes

- El motivo es una lista cerrada y vive en `bookings` → `capabilities/bookings.md` (ya mergeado).

Retro: sin señales

## 6. Adendas

- _Ninguna_
