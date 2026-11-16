---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-17
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`a89bab5`, `src/app.js`, `test/cancel.test.js`): `cancelar <sala> <día> --motivo <motivo>` acepta solo `cambio de planes`, `sala ocupada` u `otro`; guarda el motivo en la reserva cancelada. Sin motivo o con uno fuera de la lista responde «motivo no válido: …».
- **Listado de canceladas** (`e983676`, `src/app.js`, `test/cancel.test.js`): el comando `canceladas` lista «`<sala> <día> — <motivo>`».
- **Registros del cierre**: capacidad `bookings` (`capabilities/bookings.md`, creada al fusionar el delta), ADR `0003-cancel-reason-on-booking.md`, changelog y roadmap.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.
- Review de spec: no · hallazgos 0, aceptados 0 (dos señales: MODIFIED, datos; decisión 3 de la spec).

## 3. Desviaciones del plan

- _Ninguna_ en el código. El plan fijaba el gate de cierre en `node --test` y es el que se ha ejecutado.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, contra una supuesta carrera de los tests sobre el almacén en memoria — coste si estaba mal: la suite tardaba el doble. **Corregida en el cierre:** la re-revisión lo marcó Important y lo comprobé: `node --test` a secas sale 5/5 en 8 de 8 ejecuciones y la carrera no se reproduce. El gate sigue siendo `node --test` (constitution y plan); el flag no se usa y no queda como workaround.
- ADR `0002-node-test.md` sin la sección «### Confirmación» (la exige `sdd decision check`): la añadí en el cierre para poder cerrar. Es una ADR que no es de esta feature.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test` → 5/5 pasan, 0 fallan · ~90 ms · sobre el árbol del cierre (ejecutada por mí en el cierre; igual en 8 ejecuciones seguidas).
- Revisión final Spec (opus) y Código (sonnet) sobre `e983676`: limpias. Re-revisión del tramo posterior a `e983676` (solo documentación; opus): 1 Important (el ruling del gate, comprobado y corregido arriba) y 6 Minor, que van a «Minors diferidos» del mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-17 · verificación del agente: suite 5/5 · smoke de los 4 casos de los THEN con ejecución real (`run()` de `src/app.js`) · revisión final Spec y Código sobre `e983676`, re-revisión del tramo documental con 1 Important corregido. Sin validar por el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | suite (`cancelar con un motivo de la lista`) · ejecución real | ✅ |
| AND un motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | suite (`cancelar con un motivo fuera de la lista`) · ejecución real (`--motivo "me aburro"`) | ✅ |
| AND sin `--motivo` → el mismo «motivo no válido: …» | ejecución real (sin test en la suite) | ✅ |
| `canceladas` → «Norte lun — sala ocupada» | suite (`canceladas enseña sala, día y motivo`) · ejecución real | ✅ |

### 4.3 Residuales / deuda generada

- `test/cancel.test.js` depende del orden de sus tests (`canceladas` usa la cancelación del test anterior) y el almacén es compartido; falta el test de cancelar sin `--motivo` → fila de «Deuda técnica» del roadmap.
- La fila 0014 del roadmap («Motivo guardado») queda solapada con lo que ya hace esta feature (el motivo se guarda en la reserva, en memoria): la decide el dev-lead.

## 5. Aprendizajes

- Los registros del cierre no necesitan destino nuevo: la decisión de dónde vive el motivo → `decisions/0003-cancel-reason-on-booking.md`; el comportamiento → `capabilities/bookings.md`.
- Revisión de `.claude/skills/`: el proyecto no la tiene, no hay skill que revisar. No existe `architecture.md` y ningún aprendizaje es estructural.
- ADR: El motivo de una cancelación se guarda en la propia reserva → decisions/0003-cancel-reason-on-booking.md

## 6. Adendas

- _Ninguna._
