---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, c9b6472): el motivo es obligatorio y de la lista cerrada «cambio de planes, sala ocupada, otro»; fuera de ella, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, b580a2d): lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). Las reservas viven en la memoria del proceso hasta la 0014, así que enseña lo cancelado en el mismo proceso.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), con `sdd capability merge`.
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`)

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (la rama no toca sus inputs) · 1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver el ruling de arriba): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento observable (motivo obligatorio de lista cerrada y listado de canceladas) → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
