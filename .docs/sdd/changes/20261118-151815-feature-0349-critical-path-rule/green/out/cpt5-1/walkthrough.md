---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; sin motivo o fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» (Task 1, `a89b1fc`).
- `src/app.js`: comando `canceladas`, una línea «sala día — motivo» por reserva cancelada (Task 2, `08fba11`).
- `test/cancel.test.js`: un test por comando.
- `e2e/cancel.e2e.mjs`: los dos tests de feature («rechaza un motivo fuera de la lista», «la cancelada sale en canceladas con su motivo») se borran al cerrar; queda «cancela una reserva con su motivo», la fila de `critical-path.md`.
- Capacidad `bookings` creada con el delta de la spec (dos requisitos).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus, high) limpia · Código (sonnet, high) limpia · Arquitectura no (plan), sobre `08fba11`. `HEAD` solo añadió `tasks.md` desde entonces: sin re-revisión.
- Tests de feature: `node scripts/critical-path.mjs --extras --run` → 5/5 en verde (con el entorno levantado en esta sesión; la primera pasada, sin entorno, dio `ERR_CONNECTION_REFUSED` y se repitió) · borrados: `cancel.e2e.mjs › rechaza un motivo fuera de la lista`, `cancel.e2e.mjs › la cancelada sale en canceladas con su motivo`.
- Gate de cierre sobre el árbol ya sin esos tests, pasado por partes con el entorno levantado por mí: `node --test test/` 5/5 · `node scripts/critical-path.mjs` sin `fuera:` (salida 0) · `node e2e/run.mjs` 7/7. La base trae un commit por delante (`c4810c7`), así que la pasada que cuenta para el cierre es la de la fusión de sincronización: su `Gate:` y su sha van en el mensaje final.
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:54387/health` → `ok`, levantado en esta sesión y parado al acabar.
- E2E: 42,1 s de 0,5 min (30 s).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · suite unitaria 5/5, E2E 7/7 y critical-path sin `fuera:` sobre el árbol del cierre (la repetición sobre la fusión de sincronización va en el mensaje final) · smoke 4/4 THEN con ejecución real contra el servidor de la suite, una sesión por THEN · revisión final Spec y Código limpias sobre `08fba11`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| Un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| Sin `--motivo` responde lo mismo: «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| `canceladas` tras cancelar Norte lun con «sala ocupada» responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- E2E por encima del presupuesto: 42,1 s de 0,5 min — deuda del proyecto (fila en «Por triar»).
- El test de `canceladas` depende del primer test de `test/cancel.test.js`: fila en «Por triar».
- Las reservas viven en memoria hasta la 0014: `canceladas` enseña lo cancelado en el mismo proceso (dicho en la spec; la 0014 lo salda).

## 5. Aprendizajes

- El motivo de cancelar es una lista cerrada de tres valores → `capabilities/bookings.md` (requisito «Cancelar pide un motivo de la lista»), no `operations.md` ni `architecture.md`.

Retro: sin señales
