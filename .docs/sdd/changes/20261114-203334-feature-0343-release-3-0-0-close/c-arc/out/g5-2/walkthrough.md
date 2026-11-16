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

- Cancelar con motivo (Task 1, `ae3f24d`): `cancelar <sala> <día> --motivo <motivo>` acepta solo cambio de planes, sala ocupada u otro; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- Listado de canceladas (Task 2, `e62e10b`): el comando `canceladas` lista sala, día y motivo de lo cancelado en el mismo proceso. Ficheros: `src/app.js`, `test/cancel.test.js`.
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya (Task 2) — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Fila en la deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre (el cierre junta el commit de `tasks.md`; el código es el de `e62e10b`)

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

Revisión final: Spec y Código, limpias, sobre `e62e10b`; el commit posterior solo toca `tasks.md`.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver «Decisiones tomadas sin el dev-lead») → fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso (ya dicho en la spec; lo resuelve la 0014).

## 5. Aprendizajes

- Comportamiento observable nuevo (cancelar con motivo, listado de canceladas) → `.docs/sdd/capabilities/bookings.md`

Retro: sin señales
