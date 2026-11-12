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

- **Cancelar con motivo** (Task 1, `4e3f6ed`): `src/app.js` y `test/cancel.test.js`. `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda en la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista, o ninguno, responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (Task 2, `a8b7569`): `src/app.js` y `test/cancel.test.js`. El comando `canceladas` lista las reservas con estado cancelada como «Norte lun — sala ocupada».
- Documentación: `spec.md`, `plan.md` y `tasks.md` de la feature; la capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; `## Rulings` de `tasks.md`). Fila de deuda en «Por triar».

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

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2) → «Por triar» de `debt.md`.
- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta que la 0014 las guarde → `steering/architecture.md`.
- Un cambio de comportamiento observable: cancelar pide un motivo y el listado lo enseña → `capabilities/bookings.md`, fusionada con `sdd capability merge`.
- `steering/operations.md` no existe en el proyecto: no hay versiones ni herramientas que subir.

Retro: sin señales

## 6. Adendas

- _Ninguna_
