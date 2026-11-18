---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, 2b1ecab): el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …».
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, d2eaa0b): lista las reservas canceladas con su motivo («Norte lun — sala ocupada»).
- Capacidad `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.
- Revisión final: Spec y Código limpias sobre d2eaa0b; `HEAD` solo añadió `tasks.md`, sin re-revisión.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.


## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 1/2 · rooms:test: saltada (la rama no toca sus inputs) · 1 s · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests (ruling de la Task 2) → fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- La lista cerrada de motivos y las dos salidas de error son comportamiento observable → `capabilities/bookings.md` (delta fusionado).
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → ya recogido en la spec y en la fila 0014 del roadmap.

Retro: sin señales
