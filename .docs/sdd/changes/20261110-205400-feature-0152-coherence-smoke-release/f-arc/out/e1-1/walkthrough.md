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

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs`, 393d4e7): `cancelar <sala> <día> --motivo <motivo>` acepta solo «cambio de planes», «sala ocupada» u «otro»; sin motivo o con otro responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`, 3d28bd6): `canceladas` lista «<sala> <día> — <motivo>».
- Capacidad `bookings` creada con el delta de la spec (`capabilities/bookings.md`, `sdd capability merge`): no existía; «Capacidades» de la spec la declara nueva.

## 3. Desviaciones del plan

- _Ninguna_: dos tasks, Native, como el plan.

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test test/` → 5/5 en verde. `node e2e/run.mjs` → 7/7 en verde, con el servidor levantado en esta sesión.
- Gate: `node --test test/` · `node --test test/ && node e2e/run.mjs` → unit: corrió 5/5 · e2e: corrió 7/7 · 49 s · configuración: la del gate · sobre el commit de cierre (el cierre solo añade `.docs/`)
- Entorno de la suite: `node scripts/env-up.mjs` → «entorno arriba» (el script comprueba `/health` antes de salir), levantado en esta sesión.
- E2E: 48 s de 0,5 min de Presupuesto E2E: lo pasa, deuda del proyecto en 4.3.
- Revisión final: Spec (opus) y Código (sonnet) limpias sobre 3d28bd6; Arquitectura no sale (el plan dice `no`). Re-revisión del único commit posterior (solo documentación) limpia, effort-high + opus.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 y e2e 7/7 · smoke 4/4 THEN con ejecución real contra el servidor, sesión propia · revisión final Spec y Código sobre 3d28bd6, re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ✅ |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "porque sí"`) | ✅ |
| sin `--motivo` responde lo mismo | ejecución real | ✅ |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | ✅ |

`canceladas` antes de cancelar nada respondió vacío: no está en la spec, queda dicho.

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» no tiene test unitario ni e2e: solo lo cubre el smoke. Fila en `debt.md`.
- El test de `canceladas` depende del primer test (ver «Decisiones tomadas sin el dev-lead»). Fila en `debt.md`.
- E2E: 48 s sobre un presupuesto de 0,5 min — deuda del proyecto. Fila en `debt.md`.

## 5. Aprendizajes

- Ninguno que cambie una convención, la arquitectura o una versión; el comportamiento nuevo vive en `capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
