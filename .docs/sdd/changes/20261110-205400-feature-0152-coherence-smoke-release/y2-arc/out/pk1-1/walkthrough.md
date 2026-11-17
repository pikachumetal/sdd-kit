---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». Task 1, `554b088`.
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas. Task 2, `d0815fc`.
- `test/cancel.test.js`: tests de ambos comportamientos.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, mezclada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (comprobado: corrido solo da `actual: ''`). Fila en «Por triar» de `debt.md`.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 tests, 0 fallos, verde sobre `dc5aa39` (el cierre solo suma `.docs/` y este cierre no toca código desde `d0815fc`).
- Gate: `node --test` → suite única: corrió 5/5 · duración 0,2 s · configuración: la del proyecto, sin filtro · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke de 4 THEN con ejecución real (el del listado, en un solo proceso: ver 4.3) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `d0815fc`; `HEAD` solo añadió `tasks.md`, sin re-revisión · arquitectura sin revisar (lo decidió el plan).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (importando `run` en un solo proceso) · suite | `Norte lun — sala ocupada`; como CLI en un proceso nuevo sale vacío, ver 4.3 |

### 4.3 Residuales / deuda generada

- `salas canceladas` lanzado como CLI en un proceso nuevo sale vacío: las reservas viven en memoria y la cancelación de una invocación no llega a la siguiente. Ya lo salda la fila 0014 «Motivo guardado» del roadmap; no abro otra.
- El test de `canceladas` depende del orden de los tests: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- La cancelación y su motivo no sobreviven a un proceso: el almacén de reservas es en memoria → fila 0014 del roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna_
