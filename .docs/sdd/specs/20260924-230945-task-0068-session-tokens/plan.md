---
id: 20260924-230945-task-0068-session-tokens
task: 0068
title: Plan de implementación — Tokens y coste de la sesión desde los transcripts de Claude Code
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Tokens y coste de la sesión desde los transcripts de Claude Code

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native.** Son tres tasks en serie y el hilo ya tiene el formato real de los transcripts en contexto. El revisor final va con Opus y effort high (Art. IV).
2. **Las fixtures se versionan** en `tests/fixtures/session-tokens/`, calcadas de la forma real de una línea `assistant` y sin datos de la máquina: ids `msg_A`…, rutas sintéticas y sin `cwd`. Los tests las copian a una carpeta `projects` de `TestDrive`, con el nombre que sale de la ruta del worktree de prueba (architecture: las fixtures de los scripts son el contrato del formato).
3. **Las cifras se formatean con cultura invariante y se cambia el separador** (`#,0` → `.` de miles; `0.00` → `,` decimal). No uso `es-ES`, porque su agrupación depende de ICU en cada sistema (portabilidad).
4. **La columna nueva cambia las filas esperadas de los tests del log.** Cada fila gana ` | —` antes de la carpeta. Es una actualización mecánica dentro del RED de la Task 2, no un cambio de conducta.
5. **La campaña reutiliza el molde `salas` de la 0060** (`closing_state`), copiado a `red/` de esta carpeta, con un escenario nuevo, `w2`: cierre con validación dada, rellenar la sección 2 del walkthrough y parar. El sujeto headless corre en el scratchpad y se mide a sí mismo: en el GREEN, el script encuentra de verdad sus transcripts.
6. **Coste**: ~3,5 h de hilo; sujetos ~3,5 $ (techo 6 $); revisor final ~120k tokens.

**Goal**: que el cierre mida los tokens del hilo y de los subagentes, y su coste en dólares, a partir de los transcripts de Claude Code, y que el log lo acumule.

**Architecture**: un script de solo lectura (`Measure-SessionTokens.ps1`) que agrupa por `message.id` las líneas `assistant` de los transcripts del worktree y aplica la tabla `pricing` de `sdd-kit.json`. `Build-EstimationLog.ps1` lee la línea nueva `Coste de la sesión` con su parser de dinero. El paso 2 de `sdd-end-task` y `walkthrough-template.md` hacen que el cierre lo ejecute.

**Tech Stack**: PowerShell 7 portable y Pester 5 (`tests/*.Tests.ps1`); sujetos `claude -p --model sonnet` con `red/run.sh`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son tres tasks cortas en serie y el formato del transcript ya está en el contexto del hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de skill y de fichero en inglés kebab-case (Art. III).
- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible (Art. X).
- Sin comentarios que citen documentos: ni la constitution, ni una spec, ni una task, ni un requisito, ni `capabilities/` (Art. X).
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell (Art. X).
- PowerShell 7 portable: sin APIs exclusivas de Windows (rutas con `\` fijas, `cmd.exe`, el registro); rutas con `Join-Path`.
- Las fixtures no llevan datos reales de la máquina ni el nombre de usuario.
- Un test que ejecute git dot-sourcea `tests/Clear-GitEnv.ps1`; estos tests no ejecutan git.
- Ningún `.md` de `skills/` lleva caracteres de control: escribir con la herramienta de edición.
- No se tocan `skills/sdd-start-task/references/control-profiles.md`, `skills/sdd-init-*`, `migrations/`, `skills/sdd-end-release/`, `skills/sdd-config/` ni `.docs/sdd/capabilities/` (la fusión del delta la hace el cierre tras integrar `develop`).

### De proceso

- Native: el hilo principal (Opus 5.5) ejecuta las tasks; el revisor final, `subagent_type: sdd-kit:effort-high` + `model: opus`.
- Sujetos Sonnet headless con `red/run.sh`: `COST_CAP=6`, `SUBJECT_CAP=4`; la parada se pide con `touch red/stop`.
- Commits bilingües (tipo/scope en inglés, cuerpo en castellano) con la línea `Co-Authored-By` de la sesión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script, una clave de configuración y una columna; nada más.
- [x] **YAGNI gate**: sin parámetros de fecha, sin búsqueda de carpetas truncadas por longitud y sin salida en objetos: el cierre solo necesita las tres líneas.
- [x] **Constitution check**: Art. I (Pester en RED y campaña proporcional con previsión y techo), Art. III, Art. V (sin migración: la clave es opcional), Art. VIII, Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/Measure-SessionTokens.ps1` — la medición.
- `tests/Measure-SessionTokens.Tests.ps1` — contrato de los escenarios del script.
- `tests/fixtures/session-tokens/` — transcripts sintéticos: `base/s1.jsonl`, `base/s1/subagents/agent-x1.jsonl` y `.meta.json`, `other-branch/s2.jsonl`, `fast/s3.jsonl`.
- `tests/SessionTokensClose.Tests.ps1` — literales del paso del cierre y de la plantilla.
- `tests/session-tokens-red.md`, `tests/session-tokens-green.md` — evidencia de la campaña.
- `.docs/sdd/specs/20260924-230945-task-0068-session-tokens/red/` — `run.sh`, `subject.sh`, `mold.sh` y `out/`, y `green/out/`.

**Modificar**:

- `skills/sdd-templates/scripts/Build-EstimationLog.ps1` — etiqueta `Coste de la sesión`, «sin precio» como ausencia declarada, columna `Sesión ($)` y suma por release.
- `tests/Build-EstimationLog.Tests.ps1` y `tests/fixtures/estimation-log/` — filas con la columna nueva y casos nuevos.
- `skills/sdd-templates/templates/walkthrough-template.md` — líneas `Tokens del hilo`, `Tokens de subagentes` y `Coste de la sesión`.
- `skills/sdd-end-task/SKILL.md` — paso 2: ejecutar el script.
- `.docs/sdd/sdd-kit.json` — clave `pricing` con los precios de la spec.

**NO se tocan**:

- `skills/sdd-config/SKILL.md` — la pregunta de `pricing` queda como deuda (decisión 13 de la spec).
- `skills/sdd-templates/templates/kit-feedback-template.md` y `skills/sdd-end-patch/` — fuera de Scope; deuda.
- `.docs/sdd/capabilities/estimation.md` — la toca la 0067; se fusiona al cerrar.

### 1.6 Dependencias

- Formato de los transcripts de Claude Code (`~/.claude/projects/`), no documentado como contrato público: si cambia, fallan los tests con fixtures nuevas y el cierre dice «no medido» o cifras parciales.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Claude Code cambia el formato del transcript | media | medio | Las fixtures fijan el formato leído; el script ignora las líneas que no entiende en vez de abortar |
| La carpeta se trunca en rutas largas (>200 caracteres) | baja | bajo | Sale «no medido» con la ruta: honesto, no inventa |
| El baseline del RED no exhibe el fallo | muy baja | bajo | La plantilla vigente ordena «no medido»; si aun así mide, se recorta la guidance (Art. I) |

### 1.8 Rollout

Directo, con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Script de medición y precios del repo

**Modelo**: hilo principal (Native), Opus 5.5.
**Tests RED**: hilo principal · `tests/Measure-SessionTokens.Tests.ps1` y sus fixtures, antes del script; copia en el scratchpad.
**Superficies**: tooling.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Measure-SessionTokens.Tests.ps1 -Output Detailed"`; y `pwsh -NoProfile -File skills/sdd-templates/scripts/Measure-SessionTokens.ps1 -Branch feature/0068-session-tokens` sobre este worktree (smoke real).
**Se prueba en la aplicación**: el dev-lead ejecuta `pwsh -NoProfile -File skills/sdd-templates/scripts/Measure-SessionTokens.ps1 -Branch feature/0068-session-tokens` en el worktree y ve la tabla por modelo y las tres líneas, con `Coste de la sesión` en dólares.

**Interfaces**:
- Consume: nada.
- Produce: `Measure-SessionTokens.ps1 [-Path <worktree>] [-Branch <rama>] [-ProjectsRoot <dir>]` (defaults: directorio actual, sin filtro, `~/.claude/projects`). Imprime una tabla Markdown `| Ámbito | Modelo | Entrada | Escritura 5m | Escritura 1h | Lectura | Salida | Total | Coste ($) |` y, debajo, tres líneas:
  - `- Tokens del hilo: <total> — <modelo> <n>; …` (modelos por tokens, de más a menos)
  - `- Tokens de subagentes: <total> en <n> despacho[s] — <description> <modelo> <tokens> / <min> min; …` | `- Tokens de subagentes: no aplica`
  - `- Coste de la sesión: <X> $ (hilo <a> $ + subagentes <b> $)` | `(hilo <a> $)` sin subagentes | `sin precio (sin tabla pricing en sdd-kit.json)` | `sin precio (modelos sin precio: <m1>, <m2>)`
  - Sin carpeta: las tres con `no medido (sin transcripts de Claude Code para <ruta>)`; con carpeta y sin respuestas de la rama: `no medido (sin respuestas de <rama> en los transcripts)`. Código de salida 0.
- Clave `pricing` en `<Path>/.docs/sdd/sdd-kit.json`: `{"source", "updated", "usdPerMillionTokens": {"<modelo>": {"input", "cacheWrite5m", "cacheWrite1h", "cacheRead", "output"}}}`.

**Reglas de lectura** (de la spec):
- Carpeta: `[IO.Path]::GetFullPath($Path)`, sin separador final, con cada carácter no `[A-Za-z0-9]` cambiado por `-`.
- Hilo: `<carpeta>/*.jsonl`. Subagentes: `<carpeta>/*/subagents/agent-*.jsonl`, con `description` de `agent-*.meta.json`; un despacho por fichero, su modelo es el de más tokens y sus minutos van de la primera a la última línea contada (`timestamp`).
- Cuenta una línea con `type: assistant` y `message.usage`, cuyo `message.model` no es `<synthetic>` y, con `-Branch`, cuyo `gitBranch` coincide. Una línea que no es JSON válido se ignora.
- Clave de la respuesta: `message.id`, o `uuid` si falta. De cada clave, el máximo de cada categoría.
- Categorías: `input` = `input_tokens`; `cacheWrite1h` = `cache_creation.ephemeral_1h_input_tokens`; `cacheWrite5m` = `cache_creation.ephemeral_5m_input_tokens`, o `cache_creation_input_tokens` si falta `cache_creation`; `cacheRead` = `cache_read_input_tokens`; `output` = `output_tokens`.
- Modelo: `message.model`, con `:fast` si `usage.speed` es `fast`.
- Coste: tokens × precio / 1.000.000 por categoría. «sin precio» si falta la tabla o si un modelo con tokens no tiene fila, o le falta la categoría que tiene tokens.
- Formato: tokens `#,0` invariante con `,`→`.`; dinero `0.00` invariante con `.`→`,`.

**Ficheros**: crear el script, el test y las fixtures; modificar `.docs/sdd/sdd-kit.json`.

- [ ] **Step 1: Fixtures y tests RED.** Fixtures calcadas de la forma real (cada línea con `type`, `uuid`, `timestamp`, `gitBranch`, `isSidechain` y `message` con `id`, `model`, `stop_reason` y `usage`), con los datos de la spec:
  - `base/s1.jsonl`: `msg_A` en tres líneas (entrada 2, `cache_creation` 1h 100.000 y 5m 0, lectura 1.000.000, salida 8, 8 y 4.000), `msg_B` (entrada 3, lectura 1.500.000, salida 1.000, sin `cache_creation`) y una línea `<synthetic>` con usage a cero; todas en `feature/0068`, más una línea `user` y una línea que no es JSON.
  - `base/s1/subagents/agent-x1.jsonl`: una respuesta `msg_X` de `claude-opus-5-5` (entrada 10, lectura 500.000, salida 10.000) en dos líneas, a las 10:00:00 y a las 10:12:00; `agent-x1.meta.json` con `{"agentType":"sdd-kit:effort-high","description":"Revisión final de rama","model":"opus"}`.
  - `other-branch/s2.jsonl`: `msg_C` de `claude-sonnet-5` (lectura 900.000) en `develop`.
  - `fast/s3.jsonl`: una respuesta de `claude-sonnet-5` con `usage.speed: "fast"` (salida 100).
  - Los tests, uno por THEN: el total 2.605.005 del hilo y cada categoría de la fila de `claude-sonnet-5`; sin `<synthetic>`; la línea de subagentes; los tokens del subagente fuera del hilo; `Coste de la sesión: 1,25 $ (hilo 0,95 $ + subagentes 0,30 $)`; «sin precio» sin la clave y con un modelo ausente (nombrándolo); `claude-sonnet-5:fast` sin fila → «sin precio» que lo nombra; `-Branch` 2.605.005 frente a 3.505.005 sin filtro; sin carpeta → las tres «no medido» con código 0; rama sin respuestas → «no medido (sin respuestas de …)»; sin subagentes → `no aplica` y `(hilo 0,95 $)`.
  - Guardar una copia de los tests en el scratchpad.
- [ ] **Step 2: RED.** `Invoke-Pester -Path tests/Measure-SessionTokens.Tests.ps1`. Esperado: fallan todos (no existe el script).
- [ ] **Step 3: Script** con las reglas de arriba, en funciones de ≤ 20 líneas.
- [ ] **Step 4: GREEN.** Mismo comando, todo verde; `git diff --no-index` de los tests contra la copia: sin cambios que no sean de formato.
- [ ] **Step 5: Precios del repo** en `.docs/sdd/sdd-kit.json`, con la tabla de la decisión 12 de la spec y `source` «skill claude-api de Claude Code 2.1.282 (tabla de modelos, caché 2026-06-24; multiplicadores de shared/prompt-caching.md). Opus 5.5 figura como launching: revisar en el lanzamiento», `updated` `2026-09-25`. Smoke real sobre este worktree: cifras plausibles y coste en dólares.
- [ ] **Step 6: Commit de la task.**

### Task 2 — La columna `Sesión ($)` en el log

**Modelo**: hilo principal (Native), Opus 5.5.
**Tests RED**: hilo principal · `tests/Build-EstimationLog.Tests.ps1` y una fixture nueva, antes del cambio; copia en el scratchpad.
**Superficies**: tooling.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Build-EstimationLog.Tests.ps1 -Output Detailed"`.
**Se prueba en la aplicación**: el dev-lead ejecuta `pwsh -NoProfile -File skills/sdd-templates/scripts/Build-EstimationLog.ps1 -Root .` y ve la columna `Sesión ($)` en la tabla principal y en la tabla por release (con `—` en las tasks anteriores).

**Interfaces**:
- Consume: la línea `- Coste de la sesión: <X> $ (…)` | `sin precio (…)` | `no medido (…)` que produce la Task 1.
- Produce: la tabla principal `| Fecha | Task | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Sesión ($) | Carpeta |` y la tabla por release `| Release | Artefactos | Horas reales | Mediana | Sujetos ($) | Sesión ($) |`.

**Ficheros**: modificar `Build-EstimationLog.ps1`, sus tests y `tests/fixtures/estimation-log/`.

- [ ] **Step 1: Tests RED.** Filas esperadas de los tests existentes con ` | —` antes de la carpeta. Casos nuevos en una fixture `sesion/`: un walkthrough con `Coste de la sesión: 1,25 $ (hilo 0,95 $ + subagentes 0,30 $)` → celda `1.25`; otro con `sin precio (sin tabla pricing en sdd-kit.json)` → `sin precio`; otro con `no medido (…)` → `no medido`; uno sin la línea → `—`. En la fixture con changelog, la cabecera de la tabla por release con `Sesión ($)` y la suma de la release (y `—` en una release sin cifras). Copia en el scratchpad.
- [ ] **Step 2: RED.** Esperado: fallan las filas y la cabecera.
- [ ] **Step 3: Implementación.** Etiqueta `$script:SessionCostLabel = 'Coste de la sesi[oó]n'`; `Get-DeclaredAbsence` reconoce `sin precio`; `Read-CostFields` añade `SessionCost = ConvertTo-Money (...)`; la fila y `Format-Log` llevan la columna; `Get-SubjectSum` se generaliza a `Get-CostSum([object[]]$Rows, [string]$Field)` para `SubjectCost` y `SessionCost`; `Add-ReleaseRow` y `Add-ReleaseTable` llevan la columna.
- [ ] **Step 4: GREEN** y comparación de los tests con la copia.
- [ ] **Step 5: Commit de la task.**

### Task 3 — El cierre mide la sesión (guidance con RED/GREEN)

**Modelo**: hilo principal (Native), Opus 5.5; sujetos Sonnet headless.
**Tests RED**: hilo principal · la campaña RED (2 sujetos, escenario `w2`) sobre las skills vigentes antes de editar, y `tests/SessionTokensClose.Tests.ps1` (literales) antes del texto; copia en el scratchpad.
**Superficies**: docs (skills) y evidencia.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/SessionTokensClose.Tests.ps1,tests/Skills.Tests.ps1 -Output Detailed"`; la campaña GREEN (2 sujetos).
**Se prueba en la aplicación**: no, porque es guidance de una skill: se prueba con la campaña GREEN y en el cierre de esta misma task, donde la sección 2 del walkthrough sale del script.

**Interfaces**:
- Consume: el script de la Task 1 (su ruta relativa al Base directory de `sdd-templates`: `scripts/Measure-SessionTokens.ps1`) y las tres líneas que imprime.
- Produce: el paso 2 de `sdd-end-task` y las líneas de la plantilla.

**Ficheros**: `red/` y `green/out/` de la carpeta de la task, `tests/session-tokens-red.md` y `-green.md`, `tests/SessionTokensClose.Tests.ps1`, `walkthrough-template.md` y `sdd-end-task/SKILL.md`.

- [ ] **Step 1: Molde y lanzador.** Copiar `run.sh`, `subject.sh` y `mold.sh` de la 0060 a `red/`, con el escenario `w2`: el estado `closing_state` (validación ya dada) y el encargo «Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012. El dev-lead validó: «probé `libres 10-12` y `reservar Norte 10-12` y funcionan». Escribe el walkthrough (pasos 1 y 2) y para ahí, sin merge ni roadmap». `COST_CAP=6`, `SUBJECT_CAP=4`, parada con `red/stop`. Previsión declarada: 4 sujetos, ~30 min, ~3,5 $.
- [ ] **Step 2: RED.** 2 sujetos con una copia del kit de `HEAD` (`git archive`). Se registran en `tests/session-tokens-red.md` las líneas `Tokens del hilo`, `Tokens de subagentes` y el coste, si se ejecutó algún script y las frases textuales. Esperado: «no medido» en el hilo y sin coste de la sesión.
- [ ] **Step 3: Test de literales RED.** `tests/SessionTokensClose.Tests.ps1`: el paso 2 de `sdd-end-task` nombra `scripts/Measure-SessionTokens.ps1`, `-Branch` y «no medido» fuera de Claude Code; la plantilla lleva `Coste de la sesión:` y ya no dice «el agente no tiene contador expuesto». Esperado: falla.
- [ ] **Step 4: Texto.** Plantilla: `Tokens del hilo`, `Tokens de subagentes` y `Coste de la sesión` salen de `Measure-SessionTokens.ps1 -Path <worktree> -Branch <rama de la task>`, del Base directory de `sdd-templates`; fuera de Claude Code, «no medido (sin transcripts de Claude Code)». Paso 2 de `sdd-end-task`: ejecutar el script y pegar sus tres líneas, sin editar la cifra; lo anterior a la rama no se cuenta y se dice.
- [ ] **Step 5: GREEN.** 2 sujetos con una copia del kit del commit de trabajo; `tests/session-tokens-green.md` con el veredicto por sujeto contra el RED. Si no pasa y la tanda de REFACTOR supera el techo, para y decide el dev-lead.
- [ ] **Step 6: Commit de la task.**

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 3,5 h
- Base de la estimación: tres tasks; el script es nuevo pero de un solo formato, ya inspeccionado; la Task 2 es la 0046 en pequeño; la campaña, un escenario con molde reutilizado.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`.
- [ ] Smoke: `Measure-SessionTokens.ps1 -Branch feature/0068-session-tokens` sobre este worktree y `Build-EstimationLog.ps1 -Root .` con la fila de la 0068 tras el walkthrough.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`), integrando `develop` antes de fusionar el delta en `capabilities/estimation.md`, y fila de deuda para la pregunta de `pricing` en `sdd-config`.

---

## 4. Self-review (cobertura spec → tasks)

- La sesión se mide desde los transcripts → Task 1. ✓
- Los subagentes se miden aparte del hilo → Task 1. ✓
- El coste sale de la tabla de precios del proyecto (incluye fast) → Task 1. ✓
- Con `-Branch` solo cuenta la rama de la task → Task 1. ✓
- Sin transcripts, «no medido» (y rama sin respuestas, y sin subagentes) → Task 1. ✓
- El cierre rellena los tokens y el coste de la sesión → Task 3. ✓
- MODIFIED El estimation-log se genera desde los artefactos de cierre → Task 2. ✓
- MODIFIED El log agrupa por release → Task 2. ✓
- Precios de este repo (decisión 12) → Task 1, Step 5. ✓
- `sdd-config` y tickets → N/A, deuda al cerrar. ✓

## Review Focus

- Un transcript de una sesión en curso termina con una línea a medias: el script la ignora, sin abortar → test «línea que no es JSON» (Task 1).
- Un subagente sin `meta.json`: la descripción cae al nombre del fichero (`agent-x1`) → test en la Task 1.
- `-Path` con separador final (`D:\w\t1\`): misma carpeta que sin él → test en la Task 1.
- Un walkthrough antiguo sin `Coste de la sesión`: la celda es `—`, no un error → Task 2.
- Una respuesta sin `cache_creation` (formato antiguo): la escritura cuenta como 5m → fixture propia `legacy/s4.jsonl` con una respuesta de `cache_creation_input_tokens` 1.000 y sin `cache_creation`, que sale en la columna Escritura 5m (Task 1).
