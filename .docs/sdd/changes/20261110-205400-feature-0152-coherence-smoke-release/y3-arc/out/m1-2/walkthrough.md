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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; el comando `canceladas` lista las canceladas con su motivo. Commit 1333f59 (cancelar) y 71a4986 (listado).
- `test/cancel.test.js`: pruebas del comando `cancelar` y de la salida de `canceladas`.
- `.docs/sdd/steering/architecture.md`: la línea de estructura dice que `src/app.js` también valida el motivo al cancelar.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- En la Task 2, el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde.
- Gate: `node --test` → 5/5 · sobre el commit de cierre (el proyecto no declara moon ni más suites).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias, sin re-revisión: lo posterior a lo revisado es solo documentación.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | con `--motivo "me aburro"`: `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun`: `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, cancelando y listando en el mismo proceso (`run`); en un proceso aparte sale vacío, porque las reservas viven en memoria hasta la 0014 |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del estado que deja el primer test: fila en «Por triar» de `debt.md`.
- `canceladas` solo ve lo cancelado en el mismo proceso: lo resuelve la 0014 (Motivo guardado), ya en el roadmap.

## 5. Aprendizajes

- `src/app.js` es el único fichero de entrada y también valida el motivo → `steering/architecture.md` (ya escrito en la feature).
- Cancelar con motivo y el listado de canceladas → `capabilities/bookings.md`.
- El test que reutiliza el estado de otro es un workaround → fila en `steering/debt.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
