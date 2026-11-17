---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- **Cancelar con motivo** (`f591fe6`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada. Sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js`.
- **Listado de canceladas** (`53606a4`): comando `canceladas`, una línea «<sala> <día> — <motivo>» por reserva cancelada. `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda del proyecto).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde; `node e2e/run.mjs` → 7/7 en verde.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,2 s de E2E · configuración: la del gate · sobre el commit de cierre (el cierre solo añade `.docs/`).
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:55658/health` → `ok`, levantado en esta sesión y parado al acabar con `node scripts/env-down.mjs`.
- E2E: 48,2 s de 0,5 min

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite unitaria 5/5 y gate 7/7 E2E · smoke 5/5 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre 53606a4, arquitectura no (plan); lo posterior solo añadió `tasks.md`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (servidor con «me aburro») | ok |
| sin `--motivo` responde lo mismo | ejecución real (`node src/app.js cancelar Norte lun`) | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso, tras cancelar) | ok |

### 4.3 Residuales / deuda generada

- El test unitario de `canceladas` depende del estado que deja otro test (ruling de la Task 2) — deuda del proyecto.
- Suite E2E: 48,2 s de un presupuesto de 0,5 min — deuda del proyecto.

## 5. Aprendizajes

- Un test que solo pasa tras otro rompe la regla de «Datos» de `operations.md` → deuda del proyecto, no una nota en `operations.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
