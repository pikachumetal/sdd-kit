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

- **Cancelar con motivo** (`bc857d7`): `src/app.js` y `test/cancel.test.js`. `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista, o ausente, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`e56cebb`): `src/app.js`, `test/cancel.test.js` y `e2e/cancel.e2e.mjs`. El comando `canceladas` enseña «<sala> <día> — <motivo>». Las reservas viven en la memoria del proceso (hasta la 0014).
- **Capacidad** `bookings` creada con el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5 pasan, 0 fallan. `node e2e/run.mjs` → 7 pasan, 0 fallan.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,3 s de e2e · configuración: la del gate · sobre el commit de cierre (la base no iba por delante y el cierre solo añade `.docs/`)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:4880/health` → `ok`, levantado en esta sesión y parado al acabar por su puerto
- E2E: 48,3 s de 0,5 min — pasa del presupuesto (ver 4.3)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite unit 5/5 y e2e 7/7 · smoke 4/4 THEN con ejecución real contra el servidor levantado en la sesión · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `e56cebb`; el commit posterior solo toca `tasks.md`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- La suite e2e tarda 48,3 s frente a su presupuesto de 0,5 min (30 s): deuda del proyecto, en «Por triar».
- El test de `canceladas` depende de otro test (ruling de la Task 2): deuda en «Por triar».

## 5. Aprendizajes

- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya recogido en la spec; el comportamiento observable vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
