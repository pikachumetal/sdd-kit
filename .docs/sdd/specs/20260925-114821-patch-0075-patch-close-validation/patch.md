---
id: 20260925-114821-patch-0075-patch-close-validation
task: 0075
title: Patch — sdd-end-patch fusiona y empuja sin la parada de validación
type: patch
status: done
created: 2026-09-25
branch: feature/0075-patch-close-validation
commit: <hash>        # hash del commit del fix; se escribe en el commit de cierre
---

# Patch 0075 — `sdd-end-patch` fusiona y empuja sin la parada de validación

## Capacidades

Ninguna, porque ninguna capacidad describe el cierre de un patch.

## 1. Síntoma

Fila de deuda del roadmap, de los tickets de los patches [0071](../../field-reports/20260925-090824-patch-0071-roadmap-structure-tests.md) §1 y [0072](../../field-reports/20260925-090909-patch-0072-subject-output-privacy.md) §1: «con `delegate` y el bloque `merge` completo, el paso 6 fusiona y empuja sin preguntar, aunque la tabla de gates de `control-profiles.md` dice que la validación para en `pair` y `delegate`». En la 0072 se fusionó y publicó, el dev-lead validó después y hubo que reabrir y fusionar otra vez. Y del ticket del patch 0072 §2: la forma de commits pedida por el dev-lead chocó con «un solo commit» y con el pre-commit.

Medido: el mismo. En `unattended` además falta la forma diferida (🧪) al fusionar.

## 2. Causa raíz

- `skills/sdd-end-patch/SKILL.md` pasa del paso 1 (`patch.md` finalizado) al 6 (merge) sin ningún paso de validación, y el paso 6 autoriza el merge sin preguntar con el bloque `merge` completo en `delegate`.
- La fila «Validación» de la tabla de gates de `control-profiles.md` no decía que valiera para el patch; la del merge sí nombra «cierre de task y de patch».
- «Validación diferida» solo daba la forma del walkthrough y de la fila de una task, no la de `patch.md` ni la de la tabla de patches (pieza del patch 0038 en la fila 0015).
- `commit-milestones.md` no decía qué pasa cuando el dev-lead fija la forma de los commits, ni dónde va un test en RED con un pre-commit que corre la suite.
- Evidencia: [RED](../../../../tests/patch-close-validation-red.md): en `delegate`, 0/2 preguntan la validación y los dos fusionan; en `unattended`, 2/2 no paran (correcto) y 0/2 dejan la forma 🧪.

## 3. Fix

- **Fichero(s)**: `skills/sdd-end-patch/SKILL.md`, `skills/sdd-start-task/references/control-profiles.md`, `skills/sdd-start-task/references/commit-milestones.md`, `skills/sdd-templates/templates/patch-template.md`, `tests/CommitMilestones.Tests.ps1`, `tests/patch-close-validation-red.md`, `tests/patch-close-validation-green.md`
- **Cambio**: `sdd-end-patch` gana un paso 0 «Validación», como el paso 0 de `sdd-end-task`: en `pair` y `delegate` para con el smoke de §4 y un guion de pruebas, y pregunta con `AskUserQuestion`, sola en su turno. Tiene tres salidas: validado (un «sí» sin detalle cuenta), diferido con la línea en §4 y el prefijo 🧪 en la fila, o «no funciona», que vuelve al fix. En `unattended`, diferido al smoke de la release. Van además una red flag y una fila de racionalización. `control-profiles.md` extiende la fila «Validación» al patch y añade la forma diferida del patch con su adenda. `commit-milestones.md`: manda la forma de commits que fija el dev-lead, y un test en RED va en el commit de su arreglo o después, con el RED registrado en `patch.md` §4.

Es el paso 0 y no un paso nuevo entre el 1 y el 6: renumerar rompía las anclas de `CommitMilestones.Tests.ps1` y `RoadmapClosing.Tests.ps1`, y las citas «paso 6 de `sdd-end-patch`» de `merge-recipe.md` y `control-profiles.md`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED v1 (`delegate`, bloque `merge` completo): ¿pregunta la validación antes del merge? | ❌ 0/2, los dos fusionan. Verificado por el agente |
| 2 | RED v2 (`unattended`, control): no para; forma 🧪 | ✅ no para 2/2 · ❌ forma 0/2 |
| 3 | GREEN v1: para con smoke, guion y pregunta, sin llamar al script de merge | ✅ 2/2 ([green](../../../../tests/patch-close-validation-green.md)) |
| 4 | GREEN v2: no para, fusiona con `Validación diferida:` en §4 y 🧪 en la fila | ✅ 2/2 |
| 5 | Anclas nuevas de `CommitMilestones.Tests.ps1` sobre el kit sin el fix | ✅ fallaban 3/3; con el fix, 21/21 |
| 6 | Suite rápida (`Invoke-Pester tests -ExcludeTag Slow`) | ✅ 714 pasan, 0 fallan |

Sujetos: 8 Sonnet headless, 2,58 $ (RED 1,47 $, GREEN 1,11 $).

## 5. Tiempo (ligero)

- Estimación: 30 min
- Real: ~0,6 h
