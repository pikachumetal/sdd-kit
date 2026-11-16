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

- Cancelar con motivo (`5174725`): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`, con la lista cerrada «cambio de planes, sala ocupada, otro»; un motivo fuera de la lista o ausente responde «motivo no válido: …». Tests en `test/cancel.test.js`.
- Listado de canceladas (`f45f2ff`): comando `canceladas` que enseña «sala día — motivo».
- Cierre: capacidad nueva `capabilities/bookings.md` (mergeada con `sdd capability merge`), deuda y roadmap.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 verdes; `node e2e/run.mjs` → 7/7 verdes.
- Gate: `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 49 s · configuración: la del gate · sobre el commit de cierre (junta el único cambio posterior a la validación: documentación y la capacidad)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:5030/health` → `ok`, levantado en esta sesión (PID 37656; el puerto lo tenía otro proceso, que `env-up` liberó) y parado al acabar.
- E2E: 48,2 s de 0,5 min — por encima del presupuesto (ver 4.3).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite unit 5/5 y E2E 7/7 · smoke 4/4 THEN con ejecución real contra el servidor levantado y por la CLI · revisión final Spec y Código limpias sobre `f45f2ff`; `HEAD` solo añadió `tasks.md`, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | verificado por el agente |
| un motivo fuera de la lista (`me aburro`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | verificado por el agente |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | verificado por el agente |

### 4.3 Residuales / deuda generada

- Suite E2E por encima de su presupuesto: 48,2 s de 0,5 min — deuda del proyecto (`debt.md`).
- El test de `canceladas` depende de otro test (ruling de la Task 2) — deuda (`debt.md`).

## 5. Aprendizajes

- Capacidad nueva de lo observable (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya está en la spec (Approach) y en la fila 0014 del roadmap.

Retro: sin señales

## 6. Adendas

- _Ninguna_
