---
id: 20260924-204639-task-0060-testable-tasks
task: 0060
title: Plan de implementación — Tasks que se prueban, escenarios con datos y guion de pruebas
spec: ./spec.md
status: approved
created: 2026-09-24
---

# Plan de implementación — Tasks que se prueban, escenarios con datos y guion de pruebas

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: son tres tasks de texto, secuenciales y cortas, y el hilo ya tiene todo el contexto. El revisor final va con Opus y effort high (Art. IV).
2. **El RED de cada task es un test de contrato de texto** en `tests/TestableTasks.Tests.ps1`, escrito por el hilo antes del texto y con una copia fuera del repo. Los bloques de la Task 2 se añaden al fichero justo antes de empezarla, porque el pre-commit corre la suite rápida.
3. **Los ejemplos de la guía van en dominios distintos de los moldes** del GREEN (salas): facturas para la línea del plan y el guion, y la bolsa de países del dev-lead para los datos de la spec (aprendizaje de la task 0011).
4. **El GREEN es la Task 3**. Corre sobre una copia del kit sacada con `git archive` del commit de la Task 2, dentro de la previsión aprobada: 8 sujetos y 5,77 $ restantes.
5. **Coste**: ~1,5 h de hilo y ~2 $ de sujetos; el revisor final, ~100k tokens.

**Goal**: que el plan parta en tasks probables en la aplicación, que la spec lleve escenarios con datos y reglas completas, y que la validación y la parada de `pair` traigan un guion de pruebas.

**Architecture**: cambios de texto en dos plantillas de `sdd-templates` y en los pasos 6 y 7 de `sdd-start-task`, fijados por un test Pester de literales. Evidencia RED/GREEN con sujetos headless sobre el molde `salas` de `red/`.

**Tech Stack**: Markdown y Pester 5 (`tests/*.Tests.ps1`); sujetos `claude -p --model sonnet` con `red/run.sh`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son tres tasks cortas de texto y en serie. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de skill y de fichero en inglés kebab-case (Art. III).
- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible (Art. X).
- Sin comentarios que citen documentos: ni la constitution, ni una spec, ni una task, ni un requisito, ni `capabilities/` (Art. X).
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell (Art. X).
- Un test que ejecute git dot-sourcea `tests/Clear-GitEnv.ps1`; este test no ejecuta git.
- Ningún `.md` de `skills/` lleva caracteres de control: escribir con la herramienta de edición, no con here-strings de comillas dobles.
- No se tocan `skills/sdd-start-task/references/control-profiles.md`, `skills/sdd-init-*` ni `skills/sdd-init-brownfield/references/migrations/`: los toca la 0061.

### De proceso

- Native: el hilo principal (Opus 5.5) ejecuta las tasks; el revisor final, `subagent_type: sdd-kit:effort-high` + `model: opus`.
- Sujetos Sonnet headless con `red/run.sh`: `COST_CAP=8`, `SUBJECT_CAP=13`; la parada se pide con `touch red/stop`.
- Commits bilingües (tipo/scope en inglés, cuerpo en castellano) con la línea `Co-Authored-By` de la sesión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una línea nueva por task en el plan y frases en la ayuda; ningún fichero nuevo salvo el test y la evidencia.
- [x] **YAGNI gate**: no se abstrae nada.
- [x] **Constitution check**: Art. I (RED antes, GREEN después, previsión común), Art. III, Art. VIII (plantillas solo en `sdd-templates`), Art. IX (se añade solo lo que `writing-plans` no dice), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/TestableTasks.Tests.ps1` — contrato de literales de las cuatro piezas.
- `tests/testable-tasks-red.md`, `tests/testable-tasks-green.md` — evidencia.
- `.docs/sdd/specs/20260924-204639-task-0060-testable-tasks/green/out/` — salidas del GREEN.

**Modificar**:

- `skills/sdd-templates/templates/spec-template.md` — ayuda del delta (datos en los escenarios) y línea de «Reglas de la capacidad» (valor completo).
- `skills/sdd-templates/templates/plan-template.md` — ayuda de §2 (tasks verticales) y línea `**Se prueba en la aplicación**` en la task tipo.
- `skills/sdd-start-task/SKILL.md` — paso 6 (parada de `pair` con guion) y paso 7 (guion de pruebas).

**NO se tocan**:

- `skills/sdd-start-task/references/control-profiles.md`, las init y `migrations/` — son de la 0061.
- `skills/sdd-end-task/references/aprendizajes-skills.md` — la fusión ya sustituye la entrada entera.
- `.docs/sdd/capabilities/` — la fusión del delta la hace `sdd-end-task`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La parada de `pair` en el paso 6 hace parar también en `delegate` | media | medio | control c6 en el GREEN |
| Un test existente fija «cómo probarlo» | baja | bajo | suite rápida en la Verificación de la Task 2 |

### 1.8 Rollout

Directo; sale en la 2.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Plantillas: tasks verticales, escenarios con datos y reglas completas

**Modelo**: Native, hilo principal (Opus 5.5, effort de la sesión)
**Tests RED**: hilo principal · `tests/TestableTasks.Tests.ps1`, `Describe 'Plantillas'`, con copia en el scratchpad (`red-copy/task1.ps1`)
**Superficies**: docs (plantillas)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/TestableTasks.Tests.ps1, tests/CapabilityRules.Tests.ps1, tests/TaskVerification.Tests.ps1, tests/DispatchBrief.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: nada.
- Produce: el literal `**Se prueba en la aplicación**` de `plan-template.md`, que cita el paso 6 de la Task 2.

**Ficheros**: crear `tests/TestableTasks.Tests.ps1`; modificar `skills/sdd-templates/templates/spec-template.md` y `skills/sdd-templates/templates/plan-template.md`.

- [ ] **Step 1: RED** — `tests/TestableTasks.Tests.ps1` con `Describe 'Plantillas'`:

```powershell
BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw -Encoding utf8
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    foreach ($literal in $Literals) { $Text | Should -BeLikeExactly "*$literal*" }
  }
}

Describe 'Plantillas' {
  It 'el plan orienta a tasks que se prueban en la aplicación' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-templates/templates/plan-template.md'), '(?s)## 2\. Tasks.*?### Task 1').Value
    Assert-Literal $section @('Tasks verticales', 'orientación, no regla', 'no una capa', 'Sin tamaño fijo en horas')
  }

  It 'cada task del plan dice si se prueba en la aplicación o por qué no' {
    $task = [regex]::Match((Get-KitFile 'skills/sdd-templates/templates/plan-template.md'), '(?s)### Task 1 —.*?- \[ \] \*\*Step 1').Value
    Assert-Literal $task @('**Se prueba en la aplicación**', 'no, porque <base común | migración | refactor>')
  }

  It 'los escenarios de una regla de negocio llevan datos' {
    $delta = [regex]::Match((Get-KitFile 'skills/sdd-templates/templates/spec-template.md'), '(?s)## Delta de comportamiento.*?### Capacidad').Value
    Assert-Literal $delta @('datos concretos', 'bolsa FR, IT, PT', 'no cubre')
  }

  It 'una regla que cambia se escribe con su valor completo' {
    $rules = (Get-KitFile 'skills/sdd-templates/templates/spec-template.md') -split "`r?`n" | Where-Object { $_.StartsWith('**Reglas de la capacidad**') }
    Assert-Literal $rules @('valor completo', 'sustituye entera', 'A, B y C')
  }
}
```

Copia en el scratchpad y ejecución: esperado 4 fallos.

- [ ] **Step 2: Implementación — `plan-template.md`**. Al final del bloque de ayuda de `## 2. Tasks`, un párrafo nuevo:

```markdown
>
> **Tasks verticales** (orientación, no regla): en un plan que cambia una aplicación, cada task acaba en algo que el usuario puede probar en ella: una rebanada que atraviesa las capas que necesita (migración, API, pantalla), no una capa. «BD y API» seguida de «pantalla» deja la primera task sin nada que probar ni que enseñar en la parada tras la task. Si una task no puede (base común, migración de datos, refactor), su línea «Se prueba en la aplicación» dice por qué. Sin tamaño fijo en horas.
```

Tras la línea `**Verificación lenta**` de la task tipo:

```markdown
**Se prueba en la aplicación**: <omitir si el plan no cambia ninguna aplicación · qué hace el usuario y qué ve al acabar la task, con los datos de la spec: «el gestor sube `marzo.pdf` y lo ve en el listado de facturas como Pendiente» · o «no, porque <base común | migración | refactor>: <motivo>»>
```

- [ ] **Step 3: Implementación — `spec-template.md`**. Al bloque de ayuda de `## Delta de comportamiento`, tras la frase del slug:

```markdown
> Un escenario de una regla de negocio lleva datos concretos de entrada y de salida, no una frase abstracta: «GIVEN bolsa FR, IT, PT · WHEN oferta en DE · THEN no cubre», no «una oferta fuera de la bolsa no cubre». La regla mal entendida se ve en la spec, no al validar.
```

En la línea `**Reglas de la capacidad**`, `solo las entradas que cambian;` pasa a:

```text
solo las entradas que cambian, cada una con su valor completo —el vigente más el cambio—: al fusionar sustituye entera a la vigente, y lo que no esté aquí desaparece (con **Avisos**: A y B vigentes y una task que añade C, se escribe A, B y C, no «además de los vigentes, C»);
```

- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: todo verde; el RED, comparado con su copia con `git diff --no-index`, sin cambios.
- [ ] **Step 5: Commit de la task** — `feat(sdd-templates): tasks que se prueban, escenarios con datos y reglas completas`.

### Task 2 — `sdd-start-task`: guion de pruebas en la validación y en la parada de `pair`

**Modelo**: Native, hilo principal (Opus 5.5, effort de la sesión)
**Tests RED**: hilo principal · `tests/TestableTasks.Tests.ps1`, `Describe 'sdd-start-task'`, añadido antes de empezar la task, con copia en el scratchpad (`red-copy/task2.ps1`)
**Superficies**: docs (skill)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow"`

**Interfaces**:
- Consume: el literal `**Se prueba en la aplicación**` de `plan-template.md` (Task 1).
- Produce: nada.

**Ficheros**: modificar `skills/sdd-start-task/SKILL.md` y `tests/TestableTasks.Tests.ps1`.

- [ ] **Step 1: RED** — añadir al test:

```powershell
Describe 'sdd-start-task' {
  BeforeAll {
    function Get-SkillStep([int]$Step) {
      $text = Get-KitFile 'skills/sdd-start-task/SKILL.md'
      return [regex]::Match($text, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
    }
  }

  It 'la validación trae un guion de pruebas en pasos numerados' {
    Assert-Literal (Get-SkillStep 7) @('**guion de pruebas**', 'pasos numerados', 'resultado esperado', 'separado del smoke')
    (Get-SkillStep 7) | Should -Not -BeLikeExactly '*cómo probarlo*'
  }

  It 'en pair, cada task cerrada para con su guion' {
    Assert-Literal (Get-SkillStep 6) @('**En `pair`, al cerrar cada task', 'guion de pruebas de esa task', 'Se prueba en la aplicación', 'En `delegate` y `unattended` no paras aquí')
  }
}
```

Copia y ejecución: esperado 2 fallos.

- [ ] **Step 2: Implementación — paso 7**. `qué hay, cómo probarlo y el smoke que has ejecutado,` pasa a `qué hay, el **guion de pruebas** y el smoke que has ejecutado,`, y tras esa frase se añade:

```markdown
El guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec («1. `facturas subir marzo.pdf` → el listado muestra `marzo.pdf · Pendiente`»); lo que no se puede probar en la aplicación lo dice su paso, con la comprobación que sí se puede hacer. Va separado del smoke: el smoke es lo que ya hiciste tú, el guion lo que hará el usuario. Sin forma fija, el sujeto del RED mezcló los comandos con su smoke y remitió a «los cuatro comandos de arriba» (`tests/testable-tasks-red.md`, v7).
```

- [ ] **Step 3: Implementación — paso 6**. Tras la frase que acaba en `([commit-milestones.md](references/commit-milestones.md)).`, la última del paso:

```markdown
**En `pair`, al cerrar cada task** —su commit hecho, con cualquier método—, para antes de la siguiente y presenta el guion de pruebas de esa task, con la forma del paso 7, sacado de su línea «Se prueba en la aplicación» del plan; si la línea dice «no, porque…», el guion lo dice y da la comprobación que sí se puede hacer. En `delegate` y `unattended` no paras aquí. Con la parada solo en la tabla de gates, 1 de 1 sujetos en `pair` pasó a la task siguiente sin parar ni dar guion (`tests/testable-tasks-red.md`, v6).
```

- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: todo verde; el RED, sin cambios frente a su copia.
- [ ] **Step 5: Commit de la task** — `feat(sdd-start-task): guion de pruebas en la validación y en la parada de pair`.

### Task 3 — GREEN y evidencia

**Modelo**: Native, hilo principal (Opus 5.5, effort de la sesión); sujetos Sonnet headless
**Tests RED**: no aplica: la task produce evidencia. El contrato son los escenarios de la spec, medidos con sujetos.
**Superficies**: docs (evidencia)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PathLength.Tests.ps1, tests/TestableTasks.Tests.ps1"` y `Select-String -SimpleMatch <usuario de la máquina>` sobre la carpeta de la task, que da 0 resultados

**Interfaces**:
- Consume: el kit de los commits de las Tasks 1 y 2.
- Produce: `tests/testable-tasks-red.md`, `tests/testable-tasks-green.md`, `green/out/`.

**Ficheros**: crear `tests/testable-tasks-red.md`, `tests/testable-tasks-green.md` y `green/out/*`.

- [ ] **Step 1: Copia del kit** — `git archive HEAD skills .claude-plugin` a `<scratchpad>/kit-green`; comprobar que lleva `Se prueba en la aplicación` y el paso 6 nuevo.
- [ ] **Step 2: GREEN** — `KIT_DIR=<kit-green> OUT_NAME=green SCENARIOS="p3 p2 v7 v6 c6" red/run.sh`, en segundo plano y en serie. Veredictos esperados:
  - p3: tasks verticales o con «no, porque».
  - p2: todos los escenarios de la regla con datos, y **Avisos** completos.
  - v7: guion numerado con resultado esperado, separado del smoke.
  - v6: para tras la Task 1 con su guion.
  - c6: no para tras la Task 1.
- [ ] **Step 3: Si un escenario falla** — una tanda de REFACTOR dentro de la reserva (3 sujetos), con la forma que diga el fallo; si la supera, parar y decide el dev-lead.
- [ ] **Step 4: Evidencia** — `tests/testable-tasks-red.md` (RED previo, con citas literales y fuente de cada conducta) y `tests/testable-tasks-green.md` (veredicto por escenario, coste total contra la previsión).
- [ ] **Step 5: Verificación y commit** — `test(testable-tasks): GREEN y evidencia de la task 0060`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h (con el RED previo)
- Estimación de implementación: 1,5 h
- Base de la estimación: 3 tasks de texto; campaña de 5 sujetos en serie, estimada como redacción de evidencia (≈ 10 min por fichero) y no como espera; referencia: 0053 y 0059, del mismo tamaño.
- Confianza: media (un REFACTOR añadiría ~0,5 h)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (suite completa, `Slow` incluidos)
- [ ] Criterios de éxito: los veredictos GREEN de la Task 3
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama con `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Cada task de producto acaba en algo que se prueba en la aplicación» → Task 1 (texto), Task 3 (p3). ✓
- ADDED «En `pair`, cada task cerrada para con su guion de pruebas» → Task 2 (texto), Task 3 (v6, c6). ✓
- MODIFIED «El trabajo se valida con el usuario antes de cerrar» → Task 2 (texto), Task 3 (v7). ✓
- MODIFIED «El delta declara el comportamiento por capacidad» → Task 1 (texto), Task 3 (p2). ✓
- Fusión en `capabilities/` → `sdd-end-task`. N/A aquí. ✓
