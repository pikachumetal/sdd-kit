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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando `canceladas` (`7347db3`, `47fd903`).
- `test/cancel.test.js`: pruebas de cancelar con motivo, con motivo fuera de la lista y del listado.
- `capabilities/bookings.md`: creada con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (fila en «Por triar» de la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde, sobre el commit de cierre (el código no cambió desde `7347db3`; solo docs).
- Gate: `node --test --test-concurrency=1` → suite completa: corrió 5/5 · sobre el commit de cierre
- Revisión final: Spec y Código limpias sobre `7347db3`; `HEAD` solo añadió el registro de esa revisión en `tasks.md`.

### 4.2 Smoke / tests

Verificado por el agente (CLI real, `node src/app.js …`); nada reportado por el usuario.

- Validación en campo: 2026-11-05 · suite 5/5 · smoke con ejecución real de 4 THEN, 1 con matiz (ver tabla) · revisión final Spec y Código limpia sobre 7347db3

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Sur mar --motivo xyz` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` (sin prueba en la suite) |
| `canceladas` responde «Norte lun — sala ocupada» | suite; ejecución real solo en un mismo proceso | en la CLI como proceso aparte sale vacío: el almacén es en memoria y no persiste entre ejecuciones; en un mismo proceso (`cancelar` y luego `canceladas`) sale `Norte lun — sala ocupada`. La prueba de la suite pasa por depender del estado que deja la anterior |

### 4.3 Residuales / deuda generada

- `canceladas` no ve lo cancelado por otra ejecución de la CLI (almacén en memoria) y su prueba depende del orden de los tests → «Por triar».
- Workaround `--test-concurrency=1` → «Por triar».
- Los motivos no se traducen al inglés: la fila queda con lo pendiente.

## 5. Aprendizajes

- Los THEN de salida de CLI se prueban como proceso aparte: una prueba que comparte estado en memoria con la anterior puede pasar donde la CLI real no → deuda «Por triar» (sin destino vivo: no hay `architecture.md` ni convención que lo recoja).

Retro: sin señales

## 6. Adendas

