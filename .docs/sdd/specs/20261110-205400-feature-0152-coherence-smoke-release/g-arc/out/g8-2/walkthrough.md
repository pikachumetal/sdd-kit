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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `5c76f8f`.
- Comando `canceladas`: lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js`, `20f94a4`.
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (sus inputs no cambian) · 1 s · configuración: la del gate · sobre el commit de cierre (se repite una vez sobre el merge de sincronización, paso 6)

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-11-12 · smoke 4/4 THEN con ejecución real (4.2) · suite en verde, 5 tests, sobre el commit de cierre · revisión final Spec y Código limpias sobre 20f94a4; HEAD solo añade `tasks.md`

### 4.3 Residuales / deuda generada

- Los tests de `canceladas` dependen de la cancelación del primer test: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Comportamiento observable de cancelar con motivo y del listado → `capabilities/bookings.md` (creada con `sdd capability merge`).

Retro: sin señales

## 6. Adendas

- _Ninguna_
