---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar` exige `--motivo` con un valor de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando nuevo `canceladas`. Commits 4cdc012 (Task 1) y a82e724 (Task 2).
- `test/cancel.test.js`: tests de cancelar con motivo, con motivo fuera de la lista y de `canceladas`.
- `capabilities/bookings.md`: capacidad nueva, fusionada del delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del primer test del fichero (ver la decisión de §3): fila nueva en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cancelar con motivo y listado de canceladas (comportamiento observable) → `capabilities/bookings.md`
- Las reservas siguen en memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya recogido en la spec (Approach) y en la fila 0014 del roadmap; sin cambio estructural para `architecture.md`.

ADR: ninguna candidata en la spec.

Retro: sin señales
