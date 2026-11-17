---
id: 20260928-173846-feature-0095-silence-watch
feature: 0095
title: Plan de implementación — El vigía de silencio detecta un subagente colgado sin que nadie pregunte
spec: ./spec.md
status: approved
created: 2026-09-28
---

# Plan de implementación — El vigía de silencio detecta un subagente colgado sin que nadie pregunte

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: dos tasks en serie, y la segunda la lleva el hilo de todos modos, porque lanza la campaña de sujetos. Un implementador por task no ahorra nada y añade dos revisiones.
2. **Modelo**: la sesión implementa las dos tasks. El revisor final va con `sdd-kit:effort-high` + `opus` (Art. IV). Los sujetos de la campaña, en Sonnet (`tech-stack.md`, lanzamiento headless).
3. **El transcript se busca por la `description` del despacho**, que Claude Code guarda en `subagents/agent-<id>.meta.json`, y no por «el más nuevo». Con dos despachos casi a la vez, «el más nuevo» vigila al que no toca.
4. **La búsqueda de carpetas se extrae a `skills/sdd-templates/scripts/TranscriptPaths.ps1`**, cargada con `.` desde los dos scripts, como `SddLock.ps1` y `CapabilitySections.ps1`.
5. **La edad del silencio es la de la última escritura del fichero** (`LastWriteTimeUtc`), no la del `timestamp` del último evento: si se escribe algo sin marca de tiempo, el fichero sigue vivo igual.
6. **Los tokens del aviso son los de salida**, sumados una vez por `message.id`. Dicen si el subagente produjo algo, que es la pregunta del dev-lead, sin cargar la tabla de precios.
7. **`-Once`** hace una sola comprobación e imprime el estado. Existe para que Pester pruebe los umbrales sin esperar minutos.
8. **Coste**: ~1,5 h la Task 1 y ~3 h la Task 2, campaña incluida. La campaña se ciñe a la previsión de la spec (decisión 11): 23 sujetos, contando uno de control para `sdd-config`, ~13 $ y un techo de 28 sujetos o 18 $.

**Goal**: el hilo lanza un vigía tras cada despacho y cada verificación lenta, y el vigía le avisa con un diagnóstico cuando se supera el umbral de `sdd-kit.json`.

**Architecture**: un script PowerShell en segundo plano que mira el transcript del subagente cada 30 s y termina con una línea de estado; el harness despierta al hilo cuando termina. La conducta del hilo ante el aviso vive en una sección de `control-profiles.md`, y cada punto de despacho la enlaza.

**Tech Stack**: PowerShell 7, Pester 5, skills en Markdown y campaña headless (`tests/headless/`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks en serie y la segunda (skills y campaña) la ejecuta el hilo de todos modos. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Los umbrales se leen de `.docs/sdd/sdd-kit.json` (`control.silence.betweenStepsMinutes`, `control.silence.longCommandMinutes`), con los defaults 8 y 20 si falta la clave; ningún texto de skill escribe 8 ni 20 en una orden.
- Comando de shell = herramienta `Bash` o `PowerShell`.
- Un transcript real no se copia a una fixture: los tests construyen el `.jsonl` con la forma real (tipos `assistant`, `user`, `attachment`; `tool_use` con `id`, `name` e `input`; `tool_result` con `tool_use_id`; `attachment.hookEvent` `PreToolUse` con `toolUseID`; `stop_reason: end_turn`).

### De proceso

- Política de modelos del Art. IV; `fable` y `opus xhigh` prohibidos.
- Campaña del Art. I con la previsión de la spec (decisión 11); si se supera el techo, se para y decide el dev-lead.
- Commits bilingües (Art. VI), con la atribución de la sesión.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un script y una sección de texto; sin `Monitor` ni claves nuevas.
- [x] **YAGNI gate**: `TranscriptPaths.ps1` tiene dos usos reales desde el primer día; no se abstrae nada más.
- [x] **Brownfield gate**: `Measure-SessionTokens.ps1` conserva su salida; sus tests siguen verdes.
- [x] **Constitution check**: Art. I (RED antes de tocar skills), Art. VIII (sin plantillas nuevas) y Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/TranscriptPaths.ps1`: `Get-DefaultProjectsRoots` y `Get-TranscriptFolders`, movidas desde `Measure-SessionTokens.ps1`.
- `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1`: el vigía.
- `tests/Watch-SubagentSilence.Tests.ps1`.
- `tests/silence-watch-red.md` y `tests/silence-watch-green.md`: la evidencia de la campaña.

**Modificar**:

- `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`: carga `TranscriptPaths.ps1` en vez de definir las dos funciones.
- `skills/sdd-start-feature/SKILL.md`: paso 6 (orden del vigía y aviso) y paso 7 (la re-revisión, «con la regla del paso 6»).
- `skills/sdd-start-feature/references/control-profiles.md`: la sección «Vigía de silencio» sustituye L143 y L178.
- `skills/sdd-start-feature/references/encargo-revision.md`, §Revisor final; `skills/sdd-start-feature/references/review-spec.md`, §3; `skills/sdd-end-feature/SKILL.md`, paso 9: una frase que remite al vigía.
- `skills/sdd-config/SKILL.md`, pregunta 5: «su conducta la define la task 0022» pasa a «su conducta: §Vigía de silencio de `control-profiles.md`».
- `.docs/sdd/mission.md`: la frase de los frenos.
- `.docs/sdd/roadmap.md`: la fila 0022 pierde el vigía de silencio.

**NO se tocan**:

- `sdd-kit.json` de las init y la migración v2.0.0: las claves ya se escriben.
- `plan-template.md`: la verificación lenta no cambia de forma.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Claude Code cambia la ruta o el formato del transcript | media | el vigía no ve nada | «SIN TRANSCRIPT» a los 2 min: el fallo es ruidoso (spec) |
| Una respuesta larga del modelo pasa de 8 min sin escribir | baja | falso cuelgue y un relanzamiento de más | el aviso lleva los tokens; se relanza una sola vez |
| Los sujetos headless no ven la notificación de un comando en segundo plano | alta | s4 y s5 no se pueden medir de punta a punta | s4 y s5 reciben el aviso pegado en la petición (spec, decisión 11) |

### 1.8 Rollout

Directo, en la próxima release del kit. Sin migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — El script del vigía

**Modelo**: la sesión (Native).
**Tests RED**: el hilo escribe `tests/Watch-SubagentSilence.Tests.ps1` antes del código, sin commitearlo, y guarda una copia fuera del repo.
**Superficies**: tooling.
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/Watch-SubagentSilence.Tests.ps1, tests/Measure-SessionTokens.Tests.ps1 -Output Detailed"`.
**Se prueba en la aplicación**: `pwsh -File skills/sdd-templates/scripts/Watch-SubagentSilence.ps1 -Description "<un despacho de esta sesión>" -Once` imprime `EN MARCHA` o `TERMINADO` con sus minutos.

**Interfaces**:
- Consume: nada.
- Produce:
  - Llamada: `Watch-SubagentSilence.ps1 -Description <string> | -Path <string> [-Worktree <string>] [-ProjectsRoot <string[]>] [-Once]`.
  - `-Description` es la `description` del despacho, comparada con la de `subagents/agent-*.meta.json` de las carpetas de `Get-TranscriptFolders`. `-Path` es el fichero de salida de un comando.
  - Primera línea de la salida, siempre: `SILENCIO: …`, `TERMINADO: …`, `SIN TRANSCRIPT: …` o `EN MARCHA: …` (este último solo con `-Once`).

**Ficheros**: crear `TranscriptPaths.ps1`, `Watch-SubagentSilence.ps1` y el test; modificar `Measure-SessionTokens.ps1`.

- [ ] **Step 1: Tests RED**. Helper del test: `New-Transcript -Events <hashtable[]> -AgeMinutes <double>` escribe `agent-t1.jsonl` y `agent-t1.meta.json` (`{"description":"Revisor final 0095"}`) en `TestDrive:/projects/<carpeta del worktree>/s1/subagents/` y pone `LastWriteTimeUtc` a `now - AgeMinutes`. Cada test lanza el script con `-Description "Revisor final 0095" -Worktree <TestDrive repo> -ProjectsRoot TestDrive:/projects -Once`, y el `sdd-kit.json` del repo lleva `betweenStepsMinutes 8, longCommandMinutes 20` salvo que el test diga otra cosa.
  - `It 'avisa con un Read sin tool_result a los 8 min 30 s'`: la primera línea empieza por `SILENCIO:` y contiene `umbral 8 min`.
  - `It 'no avisa con un PowerShell sin tool_result a los 15 min'`: la primera línea empieza por `EN MARCHA:`.
  - `It 'avisa con un PowerShell sin tool_result a los 20 min 30 s'`: `SILENCIO:` y `umbral 20 min`.
  - `It 'aplica betweenStepsMinutes 5 de sdd-kit.json'`: el `Read` a 5 min 30 s da `SILENCIO:` y `umbral 5 min`.
  - `It 'aplica 8 y 20 sin el bloque control.silence'`: con `sdd-kit.json` sin `control`, el `Read` a 8 min 30 s da `umbral 8 min`.
  - `It 'da el diagnóstico del último evento'`: eventos del ticket, con arranque `2026-09-28T13:25:35.518Z`, un `assistant` con `usage.output_tokens` 1200 y un último `tool_use` `Read` a `13:26:12.428Z` con `file_path …\review-final-0f264440.diff`, `offset 500` y `limit 420`, sin `PreToolUse` para ese id pero con `PreToolUse` para uno anterior. La salida contiene `13:26:12Z`, `Read`, `review-final-0f264440.diff`, `offset 500`, `limit 420`, `sin PreToolUse`, `sin petición de permiso` y `1200 tokens de salida`.
  - `It 'señala un PermissionRequest pendiente'`: un `attachment` con `hookEvent PermissionRequest` después del último `tool_use`. La salida contiene `petición de permiso pendiente`.
  - `It 'termina sin aviso cuando el subagente acabó'`: último `assistant` con `stop_reason end_turn`, a 13 min. La primera línea empieza por `TERMINADO:`.
  - `It 'vigila la salida de un comando con longCommandMinutes'`: `-Path` a un `.log` de 21 min de edad. `SILENCIO:` y `umbral 20 min`.
  - `It 'dice SIN TRANSCRIPT si no encuentra el despacho'`: `-Description "no existe" -Once`. La primera línea empieza por `SIN TRANSCRIPT:`.
- [ ] **Step 2: Ejecutarlos**. Esperado: todos fallan porque el script no existe.
- [ ] **Step 3: `TranscriptPaths.ps1`**. Mueve las dos funciones sin cambiarlas. `Measure-SessionTokens.ps1` la carga con `. (Join-Path $PSScriptRoot 'TranscriptPaths.ps1')`.
- [ ] **Step 4: `Watch-SubagentSilence.ps1`**:
  - Sin `-Once`, repite cada 30 s hasta que el estado no sea `EN MARCHA`.
  - Sin transcript: a los 120 s imprime `SIN TRANSCRIPT: <descripción>; el vigía de silencio no funciona en esta sesión`; con `-Once`, al instante.
  - Umbral: `longCommandMinutes` si el último evento con contenido es un `tool_use` de `Bash` o `PowerShell` sin `tool_result` posterior, o si se usa `-Path`; si no, `betweenStepsMinutes`.
  - Formato de `SILENCIO`: `SILENCIO: <descripción> lleva <n> min sin escribir (umbral <u> min, <clave>)`. Después, una línea por dato: `Último evento: <HH:mm:ssZ> · <herramienta> <hasta 3 parámetros «nombre valor», con file_path reducido a su hoja> · <sin tool_result | con tool_result>`; `PreToolUse: sí | sin PreToolUse`; `Petición de permiso: sin petición de permiso | petición de permiso pendiente`; `<n> tokens de salida`.
- [ ] **Step 5: Verificación**. Esperado: los tests nuevos y los de `Measure-SessionTokens` en verde.
- [ ] **Step 6: Commit de la task**: `feat(sdd-templates): vigía de silencio para subagentes y comandos en segundo plano`.

### Task 2 — La guía del vigía, con su campaña

**Modelo**: la sesión (Native); sujetos en Sonnet (`tech-stack.md`).
**Tests RED**: la campaña RED de `tests/silence-watch-red.md` corre contra el kit de `develop`, antes de editar ninguna skill (Art. I).
**Superficies**: docs (skills).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester tests/ControlProfiles.Tests.ps1, tests/WorkflowDocs.Tests.ps1 -Output Detailed"`, más el GREEN de la campaña.
**Se prueba en la aplicación**: en la sesión de validación, despachar un subagente y ver que el hilo lanza `Watch-SubagentSilence.ps1 -Description` con la misma `description`.

**Interfaces**:
- Consume: la llamada y las cuatro primeras líneas posibles del script de la Task 1 (`SILENCIO:`, `TERMINADO:`, `SIN TRANSCRIPT:`, `EN MARCHA:`).
- Produce: la sección `## Vigía de silencio` de `control-profiles.md`.

**Ficheros**: los de «Modificar» de §1.1, salvo `Measure-SessionTokens.ps1`, y la evidencia de la campaña.

- [ ] **Step 1: RED**. Moldes en el scratchpad con `tests/headless/lib.sh`, `sdd-kit.json` con `control.silence` 8 y 20, perfil `delegate`, y la spec y el plan de una feature de juguete. Dos sujetos por escenario:
  - s1: Native terminado; «despacha el revisor final y sigue». Mide: ¿lanza un vigía, y con qué umbral?
  - s2: SDD, Task 1 lista para despachar. Mide: ¿vigía tras el implementador?
  - s3: una task con «Verificación lenta: `Invoke-Pester tests/` · 25 min». Mide: ¿vigía sobre la salida?
  - s4: la petición trae el aviso `SILENCIO` del diagnóstico del ticket, sin permiso. Mide: ¿para, relanza una vez, avisa sin que le pregunten y registra `Cuelgue: …`?
  - s5: el aviso con `petición de permiso pendiente` (dos sujetos) y un segundo aviso tras el relanzamiento, en `delegate` y en `unattended` (uno cada uno). Mide: ¿no relanza, pregunta o aparca?
  - Control: la comprobación del tipo `sdd-kit:effort-<nivel>` antes del primer despacho, en s1 y s2.

  Anota cada racionalización literal en `tests/silence-watch-red.md`, con coste y turnos.
- [ ] **Step 2: Guía**. La sección `## Vigía de silencio` de `control-profiles.md` lleva:
  - La orden de lanzar el vigía, con la llamada exacta y en segundo plano.
  - La lectura de cada primera línea.
  - La conducta: para, relanza una vez con un vigía nuevo, no relanza con permiso pendiente (en `unattended` aparca al instante), y ante un segundo cuelgue pregunta en `pair` y `delegate` o aparca en `unattended`.
  - El formato del ruling `Cuelgue: <tipo>, <herramienta> sin respuesta, <minutos> min, <relanzado | no relanzado: permiso | parado: segundo cuelgue>`.
  - El relanzamiento de un implementador con cambios sin commitear.
  - Con `TERMINADO:`, no hay nada que hacer. Con `SIN TRANSCRIPT:`, avisar de que en esta sesión el vigía no funciona.

  Además, el paso 6 de `SKILL.md` lleva la orden en una frase que enlaza la sección, con los números del RED, y el resto de puntos de despacho remite al paso 6. Por último, `sdd-config` P5, `mission.md` y la fila 0022 del roadmap.
- [ ] **Step 3: GREEN**. Los mismos escenarios con el kit de la rama, dos sujetos cada uno; filas de control de lo que el RED ya cumplía y un sujeto de `sdd-config` P5. Esperado: s1-s5 cumplen 2/2, o se abre una tanda de REFACTOR dentro del techo.
- [ ] **Step 4: Verificación**. Pester de la task en verde.
- [ ] **Step 5: Commit de la task**: `feat(sdd-start-feature): el hilo vigila cada despacho y actúa ante un cuelgue`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 4,5h
- Base de la estimación: dos tasks. El script lleva ~10 tests y la guía una campaña de 23 sujetos. Las campañas de conducta nueva recientes (0064, 0089) rondaron 2-3 h.
- Confianza: media. La campaña de s4 y s5 depende de cómo lean los sujetos un aviso pegado.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester tests/ -Output Detailed"`.
- [ ] Smoke: `Watch-SubagentSilence.ps1 -Once` sobre el revisor final real de esta feature (`EN MARCHA` y después `TERMINADO`).
- [ ] Cada THEN de la spec con su evidencia (`suite`, `ejecución real` o `no probado`).
- [ ] Cierre con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- Todo subagente y toda verificación lenta llevan su vigía → Task 2 (guía, s1-s3). ✓
- El umbral depende de la herramienta que espera → Task 1 (cinco tests de umbral). ✓
- El aviso dice qué hacía y cuánto gastó → Task 1 (diagnóstico y permiso). ✓
- Se para, se relanza una vez y se cuenta → Task 2 (guía, s4). ✓
- Permiso pendiente o segundo cuelgue → Task 1 (detección del permiso) y Task 2 (conducta, s5). ✓
- Un subagente que termina no da falso aviso → Task 1 (`TERMINADO`) y Task 2 (la guía dice qué hacer con `TERMINADO:`). ✓
- Sin transcript, el vigía lo dice → Task 1 (`SIN TRANSCRIPT`) y Task 2 (el aviso al usuario). ✓
- La regla «Límites» de `control-profiles` → la fusiona `sdd-end-feature` desde el delta; el texto de la skill, Task 2. ✓
