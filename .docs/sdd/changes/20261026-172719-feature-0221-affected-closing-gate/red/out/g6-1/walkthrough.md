---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-26
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (3a01456).
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas canceladas (1ae17a1).
- `test/cancel.test.js`: tests de ambos comportamientos.
- Capacidad `bookings` creada con el delta de la spec (`.docs/sdd/capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_ en lo construido. Sin `estimation.md` en el proyecto, no hay sección de tiempo y coste.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1`, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test test/app.test.js test/cancel.test.js test/rooms.test.js` → 6/6 pasan · ~1,4 s · configuración: la del gate, sin añadidos.
- Gate de cierre: `node scripts/gate.mjs run bookings:test rooms:test --affected --base develop` → `bookings:test` 5 pasan, `rooms:test` saltada (no afectada).
- Revisión final: Spec (opus+high) y Código (sonnet+high), limpias, sobre 1ae17a1. El tramo posterior solo toca `tasks.md` (documentación, 17 líneas), sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-26 · suite 6/6 · smoke de 4 THEN con ejecución real (el del listado, en un solo proceso) · revisión final Spec y Código sobre 1ae17a1, limpia. Sin validación del usuario: se valida en campo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Motivo válido → «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) + suite | ok |
| Motivo fuera de la lista → «motivo no válido: …» | ejecución real (`--motivo "me aburro"`) + suite | ok |
| Sin `--motivo` → «motivo no válido: …» | ejecución real (la suite no lo cubre) | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real en un solo proceso + suite | ok; en procesos separados da vacío (ver 4.3) |

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria y no persiste entre invocaciones de la CLI: `node src/app.js canceladas` en un proceso nuevo responde vacío, y el test del listado depende del orden. Herencia de la base, fuera del scope; pasa a la deuda técnica del roadmap.
- Sin test de «sin `--motivo`»: cubierto solo por ejecución real; entra en la deuda de arriba.

## 5. Aprendizajes

- Los tests comparten el almacén en memoria y por eso el gate corre en serie → `tech-stack.md` (workaround, con su fila de deuda).

## 6. Adendas

- _Ninguna_
