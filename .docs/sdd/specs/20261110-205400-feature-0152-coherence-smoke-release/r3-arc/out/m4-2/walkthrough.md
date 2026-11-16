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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`d801781`, Task 1).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas (`9137a85`, Task 2).
- `test/cancel.test.js`: tests de ambos comandos (`d801781`, `9137a85`).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos del delta, mezclada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ respecto a `plan.md` y a la spec.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar una carrera de los tests sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda más. Al cierre no se reproduce: `node --test` pasa 5/5 sin él; fila de deuda abierta.
- Cierre: revertí `migrations/v3.0.0.md` a `e8552a4`. Un commit posterior a la revisión final había cambiado su paso 3 de «renombra `roadmap.md` a `ROADMAP.md`» a «borra `roadmap.md` al acabar»: fuera del alcance de la 0010 y, en un sistema de ficheros sin distinción de mayúsculas, borraría `ROADMAP.md`. Lo marcó la re-revisión como Crítico — coste si está mal: se pierde un cambio que alguien quería para esa migración; está en el historial y se recupera.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde; `node --test --test-concurrency=1` → 5/5 en verde.
- Gate: `node --test` → suite: corrió 5/5 · 0,1 s · configuración: la del gate de la constitución · sobre el commit de cierre (el cierre solo añade docs y revierte `migrations/v3.0.0.md`; el código no cambia).
- Revisión final: Spec (opus) y Código (sonnet) limpias sobre `9137a85`. Re-revisión de lo posterior (opus): 1 Crítico, arreglado por mí; 2 Menores (`tasks.md`), corregidos o con ruling. Queda 1 `sin revisar`: el revert de `migrations/v3.0.0.md` a lo que ya estaba en `e8552a4`.

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre `9137a85`, re-revisión con 1 Crítico arreglado y 1 sin revisar.

Verificado por el agente; nadie del equipo ha probado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real + suite | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real + suite | `motivo no válido: cambio de planes, sala ocupada, otro` (con «me aburro») |
| sin `--motivo` responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro`; sin test en la suite |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real + suite | `Norte lun — sala ocupada`, cancelando y listando en el mismo proceso |

No probado: `canceladas` en un proceso suelto, tras cancelar en otro. El almacén es en memoria y cada comando de la CLI arranca de cero: sale vacío.

### 4.3 Residuales / deuda generada

- `canceladas` por la CLI suelta sale vacío: el almacén de reservas es en memoria (fila en «Por triar»).
- Sin test del THEN «sin `--motivo`» (fila en «Por triar»).
- Gate con `--test-concurrency=1` sin motivo reproducible (fila en «Por triar»).

## 5. Aprendizajes

- Las reservas viven en memoria del proceso y cada comando de la CLI arranca vacío → `.docs/sdd/steering/architecture.md`.
- El comportamiento nuevo (motivo y listado) → `.docs/sdd/capabilities/bookings.md`.

Retro: documento o skill desmentido → `tasks.md` daba `9137a85` como commit de la Task 1 y era `d801781`; corregido en el propio `tasks.md` (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna._
