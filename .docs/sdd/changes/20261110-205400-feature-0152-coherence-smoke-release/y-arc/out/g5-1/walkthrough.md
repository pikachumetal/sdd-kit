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

- `bookings`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y responde «cancelada Norte lun (sala ocupada)»; sin motivo o fuera de la lista responde «motivo no válido: …» — `src/app.js`, `test/cancel.test.js` (cba9a34).
- `bookings`: el comando `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada») — `src/app.js`, `test/cancel.test.js` (63408c4).
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, mezclada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre

### 4.2 Smoke

Verificado por el agente; el dev-lead no ha reportado pruebas propias.

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre · revisión final Spec y Código limpias sobre 63408c4; el commit posterior solo toca `tasks.md`

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del estado que deja el test de cancelar: fila en «Por triar» de la deuda.

## 5. Aprendizajes

- Sin aprendizajes nuevos para los docs vivos: el comportamiento está en `capabilities/bookings.md` y no cambia la estructura ni las convenciones.

Retro: sin señales

## 6. Adendas

- _Ninguna_
