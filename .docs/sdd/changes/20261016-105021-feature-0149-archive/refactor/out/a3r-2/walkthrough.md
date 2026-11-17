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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (67a7aa2).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (d2c93c5).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado en `tech-stack.md` y con fila en la deuda técnica del roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `node --test --test-concurrency=1` → 5 pasan, 1 falla (`test/export.e2e.test.js`, «TimeoutError: export no respondió en 5000 ms») · 0,6 s · sobre b428cc6.
- El fallo no es de la rama: en `develop` (dc4cbe0) el mismo comando da 4 pasan, 1 falla, el mismo test. Está en la deuda técnica del roadmap.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-16 · suite 5/6 (el 6.º es el e2e rojo también en `develop`) · smoke 3/3 THEN de cancelar y 1/1 de canceladas con ejecución real · revisión final Spec y Código sobre d2c93c5, limpia; HEAD solo añade `tasks.md` (documentación). No probado: nadie del equipo lo ha usado a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite · ejecución real (CLI) | ok |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite · ejecución real (`run` con «me aburro») | ok |
| Sin `--motivo` responde lo mismo | ejecución real (CLI); sin test propio | ok |
| `canceladas` responde «Norte lun — sala ocupada» | suite · ejecución real (`run` en un mismo proceso: el almacén es en memoria y el CLI arranca vacío cada vez) | ok |

### 4.3 Residuales / deuda generada

- Fila de deuda nueva: tests que comparten el almacén en memoria (origen del workaround de arriba).
- Sin test propio para «sin `--motivo`»; lo cubre el mismo camino que «fuera de la lista».
- El `test/export.e2e.test.js` rojo ya estaba en la deuda.

## 5. Aprendizajes

- Los tests comparten el almacén en memoria y se pisan en paralelo → `tech-stack.md` (línea Tests) y deuda técnica del roadmap.
- Skills del proyecto: `.claude/skills/` no existe y nada del trabajo pide una; no aplica.

## 6. Adendas

- _Ninguna_
