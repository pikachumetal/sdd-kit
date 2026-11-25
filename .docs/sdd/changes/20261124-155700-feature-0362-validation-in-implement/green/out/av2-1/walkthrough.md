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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (Task 1, 676e82c).
- `src/app.js`: comando `canceladas`, que lista las reservas canceladas con su motivo (Task 2, 529556a).
- `test/cancel.test.js`: tests de ambos comandos, incluido el aviso de `canceladas` sin canceladas (juntado en el cierre).
- Capacidad `bookings`: los dos `ADDED` de la spec, fusionados en `capabilities/bookings.md`.
- ADR: ninguna candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en «Por triar» de `debt.md`)

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

- Test de `canceladas` acoplado a la cancelación del primer test (ver «Decisiones tomadas sin el dev-lead») → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014 (almacén), y `canceladas` solo enseña lo cancelado en el mismo proceso → `steering/architecture.md`.
- El comportamiento nuevo (motivo obligatorio y listado) → `capabilities/bookings.md`.

Retro: sin señales
