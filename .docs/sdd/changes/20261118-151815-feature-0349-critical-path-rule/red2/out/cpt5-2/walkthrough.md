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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)»; sin motivo o fuera de la lista responde «motivo no válido: …». Comando nuevo `canceladas`. Commits 3ead41e (Task 1) y c4581a4 (Task 2).
- `test/cancel.test.js`: unitarios del motivo y del listado.
- `e2e/cancel.e2e.mjs`: la fila de la lista, «cancela una reserva con su motivo», sustituye a «cancela una reserva» (el título lo fijaba el spec); los dos tests de feature se borran en el cierre.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, creada con `sdd capability merge` desde el delta del spec.
- Sin «ADR candidata» en el spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test unitario de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de la deuda).
- Cierre: borré los dos tests de feature de `cancel.e2e.mjs` tras pasarlos una vez, como dice el spec («se borra al cerrar»); ese borrado no pasó por la revisión final, lo revisé yo en el hilo.

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 verdes, sobre el árbol del cierre.
- Gate de cierre completo (`node --test test/ && node scripts/critical-path.mjs && node e2e/run.mjs`): la base (`develop`) va un commit por delante (e2e de comentarios, otra rama), así que corre una vez en el sync merge y su línea `Gate:` va en el mensaje final, porque este walkthrough está en el commit de cierre.
- `node scripts/critical-path.mjs` sobre el árbol del cierre → exit 0 (sin tests fuera de la lista que no estén ya en la base).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:56676/health` → ok, levantado en esta sesión y parado con `node scripts/env-down.mjs`.
- E2E: 48,1 s de 0,5 min (presupuesto excedido: deuda del proyecto, ver 4.3) · medido sobre el sync merge, gate literal, traza `on` por defecto
- Tests de feature: `node scripts/critical-path.mjs --extras --run` → 5 passed (36,1 s), con los dos de feature dentro · borrados: `cancel.e2e.mjs › rechaza un motivo fuera de la lista`, `cancel.e2e.mjs › la cancelada sale en canceladas con su motivo`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · smoke 4/4 THEN con ejecución real contra el servidor de la suite (sesión propia) · unitarios 5/5 · tests de feature 5/5 · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre c4581a4 · el suite completo corre en el sync merge.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ok |

### 4.3 Residuales / deuda generada

- El test unitario de `canceladas` depende del estado del primer test (ver decisiones): fila en «Por triar».
- Suite E2E pasada de presupuesto: 48,1 s de 0,5 min (8 tests × 6 s de paso con la traza completa) — deuda del proyecto.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (ya dicho en el spec).

## 5. Aprendizajes

- La lista de motivos y sus respuestas son comportamiento observable → `capabilities/bookings.md`, no se copian a `operations.md` ni a `architecture.md`.

Retro: sin señales
