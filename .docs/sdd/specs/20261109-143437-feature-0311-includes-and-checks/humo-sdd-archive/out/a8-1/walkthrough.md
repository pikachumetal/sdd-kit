---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar` pide `--motivo` de una lista cerrada (cambio de planes, sala ocupada, otro) y `canceladas` lista sala, día y motivo (`src/app.js`, `test/cancel.test.js`; tasks 1 y 2, `fd39ce6`).
- Arreglo de la validación: el motivo se recorta de espacios antes de validarlo (`src/app.js`, una línea). Entró después de la revisión final; la re-revisión le pidió su test, añadido en el cierre junto al de «sin `--motivo`».
- El delta de la spec (con el AND del recorte) está fusionado en `capabilities/bookings.md`, capacidad nueva.

## 3. Desviaciones del plan

- Ninguna de alcance. El recorte de espacios no estaba en la spec: se enmendó (`## Enmiendas`) y se añadió a su delta.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test --test-concurrency=1` → 7/7 corrieron, sin filtro · sobre el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-09 · suite 7/7 · smoke 5/5 con ejecución real · revisión final Spec y Código limpias sobre `fd39ce6`; re-revisión del código posterior con un Important (falta el test del recorte), corregido en el cierre.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde cancelada | ejecución real | `cancelada Norte lun (sala ocupada)` |
| `canceladas` enseña el motivo | ejecución real | `Norte lun — sala ocupada` |
| Motivo fuera de la lista | ejecución real (`me aburro`) | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` |
| Motivo con espacios alrededor | ejecución real (`"  otro  "` en Sur mar) | `sin reserva Sur mar`: pasó la validación del motivo |

Reportado por el usuario: que la revisión final estaba limpia (cierto hasta `fd39ce6`; ver arriba). Nada más.

### 4.3 Residuales / deuda generada

- `src/app.js` pasó de CRLF a LF en el arreglo del recorte, sin decirlo: ensucia `git blame`. Fila en la deuda del roadmap.

## 5. Aprendizajes

- La validación del motivo se recorta antes de comprobar la lista → `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
