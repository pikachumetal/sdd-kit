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

- **Cancelar con motivo** (9573bfa): `cancelar <sala> <día> --motivo <motivo>` en `src/app.js`; la lista cerrada es «cambio de planes», «sala ocupada», «otro». Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro» y no cancela. El motivo se guarda en la reserva cancelada.
- **Listado de canceladas** (0be9cd1): comando `canceladas` en `src/app.js`, una línea «<sala> <día> — <motivo>» por reserva cancelada.
- Tests en `test/cancel.test.js`: el test de «cancelar una reserva activa» pasa a «con un motivo de la lista», el de «sin reserva» pasa a «motivo fuera de la lista», y se añade el de `canceladas`.
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre

### 4.2 Smoke

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Revisión final: Spec y Código limpias sobre 0be9cd1; Arquitectura no (plan). Lo posterior es solo `tasks.md`.

### 4.3 Residuales / deuda generada

- Tests de `cancel.test.js` acoplados por orden (ruling de la Task 2) → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Comportamiento observable (cancelar con motivo, listado de canceladas) → `capabilities/bookings.md`, por `sdd capability merge`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
