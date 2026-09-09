---
id: 20260909-100606-task-0000-skills-validation
task: 0000
title: Walkthrough — Validación de frontmatter y estructura de las skills (T8)
spec: ./spec.md
status: done
created: 2026-09-09
---

# Walkthrough — Validación de frontmatter y estructura de las skills (T8)

Task en **modo lite**: sin `plan.md` ni `tasks.md`; ejecutada en línea con TDD.

## 1. Cambios realizados

- `tests/Skills.Tests.ps1` (107 tests generados por `-ForEach` sobre las 11 skills + índice de plantillas + lista de superpowers + manifests) y `tests/Manifests.Tests.ps1` (3 tests que adoptan `claude plugin validate`). Ambos aceptan `$env:SDD_KIT_ROOT` para correr sobre una copia.
- `.githooks/pre-commit`: ejecuta `Invoke-Pester -Path tests` y bloquea el commit si falla. Activación por clon: `git config core.hooksPath .githooks`.
- Dos infracciones reales que la suite destapó en el repo: `skills/sdd-templates/SKILL.md` sin `## Overview` y `marketplace.json` sin `description`. Corregidas.
- `tests/Build-EstimationLog.Tests.ps1`: `6>$null` para que la salida de Pester quede limpia (el script de T7 escribe con `Write-Host`).
- README («Desarrollo del kit») y `tech-stack.md`.
- Commit `2470d3b` (primer commit del kit que pasó por el hook: 131/131 en 4,8 s).
- **Ronda de arreglos tras `requesting-code-review`** (Sonnet, camino en línea): el hook estaba en el índice como `100644` (inerte en Unix sin aviso) → `git update-index --chmod=+x` y `.gitattributes` con `eol=lf` para `.githooks/`; `Set-ItResult -Skipped` en un `BeforeAll` convertía el skip sin `claude` en tres fallos con excepción → `Describe -Skip:` evaluado en `BeforeDiscovery`; el JSON de `validate` se parseaba con stderr mezclado → solo stdout, con error legible si no es JSON; `Compare-Object` sobre conjuntos vacíos pasaba en vacío → guardas de `Count > 0`; el hook avisa si falta `pwsh`. Segundo commit.

## 2. Tiempo: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (de la spec): 1 h (rango 0,7–1,5)
- Esfuerzo real: **~0,7 h** (aproximado: spec aprobada 10:08 UTC, commit 10:11 UTC tras el ciclo RED/GREEN, revisión de código de ~12 min, ronda de arreglos y cierre hasta ~10:50 UTC). Spec: ~0,3 h (sondeo de `claude plugin validate` incluido).
- Desviación: −0,3 h (−30 %)
- Causa de la desviación: en el umbral. El sondeo previo de `claude plugin validate` ya había fijado qué faltaba por cubrir y las reglas son de una aserción cada una; la revisión de código sí encontró dos Critical que el GREEN en Windows no podía ver (bit de ejecución sintetizado por MSYS; `claude` siempre en PATH), y su ronda costó lo mismo que la implementación.

## 3. Desviaciones del plan

Sin plan (lite). Respecto a la spec: ninguna. El test de manifests añade dos comprobaciones no listadas en la decisión 4 (dependencia `superpowers` en `plugin.json`, `description` en `marketplace.json`) porque son las que hacen que `--strict` pase y que la pregunta del dev-lead («¿se puede indicar que el kit necesita superpowers?») tenga test.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 132, Failed: 0, Skipped: 5** (los 5 skipped son las skills sin `references/`, por diseño). Verificado por el agente.

### 4.2 Smoke / tests

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: suite sobre una copia del repo con nueve infracciones (name `Sdd Consult!` y description perdida, frontmatter borrado, enlace roto, `references/` huérfano, `@references/`, plantilla fuera del índice, `superpowers:writing-skillz`, H1 distinto, versión `0.5`, marketplace sin description) | ✅ verificado: 14 fallos en `Skills.Tests.ps1` + 2 en `Manifests.Tests.ps1`, exactamente los inducidos |
| 2 | GREEN: suite sobre el repo | ✅ verificado: 131/131 tras corregir el Overview de `sdd-templates` y la description del marketplace |
| 3 | El hook bloquea un commit con la suite en rojo | ✅ verificado: `SDD_KIT_ROOT=<copia rota> sh .githooks/pre-commit` → exit 1 |
| 4 | El hook deja pasar un commit con la suite en verde | ✅ verificado: commit `2470d3b` pasó por el hook (131/131, 6,7 s de reloj) |
| 4b | Sin `claude` en PATH, los tests de `validate` se saltan (no fallan) | ✅ verificado tras la ronda de arreglos: `Passed=0 Failed=0 Skipped=3` con el PATH filtrado |
| 4c | Hook sin `pwsh` en PATH | ✅ verificado: mensaje «necesita pwsh» y exit 1 |
| 4d | Hook con bit de ejecución en el índice | ✅ verificado: `git ls-files -s` → `100755`; fichero LF |
| 5 | `claude plugin validate --strict` acepta `skills/` y `marketplace.json` | ✅ verificado (antes de la description, `marketplace.json` fallaba en strict) |
| 6 | Salida de Pester limpia | ✅ verificado: sin líneas «Generado …» tras el `6>$null` |

### 4.3 Residuales / deuda generada

- El fichero de pipeline (GitHub Actions / Azure DevOps) queda ligado a la decisión de hosting del roadmap.
- El test de huérfanos solo cuenta enlaces desde `SKILL.md`; un `references/` enlazado únicamente desde otro reference se marcaría huérfano. Hoy no ocurre; si ocurre, el test se amplía.
- El aviso de `plugin.json` en `--strict` (CLAUDE.md en la raíz) es inherente al repo: si Claude Code lo cambia, el test de manifests puede pasar a strict.

## 5. Aprendizajes

- **`claude plugin validate` cubre menos de lo que sugiere el nombre**: detecta frontmatter y description ausentes, pero acepta `name: Sdd Consult!` y no mira enlaces ni anatomía. Adoptar (Art. IX) y completar con tests propios. → `tech-stack.md`.
- **Los tests estructurales sobre el propio repo hacen de contrato**: al primer pase encontraron dos infracciones reales que tres campañas de A/B no habían visto. → `tech-stack.md`.
- **Un GREEN en Windows no prueba el hook**: MSYS sintetiza el bit de ejecución desde el shebang y `claude` siempre está en PATH, así que ni el `100644` ni el `Set-ItResult` mal ubicado fallaban aquí; la revisión de código los encontró clonando a limpio y filtrando el PATH. Probar la degradación (sin `claude`, sin `pwsh`) es parte del smoke. → `tech-stack.md`.
- **El `--strict` no siempre es alcanzable**: un aviso inherente al layout del repo (CLAUDE.md en la raíz) obliga a decidir por fichero qué modo se usa. → `tech-stack.md`.
