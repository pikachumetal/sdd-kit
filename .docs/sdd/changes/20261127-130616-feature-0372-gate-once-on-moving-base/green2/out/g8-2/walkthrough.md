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

- Cancelar con motivo (Task 1, `3c0ab75`): `cancelar <sala> <día> --motivo <motivo>` guarda el motivo con la reserva cancelada; un motivo fuera de la lista o la ausencia de `--motivo` responden «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- Listado de canceladas (Task 2, `817be8b`): el comando `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»). Ficheros: `src/app.js`, `test/cancel.test.js`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde · 1 s · sobre el commit de cierre

### 4.2 Smoke / tests

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de ejecución (ver la decisión de la Task 2): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cancelar pide un motivo de la lista cerrada y el listado de canceladas lo enseña → `capabilities/bookings.md` (delta de la spec, fusionado con `sdd capability merge`).

Retro: sin señales
