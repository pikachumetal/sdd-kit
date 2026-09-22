---
id: 20260922-211157-task-0019-init-files
task: 0019
title: Plan de implementación — Lo que crean las init: ficheros y configuración
spec: ./spec.md
status: draft
created: 2026-09-22
---

# Plan de implementación — Lo que crean las init: ficheros y configuración

> Compatible con `superpowers:writing-plans`. Ejecución: `superpowers:subagent-driven-development` por defecto; aquí las tasks 1–5 declaran `en línea` con motivo.

## Decisiones que he tomado yo — valida estas

1. **Tasks 1–4 en línea, en el hilo (Opus de la sesión).** Motivo: cada task edita de 2 a 5 ficheros de texto con redacción ya fijada en la spec, unas 120 líneas en total. Un implementador Sonnet tendría que releer la misma media docena de ficheros por task, y cuatro revisiones por task suman unos 400k tokens para ese volumen. Los tests salen de los THEN de la spec antes de tocar cada skill (TDD del hilo).
2. **Task 5, la campaña GREEN, la ejecuta el hilo**: los subagentes no pueden lanzar sujetos headless que despachan (`tech-stack.md`, T3).
3. **Una sola revisión final de rama**: subagente `general-purpose`, **Sonnet, effort medium** (el effort va en el encargo porque el tool `Agent` no lo admite), con la cabecera de `encargo-revision.md`. Cubre todos los commits del hilo. Unos 100k tokens.
4. **El corpus de una init para el test de paridad excluye `references/migrations/`.** La spec dice «sus `references/`», pero las migraciones viven dentro de las `references/` de brownfield. Incluirlas haría que toda clave declarada «apareciera» en brownfield por estar en la propia migración, y el test no probaría nada. Esto aclara la spec, no la cambia: el test comprueba la init, no la migración.
5. **La línea `**Escribe**:` se lee como «todo token entre backticks de la línea»**, ficheros incluidos, y cada token debe aparecer literal en el corpus de cada init. Así el test también vigila que la init nombre `.claude/settings.json` y `.gitignore`, sin un segundo formato que parsear.
6. **La GREEN usa siete escenarios de un turno, 2 sujetos cada uno (14 sujetos)**, uno por camino condicional del texto nuevo (`tech-stack.md`, task 0029). Para medir el volcado de memoria de forma determinista, el molde redefine `autoMemoryDirectory` a una carpeta dentro del proyecto, sin tocar la memoria real de la máquina. Coste estimado: ~15 $, dentro del techo aprobado de 25 $ (gastados 1,87 $).
7. **Riesgo alto**: `v1.2.0.md` lo tocó la 0020 y ahora lo toca esta task; ninguna otra task abierta lo declara. `sdd-init-*/SKILL.md` es fichero caliente de la 0033 y la 0034, que van después. Sin conflicto previsto.

**Goal**: que las dos init y la migración a v1.2.0 dejen `autoMemoryEnabled: false`, `.gitignore` con los temporales y el log generado por el script; que la constitution tenga «Proyecto de referencia»; que la plantilla del roadmap declare «Ficheros que toca»; y que un test vigile la paridad migración–init.

**Architecture**: edición de texto de skills y plantillas, con tests Pester estructurales por THEN y una campaña GREEN headless para la conducta. Un test nuevo, `tests/MigrationInitParity.Tests.ps1`, lee la línea `**Escribe**:` de cada migración y busca cada token en el corpus de cada init.

**Tech Stack**: Markdown de skills; PowerShell 7 + Pester 5 (`tests/*.Tests.ps1`, hook `pre-commit`); sujetos headless `claude -p` con lanzador Python.

**Spec**: `./spec.md`

## Restricciones globales

- Art. I: ninguna skill nueva ni edición de una existente sin ciclo RED→GREEN documentado en `tests/`. El RED de esta task está en `red/README.md` de la carpeta de la spec; la evidencia se resume en `tests/init-files-red.md` y `tests/init-files-green.md`.
- Art. III: texto humano en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case.
- Art. V: toda pregunta o dato que añade una migración va también en las init, desde una sola fuente.
- Art. VI: commits con tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.
- Art. VIII: las plantillas viven solo en `skills/sdd-templates/templates/`; la init calca, nunca copia.
- Cabecera literal de la tabla de release: `| id | Task | Origen | Ficheros que toca | Estado |`.
- Líneas de `.gitignore`: `.playwright-mcp/` y `.superpowers/`. Clave: `"autoMemoryEnabled": false` en `.claude/settings.json`.
- Carpeta de memoria: `~/.claude/projects/<project>/memory/`, o `autoMemoryDirectory`; cada entrada es un fichero indexado en `MEMORY.md`.
- Proyecto de referencia: pregunta 21 en greenfield, 7 en brownfield; «no» deja «no aplica».
- Orden de `v1.2.0.md`: ids → claves de control → configuración → memoria → marcador.
- **Política de modelos** (Art. IV): modelo y effort declarados siempre al despachar; gama media como suelo para revisores e implementadores que trabajan a partir de prosa; el tier más barato solo para transcribir código ya escrito o arreglos mecánicos de un fichero; `fable` y `opus xhigh` prohibidos por defecto.
- **Modo de ejecución por defecto**: `subagent-driven-development`; en línea solo si la task lo declara con motivo.
- **Art. X — Calidad de código** (literal):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough (T14, 2026-09-09; 110 comentarios con cita en los dos retos del equipo).
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un solo test nuevo; el resto son líneas de texto en ficheros existentes.
- [x] **YAGNI gate**: sin validador genérico de migraciones; la declaración es una línea y el parser, un regex de backticks.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 5), Art. V (la task lo implementa), Art. VIII (se toca la plantilla, no copias).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/MigrationInitParity.Tests.ps1` — paridad migración–init y los tests estructurales por THEN de esta task.
- `tests/init-files-red.md`, `tests/init-files-green.md` — evidencia Art. I.
- `.docs/sdd/specs/20260922-211157-task-0019-init-files/green/` — molde, lanzador y salidas de la GREEN.
- `.docs/sdd/specs/20260922-211157-task-0019-init-files/tasks.md` — registro vivo.

**Modificar**:

- `skills/sdd-init-greenfield/SKILL.md` — paso 3 (configuración, script, `ids.mode`), pregunta 21 y red flag «con filas».
- `skills/sdd-init-greenfield/references/estructura.md` — árbol: `.claude/settings.json`, `.gitignore`, log generado por el script.
- `skills/sdd-init-brownfield/SKILL.md` — pregunta 7 y paso 5.
- `skills/sdd-init-brownfield/references/generacion.md` — paso 5: configuración, script y `ids.mode`.
- `skills/sdd-init-brownfield/references/migrations/v1.0.0.md`, `v1.1.0.md` — línea `**Escribe**:`.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md` — pasos 3 (configuración) y 4 (memoria), el marcador pasa a 5, línea `**Escribe**:` y verificación.
- `skills/sdd-init-brownfield/references/migrations/README.md` — la regla de la línea `**Escribe**:`.
- `skills/sdd-templates/templates/constitution-template.md` — entrada «Proyecto de referencia».
- `skills/sdd-templates/templates/roadmap-template.md` — bloque de ayuda de «Release N» con la cabecera.
- `skills/sdd-start-release/SKILL.md` — paso 5: la tabla de la plantilla, con «Ficheros que toca».
- `README.md` — la memoria desactivada, en «Dependencias».

**NO se tocan**:

- `skills/sdd-start-task/**` — el RED del proyecto de referencia pasó 2/2 sin guidance (decisión 8 de la spec).
- `skills/sdd-start-task/references/control-profiles.md` — ya lee «Ficheros que toca».
- `migrations/v0.2.0.md`, `v0.4.0.md` — no nombran `sdd-kit.json`.
- `.docs/sdd/roadmap.md` de este repo — cabecera propia; la plantilla no se retroaplica.

### 1.6 Dependencias

`Build-EstimationLog.ps1` (ya funciona sin specs: exit 0, cabecera y 0 filas).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto GREEN borra memoria real de la máquina | baja | alto | el molde fija `autoMemoryDirectory` a una carpeta del propio molde; el escenario de volcado va con dev-lead ausente |
| El test de paridad da falso verde por el corpus | media | medio | excluye `references/migrations/`; el test incluye un caso negativo con una clave inventada |
| Coste de la GREEN por encima del techo | baja | medio | escenarios de un turno y `--max-turns 60`; se para al llegar a 22 $ acumulados |

### 1.8 Rollout

Directo: entra en la release 1.2.0, cuyo corte hace `sdd-end-release`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Paridad migración–init

**Modelo**: Opus de la sesión (en línea).
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: TDD del hilo, `tests/MigrationInitParity.Tests.ps1`.

**Interfaces**:
- Consume: nada.
- Produce: la línea `**Escribe**: <token>, <token>, …`, una por migración, con los tokens entre backticks; y `Get-InitCorpus`, que las Tasks 2 y 3 reutilizan en el mismo fichero de tests.

**Ficheros**: `tests/MigrationInitParity.Tests.ps1`, `migrations/v1.0.0.md`, `migrations/v1.1.0.md`, `migrations/v1.2.0.md`, `migrations/README.md`, `sdd-init-greenfield/SKILL.md`, `sdd-init-greenfield/references/estructura.md`, `sdd-init-brownfield/references/generacion.md`.

- [ ] **Step 1: Test RED.** `tests/MigrationInitParity.Tests.ps1`:

```powershell
BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:MigrationsDir = Join-Path $script:RepoRoot 'skills/sdd-init-brownfield/references/migrations'

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-LinkedMarkdown([System.IO.FileInfo]$File) {
    $links = [regex]::Matches((Get-Content $File.FullName -Raw), '\]\((?!https?:)([^)#]+\.md)')
    foreach ($link in $links) {
      $target = Join-Path $File.DirectoryName $link.Groups[1].Value
      if (Test-Path $target) { Get-Item $target }
    }
  }

  function Get-InitCorpus([string]$SkillName) {
    $skillDir = Join-Path $script:RepoRoot "skills/$SkillName"
    $own = @(Get-Item (Join-Path $skillDir 'SKILL.md')) + @(Get-ChildItem (Join-Path $skillDir 'references') -Filter *.md -File -ErrorAction SilentlyContinue)
    $files = $own + @($own | ForEach-Object { Get-LinkedMarkdown $_ })
    $readable = $files | Where-Object { $_.FullName -notmatch 'references[\\/]migrations[\\/]' } | Sort-Object FullName -Unique
    return ($readable | ForEach-Object { Get-Content $_.FullName -Raw }) -join "`n"
  }

  function Get-DeclaredTokens([string]$MigrationText) {
    $line = ($MigrationText -split "`r?`n") | Where-Object { $_ -match '^\*\*Escribe\*\*:' } | Select-Object -First 1
    if (-not $line) { return @() }
    return [regex]::Matches($line, '`([^`]+)`') | ForEach-Object { $_.Groups[1].Value }
  }

  $script:Migrations = Get-ChildItem $script:MigrationsDir -Filter 'v*.md' |
    Where-Object { (Get-Content $_.FullName -Raw) -match 'sdd-kit\.json' }
}

Describe 'Paridad migración–init (Art. V)' {
  It 'hay migraciones que escriben sdd-kit.json' {
    $script:Migrations.Count | Should -BeGreaterOrEqual 3
  }

  It '<_> declara lo que escribe en su línea **Escribe**' -ForEach @('v1.0.0.md', 'v1.1.0.md', 'v1.2.0.md') {
    Get-DeclaredTokens (Get-Content (Join-Path $script:MigrationsDir $_) -Raw) | Should -Not -BeNullOrEmpty
  }

  It 'cada token declarado por una migración aparece en <_>' -ForEach @('sdd-init-greenfield', 'sdd-init-brownfield') {
    $corpus = Get-InitCorpus $_
    $missing = foreach ($migration in $script:Migrations) {
      foreach ($token in Get-DeclaredTokens (Get-Content $migration.FullName -Raw)) {
        if (-not $corpus.Contains($token)) { "$($migration.Name): $token" }
      }
    }
    $missing | Should -BeNullOrEmpty
  }

  It 'el corpus de una init no incluye las migraciones' {
    (Get-InitCorpus 'sdd-init-brownfield').Contains('**Escribe**:') | Should -BeFalse
  }

  It 'una clave inventada no aparece en el corpus' {
    (Get-InitCorpus 'sdd-init-greenfield').Contains('control.inventedKey') | Should -BeFalse
  }

  It 'el README de migraciones fija la regla de la línea **Escribe**' {
    Get-KitFile 'skills/sdd-init-brownfield/references/migrations/README.md' | Should -Match '\*\*Escribe\*\*'
  }
}
```

- [ ] **Step 2: RED.** `Invoke-Pester tests/MigrationInitParity.Tests.ps1 -Output Detailed`. Esperado: fallan «declara lo que escribe» ×3 y «README»; el de paridad pasa en vacío porque no hay tokens; «el corpus no incluye las migraciones» pasa.
- [ ] **Step 3: Líneas `**Escribe**:`.** Cada una va justo antes de `## Verificación`, a la altura de un párrafo:
  - `v1.0.0.md` y `v1.1.0.md`: `**Escribe**: `sdd-kit.json` → `version`, `channel`, `updated`.`
  - `v1.2.0.md`: `**Escribe**: `sdd-kit.json` → `version`, `channel`, `updated`, `ids.mode`, `control.profile`, `control.maxParallelAgents`, `control.silence.betweenStepsMinutes`, `control.silence.longCommandMinutes`, `merge`.` (la Task 2 le añade la configuración).
- [ ] **Step 4: Regla en `migrations/README.md`**, en la sección que describe cómo se escribe una migración: «Toda migración que escribe en el proyecto declara, en una línea `**Escribe**:` antes de «Verificación», cada fichero y cada clave que escribe, entre backticks. Lo que declara lo pregunta o lo escribe también cada init, desde una sola fuente: un proyecto nuevo nace en la versión vigente y nunca pasa por esa migración. `tests/MigrationInitParity.Tests.ps1` lo comprueba.»
- [ ] **Step 5: `ids.mode` literal en las init.** Greenfield, fila 14 de la tabla del paso 1: `Va a` = `` `sdd-kit.json` (`ids.mode`) ``. `estructura.md`: en la línea de `sdd-kit.json`, `"ids"` pasa a `"ids": { "mode" }` y se añade «(`ids.mode`)». `generacion.md` paso 5: tras `"ids": { "mode": "tracker"|"sequence" }` se añade «(`ids.mode`)».
- [ ] **Step 6: GREEN.** Ejecutar el mismo comando: todo en verde. Después, `Invoke-Pester tests` completo: verde.
- [ ] **Step 7: Commit.** `test(migrations): vigilar que lo que escribe una migración llegue a las init`, con cuerpo en castellano.

### Task 2 — Configuración y log que deja la init, y su migración

**Modelo**: Opus de la sesión (en línea).
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: TDD del hilo, un `Describe` nuevo en `tests/MigrationInitParity.Tests.ps1`.

**Interfaces**:
- Consume: `Get-KitFile` y `Get-InitCorpus` (Task 1); la línea `**Escribe**:` de `v1.2.0.md`.
- Produce: pasos 3 (configuración) y 4 (memoria) de `v1.2.0.md`, con el marcador como paso 5.

**Ficheros**: `sdd-init-greenfield/SKILL.md`, `sdd-init-greenfield/references/estructura.md`, `sdd-init-brownfield/SKILL.md`, `sdd-init-brownfield/references/generacion.md`, `migrations/v1.2.0.md`, `README.md`, `tests/MigrationInitParity.Tests.ps1`.

- [ ] **Step 1: Tests RED**, uno por THEN:

```powershell
Describe 'Configuración y log que deja la init' {
  It '<_> deja autoMemoryEnabled a false, los temporales ignorados y el log del script' -ForEach @('sdd-init-greenfield', 'sdd-init-brownfield') {
    $corpus = Get-InitCorpus $_
    foreach ($literal in '"autoMemoryEnabled": false', '.claude/settings.json', '.playwright-mcp/', '.superpowers/', 'Build-EstimationLog.ps1') {
      $corpus.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It '<_> pregunta antes de cambiar autoMemoryEnabled a true' -ForEach @('sdd-init-greenfield', 'sdd-init-brownfield') {
    Get-InitCorpus $_ | Should -Match '"autoMemoryEnabled": true'
  }

  It 'la red flag de greenfield habla de filas, no de contenido' {
    $skill = Get-KitFile 'skills/sdd-init-greenfield/SKILL.md'
    $skill | Should -Not -Match 'El estimation-log nace con contenido'
    $skill | Should -Match 'estimation-log nace con filas'
  }

  It 'la migración a v1.2.0 ordena ids, control, configuración, memoria y marcador' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    $steps = [regex]::Matches($migration, '(?m)^(\d)\. \*\*([^*]+)\*\*') | ForEach-Object { $_.Groups[2].Value.TrimEnd('.') }
    $steps | Should -Be @('Modo de numeración', 'Claves de control', 'Configuración del proyecto', 'Memoria automática', 'Marcador')
  }

  It 'el paso de memoria nombra la carpeta, el índice y el gate de borrado' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    foreach ($literal in '~/.claude/projects/<project>/memory/', 'autoMemoryDirectory', 'MEMORY.md', 'pendiente explícito') {
      $migration.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It 'el README cita autoMemoryEnabled' {
    Get-KitFile 'README.md' | Should -Match 'autoMemoryEnabled'
  }
}
```

- [ ] **Step 2: RED.** Esperado: fallan todos.
- [ ] **Step 3: Greenfield.** Paso 3 de `SKILL.md`, tras la frase del marcador. Texto:
  - «`estimation-log.md` no se escribe a mano: se genera con `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`, que lo deja con su cabecera y sin filas; el script vive en el kit y no se copia al proyecto.»
  - «`.claude/settings.json`: se crea o se fusiona con `"autoMemoryEnabled": false`, sin tocar las demás claves; si ya tiene `"autoMemoryEnabled": true`, se pregunta antes de cambiarlo y, si el usuario dice que no, se deja y el cierre lo anota. La memoria automática vive en una sola máquina; lo que se aprende va a los docs.»
  - «`.gitignore`: se añaden `.playwright-mcp/` y `.superpowers/` si faltan, sin duplicar líneas; se crea si no existe.»

  La red flag «El estimation-log nace con contenido.» pasa a «El estimation-log nace con filas, o escrito a mano en vez de generado por el script.». En `estructura.md`, la línea del log pasa a `estimation-log.md (lo genera Build-EstimationLog.ps1: cabecera y 0 filas)`, y el árbol gana, en la raíz, `├── .claude/settings.json   ("autoMemoryEnabled": false, fusionado)` y `├── .gitignore              (+ .playwright-mcp/ y .superpowers/)`.
- [ ] **Step 4: Brownfield.** `generacion.md` paso 5: «`estimation-log.md` vacío» pasa a la frase del script, y se añaden las frases de `settings.json` y `.gitignore` con el mismo texto que en greenfield. En el paso 5 de `SKILL.md`, una línea: «Además, `.claude/settings.json` con `"autoMemoryEnabled": false` y `.gitignore` con los temporales de las herramientas; detalle en generacion.md.»
- [ ] **Step 5: `v1.2.0.md`.** Se insertan dos pasos entre el 2 y el marcador, que pasa a ser el 5:

  3. **Configuración del proyecto.** `.claude/settings.json`: si no tiene `"autoMemoryEnabled": false`, se crea o se fusiona con esa clave sin tocar las demás. Si la tiene a `true`, se pregunta antes de cambiarla; si el dev-lead dice que no, se deja y el informe lo anota. `.gitignore`: se añaden `.playwright-mcp/` y `.superpowers/` si faltan, sin duplicar; se crea si no existe. Si ya estaba todo, el paso se salta y lo dice. Sin gate: es lo mismo que deja la init.
  4. **Memoria automática.** La carpeta es `~/.claude/projects/<project>/memory/`, o la de `autoMemoryDirectory` si el proyecto la redefine; la comparten todos los worktrees del repo. Cada entrada es un fichero de memoria indexado en `MEMORY.md`. Si hay entradas: **gate** — se presenta una tabla con entrada · documento de anclaje al que iría (o «ya está en `<doc>`») y se espera el «sí». Tras el «sí», se vuelcan las que faltan y se borran solo las entradas volcadas o ya presentes, con su línea de `MEMORY.md`. Sin dev-lead no se borra nada: el paso queda **pendiente explícito** y el informe dice cómo reanudarlo (reinvocar `sdd-init-brownfield`). La carpeta vacía o inexistente salta el paso.

  La línea `**Escribe**:` gana `; `.claude/settings.json` → `autoMemoryEnabled`; `.gitignore` → `.playwright-mcp/`, `.superpowers/``. En «Verificación» se añaden `(Get-Content .claude/settings.json -Raw | ConvertFrom-Json).autoMemoryEnabled` → `False` (o el informe anota que el dev-lead lo dejó en `true`) y `Select-String -Path .gitignore -Pattern '^\.superpowers/$','^\.playwright-mcp/$'` → dos líneas. El párrafo de cabecera de la migración nombra la configuración y la memoria entre lo que aplica.
- [ ] **Step 6: README.** En «Dependencias», tras la tabla: «Las init y la migración a v1.2.0 ponen `"autoMemoryEnabled": false` en `.claude/settings.json` del proyecto: la memoria automática de Claude Code vive en una sola máquina, y el kit quiere lo aprendido en los docs, que van en git.»
- [ ] **Step 7: GREEN.** `Invoke-Pester tests` completo: verde.
- [ ] **Step 8: Commit.** `feat(sdd-init): dejar la memoria desactivada, los temporales ignorados y el log generado`.

### Task 3 — Proyecto de referencia

**Modelo**: Opus de la sesión (en línea).
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: TDD del hilo, un `Describe` nuevo en `tests/MigrationInitParity.Tests.ps1`.

**Interfaces**:
- Consume: `Get-KitFile` (Task 1).
- Produce: la entrada `- **Proyecto de referencia**: …` de «Convenciones».

**Ficheros**: `sdd-templates/templates/constitution-template.md`, `sdd-init-greenfield/SKILL.md`, `sdd-init-brownfield/SKILL.md`, `tests/MigrationInitParity.Tests.ps1`.

- [ ] **Step 1: Tests RED.**

```powershell
Describe 'Proyecto de referencia' {
  It 'la constitution lo lleva en Convenciones' {
    Get-KitFile 'skills/sdd-templates/templates/constitution-template.md' | Should -Match '(?s)## Convenciones.*\*\*Proyecto de referencia\*\*.*## Reglas de producto'
  }

  It 'greenfield lo pregunta como pregunta 21' {
    Get-KitFile 'skills/sdd-init-greenfield/SKILL.md' | Should -Match '(?m)^\s*\| 21 \|.*proyecto de referencia'
  }

  It 'brownfield lo pregunta como pregunta 7' {
    Get-KitFile 'skills/sdd-init-brownfield/SKILL.md' | Should -Match '(?m)^\s*\| 7 \|.*proyecto de referencia'
  }
}
```

- [ ] **Step 2: RED.** Esperado: los tres fallan.
- [ ] **Step 3: Implementación.**
  - Plantilla, tras «Commits»: `- **Proyecto de referencia**: <ruta o repositorio cuyos patrones replica este proyecto, p. ej. `../orders-api` | no aplica>`.
  - Greenfield, fila nueva: `| 21 | ¿Replica los patrones de otro proyecto? Si es sí, ¿cuál es? (proyecto de referencia; «no» deja «no aplica») | constitution, «Convenciones» |`.
  - Brownfield, fila nueva: `| 7 | ¿Replica los patrones de otro proyecto? Si es sí, ¿cuál es? (proyecto de referencia; «no» deja «no aplica») | constitution, «Convenciones» |`.
- [ ] **Step 4: GREEN.** `Invoke-Pester tests` completo: verde.
- [ ] **Step 5: Commit.** `feat(sdd-init): preguntar el proyecto de referencia y dejarlo en la constitution`.

### Task 4 — «Ficheros que toca» en la tabla de release

**Modelo**: Opus de la sesión (en línea).
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: TDD del hilo, un `Describe` nuevo en `tests/MigrationInitParity.Tests.ps1`.

**Interfaces**:
- Consume: `Get-KitFile` (Task 1).
- Produce: la cabecera `| id | Task | Origen | Ficheros que toca | Estado |`.

**Ficheros**: `sdd-templates/templates/roadmap-template.md`, `sdd-start-release/SKILL.md`, `tests/MigrationInitParity.Tests.ps1`.

- [ ] **Step 1: Tests RED.**

```powershell
Describe 'Tabla de release con Ficheros que toca' {
  It 'la plantilla del roadmap fija la cabecera de la tabla de release' {
    Get-KitFile 'skills/sdd-templates/templates/roadmap-template.md' | Should -Match ([regex]::Escape('| id | Task | Origen | Ficheros que toca | Estado |'))
  }

  It 'sdd-start-release escribe la sección con esa tabla' {
    Get-KitFile 'skills/sdd-start-release/SKILL.md' | Should -Match 'Ficheros que toca'
  }
}
```

- [ ] **Step 2: RED.** Esperado: los dos fallan.
- [ ] **Step 3: Plantilla.** El bloque de ayuda de la línea 11 («Una release abierta con `sdd-start-release`…») se sustituye por un bloque de ayuda de la sección «Release N»:

```markdown
> **Sección `## Release <N>`** — la añade aquí debajo `sdd-start-release` al abrir una release, con una fila por task y su id reservado; `sdd-end-release` la colapsa al cerrar. Cabecera literal de su tabla:
>
> | id | Task | Origen | Ficheros que toca | Estado |
> | --- | --- | --- | --- | --- |
>
> «Ficheros que toca» nombra los ficheros o módulos que la task prevé tocar. La lee el freno de alcance de una enmienda para ver qué otras tasks abiertas comparten un fichero; sin la columna, el solape no se puede comprobar.
```

- [ ] **Step 4: `sdd-start-release` paso 5**, tras «con filas trazables al acta/origen»: «, en la tabla de la sección «Release N» de `roadmap-template.md` (con «Ficheros que toca»)».
- [ ] **Step 5: GREEN.** `Invoke-Pester tests` completo: verde.
- [ ] **Step 6: Commit.** `feat(sdd-templates): declarar los ficheros que toca cada task de una release`.

### Task 5 — GREEN headless y evidencia

**Modelo**: Opus de la sesión (hilo) para orquestar; sujetos `claude -p --model sonnet`.
**Ejecución**: en línea — decisión 2.
**Tests RED**: el RED previo (`red/README.md`); aquí se verifica.

**Interfaces**:
- Consume: el kit con las Tasks 1–4, copiado limpio a `<scratchpad>/kit` (`skills/`, `.claude-plugin/`, `hooks/`).
- Produce: `green/` (molde, `driver.py`, `out/<etiqueta>/` con `transcript.md`, `tools.txt`, `state.txt` y la foto de disco), `tests/init-files-red.md` y `tests/init-files-green.md`.

**Ficheros**: `green/**`, `tests/init-files-red.md`, `tests/init-files-green.md`.

- [ ] **Step 1: Lanzador.** Copia `red/driver.py` a `green/driver.py`, generalizado: el molde se pasa como argumento, y la foto copia además `.claude/`, `.gitignore` y la carpeta de memoria del molde (`memory/`).
- [ ] **Step 2: Moldes y escenarios** (2 sujetos cada uno; comprobación previa de `tech-stack.md` antes de lanzar):

| Escenario | Molde | Petición (un turno) | THEN que mide |
| --- | --- | --- | --- |
| G1 greenfield, estructura | proyecto vacío con mission, constitution, tech-stack, architecture y roadmap ya aprobados en `.docs/sdd/`, sin `sdd-kit.json` | «La entrevista y los documentos ya están aprobados (lo tienes en `.docs/sdd/`). Sigue con la estructura de `sdd-init-greenfield`: modo `sequence`, perfil `delegate`, sin changelog, sin worktrees. Termina el paso 3.» | `.claude/settings.json` con `"autoMemoryEnabled": false`; `.gitignore` con las dos líneas; primera línea del log `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)` y 0 filas; sin `*.ps1` en el proyecto |
| G2 brownfield, estructura con settings | molde `e2-code` de la 0020 con los docs aprobados y `.claude/settings.json` = `{"permissions":{"allow":["Bash(npm test)"]}}`, `.gitignore` = `node_modules/` | igual, con `sdd-init-brownfield` y su paso 5 | la clave añadida sin perder `permissions`; `node_modules/` conservado y las dos líneas nuevas una vez cada una; log del script |
| G3 clave a `true` | G1 con `.claude/settings.json` = `{"autoMemoryEnabled": true}` | como G1 | el sujeto pregunta antes de cambiarla y no la cambia en ese turno |
| G4 migración, volcado sin dev-lead | proyecto con `sdd-kit.json` 1.2.0 sin `.claude/`, `.claude/settings.local.json` con `autoMemoryDirectory` = `./memory`, y `memory/` con `MEMORY.md` y 3 entradas (2 ya en `tech-stack.md`, 1 no) | «Actualízame al kit. No estaré: lo que necesite mi respuesta déjalo pendiente.» | settings y `.gitignore` escritos; la tabla de las 3 entradas con destino o «ya está en»; 0 ficheros borrados de `memory/`; el informe dice «pendiente» y cómo reanudar |
| G4b migración, volcado con dev-lead | G4 | «Actualízame al kit. El gate de la memoria lo apruebo ya: vuelca lo que falte y borra lo volcado.» | la entrada nueva volcada en un doc de anclaje; las 3 entradas y sus líneas de `MEMORY.md` borradas; ninguna entrada duplicada en los docs |
| G5 pregunta 21 | G1, situado en la entrevista: «Van respondidas de la 1 a la 20: …» con las respuestas | «Sigue con la entrevista.» | la siguiente pregunta es la del proyecto de referencia, sola |
| G6 tabla de release | proyecto con roadmap calcado de la plantilla nueva y un acta triada con 3 peticiones | «Abre la release 1 con estas tres peticiones; el scope está decidido: entran las tres. Reserva los ids y escribe la sección.» | sección «Release 1» con la cabecera literal y la celda «Ficheros que toca» rellena en cada fila |

- [ ] **Step 3: Lanzar.** Los escenarios, en paralelo de dos en dos, en segundo plano. Se lleva la cuenta del coste acumulado: al llegar a 22 $ se para.
- [ ] **Step 4: Veredicto** por THEN, con fichero y línea de `out/`. Si un THEN falla: `superpowers:systematic-debugging`, ajuste del texto de la skill (REFACTOR) y re-verificación del escenario, documentado en el mismo `green.md`.
- [ ] **Step 5: Evidencia.** `tests/init-files-red.md` (resumen del RED previo con enlaces a `red/`) y `tests/init-files-green.md` (tabla escenario → THEN → resultado → coste).
- [ ] **Step 6: Commit.** `test(sdd-init): GREEN de los ficheros y la configuración que deja la init`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 3h (Tasks 1–4, ~1,25 h; GREEN y evidencia, ~1,75 h)
- Base de la estimación: cinco tasks, cuatro de texto con tests estructurales; la GREEN es la incertidumbre (la 0020, con 6 sujetos, llevó ~1,5 h y pasó del techo).
- Confianza: media

---

## 3. Validación final

- [ ] `Invoke-Pester tests` verde, con la línea «Tests Passed» citada.
- [ ] Cada THEN de la spec con evidencia: `suite` para los estructurales, `ejecución real` en la GREEN.
- [ ] Revisión final de rama limpia (Sonnet, effort medium, con cabecera de restricciones).
- [ ] Cierre vía `sdd-end-task`, tras la validación del dev-lead.

---

## 4. Self-review (cobertura spec → tasks)

- onboarding «La init deja la memoria automática desactivada y los temporales ignorados» → Task 2 (suite) + G1, G2, G3. ✓
- onboarding «El log de estimación lo genera el script del kit» → Task 2 + G1, G2. ✓
- onboarding «La constitution nombra el proyecto de referencia» → Task 3 + G5. ✓
- migration «La migración a v1.2.0 deja la configuración que deja la init» → Task 2 + G4 (el camino de la clave a `true`, en G3 sobre el mismo texto de la init). ✓
- migration «La memoria ya guardada se vuelca a los docs antes de borrarse» → Task 2 + G4 (dev-lead ausente) + G4b (gate aprobado). El molde redirige la memoria con `autoMemoryDirectory`, así que borrar no toca la de la máquina. ✓
- migration «Lo que escribe una migración lo reciben también las init» → Task 1 (suite, con caso negativo). ✓
- roadmap «Cada task de una release declara los ficheros que toca» → Task 4 + G6. ✓
- Decisión 12 (README) → Task 2, test. ✓
- `sdd-start-task` sin cambios → N/A (decisión 8 de la spec). ✓
