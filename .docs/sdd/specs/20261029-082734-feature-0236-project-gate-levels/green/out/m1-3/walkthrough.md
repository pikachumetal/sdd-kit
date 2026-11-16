---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-29
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (949ef18, Task 1).
- `src/app.js`, `test/cancel.test.js`: comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva cancelada (387add6, Task 2).
- `.docs/sdd/tech-stack.md`: `src/app.js` también valida el motivo al cancelar.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- Ninguna sobre el plan. El gate de cierre del plan es `node --test`; la ejecución usó `node --test --test-concurrency=1` (ver el ruling).

### Decisiones tomadas sin el dev-lead

- Task 2: correr el gate con `node --test --test-concurrency=1` para esquivar una carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. En el cierre, `node --test` a secas también pasa 5/5, así que la carrera no se reprodujo; lo que sí se ve en el código es que el test de `canceladas` depende del estado que deja el test anterior del mismo fichero. Queda como deuda (4.3).

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde; `node --test` → 5/5 en verde (salida guardada en el scratchpad de la sesión).
- Gate: `node --test` → corrió 5/5 (sin tarea de gate propia, ni E2E) · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificación del agente: suite 5/5 · smoke 4/4 THEN con ejecución real (el de `canceladas`, en un solo proceso: ver nota) · revisión final de Spec y Código limpia sobre 387add6; los commits posteriores solo tocan documentación (`tasks.md`, `tech-stack.md`, menos de 20 líneas cada uno) y no se re-revisó. Nada reportado por el dev-lead: no probado por una persona.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | verificado |
| un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real y suite | verificado |
| sin `--motivo` responde lo mismo | ejecución real; la suite no lo cubre | verificado por ejecución real |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run('cancelar', …)` y luego `run('canceladas', [])`) y suite | verificado; ver nota |

Nota: por la CLI, `node src/app.js canceladas` en un proceso nuevo responde vacío, porque las reservas viven en memoria y no se guardan entre ejecuciones. La spec lo da así (GIVEN la reserva ya cancelada) y la 0014 «Motivo guardado» del roadmap lo cubre; no es un fallo de esta feature, pero el listado no se puede ver todavía de punta a punta desde la línea de comandos.

### 4.3 Residuales / deuda generada

- Test `canceladas` dependiente del orden y gate con `--test-concurrency=1` (workaround): fila en «Deuda técnica» de `roadmap.md`, a resolver aislando el almacén por test.
- Sin validación de que «sin `--motivo`» tenga test propio: lo cubre solo el smoke.

## 5. Aprendizajes

- Los ficheros `.md` de `.docs/sdd/` están en CRLF: editarlos conservando los finales de línea para no reescribir el fichero entero en el diff → ninguno (no hay doc vivo donde vaya; `architecture.md` no existe y no hay plantilla de convenciones de edición).
- Revisión de skills: no hay `.claude/skills/` en el proyecto; no aplica.

## 6. Adendas

- Sin adendas.
