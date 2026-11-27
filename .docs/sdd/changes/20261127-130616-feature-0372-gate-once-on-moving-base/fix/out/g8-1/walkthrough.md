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

- `src/app.js`, `test/cancel.test.js` (Task 1, 0f8166b): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y lo incluye en la respuesta; un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …».
- `src/app.js`, `test/cancel.test.js` (Task 2, 1dfad77): comando `canceladas`, que lista las reservas canceladas con su sala, día y motivo.
- Sin «ADR candidata» en la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (la rama no toca sus inputs: `src/rooms.js`, `test/rooms.test.js`) · 1 s · configuración: la del gate · sobre el commit de cierre *(el 5/5 se leyó en el cierre, con `node --test test/app.test.js test/cancel.test.js` sobre el mismo código: tras la última task solo cambian documentos)*

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

Revisión final: Spec y Código limpias sobre 1dfad77 (`tasks.md`); desde ahí solo cambian documentos, sin re-revisión.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ver «Decisiones tomadas sin el dev-lead»): fila en «Por triar» de `debt.md`.
- `canceladas` solo enseña lo cancelado en el mismo proceso hasta la 0014 (el motivo guardado en el almacén de reservas): ya está en el roadmap.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en ese proceso → `steering/architecture.md`
- Cancelar pide un motivo de la lista y `canceladas` lo enseña → `capabilities/bookings.md` (delta de la spec, fusionado en el cierre)

Retro: sin señales

## 6. Adendas

- _Ninguna_
