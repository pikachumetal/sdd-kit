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

- **Cancelar con motivo** (Task 1, `a656944`): `cancelar <sala> <día> --motivo <motivo>` guarda el motivo en la reserva cancelada. La lista es cerrada: cambio de planes, sala ocupada, otro. Un motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: cambio de planes, sala ocupada, otro». Ficheros: `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (Task 2, `79d2a45`): el comando `canceladas` lista «<sala> <día> — <motivo>». Mismos ficheros.
- **Docs vivos**: capacidad `bookings` (nueva) en `.docs/sdd/capabilities/bookings.md`, ADR 0003, fila de la 0010 en el roadmap y entrada en el changelog.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. La spec se amplió tras aprobarse solo con la sección «Términos y ADR» (la candidata de la ADR 0003), sin tocar el comportamiento.

### Decisiones tomadas sin el dev-lead

- **Task 2: `node --test --test-concurrency=1` en el gate** — para esquivar una supuesta carrera de los tests sobre el almacén compartido en memoria — coste si está mal: la suite tarda el doble. La re-revisión señaló que la razón es dudosa: `node --test` ya ejecuta cada fichero en su propio proceso, así que el almacén no se comparte entre `app.test.js` y `cancel.test.js`, y la opción no cambia nada. En el cierre corrí el gate del plan, `node --test` sin la opción, y pasa 5/5. Lo que sí existe es una dependencia de orden dentro de `cancel.test.js` (ver 4.3).
- **Corregí la fila de la Task 1 en `tasks.md`**: decía `79d2a45` y su commit es `a656944` (lo halló la re-revisión).
- **Añadí «### Confirmación» a la ADR 0002**: sin ella `sdd decision check` falla y no deja cerrar. Puse que se confirma con la suite `node --test` del plan.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 tests, 5 pasan, 0 fallan.
- Gate: `node --test` → suite: corrió 5/5 · 0,16 s · configuración: la del plan, sin la opción `--test-concurrency=1` del Ruling · sobre el commit de cierre (el código no cambia desde `79d2a45`; después solo entra documentación).
- Revisión final: Spec (opus, effort high) y Código (sonnet, effort high), limpias, sobre `79d2a45`. Re-revisión única del tramo posterior, documentación solo (opus, effort high): 1 Important (el commit de la Task 1 en `tasks.md`, corregido) y 1 Minor (la razón del Ruling, diferido).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4/4 THEN con ejecución real (los de fallo, con la entrada que falla) · revisión final de Spec y Código limpia y re-revisión del tramo posterior sin hallazgos abiertos tras corregir el Important. Lo verificó el agente; el dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `--motivo "me aburro"` → «motivo no válido: cambio de planes, sala ocupada, otro» |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → «motivo no válido: cambio de planes, sala ocupada, otro». Ningún test lo cubre (ver 4.3) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | solo en un mismo proceso (`cancelar` y `canceladas` seguidos): «Norte lun — sala ocupada». Con dos órdenes de la CLI, `canceladas` responde vacío (ver 4.3) |

### 4.3 Residuales / deuda generada

- **`canceladas` no ve cancelaciones de otra orden de la CLI**: cada orden es un proceso nuevo y las reservas viven en memoria (ADR 0001). El GIVEN de la spec solo se cumple dentro de un proceso, como en los tests. Ya lo cubre la fila 0014 del roadmap («Motivo guardado»): sin fila nueva.
- **Dependencia de orden en `test/cancel.test.js`**: el test de `canceladas` solo pasa si antes corre el de «cancelar con un motivo de la lista», porque comparten el estado del módulo. Fila de deuda en el roadmap.
- **Sin test para «sin `--motivo`»**: el código lo cubre con `reasonOf`, pero ningún test lo fija; solo lo comprobé en el smoke. Fila de deuda en el roadmap.
- **Fuera de alcance, ya anotado en la spec**: las anulaciones del responsable de sala son la 0011.

## 5. Aprendizajes

- Comportamiento observable de la cancelación con motivo y del listado → `capabilities/bookings.md` (capacidad nueva, fusionada con `sdd capability merge`).
- El motivo vive en la propia reserva, no en una tabla aparte → `decisions/0003-cancel-reason-on-booking.md`.
ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-on-booking.md
- Un Ruling que cambia el comando del gate necesita comprobar su razón antes de ejecutarse: aquí la opción no tenía efecto → sin destino nuevo: el workaround no llegó a `tech-stack.md` ni a `operations.md`, y se deja en este walkthrough.

Retro: documento o skill desmentido → corregido el Ruling de la Task 2, cuya carrera no existe (.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/tasks.md)

## 6. Adendas

- _Ninguna._
