---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (607d506).
- `canceladas` lista las reservas canceladas como «sala día — motivo» — `src/app.js`, `test/cancel.test.js` (dbc029d).
- Cierre: capacidad `bookings` creada en `capabilities/`, `tasks.md` corregido, changelog y roadmap.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Gate de la Task 2 con `node --test --test-concurrency=1` — esquiva la carrera de los tests sobre el almacén compartido en memoria, workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble (anotado como deuda en el roadmap).
- La capacidad `bookings` no existía en `capabilities/`: la spec la declaraba «Modificadas» y el cierre la ha pasado a «Nuevas» (sus dos requisitos son ADDED) para poder fusionar el delta. Se editó la línea del bloque «Capacidades» de una spec aprobada y se añadió la decisión 4 a la spec.
- `tasks.md` daba `dbc029d` para las dos tasks; la Task 1 es `607d506`. Corregido.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 · 0,2 s; con `--test-concurrency=1` → 5/5.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 3/3 THEN con ejecución real (CLI y `run`) · revisión final Spec y Código limpias sobre dbc029d; el único commit posterior (cc82775) solo añade `tasks.md` (17 líneas) y se revisó en el hilo. No probado: ningún dev-lead ha probado la feature a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| motivo fuera de la lista → «motivo no válido: …» | suite · ejecución real (`--motivo otra`) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (`cancelar Norte lun`, y `--motivo` sin valor); sin test en la suite | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite · ejecución real (cancelar + canceladas en el mismo proceso, porque el almacén es en memoria) | ok |

### 4.3 Residuales / deuda generada

- Tests con almacén compartido en memoria: fila en «Deuda técnica» del roadmap.
- «Sin `--motivo`» no tiene test propio en `test/cancel.test.js`.
- La fila 0014 «Motivo guardado» del roadmap queda por revisar: la 0010 ya guarda el motivo con la reserva, pero en memoria.

## 5. Aprendizajes

- El comportamiento nuevo vive en `capabilities/bookings.md` (creada en el cierre; el molde era anterior a las capacidades).
- Revisión de skills: el proyecto no tiene `.claude/skills/`; no aplica.

## 6. Adendas

_Ninguna_
