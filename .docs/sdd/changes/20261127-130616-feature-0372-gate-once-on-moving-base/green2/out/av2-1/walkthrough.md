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

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, task 1, 72ea3e2): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista o la ausencia de `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, task 2, 2242d88): el comando `canceladas` lista las reservas canceladas con su motivo («Norte lun — sala ocupada»).
- **Revisión final** (`test/cancel.test.js`): un test para `canceladas` sin canceladas, que avisa.
- **Capacidad**: `bookings` nueva en `.docs/sdd/capabilities/bookings.md`, con los dos requisitos de la spec.
- Sin ADR: la spec no tenía candidatas.

## 3. Desviaciones del plan

- _Ninguna_. El gate de cierre del plan (`node --test`) se corrió con el de la constitución (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`), que lo incluye.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (anotado en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre.
- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` · 1 s · configuración: la del gate · sobre el commit de cierre (el borrador de la validación no registró cuántas tareas corrió cada una)

### 4.2 Smoke / tests

Verificado por el agente, con ejecución real.

- Validación en campo: 2026-10-26 · suite en verde sobre el commit de cierre · smoke 4/4 THEN con ejecución real (4.2) · revisión final Spec y Código limpias

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- Los tests de `canceladas` dependen de la cancelación del primer test (ver la decisión de la task 2): fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014 (spec, «Approach»): `canceladas` solo enseña lo cancelado en el mismo proceso.

## 5. Aprendizajes

- Cambio de comportamiento observable → `capabilities/bookings.md`, con `sdd capability merge`.
- Sin aprendizaje estructural, de convención ni de herramienta: `architecture.md`, `constitution.md` y `operations.md` quedan como estaban.

Retro: sin señales

## 6. Adendas

- _Ninguna_
