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

- `cancelar <sala> <día> --motivo <motivo>` (`src/app.js`, `test/cancel.test.js`, c166f31): el motivo tiene que ser de la lista cerrada (cambio de planes, sala ocupada, otro); fuera de ella, o sin `--motivo`, responde «motivo no válido: …». La reserva cancelada guarda el motivo.
- Comando `canceladas` (`src/app.js`, `test/cancel.test.js`, 220947e): lista «sala día — motivo» de las reservas canceladas.
- Capacidad `bookings` creada con `sdd capability merge` (no existía) con los dos requisitos de la spec.

## 3. Desviaciones del plan

- _Ninguna_. El gate de cierre del plan es `node --test`; el ruling de abajo lo corre además con `--test-concurrency=1`.

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Tiene su fila en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test` → corrió 5/5, verde · también con `--test-concurrency=1`, 5/5 · configuración: la del gate del plan · sobre el commit de cierre (el código es el de 220947e; el cierre solo suma `.docs/`).
- Revisión final: Spec (opus, high) y Código (sonnet, high) limpias sobre 220947e; Arquitectura no (lo decidió el plan). El commit posterior solo toca `tasks.md`: no hay re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificado por el agente: suite 5/5 · smoke 5/5 THEN con ejecución real (CLI `node src/app.js`) salvo el listado, que solo se ve con `suite` porque el almacén vive en memoria de un proceso y cada invocación de la CLI empieza de cero · revisión final Spec y Código limpia sobre 220947e. El dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite (`test/cancel.test.js`) | ok |

### 4.3 Residuales / deuda generada

- El almacén de reservas vive en memoria compartida y los tests dependen del orden: deuda en el roadmap (el workaround del ruling). El motivo guardado de forma duradera es la 0014.

## 5. Aprendizajes

- Los tests de `cancel.test.js` comparten el almacén en memoria y dependen del orden → fila de «Deuda técnica» de `roadmap.md`.
- Revisión de skills: `.claude/skills/` no existe en el proyecto; el trabajo no revela un patrón reutilizable → no aplica.
- `architecture.md` no existe y ningún aprendizaje estructural lo pide.

## 6. Adendas

- _Ninguna_
