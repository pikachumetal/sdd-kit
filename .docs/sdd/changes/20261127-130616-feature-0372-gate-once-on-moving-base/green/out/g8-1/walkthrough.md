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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, 81a3018): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde «cancelada <sala> <día> (<motivo>)». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, 120a5b5): el comando `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>».
- **Capacidad `bookings`** (`.docs/sdd/capabilities/bookings.md`): creada al fusionar el delta de la spec, con sus dos requisitos.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre

### 4.2 Smoke / tests

Verificado por el agente (ejecución real, no reportado por el usuario):

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende de la cancelación del primer test (ruling de la Task 2): fila en «Por triar» de `debt.md`.
- `canceladas` enseña solo lo cancelado en el mismo proceso, porque las reservas viven en memoria hasta la 0014 (ya en el roadmap).

## 5. Aprendizajes

- Cancelar pide un motivo de una lista cerrada y `canceladas` lo enseña → `capabilities/bookings.md` (fusionado con `sdd capability merge`).
- Sin aprendizajes de convención, estructura ni herramientas: `constitution.md`, `architecture.md` y `operations.md` no cambian.

Retro: sin señales

## 6. Adendas

- _Ninguna_
