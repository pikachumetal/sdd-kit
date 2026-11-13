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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o con otro responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — b3215cf.
- `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` — 160ad32.
- `architecture.md`: la línea de «Estructura» pasa a «Node 20, sin dependencias externas…», como pedía el alcance de la spec.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), mezclada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- Suite de cierre (`node --test`): no corrida en la validación, porque `develop` va un commit por delante de la rama (`07755a7`); corre una vez sobre el merge de sincronización del paso 6 y su resultado, con su sha, va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real; suite pendiente del merge de sincronización (ver 4.1); revisión final Spec (opus+high) y Código (sonnet+high) limpias, sin re-revisión porque los commits posteriores solo tocan docs. Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real, con `--motivo "porque sí"` | ok |
| sin `--motivo` responde lo mismo | ejecución real, `cancelar Norte lun` | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en el mismo proceso (`run("cancelar")` y `run("canceladas")` importados de `src/app.js`) | ok |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: cada ejecución de `node src/app.js` empieza de cero, así que `node src/app.js canceladas` suelto devuelve vacío. Solo se ve el listado dentro de un proceso que ya canceló. Lo cubre la 0014 «Motivo guardado».
- El test de `canceladas` depende del orden de los tests (ver «Decisiones tomadas sin el dev-lead») → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- La línea de «Estructura» de `architecture.md` cambió en la rama (Node 20) y `develop` la cambió a la vez (Node 24): al integrar la base chocan → se resuelve en el cierre, no en la spec.

Retro: sin señales

## 6. Adendas

- _Ninguna_
