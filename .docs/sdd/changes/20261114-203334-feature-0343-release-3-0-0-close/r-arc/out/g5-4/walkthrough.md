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

- `src/app.js` (e46d66e): `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …».
- `src/app.js` (234e303): comando `canceladas`, que lista las reservas canceladas con su motivo («Norte lun — sala ocupada»).
- `test/cancel.test.js` (e46d66e, 234e303): tests del motivo válido, del motivo fuera de la lista y del listado.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos del delta, mezclada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda, «Por triar»).

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

- El test de `canceladas` depende de la cancelación del primer test: si corre solo o en otro orden, falla. Pasa a la deuda («Por triar»).
- Las reservas viven en la memoria del proceso: `canceladas` enseña solo lo cancelado en el mismo proceso, hasta la 0014 (Motivo guardado).

## 5. Aprendizajes

- La lista de motivos es cerrada (cambio de planes, sala ocupada, otro) → `.docs/sdd/capabilities/bookings.md`
- Las anulaciones del responsable de sala quedan fuera → 0011 (`ROADMAP.md`)

Retro: sin señales

## 6. Adendas

- _Ninguna_
