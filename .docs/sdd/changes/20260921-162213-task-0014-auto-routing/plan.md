---
id: 20260921-162213-task-0014-auto-routing
task: 0014
title: Plan de implementación — Auto-enrutado del kit frente a superpowers
spec: ./spec.md
status: approved
created: 2026-09-21
---

# Plan de implementación — Auto-enrutado del kit frente a superpowers

## Decisiones que he tomado yo — valida estas

1. **Cinco tasks, en serie, y sin paralelizar.** El diff es pequeño (5 ficheros de hook, 4 de skills, README) y la parte cara es la campaña de sujetos, que corre secuencial. Paralelizar no ahorra reloj y multiplica el coste de la cuenta compartida. Pídeme confirmación si quieres otra cosa.
2. **Solo la Task 2 va por subagente; las otras cuatro van en línea.** La Task 2 es código (bash + Pester) y se beneficia de un revisor independiente. Las otras: la 1 y la 4 son lanzar scripts ya escritos y leer streams; la 3 son cuatro líneas de prosa cuya verificación *es* la campaña, y un subagente no tendría el contexto del RED; la 5 es evidencia que solo el hilo conoce. Motivo escrito en cada `Ejecución`.
3. **Modelo y effort.** Task 2: implementador **Sonnet, effort medium**, y revisor de task **Sonnet, effort medium** (gama media como suelo; el bash sobre Windows es donde un modelo más barato da 2–3 vueltas). Revisión final de rama: **Sonnet, effort high**, no Opus: el diff es de ~150 líneas y el Art. IV prohíbe `fable` y `opus xhigh` por defecto. El tool `Agent` no expone effort: se anota en `tasks.md` como desviación del Art. IV (aprendizaje de la T7).
4. **Sin wrapper `run-hook.cmd`.** El hook se lanza con `shell: bash` y `bash "${CLAUDE_PLUGIN_ROOT}/hooks/session-start"`, sin la cuña de superpowers. Ahorra un fichero y la doc confirma que `shell: bash` es el valor por defecto. **Riesgo**: en Windows sin Git Bash, Claude Code cae a PowerShell y el hook no corre; el kit sigue funcionando por las `description`. Si el smoke falla en esta máquina, se añade el wrapper.
5. **El directorio del proyecto sale de `CLAUDE_PROJECT_DIR`** (la doc dice que siempre está definido), con `$PWD` de reserva. Dentro de un worktree es la raíz del worktree, que tiene `.docs/sdd/` porque está versionado.
6. **`.gitattributes` gana `hooks/* text eol=lf`.** `core.autocrlf` está en `true` en esta máquina y un `session-start` con CRLF falla en bash con `pipefail\r`. Es el único cambio fuera de lo que dice la spec, y lo exige que el hook funcione en Windows.
7. **La campaña GREEN son 17 sujetos Sonnet, ≈ 4,3 $, en serie, en segundo plano.** La Task 1 gasta ≈ 1 $ más para medir el RED de los controles de sobre-disparo, que la spec exige antes de tocar nada. Total de la task: ≈ 9 $ contando lo ya gastado (3,8 $).
8. **Si el GREEN falla, se escala a `using-sdd` (Task 6, condicional)** y se me presenta un anexo al plan antes de escribir la skill: la spec ya autorizó esa escalada, pero el plan de una skill nueva no existe todavía.
9. **Coste y tiempo estimados**: ≈ 3 h de implementación y campaña (referencia: 0003, ≈ 3 h y 610k tokens de subagentes; aquí solo un implementador y un revisor, ≈ 400k tokens).

**Goal**: que una petición de trabajo en lenguaje natural entre por `sdd-start-task` y no por `superpowers:brainstorming`, con un hook `SessionStart` y frases naturales en las `description`, sin regresión ni sobre-disparo.

**Architecture**: un hook `SessionStart` en `hooks/` que emite un router de ~110 palabras como `additionalContext` solo si existe `.docs/sdd/`; frases naturales y frontmatter en las skills; se mide con la misma campaña de sujetos del RED (moldes en `red/`).

**Tech Stack**: bash (script del hook), JSON (`hooks/hooks.json`), Pester ≥ 5 en pwsh 7 (`Invoke-Pester -Path tests`), sujetos headless `claude -p --model sonnet`. Ver `.docs/sdd/tech-stack.md`.

**Spec**: `./spec.md`

## Restricciones globales

- Spec, decisión 3: la skill `using-sdd` **no entra** salvo que el GREEN incumpla la decisión 4; sin skill nueva, el catálogo sigue en 12.
- Spec, decisión 4: el GREEN exige `h1` y `h4` ×3 cada uno con **6/6** el kit primero, las seis peticiones cotidianas sin regresión y los controles de edición trivial sin ninguna skill invocada.
- Spec, «No entra»: nada de perfiles de control (0008), paralelismo (0005), hook para el canal `npx`, `paths` ni `disable-model-invocation`.
- Los tests `tests/Skills.Tests.ps1` exigen que cada `description` empiece por «Usar » y no pase de 1024 caracteres; y un valor de frontmatter en YAML plano no puede contener `: `.
- Art. III: texto humano en castellano con ortografía correcta (tildes); nombres de skill y de fichero en inglés kebab-case.
- **Política de modelos (Art. IV)**: el modelo y el effort se declaran siempre de forma explícita al despachar; gama media como suelo para revisores y para implementadores que trabajan desde prosa; el tier más barato solo para transcripción de código ya escrito o arreglos mecánicos de un fichero; `fable` y `opus xhigh` prohibidos por defecto, con justificación escrita en la task.
- **Modo de ejecución (Art. IV)**: `subagent-driven-development` por defecto; en línea solo con motivo en el campo `Ejecución` de la task.
- **Art. X — Calidad de código** (literal):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Trampas de test del repo** (`tech-stack.md`): un test que crea directorios nunca cambia el cwd y no confía en `$TestDrive` dentro de funciones de `BeforeAll`; el pre-commit corre la suite entera y rechaza un test en rojo, así que los tests RED del hilo se aparcan en `red/` y el implementador los mueve con `git mv`; nunca `--no-verify`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only (Art. VI).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin wrapper `run-hook.cmd`, sin skill nueva, un script de ~15 líneas y un texto de ~110 palabras.
- [x] **YAGNI gate**: nada se abstrae; el router es un fichero de texto que el script lee, no una plantilla.
- [x] **Brownfield gate**: retrocompatible; sin `.docs/sdd/` el hook calla y ninguna skill cambia de comportamiento fuera de la `description` de `sdd-start-task`.
- [x] **Constitution check**: Art. I (RED de los controles antes de tocar, GREEN al final), Art. III (idioma), Art. IX (extiende superpowers solo ante hueco medido: spec, decisión 10), Art. X (calidad).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `hooks/hooks.json` — declara el hook `SessionStart` del plugin.
- `hooks/session-start` — script bash: sin `.docs/sdd/` no escribe nada; con él, emite el JSON de `additionalContext`.
- `hooks/router.md` — el texto del router (editable sin tocar el script).
- `tests/Hook.Tests.ps1` — Pester del hook (se escribe en `red/` y se mueve).
- `tests/auto-routing-red.md` y `tests/auto-routing-green.md` — evidencia (Art. I).
- En `red/`: `molde-trivial/`, `run-controls.sh`, `run-green.sh` (moldes y lanzadores de la campaña).

**Modificar**:

- `skills/sdd-start-task/SKILL.md` (línea 3) — `description` con frases naturales y la exclusión reformulada; `argument-hint`.
- `skills/sdd-start-patch/SKILL.md` — `description` y `argument-hint`.
- `skills/sdd-consult/SKILL.md` — `description` y `argument-hint`.
- `skills/sdd-templates/SKILL.md` — `user-invocable: false`.
- `tests/Skills.Tests.ps1` — descriptor del frontmatter de arranque.
- `.gitattributes` — `hooks/* text eol=lf`.
- `README.md` — nota sobre el hook y el límite del canal `npx`.

**NO se tocan**:

- `.claude-plugin/plugin.json` — la doc dice que `hooks/hooks.json` se descubre solo; la versión la sube el cierre de la 1.2.0.
- `skills/sdd-start-task/references/*` y los pasos del `SKILL.md` — el enrutado fino del paso 2 ya tiene sus cuatro salidas; la campaña mide si basta.
- `.docs/sdd/constitution.md` — nada de lo que fija a los proyectos cambia.

### 1.2 Modelo de datos, 1.3 Migraciones, 1.4 Contratos API, 1.5 UX

No aplica. Sin migración: nada cambia en `.docs/sdd/` del proyecto consumidor.

### 1.4b Contrato del hook

Entrada: la que da Claude Code (`CLAUDE_PROJECT_DIR`, `CLAUDE_PLUGIN_ROOT`). Salida sin `.docs/sdd/`: **stdout vacío, exit 0**. Salida con él:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": "<contenido de hooks/router.md escapado para JSON>"
  }
}
```

Solo el campo anidado: Claude Code lee también `additional_context` sin deduplicar, así que emitir ambos inyecta el texto dos veces.

### 1.6 Dependencias

Claude Code con Git Bash (o `bash` en el PATH del shell del hook), y superpowers 6.3.0 para la campaña. Sin librerías nuevas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El hook no corre en Windows (sin wrapper o sin Git Bash) | Media | Alto: solo queda la capa de las `description` | El GREEN comprueba en el stream que el `hook_response` del kit contiene el router; si falta, se añade `run-hook.cmd` |
| `session-start` sale con CRLF | Alta sin `.gitattributes` | Alto: el hook falla | `hooks/* text eol=lf` en la Task 2 y un test que lee los bytes del script |
| Sobre-disparo: una edición trivial arranca `sdd-start-task` | Media | Medio: ceremonia | Controles c1 y c2, con RED antes y GREEN después |
| El router no basta contra el hook de superpowers | Media | Alto | Criterio del GREEN fijado antes de medir; escalada a `using-sdd` (Task 6) |
| `argument-hint` o `user-invocable` rompen la instalación en otros agentes | Baja | Medio | Sin verificar fuera de Claude Code; `claude plugin validate --strict` en la suite cubre Claude Code |

### 1.8 Rollout

Directo: viaja con el plugin. La release 1.2.0 sube versión y changelog.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — RED de los controles de sobre-disparo

**Modelo**: el del hilo (Sonnet, effort high); sin subagente.
**Ejecución**: en línea — solo lanza scripts y lee streams; el trabajo es de método, no de código, y el hilo es quien tiene el RED de la campaña en contexto.
**Tests RED**: no aplica (es el RED).

**Ficheros**: crear `red/molde-trivial/`, `red/run-controls.sh`; el RED se guarda en `red/out-controls-red/`.

- [ ] **Step 1: Molde con typo**

```powershell
$red = 'D:\code\.worktrees\sdd-kit\0014\.docs\sdd\specs\20260921-162213-task-0014-auto-routing\red'
Copy-Item "$red\molde-code" "$red\molde-trivial" -Recurse
Set-Content -Encoding utf8 "$red\molde-trivial\README.md" "# salas`n`nReservas de salas de reuniones desde la terminal. Las recervas se guardan en memoria."
```

- [ ] **Step 2: Lanzador de controles**

Crear `red/run-controls.sh`:

```bash
#!/usr/bin/env bash
# Controles de sobre-disparo: ediciones sin comportamiento, dos sujetos por petición.
# Uso: RUNS_DIR=<scratchpad> run-controls.sh <kit> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; OUT="$2"
run() { bash "$BASE/subject.sh" molde-trivial "$KIT" "$1" "$2" "$OUT"; }
run c1-typo-1   "Corrige el typo «recervas» que hay en el README."
run c1-typo-2   "Corrige el typo «recervas» que hay en el README."
run c2-rename-1 "Renombra la variable bookings a reservations en src/app.js."
run c2-rename-2 "Renombra la variable bookings a reservations en src/app.js."
```

- [ ] **Step 3: Lanzar contra el kit actual (sin cambios) en segundo plano**

`$SP\kit` es la copia del kit **previa a cualquier edición**; no se toca en toda la task.

```bash
SP=/c/Users/pikac/AppData/Local/Temp/claude/D--code--worktrees-sdd-kit-0014/17246d75-4781-4035-8f17-f3eff7199541/scratchpad
SPEC=/d/code/.worktrees/sdd-kit/0014/.docs/sdd/specs/20260921-162213-task-0014-auto-routing/red
export RUNS_DIR=$SP/runs
bash $SPEC/run-controls.sh $SP/kit $SPEC/out-controls-red
```

- [ ] **Step 4: Verificación** — para cada `out-controls-red/*.skills.txt`, la lista de skills invocadas. Esperado: registrar 4/4 o el número de sujetos que invocan alguna skill. Ese número es el RED de la spec (decisión 5); no se corrige nada aquí.
- [ ] **Step 5: Commit** — no se commitea aún; la evidencia entra con la Task 5.

---

### Task 2 — Hook `SessionStart` con su test

**Modelo**: implementador **Sonnet, effort medium**; revisor de task **Sonnet, effort medium**.
**Ejecución**: por agente (default).
**Tests RED**: hilo principal · `red/Hook.Tests.ps1`, escrito y verificado en rojo antes de despachar; el implementador lo mueve a `tests/Hook.Tests.ps1` con `git mv` en su commit.

> Un test por THEN de la spec: «el router solo existe donde hay SDD» (dos escenarios) y su forma (hook declarado, router corto, script con LF).

**Interfaces:**
- Produces: `hooks/session-start` (sin `.docs/sdd/` bajo `CLAUDE_PROJECT_DIR`, stdout vacío y exit 0; con él, el JSON de arriba) y `hooks/router.md` (≤ 150 palabras, cita `sdd-start-task`, `sdd-start-patch` y `sdd-consult`). La Task 4 espera ese router en el `hook_response` de los streams.

**Ficheros**: crear `hooks/hooks.json`, `hooks/session-start`, `hooks/router.md`, `tests/Hook.Tests.ps1`; modificar `.gitattributes`.

- [ ] **Step 1: Test RED (lo escribe el hilo antes de despachar)**

`red/Hook.Tests.ps1`:

```powershell
BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:HooksDir = Join-Path $script:KitRoot 'hooks'
  $script:Script = Join-Path $script:HooksDir 'session-start'

  # En Windows, `bash` del PATH suele ser el lanzador de WSL, que no ejecuta el script: se prefiere Git Bash.
  function Resolve-Bash {
    $gitBash = @("$env:ProgramFiles\Git\bin\bash.exe", "${env:ProgramFiles(x86)}\Git\bin\bash.exe") |
      Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($gitBash) { return $gitBash }
    $onPath = Get-Command bash -ErrorAction SilentlyContinue
    if ($onPath -and $onPath.Source -notmatch 'System32') { return $onPath.Source }
  }
  $script:Bash = Resolve-Bash

  function New-ProjectDir([bool]$WithSdd) {
    $dir = Join-Path ([IO.Path]::GetTempPath()) ('hook-' + [guid]::NewGuid().ToString('N'))
    $target = if ($WithSdd) { Join-Path $dir '.docs/sdd' } else { $dir }
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    return $dir
  }

  function Invoke-SessionStart([string]$ProjectDir) {
    $previous = $env:CLAUDE_PROJECT_DIR
    $env:CLAUDE_PROJECT_DIR = $ProjectDir
    try { $output = & $script:Bash $script:Script }
    finally { $env:CLAUDE_PROJECT_DIR = $previous }
    return [pscustomobject]@{ Output = ($output -join "`n"); ExitCode = $LASTEXITCODE }
  }
}

Describe 'hooks/hooks.json' {
  It 'declara un hook SessionStart que ejecuta session-start' {
    $config = Get-Content (Join-Path $script:HooksDir 'hooks.json') -Raw | ConvertFrom-Json
    $command = $config.hooks.SessionStart[0].hooks[0].command
    $command | Should -Match 'hooks/session-start'
  }
}

Describe 'hooks/router.md' {
  It 'es corto (150 palabras como máximo)' {
    $words = (Get-Content (Join-Path $script:HooksDir 'router.md') -Raw -ErrorAction Stop) -split '\s+' | Where-Object { $_ }
    $words.Count | Should -BeLessOrEqual 150
  }
}

Describe 'hooks/session-start' {
  It 'se guarda con finales de línea LF' {
    $bytes = [IO.File]::ReadAllBytes($script:Script)
    $bytes | Should -Not -Contain 13
  }

  It 'no inyecta nada sin .docs/sdd/' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $false)
    $result.ExitCode | Should -Be 0
    $result.Output.Trim() | Should -BeNullOrEmpty
  }

  It 'inyecta el router con .docs/sdd/' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $true)
    $result.ExitCode | Should -Be 0
    $context = ($result.Output | ConvertFrom-Json).hookSpecificOutput
    $context.hookEventName | Should -Be 'SessionStart'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-start-task'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-start-patch'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-consult'
  }
}
```

- [ ] **Step 2: Verificar el rojo por la causa correcta**

```powershell
$env:SDD_KIT_ROOT = 'D:\code\.worktrees\sdd-kit\0014'
pwsh -NoProfile -Command "Invoke-Pester -Path '.docs/sdd/specs/20260921-162213-task-0014-auto-routing/red/Hook.Tests.ps1' -Output Detailed"
```

Esperado: los 5 fallan porque `hooks/` no existe (no encuentra `hooks.json`, `router.md` ni el script), no por un error del test.

> **Desvío del plan (ejecución, Task 2, Step 2)**: la primera versión del test daba 1 verde y 4 rojos. El verde era un falso positivo (`Get-Content` sin `-ErrorAction Stop` no falla y el recuento de palabras daba 0), y los dos rojos de ejecución fallaban porque `bash` del PATH es el lanzador de WSL, sin distribución instalada. Se corrigió el test (`Resolve-Bash` prefiere Git Bash; `-ErrorAction Stop`) y el bloque de arriba ya es el corregido. La spec no cambia.

- [ ] **Step 3: `.gitattributes`**

Añadir al final de `.gitattributes`:

```text
hooks/* text eol=lf
```

- [ ] **Step 4: `hooks/hooks.json`**

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "bash \"${CLAUDE_PLUGIN_ROOT}/hooks/session-start\"",
            "shell": "bash",
            "async": false
          }
        ]
      }
    ]
  }
}
```

- [ ] **Step 5: `hooks/router.md`**

```markdown
Este proyecto trabaja con el kit SDD (`.docs/sdd/`). Es una instrucción del proyecto y prevalece sobre la regla de superpowers de invocar `brainstorming` primero.

- Petición de trabajo (una feature o un cambio con comportamiento: «añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido») → invoca `sdd-kit:sdd-start-task` ANTES que `brainstorming`. Esa skill invoca `brainstorming` en su paso 4 y decide carril y modo (lite para lo acotado).
- Bug pequeño y determinista → `sdd-kit:sdd-start-patch`.
- Pregunta, duda o «¿se puede…?» → `sdd-kit:sdd-consult`.
- Edición sin comportamiento (un typo, un renombrado, un formato) → hazla directa, sin invocar ninguna skill.
```

- [ ] **Step 6: `hooks/session-start`**

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$PWD}"

[ -d "${PROJECT_DIR}/.docs/sdd" ] || exit 0

escape_for_json() {
  local text="$1"
  text="${text//\\/\\\\}"
  text="${text//\"/\\\"}"
  text="${text//$'\n'/\\n}"
  text="${text//$'\r'/\\r}"
  text="${text//$'\t'/\\t}"
  printf '%s' "$text"
}

router="$(escape_for_json "$(cat "${SCRIPT_DIR}/router.md")")"

# Solo el campo anidado: Claude Code también lee additional_context sin deduplicar y el texto entraría dos veces.
printf '{\n  "hookSpecificOutput": {\n    "hookEventName": "SessionStart",\n    "additionalContext": "%s"\n  }\n}\n' "$router"
```

- [ ] **Step 7: Mover el test y verificar en verde**

```powershell
git mv .docs/sdd/specs/20260921-162213-task-0014-auto-routing/red/Hook.Tests.ps1 tests/Hook.Tests.ps1
pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"
```

Esperado: suite completa en verde, incluidos los 5 tests del hook y `claude plugin validate` (si `claude` está en el PATH). Si `Manifests.Tests` rechaza `hooks/`, se para y se informa.

- [ ] **Step 8: Commit**

```bash
git add hooks tests/Hook.Tests.ps1 .gitattributes
git commit -m "feat(hooks): router SessionStart que enruta el trabajo al kit antes que a brainstorming" -m "Con .docs/sdd/ inyecta un texto corto que manda las peticiones de trabajo a sdd-start-task, los bugs a sdd-start-patch y las preguntas a sdd-consult; sin .docs/sdd/ no escribe nada. Fija LF en hooks/ porque autocrlf rompía el script en bash." -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3 — `description` y frontmatter

**Modelo**: el del hilo (Sonnet, effort high); sin subagente.
**Ejecución**: en línea — son cuatro ediciones de prosa cuyo único juez es la campaña de la Task 4, y el subagente no tendría el RED en contexto.
**Tests RED**: hilo · TDD en línea sobre `tests/Skills.Tests.ps1`.

**Interfaces:**
- Consumes: nada de la Task 2.
- Produces: kit con `argument-hint` en las tres skills de arranque y `user-invocable: false` en `sdd-templates`; la Task 4 lo mide.

**Ficheros**: modificar `tests/Skills.Tests.ps1`, `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-patch/SKILL.md`, `skills/sdd-consult/SKILL.md`, `skills/sdd-templates/SKILL.md`.

- [ ] **Step 1: Test RED** — añadir al final de `tests/Skills.Tests.ps1`:

```powershell
Describe 'Frontmatter de las skills de arranque' {
  It '<_> lleva argument-hint' -ForEach @('sdd-start-task', 'sdd-start-patch', 'sdd-consult') {
    $fields = Get-Frontmatter (Get-Content (Get-SkillFile $_) -Raw)
    $fields['argument-hint'] | Should -Not -BeNullOrEmpty
  }

  It 'sdd-templates no aparece en el menú de comandos' {
    $fields = Get-Frontmatter (Get-Content (Get-SkillFile 'sdd-templates') -Raw)
    $fields['user-invocable'] | Should -Be 'false'
  }
}
```

- [ ] **Step 2: Ver el rojo** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Skills.Tests.ps1"`. Esperado: 4 fallos, uno por skill, por campo ausente.
- [ ] **Step 3: `sdd-start-task`** — sustituir la línea `description:` (línea 3) y añadir `argument-hint` debajo:

```yaml
description: Usar cuando el usuario pide arrancar trabajo en un proyecto con carpeta .docs/sdd/ — una tarea, feature o cambio con comportamiento, aunque sea pequeño («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido») — al invocar el comando, al enunciar una nueva task del roadmap o al llegar un ticket nuevo. No usar para bugs pequeños deterministas (eso es sdd-start-patch), para preguntas (eso es sdd-consult) ni para ediciones sin comportamiento (un typo, un renombrado, un formato), que se hacen directas.
argument-hint: "<id o enunciado de la task>"
```

- [ ] **Step 4: `sdd-start-patch`** — la línea `description:` conserva su texto y suma `«hay un bug…, arréglalo»` a las frases; añadir `argument-hint`:

```yaml
description: Usar cuando llega un bug pequeño y determinista (<30 min, sin interpretación de requisitos) en un proyecto con carpeta .docs/sdd/ — "arregla este bug", "hay un bug…, arréglalo", "métele un patch", un ticket de fallo puntual. No para features ni para bugs que exigen interpretar requisitos (eso es sdd-start-task).
argument-hint: "<id o descripción del bug>"
```

- [ ] **Step 5: `sdd-consult`** — la línea `description:` conserva su texto y suma `"¿cómo funciona…?"` y `"¿se puede…?"`; añadir `argument-hint`:

```yaml
description: Usar cuando el usuario quiere preguntar, entender, planificar o estructurar algo del proyecto con el contexto cargado, sin arrancar el flujo SDD — "una duda", "¿por qué…?", "¿cómo funciona…?", "¿se puede…?", "¿dónde tocaría…?", "¿cómo enfocarías…?", "¿qué hacemos ahora?". No para implementar una feature (sdd-start-task), arreglar un bug determinista (sdd-start-patch) ni investigar un fallo (superpowers:systematic-debugging).
argument-hint: "<pregunta>"
```

- [ ] **Step 6: `sdd-templates`** — añadir bajo `description:`:

```yaml
user-invocable: false
```

- [ ] **Step 7: Verde** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: suite entera en verde (incluye `description` ≤ 1024 y `claude plugin validate --strict`). Si `--strict` rechaza `argument-hint` o `user-invocable`, se para y se informa: es el hallazgo de la decisión 7.
- [ ] **Step 8: Commit**

```bash
git add skills tests/Skills.Tests.ps1
git commit -m "feat(skills): frases naturales en las description de arranque y frontmatter" -m "sdd-start-task pasa a excluir solo las ediciones sin comportamiento en lugar de los cambios describibles en una frase, que empujaban lo pequeño a superpowers. argument-hint en las tres skills de arranque y user-invocable false en sdd-templates." -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4 — Campaña GREEN

**Modelo**: el del hilo (Sonnet, effort high) lanza y lee; los sujetos son Sonnet, con el mismo lanzador del RED.
**Ejecución**: en línea — es medición, y el hilo tiene el RED; los 17 sujetos corren en serie y en segundo plano.
**Tests RED**: no aplica (es el GREEN).

**Interfaces:**
- Consumes: el router de la Task 2 (debe aparecer en los `hook_response` de los streams) y las `description` de la Task 3.

**Ficheros**: crear `red/run-green.sh`; la salida va a `red/out-green/` y `red/out-controls-green/`.

- [ ] **Step 1: Copia limpia del kit con hooks**

```powershell
$sp = 'C:\Users\pikac\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0014\17246d75-4781-4035-8f17-f3eff7199541\scratchpad'
$r = 'D:\code\.worktrees\sdd-kit\0014'
Remove-Item "$sp\kit-green" -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory "$sp\kit-green" | Out-Null
'skills', '.claude-plugin', 'hooks' | ForEach-Object { Copy-Item "$r\$_" "$sp\kit-green\$_" -Recurse }
```

- [ ] **Step 2: Lanzador GREEN** — crear `red/run-green.sh`:

```bash
#!/usr/bin/env bash
# GREEN: las frases que fallaban (h1, h4) tres veces cada una y el control de sdd-templates.
# Uso: RUNS_DIR=<scratchpad> run-green.sh <kit> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; OUT="$2"
H1="Let's build an email reminder that fires before each booking."
H4="Es un cambio pequeño: añade un campo 'notas' a cada reserva. Hazlo rápido."
for i in 1 2 3; do bash "$BASE/subject.sh" molde "$KIT" "h1-g$i" "$H1" "$OUT"; done
for i in 1 2 3; do bash "$BASE/subject.sh" molde-code "$KIT" "h4-g$i" "$H4" "$OUT"; done
bash "$BASE/subject.sh" molde "$KIT" t1-templates "Invoca la skill sdd-kit:sdd-templates y dime cuál es la primera plantilla del índice." "$OUT"
```

- [ ] **Step 3: Lanzar los tres bloques en serie y en segundo plano**

```bash
SP=/c/Users/pikac/AppData/Local/Temp/claude/D--code--worktrees-sdd-kit-0014/17246d75-4781-4035-8f17-f3eff7199541/scratchpad
SPEC=/d/code/.worktrees/sdd-kit/0014/.docs/sdd/specs/20260921-162213-task-0014-auto-routing/red
export RUNS_DIR=$SP/runs
bash $SPEC/run-red.sh $SP/kit-green $SPEC/out-green
bash $SPEC/run-green.sh $SP/kit-green $SPEC/out-green
bash $SPEC/run-controls.sh $SP/kit-green $SPEC/out-controls-green
```

Total: 6 + 7 + 4 = 17 sujetos, ≈ 4,3 $. `run-red.sh` es el mismo lanzador de las seis peticiones cotidianas, con otra salida.

- [ ] **Step 4: Verificar el criterio de la spec (decisión 4)** — leyendo `*.skills.txt`, no el autoinforme:
  - `h1-g1..3` y `h4-g1..3`: la **primera** línea es `sdd-kit:sdd-start-task` en los **6**.
  - `p1..p6` (en `out-green/`): el mismo resultado que el RED, `p4` → `sdd-consult`, `p5` → `sdd-start-patch`, el resto → `sdd-start-task`.
  - `c1-*` y `c2-*` (en `out-controls-green/`): sin skills, o el mismo resultado que el RED de la Task 1 si ese ya invocaba alguna.
  - `t1-templates`: el stream contiene una invocación de `sdd-kit:sdd-templates` sin error.
- [ ] **Step 5: Verificar que el hook del kit disparó** — en el primer `.jsonl` de `out-green/`, el `hook_response` de `SessionStart` contiene `Este proyecto trabaja con el kit SDD`. Sin eso, un verde no prueba el hook.
- [ ] **Step 6: Decidir** — si el criterio se cumple, sigue la Task 5. Si **no**, para y ve a la Task 6; no se afina el texto a ciegas.
- [ ] **Step 7: Commit** de `red/` (moldes, lanzadores, salidas):

```bash
git add .docs/sdd/specs/20260921-162213-task-0014-auto-routing/red
git commit -m "docs(sdd): evidencia RED y GREEN del auto-enrutado (task 0014)" -m "Moldes, lanzadores y streams de los sujetos de la campaña; las copias por run se quedan en el scratchpad." -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5 — Evidencia en `tests/` y README

**Modelo**: el del hilo (Sonnet, effort high); sin subagente.
**Ejecución**: en línea — la evidencia y su veredicto solo los conoce el hilo.
**Tests RED**: no aplica (docs).

**Ficheros**: crear `tests/auto-routing-red.md` y `tests/auto-routing-green.md`; modificar `README.md`.

- [ ] **Step 1: `tests/auto-routing-red.md`** — calcando la estructura de `tests/disparo-skills-red.md` (método · resultados · conclusión): los 14 sujetos del RED y los 4 de controles, con las tablas de esta sesión (primera skill por sujeto), el hallazgo del 4 de 8 y del 2 de 8 «nunca llegó al kit», las **trampas de método** (molde stub sin flujo de reservas en `h4` original; el `CLAUDE.md` de `h2` pide brainstorming, así que es evidencia débil; los sujetos heredan los hooks del usuario, caveman y ponytail) y el **posible falso negativo** de GH #1 (sesión larga y superpowers a nivel de proyecto no reproducidos), sin descartar nada sin el dev-lead.
- [ ] **Step 2: `tests/auto-routing-green.md`** — los 17 sujetos frente al RED, veredicto contra el criterio de la spec y el resultado del Step 5 de la Task 4 (el hook disparó).
- [ ] **Step 3: `README.md`** — bajo las instrucciones de instalación (después de la línea de `npx skills add`), añadir:

```markdown
### Enrutado automático

El plugin trae un hook `SessionStart` que, solo en proyectos con `.docs/sdd/`, recuerda al agente que una petición de trabajo entra por `sdd-start-task` antes que por `brainstorming`, un bug pequeño por `sdd-start-patch` y una pregunta por `sdd-consult`. `npx skills add` no instala hooks: quien use ese canal recibe solo las frases de las `description`.
```

- [ ] **Step 4: Verificación** — `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`. Esperado: verde (el test de README y el de nombres de ficheros incluidos).
- [ ] **Step 5: Commit**

```bash
git add tests README.md
git commit -m "docs(sdd): evidencia del auto-enrutado y nota del hook en el README" -m "Registra el RED y el GREEN de la task 0014, con las trampas de método y el posible falso negativo de GH #1." -m "Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6 — Escalada a `using-sdd` (condicional: solo si el GREEN incumple la decisión 4)

**Modelo**: se decide en el anexo.
**Ejecución**: se decide en el anexo.

No se detalla porque puede no ejecutarse. Si la Task 4 falla, se para y se te presenta un **anexo a este plan** con: el fallo medido, la skill `using-sdd` (RED contra baseline sin ella y GREEN con los mismos sujetos, Art. I), cómo el hook la inyecta en lugar de `router.md` y su coste. La spec ya autoriza la escalada; el anexo es el plan que falta.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 3h (RED de 14 sujetos, spec, este plan)
- Estimación de implementación: 3h (hook y Pester 1h, skills y frontmatter 0,5h, campaña GREEN y lectura 1h, evidencia y README 0,5h)
- Base de la estimación: cinco tasks, una con subagente; referencia de la 0003 (≈ 3 h y 610k tokens con varios subagentes) y de la 0004 (≈ 4,4 h); aquí un implementador y un revisor (≈ 400k tokens) y ≈ 5,3 $ de sujetos por delante de los 3,8 $ ya gastados
- Confianza: media (el hook en Windows no se ha ejecutado nunca; el GREEN puede escalar a la Task 6)

---

## 3. Validación final

- [ ] Suite Pester en verde con `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`
- [ ] Criterio de la decisión 4 de la spec cumplido, leído de los `*.skills.txt`
- [ ] Hook verificado en un stream real: el `hook_response` del kit lleva el router
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Revisión final de rama (Sonnet, effort high) y **validación del dev-lead** antes de `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «Una petición de trabajo entra por el kit» → Task 2 (router), Task 3 (`description`), medido en Task 4 (`h1-g*`, `h4-g*`, `p1`–`p3`, `p6`). ✓
- ADDED «Un bug pequeño entra por patch» → Task 4 (`p5`, sin regresión). ✓
- ADDED «Una pregunta entra por consult» → Task 4 (`p4`). ✓
- ADDED «Una edición trivial no lleva ceremonia» → RED en Task 1, GREEN en Task 4 (`c1-*`, `c2-*`). ✓
- ADDED «El router solo existe donde hay SDD» → Task 2 (`Hook.Tests.ps1`, dos escenarios), y el `hook_response` del stream en Task 4. ✓
- Decisión 3 (escalada) → Task 6 condicional. ✓
- Decisión 6 (exclusión de la `description`) → Task 3. ✓
- Decisión 7 (frontmatter) → Task 3. ✓
- Decisión 8 (capacidad `routing`) → la fusión del delta la hace `sdd-end-task`; sin task propia. ✓
- Decisión 9 (sin migración), decisión 10 (Art. IX) → N/A, confirmado en spec. ✓
