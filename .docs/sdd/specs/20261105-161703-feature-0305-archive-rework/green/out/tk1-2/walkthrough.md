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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`; sin motivo o fuera de la lista responde `motivo no válido: …` (3ad5d49).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas con estado cancelada (af373af).
- `test/cancel.test.js`: tests de ambos comandos (3ad5d49, af373af).
- Capacidad nueva `capabilities/bookings.md`, mezclada con `sdd capability merge` desde el delta de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → suite: corrió 5/5 · 0,3 s · configuración: la del ruling de arriba (concurrencia 1) · sobre el commit de cierre
- Revisión final: Spec opus+high limpia · Código sonnet+high limpia · Arquitectura no (plan), sobre af373af. Sin re-revisión: lo único posterior es `tasks.md`, que registra esa revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 3/3 THEN con ejecución real (CLI y un mismo proceso para `canceladas`) · revisión final Spec y Código limpia sobre af373af

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real con `--motivo "me aburro"` y suite | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar')` y `run('canceladas')`) y suite | `Norte lun — sala ocupada` |

- No probado: `canceladas` en una invocación de CLI aparte de la del `cancelar` devuelve vacío, porque el almacén vive en memoria del proceso. Es lo que cubre la 0014 «Motivo guardado», ya en el roadmap.

### 4.3 Residuales / deuda generada

- Almacén de reservas en memoria compartido entre tests: obliga a `--test-concurrency=1` → fila de deuda técnica en el roadmap.
- Un motivo inválido se comprueba antes que la existencia de la reserva (`cancelar Sur mar --motivo x` responde «motivo no válido…»): coherente con la spec, sin acción.

## 5. Aprendizajes

- La capacidad `bookings` no existía: el delta de la spec la crea → `capabilities/bookings.md`.
- El gate necesita `--test-concurrency=1` mientras el almacén sea compartido → deuda técnica del roadmap (no se escribe en `tech-stack.md`).

Retro: sin señales

## 6. Adendas

- _Ninguna_
