---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-06
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva y responde `cancelada <sala> <día> (<motivo>)`. Sin motivo o con uno fuera de la lista responde `motivo no válido: …`. `src/app.js`, `test/cancel.test.js` — c04acf8.
- `canceladas` lista las reservas canceladas con su motivo (`Norte lun — sala ocupada`). `src/app.js`, `test/cancel.test.js` — 36e009e.
- Capacidad `bookings` creada con los dos requisitos de la spec: `capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Con fila en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` en el árbol de cierre: 6/6. La primera pasada dio 5/6, con `test/ids.test.js` en rojo (ver 4.3); el fichero solo y la suite entera, repetidos en la rama y en un worktree desanclado de `develop`, dieron verde.
- Gate: `node --test --test-concurrency=1` → suite: corrió 6/6 · sobre el commit de cierre.
- Revisión final: ejes Spec (opus) y Código (sonnet), limpios, sobre 36e009e; Arquitectura no, por el plan. El único commit posterior, de documentación (`tasks.md`, 17 líneas), lo leí yo: revisado en el hilo, sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-06 · suite 6/6 · smoke 3/3 THEN con ejecución real (el listado, en un mismo proceso, porque el almacén es en memoria) · revisión final Spec y Código limpia sobre 36e009e. Nadie del equipo ha probado el cambio a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "porque sí"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (cancelar y listar en un mismo proceso) |

### 4.3 Residuales / deuda generada

- `test/ids.test.js` falla la primera vez que corre en un repo sin `.git/ids-store`: lee ese fichero, lo escribe y luego compara. Fila en la deuda técnica.
- `--test-concurrency=1` esquiva la carrera sobre el almacén en memoria sin arreglarla. Fila en la deuda técnica.

## 5. Aprendizajes

- Un test que lee y escribe estado fuera del árbol de trabajo (`.git/ids-store`) da rojo solo en la primera pasada y verde en las siguientes: una repetición no basta para contrastarlo → deuda técnica del roadmap.

Retro: documento desmentido → `tasks.md` daba `36e009e` como commit de la Task 1 y es `c04acf8`; corregido en el mismo documento (`tasks.md`)

## 6. Adendas

