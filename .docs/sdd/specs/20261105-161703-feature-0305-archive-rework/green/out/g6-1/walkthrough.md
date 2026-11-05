---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, 149c367): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva cancelada y responde `cancelada <sala> <día> (<motivo>)`. Un motivo fuera de la lista, o sin `--motivo`, responde `motivo no válido: cambio de planes, sala ocupada, otro`. Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, dce8d2e): el comando `canceladas` lista `<sala> <día> — <motivo>` de las reservas con estado cancelada. Ficheros: `src/app.js`, `test/cancel.test.js`.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con los dos requisitos del delta (`sdd capability merge`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna._ Los dos tasks salieron como el plan; el único ajuste fue el del gate (ruling de abajo).
- `tasks.md` decía Task 1 en dce8d2e; su commit real es 149c367 (dce8d2e es el de la Task 2). Corregido en el cierre.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Fila de deuda abierta en el roadmap.

## 4. Verificación

### 4.1 Builds

- Revisión final: Spec (opus+high) limpia · Código (sonnet+high) limpia · Arquitectura no (plan), sobre dce8d2e. Un commit posterior, el de `tasks.md` con esa línea (17 líneas, solo documentación), revisado en el hilo; sin re-revisión.
- Gate de cierre (`node --test --test-concurrency=1` y `bookings:test` del `gate.json`): otra rama (`feature/0011-others`) está abierta y `develop` va por delante, así que corre una sola vez sobre la fusión de sincronización del paso 6, no aquí. Su `Gate:` y su sha van en el mensaje final, porque el walkthrough ya está en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · verificación del agente: humo con ejecución real de los cuatro THEN de `cancelar` y del listado (ver tabla) · revisión final Spec y Código limpia sobre dce8d2e · suite del cierre en la fusión de sincronización (mensaje final). Nadie más ha probado nada: no hay frase del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | cumple |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | cumple |
| sin `--motivo` → el mismo mensaje | ejecución real (`node src/app.js cancelar Norte lun`); la suite no lo cubre | cumple |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real de `run()` importado, cancelar y listar en un solo proceso, + suite | cumple |

- Límite del THEN del listado: por la CLI, `canceladas` en un proceso nuevo responde vacío, porque el almacén de reservas es en memoria y no persiste entre invocaciones. La spec no pedía persistencia; la cubre la fila 0014 «Motivo guardado» del roadmap.

### 4.3 Residuales / deuda generada

- Test que falta: «sin `--motivo`» solo está probado a mano (la suite cubre el motivo fuera de la lista). Anotado en la deuda.
- Workaround `--test-concurrency=1`: fila de deuda «Almacén compartido en memoria entre tests».
- `canceladas` no persiste entre procesos: ya tiene su fila (0014).

## 5. Aprendizajes

- El almacén de reservas en memoria y compartido entre tests obliga a serializarlos → deuda «Almacén compartido en memoria entre tests» (roadmap).
- Un comportamiento observable nuevo (motivo al cancelar, listado) → `capabilities/bookings.md`, creada en este cierre.

Retro: sin señales

## 6. Adendas

- (ninguna)
