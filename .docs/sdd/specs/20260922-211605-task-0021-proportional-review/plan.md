---
id: 20260922-211605-task-0021-proportional-review
task: 0021
title: Plan de implementación — Revisión por task abaratada
spec: ./spec.md
status: approved
created: 2026-09-22
---

# Plan de implementación — Revisión por task abaratada

## Decisiones que he tomado yo — valida estas

1. **Tasks 1 y 2 en línea, en el hilo principal (Opus 5.5, el de la sesión)** — son ediciones de texto de una skill que se iteran contra el GREEN que lanza el hilo; mismo motivo que la 0005 y la 0025. Despachar un implementador para 20 líneas de prosa cuesta más que escribirlas.
2. **Task 3 (GREEN) con sujetos Sonnet headless**, los mismos tres escenarios del RED (R1, R2, R3) con dos sujetos cada uno; lectura de veredictos en el hilo. Techo 6 $ (el RED costó 2,44 $), con un 20 % de reserva para lo que destape la revisión final.
3. **Revisor final: un subagente Sonnet** sobre el diff de la rama sin las carpetas `red/` y `green/`. Superpowers pide el modelo más capaz para la revisión final; el diff es de prosa y anclas Pester, y la política del kit fija la gama media como suelo. El effort no se puede declarar (el tool `Agent` no lo admite: task 0031).
4. **Un solo fichero de anclas nuevo**, `tests/ProportionalReview.Tests.ps1`, y el ajuste de la prueba de lite de `tests/DispatchBrief.Tests.ps1`, que hoy exige que la política de modelos viaje en lite.
5. **Coste estimado**: ~2 h de implementación y GREEN; ~3–4 $ de sujetos.

**Goal**: que el revisor de task y el final dejen de convertir reglas de proceso y umbrales rozados en Important, que el final no corra la suite, y que la spec se repase antes del gate.

**Architecture**: dos ficheros de contrato (`plan-template.md`, `encargo-revision.md`) y dos pasos del `SKILL.md` de `sdd-start-task` (4 y 6), más una línea del Art. X. Lo que superpowers ya hace se cita, no se copia.

**Tech Stack**: Markdown de skills; Pester 5 para las anclas; sujetos `claude -p` headless para el GREEN.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes. El revisor marca el incumplimiento como Important, no como estilo. *(Art. X, literal a fecha de hoy; la Task 1 le añade la tolerancia de una unidad.)*
- Texto humano de skills, docs y tests en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case (Art. III).
- Ninguna edición de skill sin ciclo RED → GREEN documentado en `tests/` (Art. I): el RED es `tests/proportional-review-red.md`; el GREEN va en `tests/proportional-review-green.md`.
- Guidance que duplica la de superpowers está prohibida: se cita (Art. IX).
- `Invoke-Pester ./tests` en verde (lo ejecuta el pre-commit).

### De proceso

- Política de modelos (Art. IV): modelo y effort explícitos al despachar; gama media como suelo para revisores e implementadores que trabajan desde prosa; `fable` y `opus xhigh` prohibidos por defecto.
- Modo de ejecución: `subagent-driven-development` por defecto; aquí las Tasks 1 y 2 van en línea (decisión 1).
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI), con el trailer de atribución de la sesión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cuatro ediciones de texto y un fichero de anclas; nada de scripts.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Constitution check**: cambia el Art. X (decisión 4 de la spec, aprobada por el dev-lead el 2026-09-22).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/ProportionalReview.Tests.ps1` — anclas de los cuatro cambios.
- `tests/proportional-review-green.md` — evidencia GREEN.
- `.docs/sdd/specs/20260922-211605-task-0021-proportional-review/green/` — lanzadores y salida de los sujetos.

**Modificar**:

- `skills/sdd-templates/templates/plan-template.md` — Restricciones globales en dos bloques.
- `skills/sdd-start-task/references/encargo-revision.md` — cabecera con «De código», severidad con tolerancia, contrato de los tests RED, sección del revisor final.
- `skills/sdd-start-task/SKILL.md` — paso 4 (repaso de coherencia) y paso 6 (qué bloque viaja).
- `.docs/sdd/constitution.md` — última línea del Art. X.
- `tests/DispatchBrief.Tests.ps1` — la prueba de lite.

**NO se tocan**:

- `skills/sdd-start-task/references/review-spec.md` — el repaso va en el `SKILL.md` (decisión 7 de la spec); lo que queda de `review-spec` es de la 0032.
- `.docs/sdd/capabilities/task-flow.md` — la fusión del delta la hace el cierre.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La tolerancia se lee como licencia para cualquier umbral rozado | media | medio | La regla nombra la unidad y el ejemplo de 22 como Important; R1 lo mide |
| El revisor final sigue corriendo la suite porque `code-reviewer.md` pregunta «All tests passing?» | media | bajo | La regla va en la cabecera, antes de la plantilla, y nombra esa pregunta |
| El repaso de coherencia alarga el paso 4 sin encontrar nada | baja | bajo | Es una lectura del propio agente, sin subagente |

### 1.9 Excepciones a la constitution

Ninguna. El Art. X cambia por decisión aprobada.

---

## 2. Tasks

### Task 1 — Encargo de revisión y plantilla del plan

**Modelo**: hilo principal (Opus 5.5, el de la sesión), en línea.
**Ejecución**: en línea — decisión 1.
**Tests RED**: hilo · `tests/ProportionalReview.Tests.ps1` (bloques «plantilla», «encargo», «constitution») y la prueba de lite de `tests/DispatchBrief.Tests.ps1`, commiteados en rojo antes de editar las skills.

**Interfaces**:
- Consume: nada.
- Produce: los títulos `### De código` y `### De proceso` bajo `## Restricciones globales` de `plan-template.md`; la cabecera `## Restricciones de código` de `encargo-revision.md`; el literal «una unidad» con la severidad Minor en `encargo-revision.md` y en el Art. X.

**Ficheros**: `plan-template.md`, `encargo-revision.md`, `SKILL.md` (paso 6), `constitution.md`, `tests/ProportionalReview.Tests.ps1`, `tests/DispatchBrief.Tests.ps1`.

- [ ] **Step 1: Tests RED** — `tests/ProportionalReview.Tests.ps1`:

```powershell
BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Restricciones globales en dos bloques' {
  It 'la plantilla del plan separa código y proceso' {
    $template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $template | Should -Match '## Restricciones globales\s*\r?\n[\s\S]*### De código[\s\S]*### De proceso'
    $template | Should -Match 'De proceso[^\n]*no viaja[^\n]*revisor'
  }

  It 'el paso 6 despacha solo el bloque de código' {
    Get-KitFile 'skills/sdd-start-task/SKILL.md' | Should -Match 'bloque «De código»'
  }
}

Describe 'Encargo de revisión' {
  BeforeAll { $script:Brief = Get-KitFile 'skills/sdd-start-task/references/encargo-revision.md' }

  It 'no convierte en Important todo incumplimiento' {
    $script:Brief | Should -Not -Match 'Todo hallazgo que las incumpla es \*\*Important\*\*'
  }

  It 'da tolerancia de una unidad a los umbrales numéricos' {
    $script:Brief | Should -Match 'una unidad[^\n]*Minor'
  }

  It 'define qué es modificar un test RED' {
    $script:Brief | Should -Match 'aserción[^\n]*nombre[^\n]*dato[^\n]*linter'
  }

  It 'dice al revisor final que lea el paquete y no ejecute la suite' {
    $script:Brief | Should -Match 'revisor final[\s\S]*paquete[\s\S]*no ejecutes la suite'
  }
}

Describe 'Constitution' {
  It 'el Art. X declara la tolerancia' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Match 'Art\. X[\s\S]*una unidad[^\n]*Minor'
  }
}
```

Y en `tests/DispatchBrief.Tests.ps1`, la prueba «dice de dónde sale el bloque de restricciones en modo lite» pasa a:

```powershell
  It 'dice de dónde sale el bloque de restricciones en modo lite' {
    foreach ($path in 'skills/sdd-start-task/references/encargo-revision.md', 'skills/sdd-start-task/SKILL.md') {
      $text = Get-KitFile $path
      $text | Should -Match 'modo lite[^\n]*artículo de calidad de código'
      $text | Should -Not -Match 'modo lite[^\n]*artículo de calidad de código y la política de modelos'
    }
  }
```

- [ ] **Step 2: Ver el rojo** — `Invoke-Pester ./tests/ProportionalReview.Tests.ps1, ./tests/DispatchBrief.Tests.ps1`. Esperado: fallan las pruebas nuevas o cambiadas, cada una por su aserción. El pre-commit exige la suite en verde, así que los tests RED no se commitean solos (nunca `--no-verify`): van en el commit de esta task, y la salida roja se copia en `tasks.md` como evidencia (task en línea; regla de la fila 0007).
- [ ] **Step 3: `plan-template.md`** — la sección `## Restricciones globales` pasa a dos subsecciones con su ayuda:
  - `### De código`: restricciones de la spec (valores, naming, versiones), el artículo de calidad de la constitution literal y los comandos que el cambio deja en verde. «Viaja al implementador y a cada revisor.»
  - `### De proceso`: política de modelos, modo de ejecución, atribución de commits. «Es para quien despacha: no viaja al encargo de ningún revisor.»
  La línea de ayuda actual que manda copiar la política de modelos «aquí» se reparte entre las dos.
- [ ] **Step 4: `encargo-revision.md`** —
  - Cabecera: `## Restricciones de código` con «copia literal del bloque «De código» de plan.md; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal».
  - Sustituir «Todo hallazgo que las incumpla es **Important**…» por la calibración: incumplir una restricción de código es Important, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20, 4 parámetros con un límite de 3), que es Minor; 22 líneas es Important.
  - Contrato de tests RED, en el encargo del implementador y como línea de la cabecera de revisión: modificar un test RED es cambiar una aserción, un nombre de test o un dato; el formato que exige el linter o el formateador del proyecto no lo es.
  - Sección nueva «Revisor final»: tras la cabecera y antes de `code-reviewer.md`, «Lee el paquete de review `<ruta>`: no rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en el informe.» Con el porqué: la plantilla del revisor de task de superpowers ya lo dice; la del final pregunta «All tests passing?» sin decir cómo (RED R2, 2/2).
  - El «Por qué así» explica el reparto: `task-reviewer-prompt.md` de superpowers reserva ese hueco a lo que exige la spec, «not process rules» (RED R1).
- [ ] **Step 5: `SKILL.md` paso 6** — «incluye el bloque «De código» de las Restricciones globales del plan íntegro en el encargo de cada subagente que despaches…»; la frase de lite pasa a «En modo lite, sin plan, el bloque es el artículo de calidad de código de la constitution, literal; la política de modelos la aplica quien despacha». La red flag «sin la sección `## Restricciones globales`» pasa a `## Restricciones de código`.
- [ ] **Step 6: Art. X** — la última línea pasa a: «El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.»
- [ ] **Step 7: Verde** — `Invoke-Pester ./tests`. Esperado: `Failed: 0`.
- [ ] **Step 8: Commit** — `feat(skills): restricciones de código y de proceso, y tolerancia de los umbrales`.

### Task 2 — Repaso de coherencia antes del gate

**Modelo**: hilo principal (Opus 5.5), en línea.
**Ejecución**: en línea — decisión 1.
**Tests RED**: hilo · bloque «Paso 4» de `tests/ProportionalReview.Tests.ps1`.

**Interfaces**:
- Consume: nada.
- Produce: la frase del paso 4 que nombra «Spec Self-Review».

**Ficheros**: `skills/sdd-start-task/SKILL.md` (paso 4), `tests/ProportionalReview.Tests.ps1`.

- [ ] **Step 1: Test RED** — añadir:

```powershell
Describe 'Paso 4' {
  It 'repasa la coherencia de la spec antes del gate' {
    $skill = Get-KitFile 'skills/sdd-start-task/SKILL.md'
    $skill | Should -Match 'Spec Self-Review'
    $skill | Should -Match 'literal[^\n]*más de un sitio'
  }
}
```

- [ ] **Step 2: Ver el rojo** — `Invoke-Pester ./tests/ProportionalReview.Tests.ps1`. Esperado: falla «repasa la coherencia…».
- [ ] **Step 3: `SKILL.md` paso 4** — tras la línea de la rúbrica de review y antes del GATE: «**Repaso de coherencia**, siempre, antes del gate y antes de despachar la review si la hay: aplica a `spec.md` el «Spec Self-Review» de `superpowers:brainstorming` (placeholders, contradicciones, alcance, ambigüedad), contrastando cada literal que aparece en más de un sitio —una expresión, un fichero, un umbral— con las decisiones y los escenarios que lo usan. Lo que corrijas lo dices en «Decisiones que he tomado yo».» Con una fila en la tabla de racionalizaciones: «La rúbrica dice ninguna review: la spec ya está lista» → «Ninguna review es ningún revisor, no ninguna lectura. Medido en la 0018 y en el RED de la 0021: una spec con un literal que contradice su decisión llegó al gate 1 de 2 veces.»
- [ ] **Step 4: Verde** — `Invoke-Pester ./tests`. Esperado: `Failed: 0`.
- [ ] **Step 5: Commit** — `feat(skills): repaso de coherencia de la spec antes del gate`.

### Task 3 — GREEN

**Modelo**: sujetos `sonnet` headless; lectura en el hilo.
**Ejecución**: en línea — leer la conducta de cada sujeto es juicio.
**Tests RED**: no aplica (los escenarios del RED son el contrato).

**Interfaces**:
- Consume: el molde y los lanzadores de `red/`; `encargo-revision.md` y `plan-template.md` de la Task 1; el paso 4 de la Task 2.
- Produce: `tests/proportional-review-green.md`.

**Ficheros**: `green/` en la carpeta de la spec, `tests/proportional-review-green.md`.

- [ ] **Step 1: Molde GREEN** — copiar `red/` a `green/`; en `m1`, el plan del molde pasa a los dos bloques; `prompt-r1.tmpl` y `prompt-r2.tmpl` se recomponen desde la cabecera nueva de `encargo-revision.md` (con el bloque «De código» del plan del molde y, en R2, la sección «Revisor final»). R3 usa una copia limpia del kit del working tree.
- [ ] **Step 2: Comprobación previa** — la de `tech-stack.md`: R3 carga la skill, la petición tiene una lectura, la copia del kit tiene los cambios.
- [ ] **Step 3: Lanzar** — `RUNS_DIR=<scratchpad>/runs-green bash green/run.sh <kit>`: seis sujetos.
- [ ] **Step 4: Veredictos** — esperado, contra la spec:
  - R1: «Approved» 2/2; la función de 21 líneas Minor o ausente; la línea en blanco del test no es Critical ni Important; sin ⚠️ de proceso; 0 ejecuciones de la suite (control del recorte).
  - R2: 0 ejecuciones de `npm test`, `npm run lint` o build; lee `review-final.diff`; la función de 21 líneas no es Important.
  - R3: 2/2 corrigen o señalan la contradicción de `^R-\d{4}$` antes de pedir la aprobación, y la pregunta del gate llega.
  Si un escenario falla, se corrige el texto y se repite ese escenario con dos sujetos nuevos.
- [ ] **Step 5: Evidencia** — `tests/proportional-review-green.md` con la tabla RED → GREEN, coste y método; rutas locales fuera de `green/out/`.
- [ ] **Step 6: Commit** — `test(sdd): GREEN de la task 0021`.

## Estimación y esfuerzo *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: docs
- Esfuerzo spec + plan: 2h (incluye el RED previo)
- Estimación de implementación: 2h
- Base de la estimación: 2 tasks de texto + GREEN de 6 sujetos; referencia 0005 (M, en línea, GREEN iterado) y 0025
- Confianza: media — un GREEN que falla añade una ronda

---

## 3. Validación final

- [ ] `Invoke-Pester ./tests` verde
- [ ] GREEN: los cuatro frentes de la spec en verde
- [ ] Revisión final (decisión 3) limpia
- [ ] Cierre con `sdd-end-task`, tras la validación del dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «El artículo de calidad de código viaja a implementadores y revisores» → Task 1 (Steps 3–5), GREEN R1 (sin ⚠️ de proceso). ✓
- ADDED «Un umbral superado en una unidad es Minor» → Task 1 (Steps 4, 6), GREEN R1 y R2. ✓
- ADDED «El formato que exige el linter no rompe el contrato de los tests RED» → Task 1 (Step 4), GREEN R1. ✓
- ADDED «El revisor final revisa el paquete sin ejecutar la suite» → Task 1 (Step 4), GREEN R2. ✓
- ADDED «La spec se repasa antes del gate» → Task 2, GREEN R3. ✓
- Decisión 2 (sin guidance para riesgo, agrupar, Minor fuera del bucle) → N/A; control de no regresión: R1 sin ejecución de suite. ✓
- Frentes a deuda (trailer, suite del revisor de task, rulings) → fila de deuda en el cierre. ✓

Perfil `delegate`: sin gate de plan. Cada escenario de la spec tiene su task (arriba); comprobado el 2026-09-22.
