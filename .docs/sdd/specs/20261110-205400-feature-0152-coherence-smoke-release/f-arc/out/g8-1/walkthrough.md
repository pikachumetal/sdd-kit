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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella o sin `--motivo` responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, commit 7d9db79).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (`src/app.js`, `test/cancel.test.js`, commit 9252118).
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), mergeada con `sdd capability merge` desde la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde en 1 s, según el hilo de implementación; **no la he re-ejecutado yo**. La base trae commits nuevos: la suite corre una vez sobre la fusión de sincronización y su `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (el THEN de `canceladas` en una misma ejecución, no entre procesos de la CLI: ver 4.3) · suite sobre la fusión de sincronización, en el mensaje final · revisión final Spec y Código limpia, sobre 9252118 · el commit posterior solo toca `tasks.md` (17 líneas): revisado en el hilo, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) | ok |
| motivo fuera de la lista (`"me aburro"`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI) | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (CLI) | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (`run()` en un solo proceso); `node src/app.js canceladas` en un proceso nuevo responde vacío | ok en proceso; ver 4.3 |

### 4.3 Residuales / deuda generada

- Las reservas viven solo en memoria: el GIVEN de `canceladas` (una reserva ya cancelada) no se puede preparar entre dos invocaciones de la CLI. Lo cubre la 0014 «Motivo guardado», ya en el roadmap.
- El test de `canceladas` depende del estado que deja el primer test (ruling de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- La capacidad `bookings` nace con esta feature → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
