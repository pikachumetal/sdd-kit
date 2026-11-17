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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 10933c8): el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro».
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, 34a99ea): lista cada reserva cancelada como «<sala> <día> — <motivo>». Las reservas viven en la memoria del proceso hasta la 0014, así que enseña lo cancelado en el mismo proceso.
- Capacidad nueva `bookings` (`.docs/sdd/capabilities/bookings.md`), creada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Va a la deuda («Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre (el cierre junta el commit donde corrió, que solo añadió documentación).
- Revisión final: Spec y Código, limpias, sobre 34a99ea; Arquitectura no (plan). Lo posterior a 34a99ea es solo documentación.

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Verificado por el agente en todas las filas; ninguna reportada por el usuario.

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2) → fila en «Por triar» de `debt.md`.
- Las reservas canceladas y su motivo no sobreviven al proceso: lo resuelve la 0014 (Motivo guardado), ya en el roadmap.

## 5. Aprendizajes

- Sin estimación del proyecto (`estimation.md` no existe): no hay sección de tiempo.
- El delta de comportamiento de la feature vive en `capabilities/bookings.md` → capacidad `bookings`.

Retro: sin señales
