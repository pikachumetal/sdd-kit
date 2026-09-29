---
id: 20260929-160116-feature-0109-pending-migration-notice
feature: 0109
title: Plan de implementación — Aviso de migraciones pendientes al arrancar
spec: ./spec.md
status: approved
created: 2026-09-29
---

# Plan de implementación — Aviso de migraciones pendientes al arrancar

## Decisiones que he tomado yo — valida estas

1. **Dos tasks, no tres** — la campaña de cada pieza va dentro de su task (Task Right-Sizing de `writing-plans`): la migración vacía con su RED/GREEN de sujeto, y el aviso del hook con sus tests Pester y su sesión headless.
2. **Ejecución Native** — dos tasks pequeñas y secuenciales, sin interfaces compartidas salvo la carpeta de migraciones; un error enviado cuesta poco y lo caza la revisión final.
3. **Modelos** — la sesión implementa (Opus, elegido por el dev-lead al aprobar sin bajar de gama); sujetos de la migración en Sonnet (`MODEL=sonnet`, el del lanzador), sujeto del hook en Haiku (molde del patch 0100, ~0,03 $); revisor final `sdd-kit:effort-high` + `opus`.
4. **El guard va en `tests/MigrationInitParity.Tests.ps1`** — ya resuelve `$script:MigrationsDir` y es donde vive la regla de las migraciones; sin tag `Slow` (lee dos ficheros), así corre en el pre-commit del bump.
5. **El test de «falta la carpeta» usa una copia mínima del kit** (`hooks/`, `.claude-plugin/plugin.json`, `skills/using-sdd/`) en `TEMP`, pasada como `CLAUDE_PLUGIN_ROOT`: la raíz real siempre tiene la carpeta.
6. **Coste estimado** — ~1,5 h de reloj; campaña ~1,5 $ (techo 5 sujetos o 4 $, el de la spec); revisor final ~130k tokens.

**Goal**: que cada release del kit lleve su `migrations/vX.Y.Z.md` y que la sesión avise cuando el marcador del proyecto va por detrás de la mayor migración del kit cargado.

**Architecture**: un test Pester ata la versión de `plugin.json` a su fichero de migración; `v2.1.0.md` cubre la release que faltaba. El hook `session-start`, que ya lee el marcador y compara por SemVer, busca la mayor `v*.md` de la carpeta de migraciones junto a sí mismo y antepone un segundo aviso.

**Tech Stack**: bash (`hooks/session-start`, `set -euo pipefail`), Pester 5 en pwsh 7, sujetos headless con `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks pequeñas y secuenciales. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes. El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad, que es Minor.
- Toda lectura opcional de `hooks/session-start` se protege con `[ -f ]` o `[ -d ]`; cada rama nueva lleva su test de «falta el fichero» en `tests/Hook.Tests.ps1`.
- Todo test que lance procesos (`bash`, `pwsh`) lleva `-Tag 'Slow'`.
- `hooks/session-start` se guarda con LF y modo `100755`.
- Texto exacto del aviso: `AVISO sdd-kit: el proyecto tiene aplicado el kit <marcador> (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la <mayor>. Para aplicarlas, pide «ponme el proyecto al día con sdd-init-brownfield».`

### De proceso

- Política de modelos de la constitution (Art. IV): modelo y effort explícitos al despachar; `fable` y `opus xhigh` prohibidos por defecto.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- El gate completo se lanza desde la herramienta PowerShell, no desde Git Bash.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el hook reutiliza `json_version` y `version_lt`; el guard es un `It`.
- [x] **YAGNI gate**: sin helpers compartidos nuevos; el orden por SemVer del `README.md` de migraciones queda fuera.
- [x] **Constitution check**: Art. I (campaña en cada task), Art. V (la regla cambia aquí), Art. X (restricciones de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-init-brownfield/references/migrations/v2.1.0.md` — migración «sin cambios en el proyecto».
- `.docs/sdd/specs/<esta carpeta>/red/`, `green/` — `subject.sh`, molde y salidas de la campaña.
- `tests/pending-migration-notice-red.md`, `tests/pending-migration-notice-green.md` — evidencia.

**Modificar**:

- `hooks/session-start` — segundo aviso.
- `tests/Hook.Tests.ps1` — tests del aviso nuevo.
- `tests/MigrationInitParity.Tests.ps1` — guard de la versión de `plugin.json`.
- `.docs/sdd/constitution.md` (Art. V), `CLAUDE.md` (regla 4) — toda release escribe su migración.
- `README.md` (línea 139), `.docs/sdd/tech-stack.md` (bullet «Aviso de versión del kit») — el segundo aviso.

**NO se tocan**:

- `skills/sdd-end-release/` — decisión con el dev-lead en la spec.
- `skills/sdd-init-greenfield/`, `skills/sdd-init-brownfield/SKILL.md`, `references/generacion.md`, `references/migrations/README.md` — ya dicen «la mayor de `migrations/`».
- `.docs/sdd/sdd-kit.json` del repo — migrar el propio kit queda fuera.

### 1.3 Migraciones

`v2.1.0.md` sigue la forma de `v1.1.0.md`: título, a quién aplica, «sin cambios en el proyecto», línea `**Escribe**:` y `## Verificación`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El glob `v*.md` sin coincidencias devuelve el literal y `json_version`/`version_lt` lo procesa | media | el hook aborta con `set -e` | `[ -f "$f" ] \|\| continue` en el bucle y test de carpeta vacía o ausente |
| El RED de la migración no falla (el sujeto sube el marcador a 2.1.0 leyendo `plugin.json`) | baja | la guidance no tiene RED | se registra como hallazgo; `v2.1.0.md` se escribe igual, porque el marcador lo exige el procedimiento |

### 1.8 Rollout

Directo, en la próxima release (el bump de esa release ya exige su migración por el guard).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Cada release lleva su migración

**Modelo**: la sesión (Native). Sujetos: `MODEL=sonnet` por `tests/headless/run.sh`.
**Tests RED**: Native, TDD del propio hilo · `tests/MigrationInitParity.Tests.ps1` (guard) y sujeto RED de la migración, los dos antes de crear `v2.1.0.md`.
**Superficies**: tooling · docs · skill (`migrations/`)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/MigrationInitParity.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: en un proyecto en `2.0.0`, «ponme el proyecto al día con sdd-init-brownfield» deja `sdd-kit.json` en `2.1.0` y el commit `chore(sdd): migrar al kit v2.1.0`, sin tocar nada más.

**Interfaces**:
- Consume: nada.
- Produce: `skills/sdd-init-brownfield/references/migrations/v2.1.0.md`, la mayor migración que lee la Task 2.

**Ficheros**: crear `v2.1.0.md`; modificar `tests/MigrationInitParity.Tests.ps1`, `.docs/sdd/constitution.md`, `CLAUDE.md`.

- [ ] **Step 1: Guard RED** — en `tests/MigrationInitParity.Tests.ps1`, `Describe 'Cada versión del kit tiene su migración'` con `It 'la versión de plugin.json tiene su migrations/v<versión>.md'`: lee `.claude-plugin/plugin.json` con `ConvertFrom-Json`, y `Join-Path $script:MigrationsDir "v$version.md" | Should -Exist`. Ejecutar: falla con `v2.1.0.md` inexistente.
- [ ] **Step 2: Sujeto RED** — `red/subject.sh` sobre `tests/headless/lib.sh`, escenario `m1`: molde de proyecto mínimo con `.docs/sdd/` (constitution, roadmap y `sdd-kit.json` a `2.0.0` con `ids`, `control`, `merge` y `execution` completos, `.claude/settings.json` y `.gitignore` como tras una init 2.0.0), git con un commit; kit copiado sin `v2.1.0.md`, `plugin.json` en `2.1.0`; `ASK="Ponme el proyecto al día con sdd-init-brownfield. Sin dev-lead: no esperes respuestas."`. Lanzar con `run.sh`, `SUBJECT_CAP=5`, `COST_CAP=4`. Esperado RED: marcador sigue en `2.0.0` («ya al día») o sube leyendo `plugin.json` fuera del procedimiento; registrarlo en `tests/pending-migration-notice-red.md`.
- [ ] **Step 3: `v2.1.0.md`** — título `# Migración a v2.1.0 — sin cambios en el proyecto`; texto: la release 2.1.0 no cambia nada del proyecto y la migración solo avanza el marcador; `**Escribe**: \`sdd-kit.json\` → \`version\`, \`channel\`, \`updated\`.`; `## Verificación`: `.docs/sdd/sdd-kit.json` declara `"version": "2.1.0"`.
- [ ] **Step 4: Art. V y `CLAUDE.md`** — Art. V: «Toda release escribe además `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`: con pasos-predicado y verificación si cambia la estructura de `.docs/sdd/` o retira algo del proyecto, y con «sin cambios en el proyecto» si no; `tests/MigrationInitParity.Tests.ps1` falla si la versión de `plugin.json` no tiene su fichero.» Regla 4 de `CLAUDE.md`: añadir «+ su `migrations/vX.Y.Z.md`, vacío si no cambia nada del proyecto».
- [ ] **Step 5: Verificación** — el comando de «Verificación»: todo verde, incluido el guard y la paridad con `v2.1.0.md`.
- [ ] **Step 6: Sujeto GREEN** — `green/subject.sh` (el mismo molde, kit con `v2.1.0.md`), escenario `m1`. Esperado: `sdd-kit.json` con `version` `2.1.0` y `updated` del día, `git diff --stat HEAD~1` solo con `sdd-kit.json`, commit `chore(sdd): migrar al kit v2.1.0`. Evidencia en `tests/pending-migration-notice-green.md`.
- [ ] **Step 7: Commit de la task** — `feat(migration): cada release lleva su migración, con v2.1.0 sin cambios`.

### Task 2 — Aviso de migraciones pendientes en el hook

**Modelo**: la sesión (Native). Sujeto: Haiku, `claude -p` con `--plugin-dir` (molde del patch 0100).
**Tests RED**: Native, TDD del propio hilo · `tests/Hook.Tests.ps1`.
**Superficies**: tooling (hook) · docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Hook.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: una sesión de Claude Code en un proyecto con `sdd-kit.json` a `2.0.0` y el kit de la rama muestra «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 … hasta la 2.1.0 …» al arrancar (en este repo, con el marcador en `2.0.0`, lo verá el dev-lead al abrir sesión con `Start-KitSession.ps1`).

**Interfaces**:
- Consume: `v2.1.0.md` de la Task 1 (mayor migración).
- Produce: nada que usen otras tasks.

**Ficheros**: modificar `hooks/session-start`, `tests/Hook.Tests.ps1`, `README.md`, `.docs/sdd/tech-stack.md`.

- [ ] **Step 1: Tests RED** — en `Describe 'hooks/session-start'`, con `$script:LatestMigration` calculada en `BeforeAll` como la mayor `[version]` de `skills/sdd-init-brownfield/references/migrations/v*.md`; `Invoke-SessionStart` gana un parámetro opcional `[string]$PluginRoot` (por omisión `$script:KitRoot`). Todos `-Tag 'Slow'`:
  - `It 'avisa de migraciones pendientes con las dos versiones y la frase de migrar'`: proyecto `2.0.0`; en `systemMessage` y en `additionalContext`: `Should -Match 'el proyecto tiene aplicado el kit 2\.0\.0'`, `Should -Match ('migraciones hasta la ' + [regex]::Escape($script:LatestMigration))`, `Should -Match 'ponme el proyecto al día con sdd-init-brownfield'`; y `additionalContext` `Should -Match 'name: using-sdd'`.
  - `It 'no avisa de migraciones con el proyecto al día o sin sdd-kit.json'`: con `$script:LatestMigration` y `$null`, `Output | Should -Not -Match 'migraciones hasta'` y sigue `name: using-sdd`.
  - `It 'no avisa ni se cae sin carpeta de migraciones en el kit cargado'`: copia en `TEMP` de `hooks/`, `.claude-plugin/plugin.json` y `skills/using-sdd/`, proyecto `2.0.0`, `-PluginRoot` a la copia; `ExitCode | Should -Be 0`, sin `migraciones hasta`, con `name: using-sdd`.
  Ejecutar: el primero falla; los otros dos pueden pasar ya (se registran como control).
- [ ] **Step 2: Hook** — en `hooks/session-start`, `latest_migration <dir>`: `[ -d "$1" ] || return 0`, recorre `"$1"/v*.md` con `[ -f "$f" ] || continue`, quita `v` y `.md` del nombre y guarda la mayor con `version_lt`; imprime la mayor o nada. Después del aviso de versión, si `wanted` y `latest` no están vacíos y `version_lt "$wanted" "$latest"`, antepone el texto exacto de las Restricciones al contexto y lo añade al `systemMessage` (si ya hay uno, los dos avisos separados por una línea en blanco).
- [ ] **Step 3: Verificación** — el comando de «Verificación»: todo verde; `git ls-files -s hooks/session-start` sigue en `100755` y el fichero sin CR.
- [ ] **Step 4: Docs** — `README.md` línea 139: «Si el proyecto va por detrás del kit instalado, la sesión te avisa al arrancar con las dos versiones.» `tech-stack.md`, bullet «Aviso de versión del kit»: el mismo hook avisa también cuando el marcador es menor que la mayor `v*.md` de `migrations/` del kit cargado, con enlace a [`migration`](capabilities/migration.md), sin copiar el texto del aviso.
- [ ] **Step 5: Sujeto GREEN del hook** — copia del kit de la rama en el scratchpad, proyecto con `sdd-kit.json` a `2.0.0`, `claude -p --model haiku --plugin-dir <copia> --setting-sources ""` con superpowers, petición «¿Qué hace la skill sdd-consult? Responde en una frase.». Esperado: el `hook_response` trae el aviso en `systemMessage`; el sujeto no invoca `sdd-init-brownfield` ni edita `sdd-kit.json`. Salida y veredicto en `green/` y en `tests/pending-migration-notice-green.md`.
- [ ] **Step 6: Commit de la task** — `feat(hook): avisar al arrancar de migraciones pendientes del proyecto`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 1–1,5h (condicionada al RED de la migración)
- Base de la estimación: 2 tasks; hook ~20 líneas con patrón del patch 0100; 3 sujetos en paralelo (≈10 min de redacción por evidencia, tercer aviso de `estimation.md`)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre desde la herramienta PowerShell: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`
- [ ] Criterios de la spec: los tres requisitos del delta de `migration` con su evidencia
- [ ] Cierre con `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Cada release lleva su migración» (fichero + suite falla sin él) → Task 1, Steps 1, 3, 4. ✓
- ADDED «Una migración sin cambios solo avanza el marcador» → Task 1, Steps 2 y 6. ✓
- ADDED «La sesión avisa cuando el proyecto tiene migraciones pendientes»: aviso al usuario y al agente → Task 2 Step 1 (primer test) y Step 5; no migra solo → Task 2 Step 5; sin aviso al día, sin marcador o sin carpeta → Task 2 Step 1. ✓
- Regla «Avisos» → fusión en el cierre. ✓
- Decisiones 7 (el repo ve el aviso) y 8 (campaña) → Task 2 «Se prueba en la aplicación» y Steps de sujetos. ✓
