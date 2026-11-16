---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-14
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `bookings`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y responde «cancelada <sala> <día> (<motivo>)»; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (`src/app.js`, `test/cancel.test.js`, ffd3360).
- `bookings`: nuevo comando `canceladas`, que lista las reservas canceladas con su motivo (`src/app.js`, `test/cancel.test.js`, 5c55432).
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con el delta de la spec (2 requisitos añadidos).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

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

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · Arquitectura no (plan), sobre 5c55432; el único commit posterior solo toca `tasks.md`.

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden (el de `canceladas` reutiliza la cancelación del primero): fila en «Por triar» de `debt.md`.
- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso.

## 5. Aprendizajes

- Cancelar con motivo y listar canceladas es un cambio de comportamiento observable → `.docs/sdd/capabilities/bookings.md` (delta de la spec, fusionado con `sdd capability merge`).

Retro: sin señales
