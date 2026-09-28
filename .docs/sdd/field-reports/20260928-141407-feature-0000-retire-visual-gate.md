---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260928-141407-feature-0000-retire-visual-gate
task: 0000
mode: full
date: 2026-09-28
---

# Ticket para el kit — feature 0000: la revisión final se colgó 26 min sin que nada lo detectara

## Contexto

- Carril y modo: feature full, perfil `delegate`, `execution: auto` (el plan salió Native).
- Skills del kit usadas: `using-sdd`, `sdd-consult`, `sdd-start-feature`, `sdd-templates`,
  `sdd-config` (dos veces, fichero local), `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`;
  de superpowers, `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development` y
  `systematic-debugging`.
- Proyecto: monorepo brownfield (Angular + .NET, moon, pnpm) en Windows 11, un solo dev en la sesión.
- Modelo del hilo: claude-opus-5-5 (effort no registrado).
- Modelos de los subagentes: claude-opus-5-5 con `sdd-kit:effort-high`, dos despachos del revisor final.
- Coste en reloj: ~1.2 h de implementación desde la apertura, de las que ~26 min fueron el cuelgue.
- Coste en tokens: hilo 39.216.382; subagentes 3.557.901 (según `Measure-SessionTokens.ps1`).

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste
observado. Las horas son locales (UTC+2); entre paréntesis va la marca UTC del transcript.

## Hallazgos

### 1. El vigía de silencio `control.silence.*` está declarado pero ninguna skill lo ejecuta

- **Qué pasó**: el revisor final estuvo 26 min sin escribir en su transcript. El proyecto tiene
  `control.silence.longCommandMinutes: 20` y `betweenStepsMinutes: 8` en `sdd-kit.json`, y ningún
  aviso saltó: ni al llegar a 8 ni a 20 minutos. Me enteré porque el dev-lead preguntó. Hasta ese
  momento le dije que «entre 15 y 30 minutos es normal» sin haber mirado nada.
- **Dónde en el kit**:
  - `skills/sdd-start-feature/references/control-profiles.md`, L143 y L178: «`control.maxParallelAgents`
    y `control.silence.*` solo se declaran aquí: su conducta la define la task 0022».
  - `skills/sdd-config/SKILL.md`, pregunta 5 del catálogo.
  - Un `grep -rniE "silence|silencio|longCommand|betweenSteps"` sobre `skills/` solo encuentra
    declaraciones. Ni `sdd-start-feature` paso 6, ni `encargo-revision.md`, ni `executing-plans` dicen
    qué hacer al superar el umbral.
- **Por qué el kit no lo evitó**: la conducta de la task 0022 no está en la 2.0.0. La clave existe, se
  pregunta en `sdd-config` y se escribe, pero ningún paso la lee.
- **Coste**: 26 min de reloj parado y la confianza del dev-lead en las validaciones. Su frase: «en
  este proyecto las validaciones se eternizan».
- **Propuesta**: en `sdd-start-feature` paso 6 (y en `encargo-revision.md` §Revisor final), la regla
  de vigilar todo subagente en segundo plano por la última escritura de su transcript
  (`<config>/projects/<proyecto>/<sesión>/subagents/agent-<id>.jsonl`). Al pasar
  `control.silence.longCommandMinutes` sin escribir, es un cuelgue: se para, se registra como ruling
  y se relanza una vez. El umbral sale de la clave, no de un número del texto.
- **Criterio de aceptación**: GIVEN un revisor final despachado en segundo plano y
  `longCommandMinutes: 20` · WHEN su transcript deja de escribirse durante 20 min · THEN el hilo lo
  detecta sin que el usuario pregunte, lo para, lo relanza y lo anota en el ledger. RED de hoy: 0
  detecciones en 26 min.

### 2. Evidencia del cuelgue: una llamada que no llegó a pasar su `PreToolUse`

- **Qué pasó** (datos del transcript `agent-<id>.jsonl` del primer revisor):
  - Arranque a las 15:25:35 (13:25:35.518Z).
  - **Último evento: 15:26:12 (13:26:12.428Z)**, un `tool_use` de **`Read`** con
    `{"file_path": "<repo>\\.superpowers\\sdd\\plan\\review-final-0f264440.diff", "offset": 500, "limit": 420}`.
    **Sin `tool_result`.** Después no hay ningún evento más: el fichero no se volvió a escribir desde
    las 15:26:12.
  - En ese transcript hay 6 `tool_use` y solo 5 `hook_success` de `PreToolUse`: los otros cinco
    `Read`/`PowerShell` tienen su `PreToolUse` y su `PostToolUse` o `PostToolUseFailure`. **El `Read`
    colgado no tiene `PreToolUse`.** En el revisor relanzado cuadran 25 de 25.
  - En la configuración de usuario hay un hook `PreToolUse` con matcher `*` de un orquestador de
    terminales externo al kit (`claude-hook.cmd || echo {}`, `timeout: 10`). Es el único hook que
    corre para `Read`, porque los del proyecto solo casan `Edit|Write` y `Bash|PowerShell`.
  - **Petición de permiso: ninguna.** Los tipos de `attachment` del transcript son `hook_success` 12,
    `total_tokens_reminder` 3, `prompt_snapshot` 2, `deferred_tools_delta` 2 y uno de cada uno de
    `hook_additional_context`, `environment`, `model`, `skill_listing`, `instructions`,
    `session_context`, `date`, `credential_org`, `remote_session_change`, `deferred_tools_record`,
    `agent_listing_delta`, `mcp_instructions_delta` y `auto_mode`. No hay ningún `PermissionRequest`,
    y eso que el mismo hook está registrado también para ese evento. El meta del agente dice
    `requestShape: background`, `requestNonInteractive: true`.
  - La UI del hilo mostraba «Reading 3 files, running 1 shell command · 25m 48s», que parece trabajo
    en curso.
- **Dónde en el kit**: no se localiza. La causa está en el harness o en un hook de usuario, no en el
  kit. La inferencia (no demostrada) es que la llamada se quedó dentro de la fase `PreToolUse`,
  seguramente en ese hook `.cmd`, y su `timeout: 10` no la cortó. Lo que sí es del kit es no
  detectarlo (hallazgo 1).
- **Por qué el kit no lo evitó**: el kit no puede arreglar el harness, pero sí puede no depender de
  que el harness avise.
- **Coste**: el de hallazgo 1, y 254.023 tokens del primer despacho perdidos.
  `Measure-SessionTokens.ps1` le anota «1 min»: cuenta los eventos, no el reloj (hallazgo 5).
- **Propuesta**: la regla del hallazgo 1 basta. Además, que `encargo-revision.md` sugiera, como
  diagnóstico, comparar `tool_use` contra `PreToolUse` en el transcript: es lo que separa «el modelo
  piensa» de «la llamada no salió».
- **Criterio de aceptación**: GIVEN un revisor colgado · WHEN el hilo lo diagnostica · THEN su
  informe da la hora del último evento, la herramienta con sus parámetros, si tiene `PreToolUse` y
  si hubo `PermissionRequest`. RED de hoy: el primer diagnóstico que di fue una suposición («es
  normal que tarde»), sin ninguno de esos cuatro datos.

### 3. La receta del paquete de revisión final produce un fichero que `Read` no puede leer

- **Qué pasó**:
  - La receta de `encargo-revision.md` §Revisor final genera el diff completo con `-U10`, y mete
    enteros los ficheros borrados (un spec de 749 líneas y cinco fixtures), la spec y el plan de la
    propia feature, y filas de tabla Markdown de 1-3 KB en una sola línea. Resultado: **235.524 bytes**.
  - El primer `Read` del revisor (`limit: 700`) falló con este **error literal**: `File content
    (28006 tokens) exceeds maximum allowed tokens (25000). Use offset and limit parameters to read
    specific portions of the file, or search for specific content instead of reading the whole file.`
  - La receta no dice en qué tramos leer, así que el revisor fue probando (`limit: 700`, luego `500`,
    luego `offset: 500, limit: 420`, que es el que se colgó).
  - El paquete relanzado, `-slim`, se hizo con `--diff-filter=d` (los borrados solo por nombre en
    una sección aparte), `-U6`, excluyendo los PNG y la carpeta de spec de la feature: **110.464
    bytes, 1.382 líneas**. Una versión intermedia sin excluir la spec daba 137.295. Leído en tramos de
    400 líneas, no falló ningún `Read`.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, §Revisor final
  (receta `bash` y sección «Cómo revisar»).
- **Por qué el kit no lo evitó**: la receta excluye `red/` y `green/`, pero no los borrados ni la
  spec de la feature, que el revisor ya lee aparte. Tampoco da el tamaño de tramo.
- **Coste**: un `Read` fallido y tres intentos de tamaño antes del cuelgue; paquete 2,1× más grande
  de lo necesario.
- **Propuesta**:
  - `--diff-filter=d` más una sección «Ficheros borrados» con `git diff --name-only --diff-filter=D`.
  - Excluir `.docs/sdd/specs/<carpeta de esta feature>/**`.
  - En «Cómo revisar», «léelo en tramos de 400 líneas con `offset`/`limit`».
- **Criterio de aceptación**: GIVEN una rama que borra ficheros grandes · WHEN el hilo genera el
  paquete con la receta · THEN ningún `Read` del revisor devuelve el error de 25.000 tokens y el
  paquete no contiene el cuerpo de los ficheros borrados. RED de hoy: 235.524 bytes y el error de
  arriba.

### 4. El revisor final va siempre en Opus con effort high, sea cual sea el riesgo

- **Qué pasó**:
  - La revisión relanzada tardó **5 min 10 s** (13:53:26Z → 13:58:36Z). Hizo 25 llamadas (`Read` 9,
    `Bash` 14, `Grep` 1, `SubagentHandback` 1) y gastó 3.303.878 tokens. Veredicto «With fixes»:
    **0 Critical, 1 Important y 7 Minor**.
  - El Important era un comentario de configuración que citaba un artículo de la constitution.
  - Los Minor: cinco frases vivas que seguían describiendo baselines (el hilo subió este a
    Important), dos filas del roadmap para decisión del dev-lead, `tasks.md` sin actualizar, formato
    de estado no unificado, un título heredado, líneas sin re-envolver y restos locales sin versionar.
  - También contrastó tres cifras del diff contra el changelog y un walkthrough antiguo (todas
    correctas).
  - La rama era ~150 líneas de código y el resto borrado y prosa: el riesgo real era solo reescribir
    un hecho histórico en los docs.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, §Revisor final
  («`sdd-kit:effort-high` + `model: opus`… es el techo del kit»); y `plan-template.md`, bloque de
  decisiones («el revisor final de rama… va con `sdd-kit:effort-high` + `opus`»).
- **Por qué el kit no lo evitó**: la review de spec tiene rúbrica de señales y tamaño
  (`review-spec.md`); la revisión final no tiene ninguna.
- **Coste**: el despacho más caro de la sesión para hallazgos que eran casi todos de grep y de
  lectura de prosa.
- **Propuesta** (hipótesis, no demostrada): una rúbrica para la revisión final como la de
  `review-spec.md`. Con 0-3 señales (sin contrato público, sin datos, sin capacidades, diff de
  código < ~200 líneas), `sdd-kit:effort-medium` + `sonnet` con el mismo encargo. Opus solo con
  señales.
- **¿Habría bastado Sonnet?** No lo sé: no lo probé. Todos los hallazgos de hoy son de los que
  encuentra un grep o una lectura atenta, y el único con juicio (qué deudas del roadmap mezclaban lo
  retirado con lo vigente) acabó como pregunta al dev-lead. Es una hipótesis razonable, no un dato.
- **Criterio de aceptación**: RED/GREEN comparativo. Mismo paquete `-slim` y mismo encargo, un
  despacho `effort-medium` + `sonnet` frente al informe de Opus de hoy. GREEN si Sonnet encuentra el
  Important y ≥ 5 de los 7 Minor sin falsos Critical. Si falla, la rúbrica no baja de Opus.

### 5. `Measure-SessionTokens.ps1` oculta el tiempo colgado de un subagente

- **Qué pasó**: la línea de subagentes del walkthrough dice «Revisión final de rama … 254.023 / 1
  min». En reloj estuvo 26 min abierto: el script mide del primer al último evento del transcript,
  y un cuelgue no deja eventos.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`, y la línea «Tokens
  de subagentes» de `walkthrough-template.md`.
- **Por qué el kit no lo evitó**: el script no conoce la hora en que se paró el agente.
- **Coste**: el estimation-log no ve los cuelgues; una sesión con 26 min perdidos parece una de 1 min.
- **Propuesta**: que el script lea también la notificación de parada o de fin del agente en el
  transcript del hilo y dé los dos tiempos («1 min activo / 26 min abierto»).
- **Criterio de aceptación**: GIVEN un subagente parado a los 26 min tras 30 s de actividad · WHEN se
  ejecuta el script · THEN la línea dice 26 min abierto. RED de hoy: «1 min».

## Lo que hice por iniciativa propia

- **Temporizador de tope**, antes de mirar el transcript: `Bash` con `run_in_background: true` y
  `sleep 660; echo "límite de 35 min alcanzado"`. El tope de 35 min lo eligió el dev-lead entre las
  opciones que le di. Ninguna regla lo pedía. No llegó a disparar: lo paré al diagnosticar el cuelgue.
- **Vigilante de transcript**, tras relanzar la revisión. Lo monté porque el dev-lead dijo «tendríamos
  que saber qué está pasando»; **ninguna regla del kit lo pedía** (la del hallazgo 1 no tiene
  conducta):
  - herramienta `Bash` con `run_in_background: true`;
  - comando: `while true; do sleep 30; [ -f "$F" ] || continue; age=$(( $(date +%s) - $(stat -c %Y
    "$F") )); if [ $age -gt 300 ]; then echo "CUELGUE: transcript sin escribir hace ${age}s"; exit 0;
    fi; done`, con `F` apuntando al `agent-<id>.jsonl` del revisor;
  - umbral: **300 s** sin escribir (5 min), que no es el `longCommandMinutes: 20` del proyecto: lo
    elegí yo, más agresivo;
  - no llegó a disparar: la revisión volvió en 5 min 10 s y lo paré.
- **Diagnóstico por el transcript** con un script `node` que resume eventos (hora, herramienta,
  parámetros recortados, tamaños de resultado) sin volcar el contenido. Para comparar `tool_use`
  contra `PreToolUse` también usé `node`. Funcionó: dio la evidencia del hallazgo 2 sin llenar el
  contexto.
- **Paquete `-slim`** (hallazgo 3): lo construí por mi cuenta, fuera de la receta.

## Funcionó, no tocar

- El desvío en `delegate` paró de verdad. Una frase fuera del «No entra» de la spec disparó la
  pregunta, se registró como enmienda aprobada y se siguió.
- La primera pregunta de `sdd-start-feature` (carril, modo, perfil y ticket) y la oferta de modo lite
  citando el predicado condición por condición.
- En `sdd-consult`, tensar la premisa del usuario con evidencia antes de abrir el carril. Ningún
  test leía la carpeta que el usuario creía culpable, y el prototipo resultó necesario para dos
  filas del roadmap.
- En Native, el ledger (`progress.md`) con `task-start`/`task-done` y los rulings: el walkthrough se
  escribió leyéndolo, no de memoria.
- `Invoke-SddMerge.ps1 -Push`: merge y push en una llamada, sin tocar git a mano.
- La pregunta de la validación con guion numerado: el dev-lead probó y contestó con lo que había
  probado.

## Errores míos, no huecos del kit

- Dije «es normal que tarde entre 15 y 30 minutos» sin mirar el transcript, que estaba a mano. Era
  una suposición presentada como diagnóstico.
- Lancé `python3` en Git Bash, que en Windows es el shim de la Store: se colgó 120 s. Ya está como
  gotcha en el CLAUDE.md del proyecto.
- En el plan escribí `pnpm run test -- --include`, que el builder rechaza. Lo correcto es sin `--`.
- Intenté reemplazos multilínea con `perl` sobre ficheros CRLF, que no casaban. Lo rehice con Edit.
- Usé `git stash` en el hilo para comparar el lint contra la base; la pila es común a todos los
  worktrees. `git show <base>:<ruta>` habría bastado.
