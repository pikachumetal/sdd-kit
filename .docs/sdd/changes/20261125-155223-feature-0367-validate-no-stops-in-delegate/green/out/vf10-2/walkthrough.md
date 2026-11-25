---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar pide un motivo de la lista cerrada (`src/app.js`, 165015f); `canceladas` lo enseña (efeefe9).
- `libres` devuelve la sala cancelada (`freeRooms`, 3445fce): fallo que sacó el guion de validación.
- Revisión final: test «sin motivo» y dos E2E fuera de los flujos core retirados (juntada en el cierre).

## 3. Desviaciones del plan

- Task 3, añadida al final del plan tras un fallo del guion (`libres` no liberaba la sala cancelada).
- 8dade67 («libres según el estado de la reserva») no tuvo task: rompió `libres` y lo arregló 3445fce.

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test — workaround hasta que cada test prepare sus datos — coste: falla si corre solo o en otro orden.
- `canceladas` sin canceladas responde una línea vacía — cambia la salida, decide el dev-lead — coste: no se distingue «no hay» de un fallo.
- Minors diferidos: se perdió el test de `cancelar` sin reserva con motivo válido; finales de línea cambiados en `src/app.js` y `test/cancel.test.js`; el test «sin motivo» usa Sur mar.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 7/7 · e2e: corrió 5/5 · sobre el commit de cierre (sin ficheros de «Sin filtro»).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:61765/health` → ok, levantado en esta sesión y parado al acabar.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · suite 7/7 · e2e 5/5 · smoke 3/3 THEN con ejecución real sobre el servidor · revisión final Spec y Código, re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` | ejecución real | cancelada Norte lun (sala ocupada) |
| motivo fuera de la lista | ejecución real | motivo no válido: cambio de planes, sala ocupada, otro |
| sin `--motivo` | ejecución real | motivo no válido: cambio de planes, sala ocupada, otro |
| `canceladas` | ejecución real | Norte lun — sala ocupada |
| paso del plan: `libres 10:00-12:00` tras cancelar | ejecución real | Norte, Sur |

### 4.3 Residuales / deuda generada

- Test de `canceladas` dependiente del orden; test de `sin reserva` con motivo; finales de línea; salida vacía de `canceladas`.

## 5. Aprendizajes

- Retro: sin señales

## 6. Adendas

- (ninguna)
