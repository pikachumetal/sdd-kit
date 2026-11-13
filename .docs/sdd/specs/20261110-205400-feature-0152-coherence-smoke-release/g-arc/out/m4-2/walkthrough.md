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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, d7b4dd4): `cancelar <sala> <día> --motivo <motivo>` acepta solo `cambio de planes`, `sala ocupada` u `otro`; un motivo fuera de la lista, o sin `--motivo`, responde `motivo no válido: cambio de planes, sala ocupada, otro`. El motivo se guarda en la reserva cancelada.
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, 2e7eddf): el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada.
- **Migración** (`migrations/v3.0.0.md`): la línea pasa a «Paso 3: borra `roadmap.md` al acabar.», como pedía el scope.
- **Capacidad** `bookings`, creada en el cierre con `sdd capability merge` (dos requisitos `ADDED`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5 tests, 5 pasan, 0 fallan, 111 ms, sobre el commit de cierre (el cierre solo añade documentación y la capacidad al código que ya pasó).
- Gate: `node --test` → 5/5 · 111 ms · configuración: la del gate de la constitución · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real (el último con la limitación de abajo) · revisión final Spec y Código limpias, el único commit posterior es documentación (una línea de `tasks.md`) y se revisó en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js cancelar Norte lun --motivo "sala ocupada"`) | ok, salida literal |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) | ok, salida literal |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok, salida literal |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real llamando a `run` en un mismo proceso (cancelar y después `canceladas`) y `suite` | ok en el mismo proceso; **no probado entre procesos**: `node src/app.js canceladas` suelto imprime una línea vacía, porque las reservas viven en memoria y no se guardan entre invocaciones |

### 4.3 Residuales / deuda generada

- El listado solo funciona dentro de un proceso porque nada se guarda entre invocaciones del CLI: lo cubre la fila 0014 «Motivo guardado» del roadmap, sin deuda nueva.
- El workaround del test de `canceladas` (depende del primer test) → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- La lista cerrada de motivos y lo que responde cada comando es conducta observable → `capabilities/bookings.md` (delta de la spec, `sdd capability merge`); no hay cambio de estructura ni convención nueva.

Retro: sin señales

## 6. Adendas

- _Ninguna_.
