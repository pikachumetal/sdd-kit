---
id: 20260925-144030-task-0077-playwright-visual-check
task: 0077
title: Plan de implementación — Verificación visual con Playwright, hecha por el agente
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Verificación visual con Playwright, hecha por el agente

## Decisiones que he tomado yo — valida estas

1. **Dos tasks**: el texto de `sdd-start-task` con sus tests de literales, y el GREEN. Van en serie porque el GREEN mide el texto de la Task 1.
2. **Ejecución Native**: son ediciones de texto de un solo fichero de skill más una campaña que lanza el propio hilo. Por subagentes, cada despacho repetiría el contexto para diez líneas.
3. **Modelo**: la sesión va en Opus 5.5 porque el dev-lead eligió la delegación sin la parada de gama media. El revisor final va con Opus y `sdd-kit:effort-high`, el techo del Art. IV. Los sujetos del GREEN van en Sonnet, salvo `q5` y `q1`, que miden una conducta que depende de la sesión y van en Opus (`tech-stack.md`, task 0058).
4. **El ejemplo de la guía va en otro dominio que el molde** (`tech-stack.md`, task 0011): el botón «Pagar», no el selector de estado. Así el sujeto del GREEN no recibe la respuesta literal.
5. **La variante de gama media vive entera en el paso 2**, que remite al paso 4 para lo que pasa después. El paso 4 no se toca: su oferta equivalente ya está medida (`tests/session-model-green.md`).
6. **Coste**: ~1 h de implementación y GREEN, 11 sujetos, ~6 $. Dentro de la previsión de la spec.

**Goal**: el paso 6 y el paso 7 de `sdd-start-task` dicen cómo mirar sin el MCP, cuándo vale «no probado» y qué se enseña; el paso 2 ofrece bajar la sesión a gama media al delegar la spec.

**Architecture**: tres frases nuevas o ampliadas en `skills/sdd-start-task/SKILL.md` y una fila de racionalización, fijadas por un test Pester de literales. El GREEN reutiliza el molde y el lanzador del RED.

**Tech Stack**: Markdown, Pester 5+, bash con el lanzador de `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks en serie sobre un fichero y la segunda la ejecuta el propio hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta; nombres de fichero en inglés kebab-case (Art. III).
- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell (Art. X).
- Todo test nuevo que lance procesos lleva `-Tag 'Slow'`; un test de literales no lo lleva.
- Un literal con Markdown se compara con `[regex]::Escape`, nunca con `-BeLike`.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, un commit por hito (`commit-milestones.md`).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres frases y una fila; sin fichero auxiliar (lo recortó el RED).
- [x] **YAGNI gate**: nada abstraído.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 2), Art. II (contraejemplo con su escenario `x4`), Art. III, Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/VisualCheck.Tests.ps1` — literales de los pasos 2, 6 y 7 y de la racionalización.
- `tests/visual-check-green.md` — evidencia del GREEN.
- `.docs/sdd/specs/20260925-144030-task-0077-playwright-visual-check/green/out/` — salidas de los sujetos del GREEN.

**Modificar**:

- `skills/sdd-start-task/SKILL.md` — pasos 2, 6 y 7 y tabla de racionalizaciones.
- `.docs/sdd/roadmap.md` — fila de deuda del matiz en los pasos 4 y 5 (decisión 7 de la spec).

**NO se tocan**:

- `skills/sdd-templates/templates/plan-template.md` — el campo ya pide lo necesario (decisión 3 de la spec).
- `skills/sdd-start-task/references/control-profiles.md` — la tabla de gates no cambia: la parada de `pair` y la validación ya existen.
- El paso 4 de `sdd-start-task` — decisión 5 de este plan.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h (incluye el RED, 12 sujetos)
- Estimación de implementación: 1h
- Base de la estimación: 2 tasks; la Task 1 es texto medido ya en el RED y la Task 2 una campaña de 11 sujetos de ~5 min cada uno en tandas de 3–4, con el molde hecho
- Confianza: media — un GREEN que falle abre una tanda de REFACTOR, que la previsión cubre justa

---

## 2. Tasks

### Task 1 — El texto de `sdd-start-task` y sus literales

**Modelo**: la sesión (Native, Opus 5.5, effort de la sesión)
**Tests RED**: hilo principal · `tests/VisualCheck.Tests.ps1`, escritos antes de editar la skill y sin commitear: van en el commit de la task
**Superficies**: docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/VisualCheck.Tests.ps1,tests/TaskVerification.Tests.ps1,tests/FewerStops.Tests.ps1,tests/SessionModel.Tests.ps1,tests/Skills.Tests.ps1 -CI"`

**Interfaces**:
- Consume: nada.
- Produce: el texto que mide la Task 2, con estos literales: «un script con el paquete `playwright`», «El MCP de Playwright no está en la sesión» no es estar sin navegador, «guárdala fuera de git hasta la validación», «nos vemos en la validación, y paras antes de la Task 1 para que baje la sesión a gama media», «Con una sola task prevista no la ofrezcas».

**Ficheros**: crear `tests/VisualCheck.Tests.ps1`; modificar `skills/sdd-start-task/SKILL.md`.

- [ ] **Step 1: Tests RED** — crear `tests/VisualCheck.Tests.ps1`:

```powershell
BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:Skill = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-start-task/SKILL.md') -Raw

  function Get-Step([int]$Step) {
    return [regex]::Match($script:Skill, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    $Text | Should -Not -BeNullOrEmpty
    foreach ($literal in $Literals) { $Text | Should -Match ([regex]::Escape($literal)) }
  }
}

Describe 'Verificación visual' {
  It 'el paso 6 da el script de Playwright cuando falta el MCP, con su contraejemplo' {
    Assert-Literal (Get-Step 6) @('un script con el paquete `playwright`', '«El MCP de Playwright no está en la sesión» no es estar sin navegador', 'con el error concreto')
  }

  It 'el paso 6 conserva las capturas hasta la validación' {
    Assert-Literal (Get-Step 6) @('guárdala fuera de git hasta la validación', 'sin borrarla al limpiar')
  }

  It 'la parada de pair y la validación enseñan medidas y capturas antes del guion' {
    Assert-Literal (Get-Step 6) @('antes del guion enseña cada medida con su valor y el esperado y la ruta de cada captura')
    Assert-Literal (Get-Step 7) @('antes del guion van sus medidas', 'la ruta de cada captura', '«no probado» con su motivo')
  }

  It 'la tabla de racionalizaciones responde al «no tengo el MCP»' {
    $script:Skill | Should -Match '(?m)^\| "No tengo el MCP de Playwright[^\n]*script con el paquete `playwright`'
  }
}

Describe 'Delegación y gama media' {
  It 'la primera pregunta ofrece la variante de gama media con las tasks previstas' {
    Assert-Literal (Get-Step 2) @('«apruebo la spec por delegación, nos vemos en la validación, y paras antes de la Task 1 para que baje la sesión a gama media»', '(«prevé 3 tasks»)', 'Con una sola task prevista no la ofrezcas')
  }
}
```

Ejecutarlo: 5 tests en rojo.

- [ ] **Step 2: Paso 2** — tras la frase «Elegirla es la frase literal que quita la parada de la spec; la aplica el paso 4.», añadir:

> Si la sesión va con el modelo más capaz y prevés más de una task en el plan, la misma pregunta ofrece también, sin ser la recomendada, «apruebo la spec por delegación, nos vemos en la validación, y paras antes de la Task 1 para que baje la sesión a gama media», con las tasks que prevés («prevé 3 tasks») y el motivo del paso 4: con la spec delegada no queda otra parada donde cambiar de modelo, y el hilo es la mayor parte del coste de una sesión. Con una sola task prevista no la ofrezcas: rehacer la caché al cambiar de modelo cuesta más de lo que ahorra una task corta. Si la elige, apruebas la spec como con la opción anterior y, tras el plan, sigues la opción de gama media del gate del paso 4. Sin esta variante, 0 de 2 sujetos en Opus mencionaron el modelo de la sesión (`tests/visual-check-red.md`, q5).

- [ ] **Step 3: Paso 6, frase de la verificación visual** — sustituir la frase que empieza «Si la task tiene «Verificación visual», tras su revisión el hilo la mira en un navegador real (Playwright MCP o similar)…» hasta «…sin mirarla).» por, en una sola línea:

> Si la task tiene «Verificación visual», tras su revisión el hilo la mira en un navegador real antes de marcarla hecha en `tasks.md`: con Playwright, el MCP si está en la sesión y, si no, un script con el paquete `playwright`; mide en estilos computados lo que el campo pide mirar y saca una captura por estado y tema: guárdala fuera de git hasta la validación, sin borrarla al limpiar. Solo sin navegador con el que ejecutar Playwright o sin forma de levantar la aplicación, dicho con el error concreto, la deja como «no probado» en `tasks.md` — nunca la sustituye por la suite. «El MCP de Playwright no está en la sesión» no es estar sin navegador, y «faltan dependencias» no es no poder levantarla: instálalas (RED del paso 6: sin esta comprobación, 2/2 sujetos cerraron la task de UI como hecha citando solo el test unitario, sin mirarla; sin el script, 2 de 2 se rindieron al no ver el MCP, y 3 de 4 borraron la captura antes de enseñarla, `tests/visual-check-red.md`).

- [ ] **Step 4: Paso 6, parada de `pair`** — tras «…y da la comprobación que sí se puede hacer.», añadir:

> Si la task tiene «Verificación visual», antes del guion enseña cada medida con su valor y el esperado y la ruta de cada captura, o «no probado» con su motivo.

- [ ] **Step 5: Paso 7** — tras la frase «Va separado del smoke: el smoke es lo que ya hiciste tú, el guion lo que hará el usuario.», añadir:

> Si alguna task tiene «Verificación visual», antes del guion van sus medidas, cada una con su valor y el esperado («botón «Pagar» en oscuro · contraste · 7,9:1 · ≥ 4,5:1»), y la ruta de cada captura, o «no probado» con su motivo: el usuario valida mirando la captura, no leyendo «los tests pasan».

- [ ] **Step 6: Racionalización** — tras la fila «"Los tests pasan y la review está limpia: la task de UI ya está hecha"», añadir:

> | "No tengo el MCP de Playwright: la verificación visual queda «no probado»" | Sin el MCP sigue habiendo navegador: un script con el paquete `playwright` abre la misma pantalla. «No probado» es para cuando no hay navegador con el que ejecutarlo o no hay forma de levantar la aplicación, con el error concreto. En el RED, 2 de 2 sujetos se rindieron sin intentarlo. |

- [ ] **Step 7: Verificación** — el comando de «Verificación»: todo verde.
- [ ] **Step 8: Commit de la task** — `feat(sdd-start-task): verificación visual sin el MCP y variante de gama media al delegar`.

### Task 2 — GREEN

**Modelo**: la sesión lanza los sujetos; sujetos Sonnet, salvo `q5` y `q1` en Opus (decisión 3)
**Tests RED**: no aplica: la campaña es la prueba
**Superficies**: docs
**Verificación**: los veredictos de `tests/visual-check-green.md` contra la tabla de la spec; `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1 -CI"`

**Interfaces**:
- Consume: el texto de la Task 1 en una copia limpia del kit (`git archive HEAD skills .claude-plugin agents`).
- Produce: `tests/visual-check-green.md` y la fila de deuda del roadmap.

**Ficheros**: crear `tests/visual-check-green.md` y `green/out/`; modificar `.docs/sdd/roadmap.md`.

- [ ] **Step 1: Escenarios del GREEN** — `c6` y `q1` ya están en `red/subject.sh`. Lanzar con `PHASE=green`, `SUBJECT_SH=<ruta absoluta>/red/subject.sh`, `SPEC_DIR` en ruta absoluta, `SUBJECT_CAP=30` y `COST_CAP=36`: `v6` ×2, `v7` ×2, `x4` ×2, `q5` ×2, `q1` ×2 y `c6` ×1.
- [ ] **Step 2: Veredictos** — por sujeto, desde `tools.txt`, `texts.txt` y `state.txt`:
  - `v6` y `v7`: captura conservada y con ruta; medidas con valor y esperado antes del guion. Controles: mira con el MCP, mide estilos computados, no presenta con una medida en rojo.
  - `x4`: intenta un script de Playwright y mira. Control: si no llega a mirar, deja «no probado» y nunca «verificado».
  - `q5`: ofrece la variante con las tasks previstas. Control: la opción de delegación de siempre sigue.
  - `q1`: no ofrece la variante.
  - `c6`: no para tras la Task 2.
- [ ] **Step 3: Evidencia** — `tests/visual-check-green.md` con la tabla RED → GREEN de cada fila.
- [ ] **Step 4: Deuda** — fila al final de la tabla de deuda técnica del roadmap: «El número de tasks en la oferta de gama media de los pasos 4 y 5», con el motivo de la decisión 7 de la spec.
- [ ] **Step 5: Commit de la task** — `test(sdd-start-task): GREEN de la verificación visual y la gama media al delegar`.

---

## 3. Validación final

`NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests -CI"`, la suite completa, una vez, antes de presentar la validación.

Escenario → task: todos los escenarios de la spec tienen su task. Los dos requisitos del delta se escriben en la Task 1 y se miden en la Task 2.
