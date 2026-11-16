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

- **Cancelar con motivo** (Task 1, `35fa6bf`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `81c2254`): comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva cancelada. `src/app.js`, `test/cancel.test.js`.
- Capacidad nueva `capabilities/bookings.md`, mergeada con `sdd capability merge` desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_ respecto al plan (2 tasks, Native).

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Nota del cierre: el flag no está en `gate.json` ni en `scripts/gate.mjs`; lo apliqué yo en mi pasada de la suite, pero el gate no lo lleva. Fila en la deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa, pasada del cierre: `node --test --test-concurrency=1` → 6 pass, 0 fail, sobre el código de la rama (los commits posteriores a `81c2254` solo tocan `.docs/`).
- El gate de `constitution.md` (`node scripts/gate.mjs run bookings:test rooms:test --affected --base develop`) **no corrió en la validación**: `develop` lleva un commit por delante (el test de salas de la 0015), así que corre una sola vez sobre el merge de sincronización, y su línea `Gate:` y su sha van en el mensaje final del cierre, porque este fichero ya está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-11 · smoke 4/4 THEN con ejecución real (comandos de la tabla) · suite 6/6 · revisión final Spec y Código limpia sobre `81c2254`, sin re-revisión (los commits posteriores solo tocan `.docs/`) · gate de cierre pendiente del merge de sincronización.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real: `node src/app.js cancelar Norte lun --motivo "sala ocupada"` | «cancelada Norte lun (sala ocupada)» |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real: `node src/app.js cancelar Norte lun --motivo "me aburro"` | «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` → lo mismo | ejecución real: `node src/app.js cancelar Norte lun` | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real, en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`): el almacén es en memoria, y `node src/app.js canceladas` en un proceso nuevo responde vacío | «Norte lun — sala ocupada» |

Verificado por el agente: todo lo de arriba. Reportado por el usuario: nada; la validación es en campo (`validation.mode: field`).

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria: `canceladas` no ve lo cancelado por otra invocación de la CLI. Lo cubre la 0014 («Motivo guardado»), ya en el roadmap.
- La Task 1 sustituyó el test «cancelar sin reserva lo dice»: la rama `sin reserva <sala> <día>` de `cancelar` con un motivo válido ya no tiene test. Fila en «Por triar».
- Workaround `--test-concurrency=1`: fila en «Por triar».

## 5. Aprendizajes

- `cancelar` sin `--motivo` ya no cancela: es un cambio de comportamiento observable → `capabilities/bookings.md`.
- El gate y el almacén compartido en memoria: los tests no se aíslan entre sí → deuda («Por triar»), sin destino estructural todavía.

Retro: sin señales

## 6. Adendas

- _(ninguna)_
