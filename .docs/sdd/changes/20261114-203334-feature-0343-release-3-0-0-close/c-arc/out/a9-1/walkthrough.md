---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (task 1, `861518f`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (task 2, `25ac3c5`): comando `canceladas`, que lista las reservas canceladas como «Norte lun — sala ocupada». Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` enseña lo cancelado en el mismo proceso. Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Capacidad** `bookings` creada con `sdd capability merge` desde el delta de la spec (dos requisitos añadidos): `.docs/sdd/capabilities/bookings.md`.
- **Deuda**: sale «El motivo de cancelar no se valida»; «Los motivos no se traducen» se queda solo con el inglés.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Tiene su fila en «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test` (gate de cierre de la constitución, regla 2): 5/5 en verde, sobre el commit de cierre. El proyecto no declara más suites ni gate; no hay otra rama abierta y `develop` no está por delante, así que no hay base que integrar.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `25ac3c5`; desde entonces solo cambió `tasks.md`. Sin validación del dev-lead: no dijo qué probó. Verificado por el agente, nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un mismo proceso, tras cancelar: `Norte lun — sala ocupada` |

- No probado: `canceladas` en un proceso nuevo (`node src/app.js canceladas`) sale vacío, porque las reservas viven en memoria hasta la 0014; la spec lo declara.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de arriba) → «Por triar» de `debt.md`.
- Los motivos no se traducen al inglés → fila de «Lista» de `debt.md`, sin fila en el roadmap todavía.

## 5. Aprendizajes

- Sin aprendizajes de convención ni de estructura: el cambio no añade ficheros ni capas. El comportamiento observable vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
