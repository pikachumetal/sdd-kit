---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`src/app.js`, `test/cancel.test.js`, 3d02824): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; un motivo fuera de la lista o sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro».
- **Listado de canceladas** (`src/app.js`, `test/cancel.test.js`, 758d168): `canceladas` lista «<sala> <día> — <motivo>» de las reservas canceladas.
- **Capacidad** `bookings` creada con `sdd capability merge` desde el delta de la spec (dos requisitos añadidos).

## 3. Desviaciones del plan

- _Ninguna_ en el código. Dos erratas del registro de ejecución, corregidas en el cierre: la Task 1 citaba el commit de la Task 2 (era 3d02824) y un ruling decía que el gate llevaba una bandera que nunca se aplicó.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. **No se aplicó**: `gate.json` no lleva la bandera y la suite sale verde 9/9 con la concurrencia por defecto, así que la carrera no se reprodujo. Queda como fila en «Por triar» de `debt.md`; no hay workaround que apuntar.

## 4. Verificación

### 4.1 Builds

- Gate: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → bookings:test: corrió 5/5 · rooms:test: saltada (ninguna de sus entradas cambia) · 1 s · configuración: la del gate · sobre el commit de cierre
- Suite completa `node --test`: 6/6 verde, repetida 9 veces seguidas sin un fallo.

### 4.2 Smoke / tests

Validación en campo: 2026-11-11 · smoke 4/4 THEN con ejecución real (comandos de la tabla, encadenados en un solo proceso porque el almacén es en memoria) · gate verde sobre el commit de cierre · revisión final Spec y Código limpias sobre 758d168, re-revisión de 758d168..HEAD con 2 hallazgos de registro (tasks.md) corregidos en el cierre. Del dev-lead consta la validación de campo previa a este cierre (2026-10-26, `cancelar Norte lun --motivo "sala ocupada"`); lo de abajo lo ejecuté yo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | la respuesta esperada, literal |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | la respuesta esperada, literal |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |

### 4.3 Residuales / deuda generada

- Posible carrera entre tests sobre el almacén de reservas en memoria: no reproducida, en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Un ruling de la ejecución es un registro: antes de cerrar se contrasta con el código (aquí, con `gate.json`) → `tasks.md` (corregido en el mismo documento).
- El comportamiento nuevo vive en la capacidad → `.docs/sdd/capabilities/bookings.md`.

Retro: documento o skill desmentido → corregido en el mismo documento: el ruling de `tasks.md` decía que el gate llevaba una bandera que `gate.json` no tiene (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna_
