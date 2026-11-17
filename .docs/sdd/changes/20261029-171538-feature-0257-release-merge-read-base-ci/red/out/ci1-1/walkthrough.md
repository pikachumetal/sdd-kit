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

- `src/app.js` y `test/cancel.test.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda en la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (5e00828).
- `src/app.js` y `test/cancel.test.js`: comando `canceladas`, que lista «sala día — motivo» de las reservas canceladas (b4d2f71).
- `capabilities/bookings.md`: capacidad nueva, fusionada desde el delta de la spec con `sdd capability merge`.

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` en vez de `node --test` — los tests comparten el almacén de reservas en memoria y corriendo en paralelo se pisan — coste si está mal: la suite tarda el doble. Es un workaround: tiene fila en la deuda del roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5 pasan, 0 fallan.
- Gate: `node --test --test-concurrency=1` → node --test: corrió 5/5 · 0,3 s · configuración: la del gate más `--test-concurrency=1` (ruling de la Task 2) · sobre 5add5dc (mismo código que b4d2f71; el commit de cierre solo añade documentos)

### 4.2 Smoke / tests

- Validación en campo: 2026-10-29 · verificación del agente: suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) sobre b4d2f71, limpias; no probado: que el motivo sobreviva entre invocaciones de la CLI (ver 4.3).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real | ok |
| Motivo fuera de la lista (`--motivo "me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` tras cancelar Norte lun responde «Norte lun — sala ocupada» | suite · ejecución real, en un mismo proceso | ok |

### 4.3 Residuales / deuda generada

- El almacén vive en memoria de cada proceso: `salas canceladas` lanzado como invocación aparte no ve las cancelaciones de otra. Lo cubre la fila 0014 «Motivo guardado» del roadmap; no se ha abierto otra.
- `test/cancel.test.js`: el test de `canceladas` depende del estado que deja el test de cancelar. Fila nueva en la deuda del roadmap.

## 5. Aprendizajes

- Los tests comparten estado en memoria y no se pueden paralelizar → fila de deuda «aislar el almacén por test» en el roadmap; el workaround `--test-concurrency=1` queda en la deuda, no en `tech-stack.md`.
- Revisión de skills: no aplica, mirado: el proyecto no tiene `.claude/skills/`.
- Conceptos y reglas de comportamiento → `capabilities/bookings.md`. `constitution.md` y `tech-stack.md`: sin cambios; no existe `architecture.md` y esta feature no cambia la estructura.

## 6. Adendas

- _Ninguna_
