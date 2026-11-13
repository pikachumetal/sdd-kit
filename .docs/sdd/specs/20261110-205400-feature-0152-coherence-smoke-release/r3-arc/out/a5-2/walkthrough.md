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

- **Cancelar con motivo** (Task 1, `b7f3af1`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`. Un motivo fuera de la lista, o sin `--motivo`, responde `motivo no válido: cambio de planes, sala ocupada, otro`. Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `20a2f3d`): el comando `canceladas` lista las reservas con estado cancelada como `<sala> <día> — <motivo>`. Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Capacidad**: `bookings` nace con los dos requisitos de la spec (`.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`).
- **Registros**: `tasks.md` con la revisión final; la spec y el roadmap anotan que la 0010 es pieza de la 0009.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. El plan declaraba dos tasks nativas y salieron dos tasks nativas.
- Corrección de registro en el cierre: `tasks.md` citaba `20a2f3d` para las dos tasks; la Task 1 es `b7f3af1`.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre corrí el gate del plan (`node --test`) y también con `--test-concurrency=1`: 5/5 en las dos, así que no vi la carrera. La dependencia entre tests sí existe: `canceladas enseña sala, día y motivo` solo pasa con el estado que deja `cancelar con un motivo de la lista`.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → suite: corrió 5/5 · 95 ms · configuración: la del gate (plan §3, sin `operations.md` ni «Suites» declaradas) · además `node --test --test-concurrency=1`: 5/5 · sobre el commit de cierre (el cierre solo añade documentación a lo que corrí).
- Salidas completas guardadas en el scratchpad de la sesión antes de leerlas.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · suite 5/5 (con y sin `--test-concurrency=1`) · smoke 4/4 THEN con ejecución real, el último solo dentro de un proceso (ver 4.3) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `20a2f3d`; los dos commits posteriores, solo documentación (`tasks.md`, 17 líneas; `spec.md` y `ROADMAP.md`, 5 líneas), revisados en el hilo, sin re-revisión · 0 sin revisar, 0 sin verificar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real, con `--motivo "me aburro"` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real, `cancelar Norte lun` | `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» tras cancelar con «sala ocupada» | ejecución real en un solo proceso (`cancelar` y `canceladas` importando `run`); por CLI, en dos procesos, sale vacío | `Norte lun — sala ocupada` (un proceso) · salida vacía (dos procesos) |

### 4.3 Residuales / deuda generada

- **El motivo no sobrevive entre invocaciones de la CLI**: las reservas viven en memoria dentro de `src/app.js`, y un `canceladas` en un proceso nuevo no ve lo cancelado en otro. La spec lo cumple en su GIVEN/WHEN/THEN, pero quien lo use desde la terminal no verá nada en `canceladas`. Lo cubre la fila 0014 del roadmap («el motivo de una cancelación se guarda en el almacén de reservas»): no abro fila de deuda aparte.
- **Tests acoplados por el almacén en memoria** y el workaround `--test-concurrency=1`: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- Los tests de `test/cancel.test.js` comparten el almacén de reservas del módulo, y uno depende del estado que deja otro; el workaround del gate no está demostrado necesario → `debt.md`, «Por triar».
- Nuevo comportamiento observable de `bookings` (cancelar con motivo, listado de canceladas) → `.docs/sdd/capabilities/bookings.md`, con `sdd capability merge`.
- La persistencia del motivo entre ejecuciones es la 0014 → ya está en el roadmap.

Retro: documento o skill desmentido → corregido en el propio documento: el commit de la Task 1 en `tasks.md` era `20a2f3d` y es `b7f3af1` (`.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md`)

## 6. Adendas

- _Ninguna_
