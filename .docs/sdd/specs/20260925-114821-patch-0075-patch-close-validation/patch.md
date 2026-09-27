---
id: 20260925-114821-patch-0075-patch-close-validation
task: 0075
title: Patch — sdd-end-patch fusiona y empuja sin la parada de validación
type: patch
status: done
created: 2026-09-25
branch: feature/0075-patch-close-validation
commit: 1f115b4
---

# Patch 0075 — `sdd-end-patch` fusiona y empuja sin la parada de validación

## Capacidades

- Modificadas: `control-profiles` — cambia «La validación puede diferirse con condiciones» y «El merge a develop sigue la política declarada»
- Modificadas: `commit-history` — cambia «El patch queda en dos commits»

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

Validación diferida: 2026-09-25 · «Diferido» · disparador: el próximo cierre de un patch de este repo en `delegate`, a cargo del dev-lead. El dev-lead eligió «Diferido» en la pregunta del paso 0 de este mismo cierre, sin disparador; lo concretó el agente.

## 5. Tiempo (ligero)

- Estimación: 30 min
- Real: ~0,7 h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — La validación puede diferirse con condiciones**
- GIVEN una task o un patch verificados por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una task o un patch en `unattended`
- WHEN el agente cierra
- THEN el walkthrough registra `Validación diferida: <fecha> · «<frase literal>» · disparador: <task, release o uso con dueño>` y el roadmap marca la fila `🧪 validación diferida a <disparador>`, no ✅; en un patch, la línea va en `patch.md` §4, debajo de la tabla, y la fila de la tabla de patches empieza por `🧪 validación diferida a <disparador> — `
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) no hay diferido: la task o el patch siguen esperando la validación
- AND con la frase y sin disparador, o con uno vago («diferida», «se prueba en uso»), el agente no vuelve a preguntar: concreta el uso más próximo, con quien difiere como dueño (`disparador: la primera exportación del informe mensual, a cargo del dev-lead`), y lo dice en el mensaje de cierre para que lo corrija
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** (en un patch, en `patch.md` §4) y pasa la fila a ✅ (en un patch, quita el prefijo 🧪)

**MODIFIED — El merge a develop sigue la política declarada**
- GIVEN una task o un patch validados (o diferidos) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso de rama del cierre (paso 10 de `sdd-end-task`, paso 6 de `sdd-end-patch`)
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta
- AND el bloque autoriza el merge, no la validación: en `pair` y `delegate`, el paso 0 de `sdd-end-patch` para con el smoke y la pregunta de validación antes de tocar nada

### Capacidad: `commit-history`

**MODIFIED — El patch queda en dos commits**
- GIVEN un patch con el fix verificado
- WHEN se cierra con `sdd-end-patch`
- THEN la rama tiene dos commits desde el `merge-base`: el fix (código, tests y `patch.md`) y el cierre (`patch.md` con el hash del fix y el tiempo, más changelog, roadmap y estimation-log si existen)
- AND el `commit:` de `patch.md` es el hash del commit del fix
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama
- AND si el dev-lead fija otra forma de commits, manda la suya y el fix no se junta; un test en RED va en el commit de su arreglo o en uno posterior, y el RED queda registrado en `patch.md` §4
