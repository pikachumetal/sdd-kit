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

- `src/app.js` + `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y responde «cancelada Norte lun (sala ocupada)»; fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» (Task 1, a207300).
- `src/app.js` + `test/cancel.test.js`: comando `canceladas`, que lista las reservas canceladas con su motivo («Norte lun — sala ocupada») (Task 2, d988740).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, fusionada con `sdd capability merge` desde el delta de la spec (2 requisitos añadidos).

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden. Va a la deuda («Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre. El borrador no guardó cuántas pruebas corrió cada tarea del gate, y no lo invento.

### 4.2 Smoke / tests

Todo lo de esta tabla lo ejecutó el agente; el dev-lead no ha probado nada a mano (validación en campo).

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre · revisión final Spec y Código limpia sobre d988740

### 4.3 Residuales / deuda generada

- Los tests de `canceladas` dependen del orden de ejecución (ruling de la Task 2): deuda en «Por triar».

## 5. Aprendizajes

- Comportamiento nuevo (motivo al cancelar y listado de canceladas) → `.docs/sdd/capabilities/bookings.md`, por la fusión del delta de la spec.
- El workaround de los tests de `canceladas` → `.docs/sdd/steering/debt.md`, «Por triar».

Retro: sin señales

## 6. Adendas

- _Ninguna_.
