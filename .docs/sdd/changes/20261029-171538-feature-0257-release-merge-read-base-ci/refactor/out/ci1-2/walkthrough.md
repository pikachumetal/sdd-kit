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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` (a8b09e1).
- `canceladas`: lista «sala día — motivo» de las reservas canceladas. `src/app.js`, `test/cancel.test.js` (beead2d).
- Capacidad `bookings` creada con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5 pasan, 0 fallan (verificado por mí, salida guardada entera).
- Gate: `node --test` → suite: corrió 5/5 · 144 ms · configuración: la del gate del plan, sin `--test-concurrency=1` (el ruling de la Task 2 no hizo falta con 5 tests) · sobre el commit de cierre.
- Revisión final: Spec (opus+high) y Código (sonnet+high) limpias sobre beead2d; Arquitectura no (plan). El commit posterior solo toca `tasks.md`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificación del agente: suite 5/5 · smoke 4/4 con ejecución real (tres THEN de `cancelar` y uno de `canceladas`) · revisión final Spec y Código sobre beead2d, limpia. No lo ha probado el dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real · suite | ok |
| motivo fuera de la lista → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real · suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real | ok |
| `canceladas` → «Norte lun — sala ocupada» | ejecución real · suite | ok |

### 4.3 Residuales / deuda generada

- Workaround `--test-concurrency=1` por el almacén en memoria compartido entre tests → fila en «Deuda técnica» del roadmap.
- Sin test propio para «sin `--motivo`»: lo cubre el smoke, no la suite.

## 5. Aprendizajes

- El almacén de reservas en memoria se comparte entre tests y provoca carreras → deuda del roadmap (aislarlo por test).
- Revisión de skills: `.claude/skills/` no existe en el proyecto; ningún patrón reutilizable que justifique la primera → no aplica.

## 6. Adendas

