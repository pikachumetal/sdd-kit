---
id: 20260925-180248-feature-0036-closing-verification
feature: 0036
title: Plan de implementación — Verificación de cierre, qué cuenta
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Verificación de cierre, qué cuenta

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: las cinco tasks son texto de skills, plantillas y un test Pester, encadenadas sobre `sdd-start-feature/SKILL.md`. El GREEN de cada una lo lanza el hilo. Un implementador por task cargaría el contexto de la skill cinco veces para editar párrafos.
2. **Revisor final: Opus con `sdd-kit:effort-high`**, el techo por defecto del kit para Native.
3. **El GREEN web (`v6`, `v7f`, `v8`) corre una vez, al cerrar la Task 2**, porque `v7f` mide a la vez la Task 1 (la parada) y la Task 2 (la evidencia por THEN). La Task 1 se cierra con sus tests de literales y su veredicto conductual llega con la Task 2.
4. **Un solo fichero de tests de literales**, `tests/ClosingVerification.Tests.ps1`, con un `Describe` por task, como `VisualCheck.Tests.ps1`. La compatibilidad del log va en `tests/Build-EstimationLog.Tests.ps1`, que ya prueba ese script.
5. **El test del log escribe la plantilla nueva rellena y un walkthrough cerrado real** (el de la 0077, forma vieja) en una carpeta temporal y ejecuta el script sobre las dos. Así prueba la plantilla de verdad, no una copia.
6. **Coste estimado**: ~3 h de hilo y ~5 $ en 10 sujetos GREEN, más un revisor final Opus (~150k tokens).

**Goal**: el agente para solo lo que arrancó, la validación del paso 7 dice de dónde sale cada THEN, `task-done` no se escribe sin commit y un THEN que depende de la base declara cómo se valida.

**Architecture**: guía en el punto de uso de `skills/sdd-start-feature/SKILL.md` (paso 6 y paso 7, tabla de racionalizaciones y red flags), forma en `walkthrough-template.md` y `spec-template.md`, un test Pester por regla y una campaña GREEN por conducta.

**Tech Stack**: Markdown de skills, PowerShell 7 con Pester, lanzador headless `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son cinco tasks cortas de texto sobre los mismos ficheros y el GREEN lo lanza el hilo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
- Valores exactos de la spec: evidencia `suite` · `ejecución real` · `no probado`; umbral de la suite 10 minutos; línea `Se valida en:` con `worktree con la base al día` o `validación post-merge con fecha`; clave `validation.startEnvironment`.
- Un test de literales compara con `-Match ([regex]::Escape(...))` o `.Contains`, nunca con `-BeLike`.
- Ficheros reescritos desde PowerShell, en LF.

### De proceso

- Native: la sesión implementa; revisor final Opus + `sdd-kit:effort-high`. `fable` y `opus xhigh` prohibidos.
- Sujetos: Sonnet, con `tests/headless/run.sh`, `SUBJECT_CAP=15` y `COST_CAP=12` comunes a RED y GREEN. Los sujetos web llevan el hook `green/deny-kill.mjs`.
- Con una campaña en marcha, el hilo no commitea.
- Commits: tipo/scope en inglés, cuerpo en castellano, trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una frase por regla en el paso que produce la salida; sin claves nuevas de configuración.
- [x] **YAGNI gate**: el umbral de 10 min no se hace configurable.
- [x] **Brownfield gate**: los walkthroughs cerrados no cambian; el test lo prueba.
- [x] **Constitution check**: Art. I (RED antes, GREEN por conducta), Art. II (fila de racionalizaciones para la disciplina, receta para la forma, contraejemplo de `startEnvironment` con su escenario), Art. VIII (se edita la fuente única de plantillas).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/ClosingVerification.Tests.ps1` — literales de las reglas nuevas.
- `tests/closing-verification-red.md` y `tests/closing-verification-green.md` — evidencia de la campaña.

**Modificar**:

- `skills/sdd-start-feature/SKILL.md` — paso 6 («En Native» y «Verificación visual»), paso 7, red flags y tabla de racionalizaciones.
- `skills/sdd-templates/templates/walkthrough-template.md` — «4.1 Builds», «4.2 Smoke / tests», «4.3 Residuales».
- `skills/sdd-templates/templates/spec-template.md` — línea `Se valida en:` en el escenario ADDED.
- `tests/Build-EstimationLog.Tests.ps1` — lectura de la forma nueva y de la vieja.
- `.docs/sdd/tech-stack.md` — aprendizaje del hook que deniega parar por nombre en las campañas web.

**NO se tocan**:

- `skills/sdd-templates/scripts/Build-EstimationLog.ps1` — no lee «4. Verificación»; si el test lo contradice, es un desvío.
- `skills/sdd-start-feature/references/control-profiles.md` — ya define `validation.startEnvironment`; el paso 7 lo enlaza.
- `tests/headless/` — la campaña usa el lanzador tal cual.
- Pasos 2 y frontmatter de las skills — son de la 0078 y la 0074, en paralelo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La 0078 o la 0074 entran en `develop` con cambios en `SKILL.md` | media | conflicto en el merge | tocan otro tramo; se comprueba la base antes de cada task |
| Un sujeto web mata procesos de la máquina | media | caen MCP de otras sesiones | hook `deny-kill.mjs` |
| `v7f` no llega al guion | baja | T1/T2 sin medir | el molde ya trae la verificación visual hecha |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Parar lo arrancado por su PID o su puerto

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/ClosingVerification.Tests.ps1`, `Describe 'Parar lo arrancado'`; Native: TDD del propio hilo
**Superficies**: docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingVerification.Tests.ps1 -CI"`

**Interfaces**:
- Consume: nada
- Produce: la frase «párala por ese PID o por el proceso que escucha en ese puerto» en el paso 6, que el paso 7 cita como «con la regla del paso 6»

**Ficheros**: crear `tests/ClosingVerification.Tests.ps1`; modificar `skills/sdd-start-feature/SKILL.md`

- [ ] **Step 1: Test RED**

```powershell
BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:Skill = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-start-feature/SKILL.md') -Raw

  function Get-Step([int]$Step) {
    return [regex]::Match($script:Skill, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    $Text | Should -Not -BeNullOrEmpty
    foreach ($literal in $Literals) { $Text | Should -Match ([regex]::Escape($literal)) }
  }
}

Describe 'Parar lo arrancado' {
  It 'el paso 6 para por PID o por puerto y nunca por nombre ni por línea de comandos' {
    Assert-Literal (Get-Step 6) @('párala por ese PID o por el proceso que escucha en ese puerto', 'nunca por el nombre del ejecutable', 'ni por un patrón de su línea de comandos', '`taskkill /IM`', '`pkill -f`')
  }

  It 'el paso 7 para antes del guion salvo validation.startEnvironment' {
    Assert-Literal (Get-Step 7) @('Antes de presentar el guion, para lo que arrancaste, con la regla del paso 6', '`validation.startEnvironment: true`', 'en qué puerto está y cómo pararla')
  }

  It 'la tabla de racionalizaciones responde a matar todos los procesos del ejecutable' {
    $script:Skill | Should -Match '(?m)^\| "Mato todos los `node\.exe`[^\n]*por su PID o por el puerto'
  }

  It 'hay red flag de parar por nombre' {
    $script:Skill | Should -Match '(?m)^- Vas a parar un proceso por su nombre o por un patrón de su línea de comandos'
  }
}
```

Ejecuta la verificación: 4 fallos. Copia el fichero a `<scratchpad>/red-copies/t1/`.

- [ ] **Step 2: Paso 6.** En la frase de la «Verificación visual», tras «guárdala fuera de git hasta la validación, sin borrarla al limpiar.», añade:

  > Al arrancar la aplicación, guarda su PID (`$!`, `Start-Process -PassThru`, la tarea en segundo plano del harness) o el puerto en que escucha; cuando acabes, párala por ese PID o por el proceso que escucha en ese puerto, nunca por el nombre del ejecutable (`taskkill /IM`, `pkill node`, `killall`, `Stop-Process -Name`) ni por un patrón de su línea de comandos (`pkill -f`, filtrar `CommandLine`): en la máquina del dev-lead corren otros procesos iguales —su servidor, los MCP, otras sesiones—, y 7 de 15 sujetos los habrían parado (`tests/closing-verification-red.md`).

- [ ] **Step 3: Paso 7.** Tras «…y el smoke que has ejecutado, y ESPERA la validación explícita del usuario.», añade:

  > Antes de presentar el guion, para lo que arrancaste, con la regla del paso 6, y el guion empieza por cómo arrancarla; con `validation.startEnvironment: true` en `.docs/sdd/sdd-kit.local.json` ([control-profiles.md](references/control-profiles.md)) la dejas arrancada, y el guion dice en qué puerto está y cómo pararla.

- [ ] **Step 4: Red flag y racionalización.** Tras la red flag «Vas a marcar una task de UI como hecha…», añade `- Vas a parar un proceso por su nombre o por un patrón de su línea de comandos, en vez de por el PID o el puerto de lo que arrancaste.` Al final de la tabla: `| "Mato todos los \`node.exe\` (o \`pkill -f server.mjs\`): así seguro que el mío se para" | Y el servidor del dev-lead, sus MCP y las otras sesiones: en la campaña de la 0077 así cayó el MCP de Playwright. Para lo que arrancaste por su PID o por el puerto que escucha. |`

- [ ] **Step 5: Verificación** en verde; `git diff --no-index` contra la copia; commit `feat(sdd-start-feature): parar lo arrancado por su PID o su puerto`.

### Task 2 — La validación dice de dónde sale cada THEN

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/ClosingVerification.Tests.ps1` (`Describe 'Evidencia por THEN'`) y `tests/Build-EstimationLog.Tests.ps1` (`Describe 'Walkthrough con evidencia por THEN'`)
**Superficies**: docs, tooling
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingVerification.Tests.ps1,tests/Build-EstimationLog.Tests.ps1 -CI"`

**Interfaces**:
- Consume: la frase del paso 7 de la Task 1
- Produce: los valores `suite` · `ejecución real` · `no probado` en el paso 7 y en la tabla 4.2 del walkthrough

**Ficheros**: modificar `skills/sdd-start-feature/SKILL.md`, `skills/sdd-templates/templates/walkthrough-template.md`, `tests/ClosingVerification.Tests.ps1`, `tests/Build-EstimationLog.Tests.ps1`; crear `tests/closing-verification-red.md`, `tests/closing-verification-green.md`

- [ ] **Step 1: Tests RED**

```powershell
Describe 'Evidencia por THEN' {
  BeforeAll { $script:Walkthrough = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-templates/templates/walkthrough-template.md') -Raw }

  It 'el paso 7 da una fila por THEN con tres valores cerrados' {
    Assert-Literal (Get-Step 7) @('una fila por THEN de la spec con su evidencia', '`suite`, `ejecución real` o `no probado`', 'solo cuenta como verificado con `ejecución real`')
  }

  It 'el paso 7 provoca de verdad los THEN de fallo' {
    Assert-Literal (Get-Step 7) @('se provoca de verdad con la entrada que falla', '«lo cubre el test» es `suite`')
  }

  It 'el paso 7 dice cuánto tardó la suite' {
    Assert-Literal (Get-Step 7) @('cuánto tardó la suite completa')
  }

  It 'el walkthrough lleva la suite con su duración y el umbral de 10 minutos' {
    Assert-Literal $script:Walkthrough @('Suite completa: `<comando>` → <resultado> · <duración>', 'más de 10 min')
  }

  It 'la tabla 4.2 es una fila por THEN con su evidencia' {
    Assert-Literal $script:Walkthrough @('| THEN | Evidencia | Resultado |', '`suite` · `ejecución real` · `no probado`')
  }
}
```

En `tests/Build-EstimationLog.Tests.ps1`, al final:

```powershell
Describe 'Walkthrough con evidencia por THEN' {
  BeforeAll {
    $root = Join-Path ([IO.Path]::GetTempPath()) ([guid]::NewGuid().ToString())
    $specs = Join-Path $root '.docs/sdd/specs'
    $template = Get-Content (Join-Path $PSScriptRoot '../skills/sdd-templates/templates/walkthrough-template.md') -Raw
    $filled = $template -replace '(?m)^- Tipo: <[^\n]*', '- Tipo: docs' -replace '(?m)^- Estimación de implementación \(del plan\): <Yh>', '- Estimación de implementación (del plan): 2h' -replace '(?m)^- Esfuerzo real: <Zh>', '- Esfuerzo real: 3h'
    New-Item -ItemType Directory -Force (Join-Path $specs '20260926-100000-feature-0100-nuevo') | Out-Null
    Set-Content -Path (Join-Path $specs '20260926-100000-feature-0100-nuevo/walkthrough.md') -Value ($filled -replace '(?m)^feature: <id>', 'feature: 0100')
    $closed = Get-ChildItem (Join-Path $PSScriptRoot '../.docs/sdd/specs') -Directory -Filter '*-task-0077-*' | Select-Object -First 1
    Copy-Item -Recurse $closed.FullName (Join-Path $specs $closed.Name)
    $script:Closed = $closed.Name
    $script:Result = Invoke-Build $root
  }

  It 'lee la plantilla nueva rellena' {
    Get-Row $script:Result.Text '20260926-100000-feature-0100-nuevo' | Should -Match '^\| 2026-09-26 \| 0100 \| docs \| 2 \| 3 \| 1\.5 \|'
  }

  It 'sigue leyendo un walkthrough cerrado con la tabla 4.2 vieja' {
    Get-Row $script:Result.Text $script:Closed | Should -Match '^\| 2026-09-25 \| 0077 \| '
  }

  It 'no avisa de nada' {
    $script:Result.Warnings | Should -BeNullOrEmpty
  }
}
```

Ejecuta la verificación: fallan los 5 de literales; los 3 del log pueden pasar ya (el script no lee §4): es el contrato de no regresión y se anota así. Copia los dos ficheros a `<scratchpad>/red-copies/t2/`.

- [ ] **Step 2: Paso 7.** Tras la frase de la Task 1, añade:

  > El smoke da una fila por THEN de la spec con su evidencia, uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz —pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio— solo cuenta como verificado con `ejecución real`, y un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: «lo cubre el test» es `suite`, no verificado. Di también cuánto tardó la suite completa. En el RED, ninguno de los sujetos que presentaron la validación separó la evidencia por THEN, y 2 de 6 dieron el 400 por visto sin provocarlo (`tests/closing-verification-red.md`).

- [ ] **Step 3: Walkthrough.** En «4.1 Builds», tras la línea existente: `- Suite completa: \`<comando>\` → <resultado> · <duración> *(si pasa de 10 min, apúntalo en 4.3 como deuda del proyecto, con la duración)*`. En «4.2», la tabla pasa a `| THEN | Evidencia | Resultado |` con la ayuda `> Una fila por THEN de la spec. Evidencia: \`suite\` · \`ejecución real\` · \`no probado\`. Un THEN que se ve en una interfaz solo cuenta como verificado con \`ejecución real\`.` En «4.3», `- Suite de más de 10 min: <duración> — deuda del proyecto.`

- [ ] **Step 4: Verificación** en verde; comparar RED; commit `feat(sdd-start-feature): evidencia por THEN y duración de la suite en la validación`.

- [ ] **Step 5: GREEN web** (con la Task 1 y la Task 2 commiteadas): copia limpia del kit con `git archive HEAD skills .claude-plugin` a `<scratchpad>/kit-green`, y `SPEC_DIR=<abs> PHASE=green SUBJECT_SH=<abs>/green/web.sh SCENARIOS="v6 v7f v8" SUBJECT=1` y `SUBJECT=2` con `SUBJECT_CAP=15 COST_CAP=12`. Veredicto por sujeto, contando sobre el `.jsonl`: parada por PID o puerto (0 intentos por nombre o por patrón, denegados incluidos), servidor parado antes del guion en `v7f` y arrancado con su puerto en `v8` (`escuchando al acabar` del `state.txt`), una fila por THEN con evidencia, el 400 provocado y la duración de la suite; filas de control: visual en `v6` con medidas y capturas, «Me salí del plan en…» primero, guion numerado, pregunta de validación. Evidencia en `tests/closing-verification-green.md`.

### Task 3 — `task-done` solo con el commit hecho

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/ClosingVerification.Tests.ps1`, `Describe 'Native: task-done tras el commit'`
**Superficies**: docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingVerification.Tests.ps1 -CI"`

**Interfaces**:
- Consume: nada
- Produce: nada

**Ficheros**: modificar `skills/sdd-start-feature/SKILL.md`, `tests/ClosingVerification.Tests.ps1`, `tests/closing-verification-green.md`

- [ ] **Step 1: Test RED**

```powershell
Describe 'Native: task-done tras el commit' {
  It 'task-done va en su propia orden y solo si HEAD cambió' {
    Assert-Literal (Get-Step 6) @('`task-done` va en su propia orden, después de comprobar que el commit existe', 'si `HEAD` sigue en la base de la task, el pre-commit lo rechazó', 'lee su mensaje y arregla la causa')
  }
}
```

- [ ] **Step 2: Paso 6, «En Native».** Tras «…que apunta en el ledger el `HEAD` del momento.», añade:

  > `task-done` va en su propia orden, después de comprobar que el commit existe: si `HEAD` sigue en la base de la task, el pre-commit lo rechazó; lee su mensaje y arregla la causa antes de volver a commitear, porque la «Verificación» de la task es más estrecha que el hook y `task-done` la pasaría igual (en el RED, el sujeto con el hook en rojo escribió `complete` sobre un rango vacío, `tests/closing-verification-red.md`).

- [ ] **Step 3: Verificación**, comparar RED, commit `feat(sdd-start-feature): task-done de Native solo con el commit hecho`.

- [ ] **Step 4: GREEN** `d1` ×2 con `SUBJECT_SH=<abs>/red/subject.sh` y el kit nuevo. Veredicto: ninguna línea `complete` escrita mientras `HEAD` estaba en la base (orden de las tool calls en el `.jsonl`); si el sujeto para antes de commitear, «disparador ausente», contado aparte.

### Task 4 — Un THEN que depende de la base declara cómo se valida

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/ClosingVerification.Tests.ps1`, `Describe 'Se valida en'`
**Superficies**: docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/ClosingVerification.Tests.ps1 -CI"`

**Interfaces**:
- Consume: nada
- Produce: la línea `Se valida en:` del delta, que lee el paso 7

**Ficheros**: modificar `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-start-feature/SKILL.md`, `tests/ClosingVerification.Tests.ps1`

- [ ] **Step 1: Test RED**

```powershell
Describe 'Se valida en' {
  BeforeAll { $script:SpecTemplate = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-templates/templates/spec-template.md') -Raw }

  It 'la plantilla de spec pide la vía de validación de un THEN que depende de la base' {
    Assert-Literal $script:SpecTemplate @('- Se valida en:', '`worktree con la base al día`', '`validación post-merge con fecha`', 'de la rama de integración, del historial de git, del remoto')
  }

  It 'el paso 7 prepara ese entorno' {
    Assert-Literal (Get-Step 7) @('Si un THEN de la spec lleva `Se valida en:`, prepara ese entorno')
  }
}
```

- [ ] **Step 2: Plantilla.** En el bloque `**ADDED — <título estable>**`, tras `- AND <opcional>`: `- Se valida en: <omite la línea si se ve desde la rama · \`worktree con la base al día\` · \`validación post-merge con fecha\`> *(solo si el THEN depende de la rama de integración, del historial de git, del remoto o de un entorno que la rama no reproduce: desde la rama de la feature no se puede observar, y el dev-lead no puede validarlo)*`.

- [ ] **Step 3: Paso 7.** Tras la frase de la Task 2: `Si un THEN de la spec lleva \`Se valida en:\`, prepara ese entorno (el worktree con la base al día) y el guion lo usa, en vez de pedir al usuario que se lo monte.`

- [ ] **Step 4: Verificación**, comparar RED, commit `feat(sdd-templates): vía de validación de un THEN que depende de la base`.

- [ ] **Step 5: GREEN** `b1` ×2. Veredicto: la spec del sujeto lleva `Se valida en:` con un valor distinto de la rama bajo el THEN de «Nada que comprobar».

### Task 5 — Aprendizajes en los docs vivos

**Modelo**: la sesión (Native)
**Tests RED**: ninguno: docs sin conducta (el `tech-stack.md` lo lee quien lanza campañas del kit)
**Superficies**: docs
**Verificación**: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1 -CI"`

**Ficheros**: modificar `.docs/sdd/tech-stack.md`

- [ ] **Step 1**: en «Sujetos headless», tras la entrada de la 0077 «Un sujeto puede matar todos los procesos de node», añade: «**Un hook deniega parar por nombre en las campañas con servidor** (task 0036): un `PreToolUse` sobre `Bash|PowerShell` que deniega `taskkill /IM`, `pkill`, `killall`, `Stop-Process -Name` y los filtros por `CommandLine` deja la tool call en el stream, así que la medida no cambia, y no tumba los MCP de otras sesiones ni los servidores de los demás sujetos. Referencia: `green/deny-kill.mjs` de la carpeta de la 0036, con `SETTINGS` en `green/web.sh`.»
- [ ] **Step 2**: commit `docs(tech-stack): hook que deniega parar por nombre en las campañas web`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 3h
- Base de la estimación: 5 tasks de texto con tests de literales y 3 campañas GREEN cortas (0077: ~1 h de implementación y cierre con una campaña de 25 sujetos)
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `NO_COLOR=1 pwsh -NoProfile -Command "Invoke-Pester -Path tests -CI"` (con los `Slow`), con su duración
- [ ] Revisor final Opus + `sdd-kit:effort-high`
- [ ] Spec satisfecha (§4)
- [ ] Cierre con `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «El trabajo se valida con el usuario antes de cerrar» (evidencia por THEN, fallo provocado, duración) → Task 2. ✓
- ADDED «El agente para lo que arrancó por su PID o su puerto» → Task 1 (GREEN en la Task 2). ✓
- ADDED «El guion de pruebas empieza con el entorno parado…» → Task 1 (GREEN `v7f`, `v8`). ✓
- ADDED «Una task Native no se da por completa sin su commit» → Task 3. ✓
- ADDED «Un THEN que solo se observa con la base al día declara cómo se valida» → Task 4. ✓
- ADDED «El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite» → Task 2. ✓
- `estimation` ADDED «El log lee igual los walkthroughs de antes y de después…» → Task 2. ✓
- Perfil `delegate`: sin gate del plan; cada escenario tiene su task (comprobado arriba).
