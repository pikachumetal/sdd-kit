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

- `src/app.js` (3d3f6ab, 6f7d7ce): `cancelar` exige `--motivo` de la lista cerrada (cambio de planes, sala ocupada, otro), guarda el motivo en la reserva cancelada y responde «cancelada Norte lun (sala ocupada)»; un motivo fuera de la lista o ausente responde «motivo no válido: …». Comando nuevo `canceladas`, que lista «sala día — motivo».
- `test/cancel.test.js` (3d3f6ab, 6f7d7ce): tests del motivo válido, del motivo fuera de la lista y del listado.
- Capacidad nueva `bookings` (`capabilities/bookings.md`), con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- Suite completa: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → verde, 1 s, sobre el commit de cierre

### 4.2 Smoke / tests

Verificado por el agente (con evidencia), una fila por THEN:

| THEN | Evidencia | Comando y salida |
| --- | --- | --- |
| Cancelar con motivo | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| Motivo fuera de la lista | ejecución real | `node src/app.js cancelar Norte lun --motivo "por si acaso"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin motivo | ejecución real | `node src/app.js cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| Listado de canceladas | ejecución real | `node --input-type=module -e "const { run } = await import('./src/app.js'); run('cancelar', ['Norte', 'lun', '--motivo', 'sala ocupada']); console.log(run('canceladas', []))"` → «Norte lun — sala ocupada» |

Validación en campo: 2026-10-26 · smoke con una fila por THEN (4.2) y suite en verde sobre el commit de cierre

### 4.3 Residuales / deuda generada

- Al reescribir `test/cancel.test.js` desapareció el test «cancelar sin reserva lo dice»: la respuesta «sin reserva <sala> <día>» queda sin test. Va a «Por triar» de la deuda.
- El test de `canceladas` depende del orden de los tests (ver la decisión de la Task 2). Va a «Por triar» de la deuda.

## 5. Aprendizajes

- El motivo vive en la memoria del proceso hasta la 0014 (`canceladas` solo enseña lo cancelado en el mismo proceso) → ROADMAP.md, fila 0014 («Motivo guardado»), que ya lo cubre; sin cambio en los docs vivos.

Retro: sin señales

## 6. Adendas

- _Ninguna_
