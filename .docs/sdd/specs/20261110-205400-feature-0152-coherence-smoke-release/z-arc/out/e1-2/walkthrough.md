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

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (6b6d203).
- `canceladas` lista las reservas canceladas como «<sala> <día> — <motivo>» — `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` (dba9f8e).
- Capacidad `bookings` creada con los dos requisitos del delta (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_ en el código.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 verdes; `node e2e/run.mjs` → 7/7 verdes.
- Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 48,2 s de E2E · configuración: la del gate (`E2E_TRACE` sin tocar, traza completa) · sobre el commit de cierre (el código es el de dba9f8e; el cierre solo añade documentos)
- Entorno de la suite: `node scripts/env-up.mjs` · `curl -f http://localhost:63522/health` → `ok`, levantado en esta sesión y parado al acabar con `node scripts/env-down.mjs`.
- E2E: 48,2 s de 0,5 min — pasa del presupuesto (ver 4.3).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 unitarios y 7/7 E2E · smoke 5/5 THEN con ejecución real contra el servidor levantado en la sesión · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre dba9f8e; el cierre solo cambia documentos.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (entrada que falla) | ok |
| sin `--motivo` responde lo mismo | ejecución real (entrada que falla) | ok |
| `canceladas`, tras cancelar con «sala ocupada», responde «Norte lun — sala ocupada» | ejecución real | ok |
| `canceladas` sin cancelaciones previas responde vacío (antes del THEN anterior; no está en la spec) | ejecución real | ok |

### 4.3 Residuales / deuda generada

- Suite E2E que pasa de su presupuesto: 48,2 s de 0,5 min — deuda del proyecto (causa visible en `e2e/run.mjs`: 6 s de espera por paso con la traza completa).
- Los tests de `canceladas` dependen del estado que deja otro test (ver Decisiones tomadas sin el dev-lead): deuda en «Por triar».

## 5. Aprendizajes

- Ninguno que cambie una convención, la arquitectura o una versión: el comportamiento observable va a `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna._
