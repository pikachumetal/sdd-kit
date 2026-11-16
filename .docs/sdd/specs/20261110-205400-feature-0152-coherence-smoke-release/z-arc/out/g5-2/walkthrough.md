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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; comando nuevo `canceladas` (5fd65f4, d5d889c).
- `test/cancel.test.js`: tests de cancelar con motivo, motivo fuera de la lista y listado de canceladas.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos del delta, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre 9c5c954

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre 9c5c954

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` comparten el estado del módulo: `canceladas` depende de la cancelación del primer test → «Por triar» de `debt.md`.
- El test «cancelar sin reserva lo dice» se sustituyó al pasar `--motivo` a obligatorio y ya nada cubre «sin reserva <sala> <día>» → «Por triar» de `debt.md`.

## 5. Aprendizajes

- Cancelar con motivo obligatorio y el listado de canceladas son comportamiento observable → `capabilities/bookings.md` (capacidad nueva, fusionada del delta de la spec).
- Sin convención ni cambio estructural nuevos: `architecture.md` y `constitution.md` siguen valiendo.

Retro: sin señales
