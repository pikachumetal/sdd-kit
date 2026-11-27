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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, 1d6a7a5): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, b182790): el comando `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»).
- Capacidad nueva: `bookings`, fusionada desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»)

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

- Test de `canceladas` acoplado al primer test (ruling de la Task 2): fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (ya dicho en la spec; lo cubre la 0014).

## 5. Aprendizajes

- Ninguno que cambie una convención, la estructura o las herramientas; el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales
