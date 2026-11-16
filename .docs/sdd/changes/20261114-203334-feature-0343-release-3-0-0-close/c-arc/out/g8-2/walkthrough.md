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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, d74ac65): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista, o ninguno, responde «motivo no válido: …».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, d8cb37a): el comando `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»).
- **Capacidad** `capabilities/bookings.md`: creada desde el delta de la spec con `sdd capability merge`; `bookings` no existía.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre (la validación corrió sobre el último commit de la rama, que el cierre junta en uno)

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre · revisión final Spec y Código sobre d8cb37a, limpia

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden: el de `canceladas` usa la cancelación del primero (ruling de la Task 2) → fila en «Por triar» de `debt.md`.
- Las reservas viven en la memoria del proceso: `canceladas` solo enseña lo cancelado en el mismo proceso, hasta la 0014 (ya en el roadmap).

## 5. Aprendizajes

- Un cambio de comportamiento observable: cancelar pide un motivo de una lista cerrada y `canceladas` lo enseña → `capabilities/bookings.md`
- Sin convención nueva ni cambio estructural: nada para `constitution.md` ni `architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
