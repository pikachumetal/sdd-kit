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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la propia reserva — `src/app.js`, `test/cancel.test.js`, commit c0f56b2.
- `canceladas` lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js`, commit bdff451.
- Capacidad `bookings` creada en `capabilities/bookings.md` con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- Sin `.docs/sdd/estimation.md`: no hay estimación ni estimation-log.
- Tokens del hilo: 664.153 — claude-sonnet-5-5 664.153 (solo el tramo de cierre: lo anterior a esta sesión no cuenta)
- Tokens de subagentes: 253.599 en 1 despacho — Re-review 0010 closing range claude-opus-5-5 253.599 / 1 min
- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar una carrera de los tests sobre el almacén compartido — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. La re-revisión dudó de la premisa (`node --test` ya aísla cada fichero en su proceso, y el gate del plan es `node --test` sin el flag): conviene revisarlo.
- ADR 0002 sin `### Confirmación` (Important de la re-revisión) — ADR anterior y ajeno a la feature; no lo reescribí sin el dev-lead y queda como deuda en el roadmap — coste si está mal: `sdd decision check` falla en ese ADR.
- Hash de la task 1 en `tasks.md` corregido de bdff451 a c0f56b2.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5/5 en verde.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/5 · smoke 3 de 4 THEN con ejecución real (el listado `canceladas` solo con suite) · revisión final Spec y Código sobre bdff451 limpia; re-revisión del tramo bdff451..aee0645 (solo documentación) con 1 Important abierto adjudicado (ver §3) · no probado: persistencia entre ejecuciones (el almacén vive en memoria, ADR 0001).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real + suite | ok |
| motivo fuera de la lista → «motivo no válido: …» | suite | ok |
| sin `--motivo` → «motivo no válido: …» | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | suite | ok |

### 4.3 Residuales / deuda generada

- `canceladas` por CLI sale vacío en una ejecución nueva: el almacén es en memoria. Es la fila 0014 «Motivo guardado» del roadmap.
- ADR 0002 sin Confirmación → fila en la deuda técnica del roadmap.
- Pendiente: la ADR candidata «el motivo se guarda en la propia reserva» (alternativa descartada: una tabla de motivos aparte) no está escrita como ADR.

## 5. Aprendizajes

- El motivo vive en la reserva cancelada → `capabilities/bookings.md`.
- La ADR candidata del motivo queda pendiente de escribirse (sin `architecture.md` ni plantilla de destino que lo pida) → ver 4.3.
- Sin patrón reutilizable ni skill desmentida: el proyecto no tiene `.claude/skills/`.

## 6. Adendas

- _Ninguna_
