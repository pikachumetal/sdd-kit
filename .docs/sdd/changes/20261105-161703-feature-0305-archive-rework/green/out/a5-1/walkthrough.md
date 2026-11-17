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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (`db4c22c`).
- `src/app.js`: comando `canceladas`, que lista `<sala> <día> — <motivo>` de las reservas canceladas (`9382a28`).
- `test/cancel.test.js`: tests de los dos comandos.
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` con `sdd capability merge`: no existía (la spec la declara «Nueva»).
- Es pieza de la 0009 (`parent: 0009`).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate durante la Task 2, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre el gate normal (`node --test`) pasó 3 de 3 veces; el workaround no hizo falta, y queda la deuda de aislar el almacén.
- Re-revisión de cierre: pide quitar la fila 0016 de la 0009 en `roadmap.md`. No la toco: la partición la escribió el dev-lead, no es de esta feature y no cambia lo que hace el software — coste si es erróneo: la 0009 espera una pieza que no le toca hasta que el dev-lead reparta de nuevo.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 de 5 en verde, exit 0. `node --test` (el gate de la constitution), 3 ejecuciones: 5 de 5 en verde cada una.
- Gate: `node --test` → 5/5 · sobre el commit de cierre (el cierre junta los commits solo de documentación posteriores a `9382a28`; el código no cambia desde ese sha).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 4 de 4 THEN con ejecución real · revisión final Spec y Código sobre 9382a28, limpia · re-revisión de lo posterior a 9382a28, solo documentación, con un Important de planificación que queda como ruling.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | ok |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"` y suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) y suite | ok |

Nota: el almacén de reservas vive en memoria, así que `canceladas` en un proceso nuevo de la CLI sale vacía; el THEN se prueba cancelando y listando en el mismo proceso. Guardar el motivo entre ejecuciones es la fila 0014 del roadmap.

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` comparten el almacén en memoria y el de `canceladas` depende de que el de cancelar haya corrido antes: fila nueva en la deuda técnica del roadmap.

## 5. Aprendizajes

- Comportamiento observable nuevo (motivo al cancelar, listado de canceladas) → `.docs/sdd/capabilities/bookings.md` (creada en el cierre).
- Los tests de la feature acoplan su orden por el almacén compartido → deuda técnica del roadmap, sin tocar `tech-stack.md`.

Retro: error que cazaría un chequeo → una línea en la constitution: los `.md` de `.docs/` conservan CRLF; un commit de documentación posterior a la revisión pasó `roadmap.md` a LF (74 líneas de diff por 3 reales) y obligó a una re-revisión (`.docs/sdd/constitution.md`; `roadmap.md` devuelto a CRLF en el cierre)

## 6. Adendas

- (ninguna)
