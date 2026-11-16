---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (Task 1, `b1e206a`): `src/app.js` — `cancelBooking` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva (`reason`); `--motivo` se lee de los parámetros. Sin motivo o fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (Task 2, `e58f3f0`): `src/app.js` — comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva cancelada. Tests en `test/cancel.test.js`.
- **Documentación**: capacidad nueva `bookings` (fusionada con `sdd capability merge`), ADR 0003 (el motivo vive en la propia reserva), `### Confirmación` que faltaba en el ADR 0002, changelog y roadmap.

## 3. Desviaciones del plan

- Spec: la sección «Términos y ADR» (con la ADR candidata) se añadió a `spec.md` en `b19e16b`, después de la aprobación del 2026-10-08, y `## Enmiendas` sigue en «(ninguna)». No cambia ningún requisito ni THEN, pero la spec aprobada se tocó sin enmienda ni nueva aprobación.
- Spec: «Decisiones que he tomado yo» salta del 1 al 3 (falta el 2). Viene de antes del cierre y no lo he reescrito.

### Decisiones tomadas sin el dev-lead

- Gate con `node --test --test-concurrency=1` en vez de `node --test` (Task 2), para esquivar una carrera entre tests sobre el almacén en memoria — coste si está mal: la suite tarda más. En el cierre no pude reproducir la carrera: `node --test` y el gate con el flag dieron 5/5. La re-revisión señala además que el acoplamiento real está dentro de `test/cancel.test.js` (`canceladas` depende del estado que deja el test anterior), no entre ficheros. Queda como fila de deuda en el roadmap.
- ADR 0003 escrita en el cierre desde la candidata de la spec, con `accepted` y la fecha de la spec (2026-10-08), sin que el dev-lead la leyese. La re-revisión duda de que sea «difícil de deshacer» y señala el solape con la fila 0014 del roadmap; anotado en la ADR y en la fila 0014.
- Correcciones de documentación en el cierre tras la re-revisión: commit de la Task 1 en `tasks.md` (`b1e206a`, no `e58f3f0`) y `### Confirmación` del ADR 0002 (redactada por mí: `node --test` y sin dependencias de tests).

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 pass · 0,17 s · sobre `b19e16b`.
- Sin el flag: `node --test` → 5/5 pass, una ejecución.
- Tras el cierre solo cambian ficheros de `.docs/`, sin tocar `src/` ni `test/`: la suite sobre `b19e16b` vale para el árbol integrado.

### 4.2 Smoke / tests

Validación en campo: 2026-10-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (el listado, solo dentro de un proceso, por los tests) · revisión final Spec y Código sobre e58f3f0 limpia; re-revisión de `e58f3f0..b19e16b` (solo documentación): 3 Important y 1 Minor, los 3 Important corregidos en el cierre y el Minor anotado; sin validación humana.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | OK |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | OK |
| sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`) | OK |
| `canceladas` responde «Norte lun — sala ocupada» | suite (`canceladas enseña sala, día y motivo`); **ejecución real: no probado de punta a punta** | La CLI en procesos separados responde vacío: el almacén está en memoria ([ADR 0001](../../decisions/0001-bookings-in-memory.md)) y la cancelación no sobrevive al proceso. Solo se ve dentro de un proceso, y lo cubre el test |

### 4.3 Residuales / deuda generada

- Workaround del gate y test acoplado por estado: fila en «Deuda técnica» del roadmap.
- Fila 0014 («Motivo guardado») solapada con esta feature y con la ADR 0003: reconciliar su alcance al planificarla.
- `sdd roadmap check` da 2 fallos en líneas que no he tocado (cabecera de «Deuda técnica» y título de «Releases cerradas»); el paso «Roadmap en la forma de la plantilla» de la migración v2.3.0 los arregla.

## 5. Aprendizajes

- Una cancelación solo existe dentro del proceso mientras el almacén sea en memoria → ya recogido en el ADR 0001 y en la fila 0014 del roadmap.
- Un test que depende del estado que deja el anterior esconde carreras y obliga a workarounds en el gate → fila de deuda en el roadmap.
- Sin skills del proyecto (`.claude/skills/` no existe), `architecture.md` ni `operations.md`: ningún aprendizaje les toca, y la feature no revela un patrón para una skill nueva.

## 6. Adendas

