---
id: 20260923-190542-task-0016-git-env-cache-warning
task: 0016
title: Plan de implementación — Entorno de git limpio en los tests y aviso de skills cargadas de la caché
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Entorno de git limpio en los tests y aviso de skills cargadas de la caché

## Decisiones que he tomado yo — valida estas

1. **Dos tasks, por agente, Sonnet con effort medio en las dos** — el plan trae el código casi escrito y los tests RED los pone el hilo: es generación guiada, no diseño. Revisor de task: Sonnet medio. Revisión final de rama: el modelo del hilo (Opus), porque en T7 fue la de rama la que cazó lo que dos Sonnet aprobaron. Sin `fable` ni `opus xhigh`.
2. **Tests RED aparcados en `red-tests/` de esta carpeta**: el pre-commit rechaza un test en rojo dentro de `tests/` (`tech-stack.md`). Cada implementador los mueve con `git mv` en el commit de su task.
3. **`Start-KitSession.ps1` restaura `SDD_KIT_SESSION_ROOT` al salir `claude`** (`try/finally`). La variable vive en el proceso de la terminal: sin restaurarla, un `claude` a secas lanzado después desde esa misma terminal no recibiría el aviso. La spec pide exportarla antes de `claude`; restaurarla después no cambia ningún THEN.
4. **El JSON del hook sale con `-EscapeHandling EscapeNonAscii`**: `pwsh -File` escribe con la página de códigos de la consola y las tildes llegarían rotas a Claude Code; con los caracteres escapados, la salida es ASCII puro y el JSON sigue siendo el mismo.
5. **Registro del hook con `"shell": "bash"`, como el del plugin**, y el comando `pwsh -NoProfile -File "${CLAUDE_PROJECT_DIR}/.claude/hooks/Test-KitSessionSource.ps1"`. Sin `matcher`: el origen de las skills se decide al arrancar el proceso, también en `resume`.
6. **Los tests nuevos no llevan `Slow`**: ninguno crea repos ni lanza procesos; el hook se ejecuta en proceso con `&`.
7. **`Invoke-GitIsolated` se conserva como envoltorio de una línea** (`& git -C $Repo @GitArguments`): quitarlo cambiaría ~20 llamadas sin ganar nada.
8. **Coste**: ~2,5 h de implementación. Tokens: 2 implementadores + 2 revisores Sonnet + 1 revisión final Opus, orden de magnitud de una task S del estimation-log.

**Goal**: un helper único y vigilado que aísla del entorno de git a todo test que ejecuta git, y un aviso al arrancar la sesión cuando las skills del kit no salen de la rama.

**Architecture**: `tests/Clear-GitEnv.ps1` expone `Clear-GitEnv` y `Restore-GitEnv`, dot-sourced como `Resolve-Bash.ps1`; un test de convención lo exige en todo `tests/*.Tests.ps1` con `git -C`. `Start-KitSession.ps1` deja `SDD_KIT_SESSION_ROOT`; un hook `SessionStart` del proyecto en PowerShell la compara con `CLAUDE_PROJECT_DIR` y avisa si no casan.

**Tech Stack**: PowerShell 7 + Pester ≥ 5; hooks de Claude Code (`.claude/settings.json`).

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Art. X de la constitution, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Las variables de git del helper son exactamente cinco: `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR`, `GIT_OBJECT_DIRECTORY`. Se borran con `Remove-Item Env:\<nombre>`, nunca con `SetEnvironmentVariable($n, $null)` (deja `""`).
- Un test nunca cambia el cwd; `git -C` siempre.
- No se tocan: `skills/` (ninguna skill, ni plantillas, ni `skills/sdd-templates/scripts/`), `hooks/` del plugin.

### De proceso

- Modelos: el más barato que resuelva bien; `fable` y `opus xhigh` prohibidos por defecto (cuenta compartida, `tech-stack.md`).
- Ejecución: `superpowers:subagent-driven-development`, secuencial.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, nunca title-only; nunca `--no-verify`. Cierre con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- La 0044 corre en paralelo: nada de `sdd-start-task`, `sdd-end-task`, `sdd-end-patch`, `plan-template`, `overrides-superpowers`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos funciones y un script de hook; sin módulo ni configuración.
- [x] **YAGNI gate**: el helper tiene cuatro usuarios reales desde el primer día.
- [x] **Brownfield gate**: sigue el patrón de `Resolve-Bash.ps1` y de `Hook.Tests.ps1`; sin refactor fuera de los cuatro tests.
- [x] **Constitution check**: Art. I proporcional (sin skill editada, evidencia Pester), Art. III, Art. VI, Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/Clear-GitEnv.ps1` — `Clear-GitEnv` y `Restore-GitEnv`.
- `tests/Clear-GitEnv.Tests.ps1` — escenarios del helper.
- `tests/GitEnvConvention.Tests.ps1` — todo test con `git -C` usa el helper.
- `.claude/hooks/Test-KitSessionSource.ps1` — el hook.
- `tests/KitSessionSource.Tests.ps1` — escenarios del hook, del lanzador y del registro.

**Modificar**:

- `tests/Get-NextSddId.Tests.ps1`, `tests/Invoke-SddMerge.Tests.ps1`, `tests/Hook.Tests.ps1`, `tests/PathLength.Tests.ps1` — usan el helper.
- `Start-KitSession.ps1` — exporta y restaura `SDD_KIT_SESSION_ROOT`.
- `.claude/settings.json` — registra el hook.
- `.docs/sdd/architecture.md`, `.docs/sdd/tech-stack.md`, `CLAUDE.md` — nombran el helper y el hook.

**NO se tocan**:

- `skills/**` — ninguna pieza edita una skill; los scripts del kit viajan sin `tests/` y tienen su propia lista.
- `hooks/**` — hook del plugin publicado, distinto de este.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El hook del proyecto no se ejecuta en Windows por el intérprete | media | el aviso no sale | `"shell": "bash"` como el plugin; smoke en sesión real |
| Tildes rotas en el JSON | media | aviso ilegible | `EscapeNonAscii` (decisión 4) |
| Falso silencio por la variable que queda en la terminal | media | no avisa cuando toca | `try/finally` en el lanzador (decisión 3) |

### 1.8 Rollout

Directo: los hooks y el lanzador son del repo; nada viaja a los proyectos.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Helper `Clear-GitEnv.ps1` y migración de los tests

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `red-tests/Clear-GitEnv.Tests.ps1` y `red-tests/GitEnvConvention.Tests.ps1` de la carpeta de la spec, commiteados antes de despachar; el implementador los mueve a `tests/` con `git mv`.
**Superficies**: tooling · docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Clear-GitEnv.Tests.ps1,tests/GitEnvConvention.Tests.ps1,tests/PathLength.Tests.ps1,tests/Hook.Tests.ps1 -Output Detailed"`
**Verificación lenta**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Get-NextSddId.Tests.ps1,tests/Invoke-SddMerge.Tests.ps1 -Output Detailed"` (~4 min) — la lanza el hilo principal.

**Interfaces**:
- Consume: nada.
- Produce:
  - `Clear-GitEnv` → `[hashtable]`: clave = nombre de cada una de las cinco variables, valor = su valor previo o `$null` si no existía. Borra las cinco del proceso.
  - `Restore-GitEnv([hashtable]$Saved)`: para cada clave, si el valor no es `$null` lo repone; si es `$null`, deja la variable sin existir. Con `$Saved` en `$null` no hace nada ni falla.
  - Uso en un test: `. (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')` y `$script:SavedGitEnv = Clear-GitEnv` en `BeforeAll`; `Restore-GitEnv $script:SavedGitEnv` en `AfterAll`.

**Ficheros**: crear `tests/Clear-GitEnv.ps1`; mover `red-tests/*.Tests.ps1` → `tests/`; modificar los cuatro tests, `architecture.md`, `tech-stack.md`.

- [ ] **Step 1: Mover los tests RED** — `git mv .docs/sdd/specs/20260923-190542-task-0016-git-env-cache-warning/red-tests/Clear-GitEnv.Tests.ps1 tests/` y lo mismo con `GitEnvConvention.Tests.ps1`. Ejecutarlos: fallan (el helper no existe; los cuatro tests no lo usan).
- [ ] **Step 2: Helper** — `tests/Clear-GitEnv.ps1`:

```powershell
# Git exporta estas variables a sus hooks y ganan a `git -C`: heredadas del pre-commit, una fixture
# escribiría en el índice o en el repositorio del commit en curso.
$script:GitEnvNames = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY')

function Clear-GitEnv {
  $saved = @{}
  foreach ($name in $script:GitEnvNames) {
    $saved[$name] = [Environment]::GetEnvironmentVariable($name)
    Remove-Item -LiteralPath "Env:\$name" -ErrorAction SilentlyContinue
  }
  return $saved
}

function Restore-GitEnv([hashtable]$Saved) {
  if ($null -eq $Saved) { return }
  foreach ($name in $Saved.Keys) {
    if ($null -eq $Saved[$name]) { Remove-Item -LiteralPath "Env:\$name" -ErrorAction SilentlyContinue; continue }
    Set-Item -LiteralPath "Env:\$name" -Value $Saved[$name]
  }
}
```

- [ ] **Step 3: Migrar `Invoke-SddMerge.Tests.ps1`** — sustituir el bloque de `BeforeAll` que empieza en el comentario «Dentro del hook pre-commit git exporta GIT_INDEX_FILE…» (bucle con `GIT_PREFIX` incluido) por `. (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')` y `$script:SavedGitEnv = Clear-GitEnv`; en `AfterAll`, sustituir el `foreach` sobre `$script:SavedGitEnv.Keys` por `Restore-GitEnv $script:SavedGitEnv`.
- [ ] **Step 4: Migrar `Get-NextSddId.Tests.ps1`** — en `BeforeAll`, dot-source + `$script:SavedGitEnv = Clear-GitEnv`; `Invoke-GitIsolated` queda `function Invoke-GitIsolated([string]$Repo, [string[]]$GitArguments) { return (& git -C $Repo @GitArguments) }`, sin comentario; añadir `AfterAll { Restore-GitEnv $script:SavedGitEnv }`. El `It` «ignora las variables de entorno de git del proceso que lo invoca» no cambia.
- [ ] **Step 5: Migrar `Hook.Tests.ps1` y `PathLength.Tests.ps1`** — dot-source + `Clear-GitEnv` en su `BeforeAll` de fichero, antes del primer `git -C`; `Restore-GitEnv $script:SavedGitEnv` en `AfterAll` (añadirlo si no existe; en `PathLength` junto a la restauración de `OutputEncoding`).
- [ ] **Step 6: Docs** —
  - `architecture.md`, viñeta `<script>.Tests.ps1`: añadir «Todo `<script>.Tests.ps1` que ejecute git dot-sourcea `tests/Clear-GitEnv.ps1`, guarda `Clear-GitEnv` en `BeforeAll` y llama a `Restore-GitEnv` en `AfterAll`: dentro del pre-commit, git exporta `GIT_INDEX_FILE` y compañía, y una fixture de la task 0042 escribió en el índice del worktree real. Lo exige `tests/GitEnvConvention.Tests.ps1`.»
  - `tech-stack.md`, regla «Dentro de un hook de git, `git -C` no basta»: añadir al final «En los tests se hace con `tests/Clear-GitEnv.ps1`, que borra también `GIT_OBJECT_DIRECTORY`; lo exige `GitEnvConvention.Tests.ps1`.» En la trampa (8), añadir tras «…con `git read-tree HEAD`.»: «Desde la task 0016 lo cubre ese helper.»
- [ ] **Step 7: Verificación** — el comando de «Verificación»: todo verde.
- [ ] **Step 8: Commit** — `test(tests): helper Clear-GitEnv para aislar del entorno de git a todo test que ejecuta git` con cuerpo en castellano que nombre los cuatro tests migrados y el test de convención.

### Task 2 — Hook `SessionStart` del repo

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `red-tests/KitSessionSource.Tests.ps1`, commiteado antes de despachar; el implementador lo mueve a `tests/` con `git mv`.
**Superficies**: tooling · docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/KitSessionSource.Tests.ps1,tests/GitEnvConvention.Tests.ps1 -Output Detailed"`

**Interfaces**:
- Consume: nada de la Task 1.
- Produce:
  - `.claude/hooks/Test-KitSessionSource.ps1`: lee `SDD_KIT_SESSION_ROOT` y `CLAUDE_PROJECT_DIR` (si falta, `(Get-Location).Path`). Si las dos rutas casan tras normalizar (ruta completa, separadores a `/`, sin separador final, sin distinguir mayúsculas) no escribe nada. Si no, escribe una línea JSON y sale con 0 en todos los casos.
  - JSON: `{"systemMessage": <texto>, "hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": <texto>}}`, con `ConvertTo-Json -Compress -Depth 3 -EscapeHandling EscapeNonAscii`.

**Ficheros**: crear `.claude/hooks/Test-KitSessionSource.ps1`; mover `red-tests/KitSessionSource.Tests.ps1` → `tests/`; modificar `Start-KitSession.ps1`, `.claude/settings.json`, `CLAUDE.md`.

- [ ] **Step 1: Mover el test RED** — `git mv .docs/sdd/specs/20260923-190542-task-0016-git-env-cache-warning/red-tests/KitSessionSource.Tests.ps1 tests/`. Ejecutarlo: falla.
- [ ] **Step 2: Hook** — `.claude/hooks/Test-KitSessionSource.ps1`. Textos exactos:
  - `systemMessage` sin variable: `Las skills del kit de esta sesión no salen de la rama: se cargaron desde la caché del plugin. Si no lanzaste la sesión con ./Start-KitSession.ps1, sal y relánzala con él.`
  - `systemMessage` con otra carpeta: `Las skills del kit de esta sesión no salen de la rama: la sesión se lanzó con Start-KitSession.ps1 desde <SDD_KIT_SESSION_ROOT>, pero el proyecto es <carpeta del proyecto>. Relánzala con ./Start-KitSession.ps1 desde el proyecto.`
  - `additionalContext` (los dos casos): `Las skills sdd-kit:* de esta sesión no salen de la rama actual: vienen de la caché del plugin o de otra carpeta. Antes de ejecutar un paso de una skill cargada, contrasta su texto con skills/<nombre>/SKILL.md de la rama; si difieren, manda el de la rama.`
  - Funciones cortas (normalizar ruta, construir mensaje, escribir JSON); `exit 0` al final.
- [ ] **Step 3: Lanzador** — `Start-KitSession.ps1` queda:

```powershell
# Arranca Claude Code con las skills del working tree y el plugin publicado deshabilitado.
# Sin esto, el .claude/settings.json del repo activa sdd-kit@sdd-kit y las skills salen de la caché.
# Los argumentos extra pasan tal cual: ./Start-KitSession.ps1 --model sonnet
# SDD_KIT_SESSION_ROOT le dice al hook SessionStart del repo que la sesión salió de aquí; se restaura
# al salir para que un `claude` posterior en la misma terminal sí reciba el aviso.
$previousSessionRoot = $env:SDD_KIT_SESSION_ROOT
$env:SDD_KIT_SESSION_ROOT = $PSScriptRoot
try {
  claude --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir $PSScriptRoot @args
}
finally {
  if ($null -eq $previousSessionRoot) { Remove-Item -LiteralPath Env:\SDD_KIT_SESSION_ROOT -ErrorAction SilentlyContinue }
  else { $env:SDD_KIT_SESSION_ROOT = $previousSessionRoot }
}
```

- [ ] **Step 4: Registro** — `.claude/settings.json`, clave nueva `hooks` (el resto intacto):

```json
"hooks": {
  "SessionStart": [
    {
      "hooks": [
        {
          "type": "command",
          "command": "pwsh -NoProfile -File \"${CLAUDE_PROJECT_DIR}/.claude/hooks/Test-KitSessionSource.ps1\"",
          "shell": "bash"
        }
      ]
    }
  ]
}
```

- [ ] **Step 5: Docs** — `CLAUDE.md`, regla 2, tras «Por eso la sesión se arranca con `./Start-KitSession.ps1` (…)»: añadir «Si no sale de él, el hook `SessionStart` del repo (`.claude/hooks/Test-KitSessionSource.ps1`) lo avisa al arrancar.» `architecture.md`, árbol del repo: añadir bajo `hooks/` la línea `├── .claude/                     (settings.json del repo y hooks/Test-KitSessionSource.ps1: aviso de skills cargadas fuera de la rama)`.
- [ ] **Step 6: Verificación** — el comando de «Verificación»: todo verde.
- [ ] **Step 7: Commit** — `feat(hooks): avisar al arrancar cuando las skills del kit no salen de la rama`, cuerpo en castellano.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 2,5h
- Base de la estimación: 2 tasks con el código casi escrito; incertidumbre en cómo ejecuta Claude Code un hook de proyecto en Windows (smoke real).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"` (suite completa, `Slow` incluidos).
- [ ] Smoke del hook: sesión real con `claude` a secas en este worktree (aviso visible) y con `./Start-KitSession.ps1` (sin aviso).
- [ ] Smoke del helper: `git commit` con el pre-commit activo; `git status` limpio después, índice sin entradas ajenas.
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`).

---

## 4. Self-review (cobertura spec → tasks)

- Borra las variables de git → Task 1 (`Clear-GitEnv.Tests.ps1`). ✓
- Restaura lo que había → Task 1 (`Clear-GitEnv.Tests.ps1`). ✓
- Todo test que ejecuta git lo usa → Task 1 (`GitEnvConvention.Tests.ps1`). ✓
- La fixture no toca el índice heredado → Task 1, verificación lenta (`Invoke-SddMerge.Tests.ps1`). ✓
- Sesión con el script: silencio → Task 2. ✓
- Sesión sin el script: aviso → Task 2. ✓
- Sesión desde otro worktree: aviso → Task 2. ✓
- El lanzador deja la señal → Task 2. ✓
- El hook está registrado → Task 2. ✓
- Docs (`architecture.md`, `tech-stack.md`, `CLAUDE.md`) → Tasks 1 y 2. ✓

### Review Focus

- `Restore-GitEnv $null` (un `BeforeAll` que falla antes de `Clear-GitEnv`) no lanza excepción → test en `Clear-GitEnv.Tests.ps1`.
- Dot-sourcear el helper no borra nada → test en `Clear-GitEnv.Tests.ps1`.
- El test de convención no pasa en vacío si cambia el patrón → test «encuentra al menos los cuatro ficheros conocidos».
- `CLAUDE_PROJECT_DIR` con otra forma de la misma ruta (mayúsculas, `\` frente a `/`, separador final) → silencio; test en `KitSessionSource.Tests.ps1`.
- La variable no queda en la terminal tras `Start-KitSession.ps1` → test estructural del `finally`.
