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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada: `src/app.js`, `test/cancel.test.js` (2b44dab).
- Comando `canceladas`: lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso: `src/app.js`, `test/cancel.test.js` (644c6fa).
- Capacidad nueva `bookings` fusionada con `sdd capability merge` en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 174 ms, sobre el commit de cierre (tras 644c6fa solo cambia `.docs/`).
- Gate: `node --test` → suite: corrió 5/5 · 174 ms · configuración: la del proyecto, sin filtro · sobre el commit de cierre (tras 644c6fa solo cambia `.docs/`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 5/5 THEN con ejecución real (4 con `run()` en un proceso y 3 por CLI) · revisión final Spec y Código sobre 644c6fa, limpia · sin re-revisión: HEAD solo movió `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Sur mar --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| Sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` (este THEN no lo cubre ningún test) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada`, en el mismo proceso que la cancelación |

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden: fila en «Por triar».
- Sin `--motivo` no tiene test propio: lo verifiqué a mano; queda como paso de la 0014 o del siguiente cambio de `cancelar`.
- Las reservas viven en memoria: `canceladas` solo ve lo cancelado en el mismo proceso, por CLI separada sale vacío. Está en el Approach de la spec; lo resuelve la 0014.

## 5. Aprendizajes

- Sin aprendizajes nuevos para constitution, architecture u operations: el comportamiento observable va a `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
