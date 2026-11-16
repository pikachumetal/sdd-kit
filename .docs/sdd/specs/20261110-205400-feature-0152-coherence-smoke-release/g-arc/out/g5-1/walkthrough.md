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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`): el motivo debe estar en la lista cerrada (cambio de planes, sala ocupada, otro); fuera de la lista o sin `--motivo` responde «motivo no válido: …». Task 1, `ce89f7d`.
- `canceladas` (`src/app.js`, `test/cancel.test.js`): lista las reservas canceladas como «Norte lun — sala ocupada». Task 2, `cd03b8d`.
- Capacidad nueva `bookings` (`capabilities/bookings.md`), fusionada desde el delta de la spec con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → rooms:test: saltada (el filtro no la selecciona) · bookings:test: corrió 5/5 · 1 s · configuración: la del gate · sobre el commit de cierre (verificado por el agente en el cierre, salida guardada en el scratchpad)

### 4.2 Smoke / tests

Validación en campo: 2026-11-12 · smoke con una fila por THEN (4.2), verificado por el agente con ejecución real, y suite en verde sobre el commit de cierre · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre cd03b8d, sin re-revisión: lo posterior es solo documentación (`tasks.md`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Reportado por el usuario: la validación en campo de la feature, hecha antes del cierre (sin detalle de lo que probó).

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` comparten estado entre sí (ver «Decisiones tomadas sin el dev-lead»): fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El comportamiento nuevo (motivo obligatorio y listado de canceladas) → `capabilities/bookings.md`, por el delta de la spec. Ninguna convención ni cambio estructural nuevos: `constitution.md` y `architecture.md` siguen valiendo.

Retro: sin señales

## 6. Adendas

- _Ninguna_
