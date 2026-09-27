---
id: 20260927-105403-patch-0082-superpowers-obra-642
task: 0082
title: Patch — superpowers desde el marketplace de obra y validación de la 6.4.2
type: patch
status: done
created: 2026-09-27
branch: patch/0082-superpowers-obra-642
commit: 9a3687e
---

# Patch 0082 — superpowers desde el marketplace de obra y validación de la 6.4.2

## Capacidades

- Modificadas: `onboarding` — «La init deja la memoria automática desactivada y los temporales ignorados»: `.claude/settings.json` declara también el marketplace de superpowers
- Modificadas: `migration` — requisito nuevo «La migración a v2.0.0 declara el marketplace de superpowers»

## 1. Síntoma

Reportado (dev-lead, 2026-09-27): el kit tiene que resolver superpowers desde `superpowers-marketplace` (obra/superpowers-marketplace) y validar la 6.4.2, en la que solo cambia `writing-plans` (RELEASE-NOTES v6.4.2, #2333). `plan-template.md:150` no sigue «What a Step Contains».

Medido en esta máquina: el dev-lead tenía `superpowers@superpowers-marketplace` 6.4.2 (`installed_plugins.json`, actualizado a las 10:37:52Z), y a las 10:38:48Z apareció `superpowers@claude-plugins-official` 6.4.1 con `"auto": true`. Eran dos superpowers instalados a la vez. Cuando el dev-lead desinstaló el del marketplace oficial, `/reload-plugins` dio «1 error during load» y el kit 1.1.0 dejó de cargar: sus skills y los agentes `effort-*` desaparecieron de la sesión.

Medido para la decisión 3 ([RED](../../../../tests/superpowers-642-red.md)): la transcripción que predice la 6.4.2 **no se reproduce**, porque ningún plan copia el código entero. Pero `writing-plans` 6.4.2 se sigue a medias con la plantilla vieja. Sin cuerpo que la firma y los tests ya fijan: Sonnet 1/2 y Opus 2/2. Con asserts como código: 1/2 con los dos modelos. El patch sigue con este fallo medido.

## 2. Causa raíz

- **Dependencia**: `.claude-plugin/plugin.json` declara `superpowers` contra `claude-plugins-official`, y `marketplace.json` solo permite ese marketplace (`allowCrossMarketplaceDependenciesOn`). Ese marketplace fija superpowers a un commit: `source.sha: 5bf4e78…`, que es la 6.4.1 (`marketplaces/claude-plugins-official/.claude-plugin/marketplace.json`). El de obra apunta a la cabeza de `obra/superpowers.git`, y por eso ya instala la 6.4.2. Claude Code resuelve la dependencia en el marketplace declarado, así que instala la copia fijada junto a la de obra; sin esa copia, deshabilita el kit.
- **Instalación**: el README, las init y la migración no añaden el marketplace de obra. Una dependencia de otro marketplace no se instala si Claude Code no conoce ese marketplace.
- **Referencias**: la vigilancia del roadmap y `tests/DispatchBrief.Tests.ps1:46` leen la caché de `claude-plugins-official`.
- **6.4.2**: `diff -rq 6.4.1 6.4.2` en la caché de obra solo cambia `skills/writing-plans/SKILL.md`, borra `plan-document-reviewer-prompt.md` y toca los manifests. «What a Step Contains» sustituye a «No Placeholders»: en un paso de código van la firma, el fichero y los valores de la spec, y el cuerpo solo si el algoritmo no queda determinado. `plan-template.md:150` pedía «código real cuando ayude». Detalle en [`tests/superpowers-642-red.md`](../../../../tests/superpowers-642-red.md).

## 3. Fix

- **Fichero(s)**: `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `.claude/settings.json` (lo dejó el dev-lead con `/plugin`), `README.md`, `.docs/sdd/tech-stack.md`, `.docs/sdd/roadmap.md` (vigilancia), `skills/sdd-init-greenfield/SKILL.md`, `skills/sdd-init-greenfield/references/estructura.md`, `skills/sdd-init-brownfield/SKILL.md`, `skills/sdd-init-brownfield/references/generacion.md`, `skills/sdd-init-brownfield/references/migrations/v2.0.0.md`, `skills/sdd-templates/templates/plan-template.md`, `tests/Skills.Tests.ps1`, `tests/SuperpowersCompat.Tests.ps1`, `tests/MigrationInitParity.Tests.ps1`, `tests/DispatchBrief.Tests.ps1`, `tests/superpowers-642-red.md` y `tests/superpowers-642-green.md`.
- **Cambio**: la dependencia pasa a `superpowers@superpowers-marketplace`. El README añade `/plugin marketplace add obra/superpowers-marketplace` antes del kit y dice cómo quitar la copia del marketplace oficial. Las init y el paso 4 nuevo de la migración v2.0.0 (Art. V) escriben `extraKnownMarketplaces.superpowers-marketplace` en `.claude/settings.json`, y ejecutan `claude plugin marketplace add obra/superpowers-marketplace` si `claude plugin marketplace list` no lo muestra. La 6.4.2 queda validada en el README y en la vigilancia. El paso de implementación de `plan-template.md` sigue «What a Step Contains», con «asserts como código», y lleva detrás un bloque de ayuda con el contraejemplo medido. Alinear solo el texto no cambió la conducta (ronda 1 del GREEN); lo que funcionó fue el contraejemplo. Sin paso de migración para la plantilla: los proyectos la calcan del kit.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED determinista: 10 tests Pester nuevos (manifests, README, init, migración v2.0.0, vigilancia, plantilla) sobre el kit de `develop` | ❌ 10/10 fallan, como se esperaba |
| 2 | Los mismos tests con el fix | ✅ 10/10 |
| 3 | `tests/DispatchBrief.Tests.ps1`, test lento: `task-brief` de la caché de `superpowers-marketplace` extrae las interfaces de la plantilla | ✅ |
| 4 | RED de conducta, plantilla de `HEAD`: (a) sin cuerpo determinado · (b) asserts como código | Sonnet 1/2 · 1/2; Opus 2/2 · 1/2 |
| 5 | GREEN ronda 1: Step 1 alineado, sin contraejemplo (Sonnet) | ❌ (a) 1/2 · (b) 1/2: sin mejora |
| 6 | GREEN ronda 2: con «asserts como código» y el contraejemplo (Sonnet y Opus) | ✅ (a) 4/4 · (b) 4/4 |
| 7 | Suite Pester completa sin `Slow` | ✅ 841/0 (9 omitidos) |

Sujetos headless con `tests/headless/run.sh`: 10 sujetos, 12,03 $. El techo empezó en 4 sujetos y 6 $, y el dev-lead lo subió para medir Opus. Evidencia: [RED](../../../../tests/superpowers-642-red.md) y [GREEN](../../../../tests/superpowers-642-green.md), que incluye cómo lo hacen Spec Kit, OpenSpec y Kiro. Lo que no se ha probado: instalar el kit desde cero en una máquina sin `superpowers-marketplace`, porque cambiaría la configuración de Claude Code del dev-lead.

Validación diferida: 2026-09-27 · «Diferir: lo pruebo en la próxima sesión arrancada con ./Start-KitSession.ps1 en este worktree, a cargo del dev-lead» · disparador: la próxima sesión arrancada con `./Start-KitSession.ps1` en este worktree, a cargo del dev-lead

## 5. Tiempo (ligero)

- Real: 2,5 h

## 6. Delta de capacidad

### Capacidad: `onboarding`

**MODIFIED — La init deja la memoria automática desactivada y los temporales ignorados**
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield`
- WHEN crea la estructura del proyecto
- THEN `.claude/settings.json` tiene `"autoMemoryEnabled": false` y conserva las demás claves que ya tuviera
- AND `.claude/settings.json` tiene `extraKnownMarketplaces.superpowers-marketplace` con la fuente `github` `obra/superpowers-marketplace`, sin tocar las demás entradas; si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`
- AND `.gitignore` contiene las líneas `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` una sola vez cada una
- AND si `.claude/settings.json` ya tenía `"autoMemoryEnabled": true`, el agente pregunta antes de cambiarlo; si el usuario dice que no, la clave se queda en `true` y el resumen de cierre lo anota

### Capacidad: `migration`

**ADDED — La migración a v2.0.0 declara el marketplace de superpowers**
- GIVEN un proyecto que migra a v2.0.0 sin `extraKnownMarketplaces.superpowers-marketplace` en `.claude/settings.json`
- WHEN se aplica `v2.0.0.md`
- THEN `.claude/settings.json` gana esa entrada con la fuente `github` `obra/superpowers-marketplace`, sin tocar las demás claves ni entradas y sin gate
- AND si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`
- AND si la entrada ya está y el marketplace aparece en la lista, el paso se salta y lo dice