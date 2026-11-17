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

- `src/app.js`, `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la propia reserva (Task 1, `7507118`).
- `src/app.js`, `test/cancel.test.js`: el comando `canceladas` lista las reservas canceladas como «sala día — motivo» (Task 2, `c8fdf01`).
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva, con los dos requisitos de la spec.
- `.docs/sdd/decisions/0003-cancel-reason-on-booking.md`: ADR de la candidata de la spec.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. El cierre no lo usa: corre el gate de la constitution, `node --test` a secas, y sale verde (8 de 8 pasadas). La re-revisión lo marcó Important por apartarse de la constitution, art. 2; queda como fila de deuda.
- Cierre: añadí la sección «Confirmación» a `decisions/0002-node-test.md`, que faltaba, porque `sdd decision check` no deja pasar un ADR sin ella.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde (119 ms); además 8 pasadas seguidas en verde para descartar la carrera del Ruling.
- Gate: `node --test` → corrió 5/5 · 119 ms · configuración: la del gate · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · verificado por el agente: suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia sobre c8fdf01 · re-revisión de c8fdf01..cierre con 1 Important (Ruling del gate, resuelto sin el flag) y 1 Minor (commit de la Task 1, corregido). Nada reportado por el usuario.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, `--motivo "porque sí"`) | ok |
| sin `--motivo` responde lo mismo | ejecución real (CLI) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (`run()` importado, mismo proceso: el almacén vive en memoria y la CLI no lo conserva entre llamadas) | ok |

### 4.3 Residuales / deuda generada

- Los tests de `test/cancel.test.js` comparten el almacén en memoria y `canceladas` depende de que antes se haya cancelado: deuda en el roadmap.
- La fila 0014 del roadmap («Motivo guardado») describe lo que esta feature ya hace; no la he marcado, la decide el dev-lead.

## 5. Aprendizajes

- El motivo de una cancelación vive en la propia reserva → `decisions/0003-cancel-reason-on-booking.md`
- Comportamiento observable nuevo (motivo y listado) → `capabilities/bookings.md`

ADR: El motivo de una cancelación se guarda en la propia reserva — alternativa descartada: una tabla de motivos aparte → decisions/0003-cancel-reason-on-booking.md

Retro: sin señales

## 6. Adendas

- _Ninguna_
