---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada (cambio de planes, sala ocupada, otro) y comando `canceladas` con el motivo: `src/app.js`, `test/cancel.test.js` (5ab0039, e3a1974).
- Task 3: cancelar libera la sala en `libres` (b3c77c1), tras un fallo del script de validación; el commit 8848f97 había dejado `libres` con `!== 'voided'`.
- Pasada de fix de la revisión final: tests de `cancelar` sin `--motivo` y de «sin reserva» (fa4d5b9).

## 3. Desviaciones del plan

- Task 3, añadida al final del plan por el fallo del paso 3 del script (aprobada por el dev-lead).

### Decisiones tomadas sin el dev-lead

- Tests de `canceladas` y de `libres` tras cancelar reutilizan la cancelación del primer test — workaround hasta poder reiniciar el estado — fallan si corren solos o en otro orden.
- Revisión final: tests dependientes del orden se quedan como están — reiniciar el estado exige exportar algo fuera del plan — mismo coste.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/` · `node e2e/run.mjs` → unit: corrió 6/6 · e2e: corrió 7/7 (48 s), sobre b3c77c1; tras la pasada de fix, unit 8/8 sobre fa4d5b9.

### 4.3 Residuales / deuda generada

- `canceladas` sin canceladas imprime una línea vacía (el spec calla).
- `src/app.js` en LF y el resto del repo en CRLF, sin `.gitattributes`.
- `reasonOf` toma mal los posicionales si `--motivo` va antes de sala y día.
- La decisión 3 del spec dice MODIFIED y los requisitos están como ADDED.
