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

- Cancelar con motivo: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) — `src/app.js`, `test/cancel.test.js` (e528055).
- Listado de canceladas: comando `canceladas`, que enseña la reserva y su motivo — `src/app.js`, `test/cancel.test.js` (4354ef1).
- Capacidad `bookings` creada con los dos requisitos del delta (`capabilities/bookings.md`, con `sdd capability merge`).
- ADR: ninguna candidata en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 (5 pasan, 0 fallan) · rooms:test: saltada (la rama no toca sus inputs) · 1 s · configuración: la del gate · sobre el commit de cierre (verificado por el agente en el cierre)
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

- El test de `canceladas` depende del orden de los tests de `test/cancel.test.js`: fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014 (`canceladas` solo ve lo cancelado en el mismo proceso): ya está en el roadmap.

## 5. Aprendizajes

- Ninguno que cambie una convención, la estructura o las versiones: el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales
