---
id: 20261118-190500-patch-0352-capability-size-warning
task: 0352
title: Patch — aviso de capacidad de más de 5.000 palabras
type: patch
solution: dev-lead
status: done
created: 2026-11-18
branch: patch/0352-capability-size-warning
commit: 330bad3fd
---

# Patch 0352 — aviso de capacidad de más de 5.000 palabras

## Capacidades

- Modificadas: `capabilities` — `sdd capability check` avisa de una capacidad de más de 5.000 palabras

## 1. Síntoma

Una capacidad crece sin freno: en un proyecto del equipo, una llegó a 15.911 palabras, y cada delta que la toca copia requisitos y reglas enteros, así que sus specs salen largas. Nada lo avisaba.

## 2. Causa raíz (o intención, en un ajuste visual; o solución fijada, en una petición cerrada)

Solución fijada por el dev-lead, 2026-11-18: «sí, haz el patch del aviso de tamaño». `sdd capability check` ya avisaba de un requisito de más de 500 caracteres, pero no de la capacidad entera.

## 3. Fix

- **Fichero(s)**: `cli/src/capabilities/check.ts`, `cli/test/capability/check.test.ts`.
- **Cambio**: `sdd capability check` cuenta las palabras de cada capacidad que valida y, con más de 5.000, da un aviso, sin cambiar el código de salida.
- **Decisiones**: el tope de 5.000 palabras y el texto del aviso — sin el dev-lead.

## 4. Verificación

- Fila propuesta: ninguna
- Gate: `moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 775/775 · cli:typecheck: corrió · cli:test: corrió 2475/2487 (12 saltados por el runner)

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `pnpm exec vitest run test/capability/check.test.ts -t "oversized"` antes del fix | 1 falla («warns over 5000 words») ✅ |
| 2 | `pnpm exec vitest run test/capability/` tras el fix | 148/148 ✅ |
| 3 | `sdd capability check` en el proyecto del equipo con la capacidad grande | avisa de las dos que pasan de 5.000 (15.911 y 6.978 palabras) ✅ |
| 4 | `sdd capability check --path .docs/sdd` en el kit | avisa de 7 capacidades del kit (`feature-flow` 13.494, `control-profiles` 10.882…), sale con 0 ✅ |

Validación por el agente: 2026-11-18 · los cuatro casos

## 5. Tiempo (ligero)

- Esfuerzo real: ~20 min, aproximado con las marcas de los commits

## 6. Delta de capacidad

### Capacidad: `capabilities`

#### ADDED — Una capacidad de más de 5.000 palabras da un aviso

- GIVEN `bookings.md` con 5.001 palabras
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN escribe `Aviso: bookings.md: tiene 5001 palabras; el máximo aconsejado es 5000: pártela por propósito con sdd-propose, una capacidad por cosa que hace el usuario` y sale con 0
- AND con 5.000 palabras no avisa
