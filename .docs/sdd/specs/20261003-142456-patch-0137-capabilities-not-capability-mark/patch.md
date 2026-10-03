---
id: 20261003-142456-patch-0137-capabilities-not-capability-mark
task: 0137
title: Patch — Test-Capabilities.ps1 omite un documento marcado «No es una capacidad.»
type: patch
solution: dev-lead
status: done
created: 2026-10-03
branch: hotfix/v2.3.1
commit: <hash>
---

# Patch 0137 — Test-Capabilities.ps1 omite un documento marcado «No es una capacidad.»

## Capacidades

- Modificadas: `capabilities` — añade «Un documento marcado «No es una capacidad.» no se valida» y cambia la regla «Avisos» (la línea de éxito nombra los omitidos)

## 1. Síntoma

Fila de deuda del roadmap «Un documento funcional heredado dentro de `capabilities/` deja el validador en rojo permanente» ([ticket de la feature 6298 de un proyecto del equipo](../../field-reports/20260928-120657-feature-6298-layout-two-columns.md) §6, 2026-09-28): un fichero de `capabilities/` que se declara «no es una capacidad» (documento funcional anterior al troceo) lo rechaza entero `Test-Capabilities.ps1`, y el rojo permanente tapa fallos reales. La misma fila reúne los punteros del repo de templates ([ticket de la feature 0021 del template](../../field-reports/20260928-145021-feature-0021-init-template-bridge.md) §1).

Medido sobre `main` (2.3.0): `capabilities/` con `estimation.md` y un `funcional-legado.md` que se declara «No es una capacidad» da 4 errores de ese fichero (título, «Requisitos», sección «Pantallas», «Propósito») y sale con 1.

## 2. Solución fijada

Dev-lead, 2026-10-03, eligiendo entre las propuestas de los tickets: «Una línea `> **No es una capacidad.**` justo tras el título: Test-Capabilities.ps1 omite ese fichero y lo nombra en su salida; con un `- GIVEN` dentro sí da error. Solo el script y su test; el paso 7 de la migración, Get-CapabilityIndex y los punteros del template siguen en la 0129.»

Lo que da por existente, comprobado: `Test-Capabilities.ps1` valida cada `*.md` de `capabilities/` sin excepción (`Get-CapabilityFiles` y `Test-CapabilityFile`).

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Test-Capabilities.ps1`
  - `tests/Test-Capabilities.Tests.ps1`
  - `.docs/sdd/capabilities/capabilities.md` (fusión del delta, en el cierre)
- **Cambio**: si la primera línea no vacía tras el título empieza por `> **No es una capacidad.**`, el fichero no se valida; falla solo si tiene líneas de escenario (`- GIVEN`, `- WHEN`, `- THEN`, `- AND`). La línea de éxito los cuenta fuera y los nombra: `Capacidades válidas: 1 · omitidas por «No es una capacidad.»: funcional.md`.
- **Decisiones**:
  - La marca, su sitio y el alcance (solo el script) — dev-lead
  - El texto de la línea de éxito y el del error de una marca con escenarios — sin el dev-lead (los lee el agente que cierra, no el usuario del proyecto)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | tests nuevos antes del fix: un documento marcado se omite y se nombra; uno marcado con escenarios falla | ❌ los dos, como se esperaba |
| 2 | `tests/Test-Capabilities.Tests.ps1` y `tests/CapabilityRules.Tests.ps1` tras el fix | ✅ 77/77 |

Los casos los verificó el agente.

## 5. Tiempo (ligero)

- Real: 0,4h

## 6. Delta de capacidad

### Capacidad: `capabilities`

**ADDED — Un documento marcado «No es una capacidad.» no se valida**
- GIVEN `capabilities/funcional.md`, un documento funcional heredado o un puntero, cuya primera línea no vacía tras el título empieza por `> **No es una capacidad.**`
- WHEN se ejecuta `Test-Capabilities.ps1 -Path .docs/sdd`
- THEN no informa errores de ese fichero, sí de las capacidades reales, y la línea de éxito lo cuenta fuera y lo nombra: `Capacidades válidas: 1 · omitidas por «No es una capacidad.»: funcional.md`
- AND si el fichero marcado tiene líneas de escenario, falla con `funcional.md: marcado «No es una capacidad.» y con escenarios: quita la marca o los escenarios`

**Reglas de la capacidad**
- **Avisos**: `Test-Capabilities.ps1` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`, seguida de `· omitidas por «No es una capacidad.»: <ficheros>` si omitió alguno. `Merge-CapabilityDelta.ps1` escribe una línea por cambio, `<fichero>: añadido|sustituido|quitado «<requisito>»` o `<fichero>: regla «<nombre>» sustituida|añadida`, y sale con 0; con fallos, una línea por fallo, sale con 1 y no escribe ningún fichero. `Get-CapabilityIndex.ps1` marca con `(sin propósito)` la capacidad que no lo tiene, y sale con 0.
