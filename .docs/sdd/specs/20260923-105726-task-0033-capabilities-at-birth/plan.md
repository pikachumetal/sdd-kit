---
id: 20260923-105726-task-0033-capabilities-at-birth
task: 0033
title: Plan de implementación — Capacidades al nacer
spec: ./spec.md
status: approved
created: 2026-09-23
---

# Plan de implementación — Capacidades al nacer

> Compatible con `superpowers:writing-plans`. Ejecución: `superpowers:subagent-driven-development` por defecto; aquí las cuatro tasks declaran `en línea` con motivo.

## Decisiones que he tomado yo — valida estas

1. **Tasks 1–3 en línea, en el hilo (Opus de la sesión).** Motivo: son unas 60 líneas de texto de skills en cinco ficheros, con la redacción ya fijada en este plan; un implementador tendría que releer las dos init y la plantilla en cada task, y la 0019 midió que en línea con el contexto cargado sale a una cuarta parte del tiempo estimado. TDD del hilo: los tests de cada task se escriben y fallan antes de tocar el texto.
2. **Task 4, la GREEN, la ejecuta el hilo**: los subagentes no pueden lanzar sujetos headless (`tech-stack.md`, T3).
3. **Una sola revisión final de rama**: subagente `general-purpose`, **Sonnet, effort medium** (el effort va en el encargo porque el tool `Agent` no lo admite), con la cabecera de `encargo-revision.md` y el bloque «De código». Cubre todos los commits del hilo. Unos 100k tokens.
4. **Un fichero de tests nuevo, `tests/CapabilitiesAtBirth.Tests.ps1`**, con un `Describe` por task. No se amplía `MigrationInitParity.Tests.ps1`: esta task no toca migraciones.
5. **La regla del funcional va al paso 3 (Estructura) de greenfield, no al paso 1**: el THEN mira lo que queda al crear la estructura, y el paso 3 ya es la lista de lo que la init deja. `estructura.md` gana la línea de `sources/` en el árbol.
6. **Brownfield: la negativa a volcar sube al `SKILL.md` (paso 5)** además de estar en `generacion.md`, porque decide (anatomía de `architecture.md`). `b1` ya se negaba leyendo solo `generacion.md`; la línea en el `SKILL.md` no cambia la conducta, la fija donde se lee primero.
7. **GREEN: seis escenarios de un turno, 2 sujetos cada uno (12)**, uno por camino condicional del texto nuevo: volcado pedido (partición), volcado con partición ya aprobada (historial y gate), brownfield pidiendo volcado (control), greenfield con código sin petición (no se ofrece), greenfield con funcional (sources, carpetas) y brownfield completo (carpetas). Coste estimado: ~9 $, dentro de los 16,27 $ que quedan del techo de 20 $.
8. **Riesgo**: `sdd-init-greenfield/SKILL.md` y `generacion.md` los toca después la 0034; no hay otra task abierta sobre ellos. Sin conflicto previsto.

**Goal**: que ninguna init cree carpetas vacías, que el volcado inicial exista solo como excepción de greenfield con partición aprobada e historial `init`, y que el funcional aportado quede literal en `.docs/sdd/sources/`.

**Architecture**: edición de texto de dos skills y una plantilla, con tests Pester estructurales por THEN y una campaña GREEN headless para la conducta.

**Tech Stack**: Markdown de skills; PowerShell 7 + Pester 5 (`tests/*.Tests.ps1`, hook `pre-commit`); sujetos headless `claude -p` con lanzador Python.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Art. I: ninguna edición de skill sin ciclo RED→GREEN documentado en `tests/`. El RED está en `red/README.md` de la carpeta de la spec; la evidencia se resume en `tests/capabilities-at-birth-red.md` y `tests/capabilities-at-birth-green.md`.
- Art. III: texto humano en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case.
- Art. VIII: las plantillas viven solo en `skills/sdd-templates/templates/`.
- Línea de historial del volcado, literal: `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`.
- Funcional pegado en el chat: `sources/<yyyyMMdd>-functional-brief.md`. Cita desde el roadmap: `sources/<fichero> §<n>`.
- Ninguna carpeta de `.docs/sdd/` se crea vacía ni con `.gitkeep`.
- **Art. X — Calidad de código** (literal):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough (T14, 2026-09-09; 110 comentarios con cita en los dos retos del equipo).
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Verde: `Invoke-Pester tests` (lo ejecuta el hook `pre-commit`).

### De proceso

- **Política de modelos** (Art. IV): modelo y effort declarados siempre al despachar; gama media como suelo para revisores e implementadores que trabajan a partir de prosa; el tier más barato solo para transcribir código ya escrito o arreglos mecánicos de un fichero; `fable` y `opus xhigh` prohibidos por defecto.
- **Modo de ejecución por defecto**: `subagent-driven-development`; en línea solo si la task lo declara con motivo.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By` de la sesión.
- Techo de las campañas headless: 20 $ (gastados 3,73 $ en el RED).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: texto en ficheros existentes y un fichero de tests; sin scripts nuevos.
- [x] **YAGNI gate**: sin umbral de tamaño, sin campo `Cobertura`, sin migración.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 4), Art. V (sin migración: solo cambia lo que crea una init nueva; decisión 8 de la spec), Art. VIII (se toca la plantilla, no copias).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/CapabilitiesAtBirth.Tests.ps1` — tests estructurales por THEN.
- `tests/capabilities-at-birth-red.md`, `tests/capabilities-at-birth-green.md` — evidencia resumida.
- `green/` en la carpeta de la spec — lanzador, moldes, peticiones y salidas de la GREEN.

**Modificar**:

- `skills/sdd-init-greenfield/references/estructura.md` — árbol: `capabilities/` y `specs/` no se crean; `sources/` opcional.
- `skills/sdd-init-greenfield/SKILL.md` — paso 3 (funcional en `sources/`), paso 6 (volcado), red flag y dos racionalizaciones.
- `skills/sdd-init-brownfield/references/generacion.md` — paso 5 en viñetas, carpetas que no se crean, negativa a volcar.
- `skills/sdd-init-brownfield/SKILL.md` — paso 5: carpetas y negativa a volcar.
- `skills/sdd-templates/templates/capability-template.md` — regla 4 y ayuda del historial.

**NO se tocan**:

- `skills/sdd-init-brownfield/references/migrations/` — sin migración (decisión 8 de la spec).
- `skills/sdd-start-task/` — leer `sources/` por su cuenta está fuera del Scope.
- `.docs/sdd/capabilities/*.md` — la fusión del delta es del cierre (`sdd-end-task`).

### 1.6 Dependencias

- La 0034 toca después los mismos `SKILL.md` de las init.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La GREEN del volcado no llega a escribir ficheros en un turno (se para a pedir la partición) | alta en G1, que es lo esperado | bajo | G2 da la partición ya aprobada en la petición para medir historial y gate |
| `-p` bloquea escrituras en `.claude/` | alta | bajo | las peticiones excluyen `.claude/` y `.gitignore`, como en los relanzamientos del RED |
| Reordenar el paso 5 de `generacion.md` rompe tests de la 0019 que buscan sus frases | media | bajo | se conservan literales `autoMemoryEnabled`, `Build-EstimationLog.ps1`, `.playwright-mcp/`, `.superpowers/`; la suite corre en cada commit |

### 1.8 Rollout

Directo: entra en la release 1.2.0 en curso.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Carpetas que no nacen vacías

**Modelo**: Opus 5.5 de la sesión, effort de la sesión.
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: TDD del hilo, `Describe 'Carpetas que no nacen vacías'` en `tests/CapabilitiesAtBirth.Tests.ps1`.

**Interfaces**:
- Consume: nada.
- Produce: el fichero de tests con sus helpers `Get-KitFile` y `Get-NumberedStep`, que usan las Tasks 2 y 3.

**Ficheros**: `tests/CapabilitiesAtBirth.Tests.ps1`, `sdd-init-greenfield/references/estructura.md`, `sdd-init-brownfield/references/generacion.md`, `sdd-init-brownfield/SKILL.md`.

- [ ] **Step 1: Tests RED.** Crear `tests/CapabilitiesAtBirth.Tests.ps1`:

```powershell
BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:RepoRoot $RelativePath)
  }

  function Get-NumberedStep([string]$Content, [int]$Number) {
    return [regex]::Match($Content, "(?ms)^$Number\. .*?(?=^\d+\. |^## |\z)").Value
  }

  $script:Tree = Get-KitFile 'skills/sdd-init-greenfield/references/estructura.md'
  $script:BrownfieldStructure = Get-NumberedStep (Get-KitFile 'skills/sdd-init-brownfield/references/generacion.md') 5
  $script:BrownfieldSkillStep = Get-NumberedStep (Get-KitFile 'skills/sdd-init-brownfield/SKILL.md') 5
}

Describe 'Carpetas que no nacen vacías' {
  It 'el árbol de greenfield no crea <_> vacía' -ForEach @('capabilities/', 'specs/') {
    $line = ($script:Tree -split "`r?`n") | Where-Object { $_ -match [regex]::Escape("── $_") }
    $line | Should -Match 'no se crea'
  }

  It 'greenfield prohíbe el .gitkeep' {
    $script:Tree | Should -Match 'ni con `\.gitkeep`'
  }

  It 'brownfield no crea capabilities/ ni specs/ y prohíbe el .gitkeep' {
    $script:BrownfieldStructure | Should -Match '`capabilities/` y `specs/` no se crean'
    $script:BrownfieldStructure | Should -Match 'ni con `\.gitkeep`'
  }

  It 'brownfield no vuelca aunque el usuario lo pida, en generacion.md y en el SKILL.md' {
    $script:BrownfieldStructure | Should -Match 'aunque el usuario lo pida'
    $script:BrownfieldSkillStep | Should -Match 'aunque el usuario lo pida'
  }

  It 'el paso 5 de generacion.md va en viñetas' {
    @($script:BrownfieldStructure -split "`r?`n" | Where-Object { $_ -match '^   - ' }).Count | Should -BeGreaterOrEqual 6
  }
}
```

- [ ] **Step 2: RED.** `Invoke-Pester tests/CapabilitiesAtBirth.Tests.ps1 -Output Detailed`. Esperado: fallan los cinco `It` (seis casos con el `-ForEach`).
- [ ] **Step 3: Árbol de `estructura.md`.** Sustituir las líneas de `capabilities/` y `specs/`:

```text
│       ├── capabilities/     (no se crea: nace con la primera task que declara una capacidad, o con el volcado inicial del paso 6)
```

```text
│       └── specs/            (no se crea: nace con la primera task o patch)
```

  y añadir tras el bloque del árbol, antes de «Sin carpeta `templates/`»: «Git no versiona carpetas vacías: ninguna carpeta de `.docs/sdd/` se crea vacía ni con `.gitkeep`.»
- [ ] **Step 4: Paso 5 de `generacion.md` en viñetas**, sin cambiar el contenido vigente salvo las carpetas:

```markdown
5. **Estructura**: `.docs/sdd/` con:
   - `estimation.md` calcando `estimation-template.md`, con la calibración vacía.
   - `estimation-log.md` generado con `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`, que lo deja con su cabecera y sin filas (el script vive en el kit y no se copia al proyecto).
   - `sdd-kit.json` con la versión del kit instalada, el modo de ids y las claves de control que respondió la entrevista (`{ "version", "channel": "plugin"|"cli", "updated", "ids": { "mode": "tracker"|"sequence" }, "control"?, "merge"? }`, con `ids.mode` de la pregunta 1, con `control` y `merge` solo con lo respondido; la versión es la mayor de `references/migrations/` de esta skill).
   - **`capabilities/` y `specs/` no se crean**: git no versiona carpetas vacías, y ninguna se crea vacía ni con `.gitkeep`. `specs/` nace con la primera task o patch; `capabilities/`, con la primera task que toque una capacidad. **Brownfield no vuelca capacidades, aunque el usuario lo pida**: volcar el comportamiento de golpe produce ficheros que nadie revisa. Si lo pide, explícale que crecen task a task.
   - Sin carpeta `templates/`: las plantillas viven en el skill `sdd-templates`.
   - ¿Changelog? — preguntas 5 y 6 del paso 3 (o decisión pendiente); si sí, `changelog.md` calcando `changelog-template.md`, y ¿también novedades para el cliente? (`client-changelog.md` calcado de `client-changelog-template.md`, alimentado por `sdd-end-release` desde las release notes).
   - **Configuración del proyecto**: `.claude/settings.json` se crea, o se fusiona sin tocar las demás claves, con `"autoMemoryEnabled": false`, porque la memoria automática vive en una sola máquina y lo que se aprende va a los docs; si ya tiene `"autoMemoryEnabled": true`, pregunta antes de cambiarlo y, si el usuario dice que no, se deja y el resumen de cierre lo anota.
   - `.gitignore` gana `.playwright-mcp/` y `.superpowers/` si faltan, sin duplicar líneas, y se crea si no existe.
   - **`environments.md`** calcando `environments-template.md` del skill `sdd-templates` **si el inventario encontró scripts de entorno** (medido en `tests/entorno-worktree-red.md`, F3: sin este paso el entorno queda repartido en notas que ningún predicado lee).
```

- [ ] **Step 5: Paso 5 del `SKILL.md` de brownfield.** Tras «`estimation-log.md` generado con `Build-EstimationLog.ps1`, nunca a mano.» añadir: «`capabilities/` y `specs/` no se crean (git no versiona carpetas vacías), y las capacidades no se vuelcan aunque el usuario lo pida: crecen task a task.»
- [ ] **Step 6: GREEN estructural.** `Invoke-Pester tests -Output Detailed`. Esperado: `Describe 'Carpetas que no nacen vacías'` en verde y el resto de la suite sin fallos.
- [ ] **Step 7: Commit** `feat(sdd-init): ninguna init crea capabilities/ ni specs/ vacías`, con cuerpo.

### Task 2 — Volcado inicial en greenfield

**Modelo**: Opus 5.5 de la sesión, effort de la sesión.
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: TDD del hilo, `Describe 'Volcado inicial en greenfield'` en `tests/CapabilitiesAtBirth.Tests.ps1`.

**Interfaces**:
- Consume: `Get-KitFile` y `Get-NumberedStep` del `BeforeAll` de la Task 1.
- Produce: la línea de historial literal `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`, que mide la GREEN.

**Ficheros**: `tests/CapabilitiesAtBirth.Tests.ps1`, `sdd-init-greenfield/SKILL.md`, `sdd-templates/templates/capability-template.md`.

- [ ] **Step 1: Tests RED.** Añadir:

```powershell
Describe 'Volcado inicial en greenfield' {
  BeforeAll {
    $script:InitLine = '- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código'
    $script:Greenfield = Get-KitFile 'skills/sdd-init-greenfield/SKILL.md'
    $script:ClosingStep = Get-NumberedStep $script:Greenfield 6
    $script:CapabilityTemplate = Get-KitFile 'skills/sdd-templates/templates/capability-template.md'
  }

  It 'el cierre de greenfield vuelca solo a petición del usuario' {
    $script:ClosingStep | Should -Match 'solo si el usuario lo pide'
    $script:ClosingStep | Should -Match 'nunca lo ofrezcas'
  }

  It 'el cierre exige leer el código entero o no volcar' {
    $script:ClosingStep | Should -Match 'código entero'
  }

  It 'la partición se aprueba antes de escribir ningún fichero' {
    $script:ClosingStep | Should -Match 'Antes de escribir ningún fichero'
    $script:ClosingStep | Should -Match 'partición'
  }

  It 'cada capacidad pasa el gate de los documentos de anclaje' {
    $script:ClosingStep | Should -Match 'mismo gate que los documentos de anclaje'
  }

  It 'el cierre y la plantilla llevan la línea de historial init' {
    $script:ClosingStep.Contains($script:InitLine) | Should -BeTrue
    $script:CapabilityTemplate.Contains($script:InitLine) | Should -BeTrue
  }

  It 'la regla 4 de la plantilla dice que las init no vuelcan, salvo la excepción de greenfield' {
    $rule = ($script:CapabilityTemplate -split "`r?`n" | Where-Object { $_ -match '^> 4\. ' })
    $rule | Should -Match 'Las init no vuelcan'
    $script:CapabilityTemplate | Should -Match 'Única excepción: el volcado inicial de `sdd-init-greenfield`'
  }

  It 'greenfield tiene una red flag contra el volcado no pedido o sin partición' {
    $redFlags = [regex]::Match($script:Greenfield, '(?s)## Red flags.*?\|').Value
    $redFlags | Should -Match 'volcando capacidades'
  }
}
```

- [ ] **Step 2: RED.** Esperado: fallan los siete `It` del `Describe` nuevo.
- [ ] **Step 3: Paso 6 de greenfield.** Sustituir el paso 6 por:

```markdown
6. **Cierre**: resumen de lo creado + siguientes pasos — partición fina y estimación cuando `capabilities/` madure; skills de nivel 2 recomendadas según el stack (esta skill no las crea).
   **Volcado inicial de capacidades, solo si el usuario lo pide** (nunca lo ofrezcas). Es la única excepción a que las capacidades crecen task a task, y solo existe en greenfield:
   - Lee el código entero. Si no puedes leerlo entero en esta sesión, dilo y no vuelques.
   - Antes de escribir ningún fichero, propón la partición: la lista de capacidades, cada una con su slug en inglés kebab-case y sustantivo del dominio (regla 1 de `capability-template.md`; el nombre de un módulo del código no es un nombre de capacidad). Espera el «sí».
   - Escribe cada capacidad calcando `capability-template.md`, con lo que el código hace hoy, y preséntala con el mismo gate que los documentos de anclaje.
   - Su «Historial» empieza con `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`.
```

- [ ] **Step 4: Red flag y racionalizaciones de greenfield.** En «Red flags — STOP» añadir: «- Estás volcando capacidades que el usuario no ha pedido, o escribiendo alguna antes de que apruebe la partición.» En la tabla, dos filas:

```markdown
| "El kit dice que las capacidades crecen task a task: me niego a volcarlas" | En greenfield, a petición del usuario, el volcado es la excepción escrita en el paso 6. Negarse es el fallo que mostró el RED (1/2): aplica sus condiciones. |
| "El código es pequeño: vuelco las capacidades y las enseño al final" | La partición se aprueba antes de escribir ningún fichero. En el RED, un volcado directo nombró las capacidades como los módulos del código y las dejó sin historial. |
```

- [ ] **Step 5: `capability-template.md`.** Sustituir la regla 4 por:

```markdown
> 4. Las init no vuelcan: la carpeta `capabilities/` no se crea al inicializar y crece task a task,
>    con la primera que toque cada capacidad. Única excepción: el volcado inicial de `sdd-init-greenfield`
>    (paso 6), a petición del usuario y con la partición aprobada antes. Brownfield no vuelca nunca.
```

  y en la ayuda del «Historial», tras la frase de auditar, añadir: «> Una capacidad nacida del volcado inicial de una init greenfield empieza con la línea `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`.» (en una sola línea de cita o partida en dos con `>`; el test busca la línea literal, así que la línea de historial no se parte).
- [ ] **Step 6: GREEN estructural.** `Invoke-Pester tests -Output Detailed`. Esperado: verde entero.
- [ ] **Step 7: Commit** `feat(sdd-init-greenfield): volcado inicial de capacidades como excepción`, con cuerpo.

### Task 3 — El funcional aportado se guarda literal

**Modelo**: Opus 5.5 de la sesión, effort de la sesión.
**Ejecución**: en línea — ver decisión 1.
**Tests RED**: TDD del hilo, `Describe 'Funcional aportado en greenfield'` en `tests/CapabilitiesAtBirth.Tests.ps1`.

**Interfaces**:
- Consume: `Get-KitFile`, `Get-NumberedStep` y `$script:Tree` del `BeforeAll` de la Task 1.
- Produce: la ruta `.docs/sdd/sources/`, el nombre `<yyyyMMdd>-functional-brief.md` y la cita `sources/<fichero> §<n>`, que mide la GREEN.

**Ficheros**: `tests/CapabilitiesAtBirth.Tests.ps1`, `sdd-init-greenfield/SKILL.md`, `sdd-init-greenfield/references/estructura.md`.

- [ ] **Step 1: Tests RED.** Añadir:

```powershell
Describe 'Funcional aportado en greenfield' {
  BeforeAll {
    $script:StructureStep = Get-NumberedStep (Get-KitFile 'skills/sdd-init-greenfield/SKILL.md') 3
  }

  It 'el paso 3 guarda el funcional literal en sources/' {
    $script:StructureStep | Should -Match '`\.docs/sdd/sources/`'
    $script:StructureStep | Should -Match 'nombre original'
    $script:StructureStep | Should -Match 'No se edita nunca'
  }

  It 'el funcional pegado en el chat tiene nombre fijo' {
    $script:StructureStep | Should -Match '<yyyyMMdd>-functional-brief\.md'
  }

  It 'mission lo enlaza y el roadmap cita su sección' {
    $script:StructureStep | Should -Match '`mission\.md` lo enlaza'
    $script:StructureStep | Should -Match 'sources/<fichero> §<n>'
  }

  It 'ninguna capacidad nace del funcional' {
    $script:StructureStep | Should -Match 'Ninguna capacidad nace de él'
  }

  It 'el árbol de greenfield lleva sources/ como opcional' {
    ($script:Tree -split "`r?`n" | Where-Object { $_ -match '── sources/' }) | Should -Match 'opcional'
  }
}
```

- [ ] **Step 2: RED.** Esperado: fallan los cinco `It` del `Describe` nuevo.
- [ ] **Step 3: Paso 3 de greenfield.** Añadir como primera viñeta de «Además:»:

```markdown
   - **Funcional aportado**: si el usuario aporta un funcional (un documento, un correo o texto pegado en el chat), se guarda literal en `.docs/sdd/sources/`: con su nombre original si es un fichero, o como `<yyyyMMdd>-functional-brief.md` si llegó pegado. No se edita nunca: los documentos de anclaje lo resumen y lo enlazan — `mission.md` lo enlaza en una línea, y cada fila de módulo del roadmap que sale de él cita su sección (`sources/<fichero> §<n>`). Ninguna capacidad nace de él: describe lo que se quiere construir, no lo construido.
```

- [ ] **Step 4: Árbol de `estructura.md`.** Añadir antes de la línea de `specs/`:

```text
│       ├── sources/          (opcional: el funcional que aporta el usuario, literal y sin editar · paso 3)
```

- [ ] **Step 5: GREEN estructural.** `Invoke-Pester tests -Output Detailed`. Esperado: verde entero.
- [ ] **Step 6: Commit** `feat(sdd-init-greenfield): el funcional aportado se guarda literal en sources/`, con cuerpo.

### Task 4 — GREEN headless y evidencia

**Modelo**: Opus 5.5 de la sesión (hilo); sujetos Sonnet.
**Ejecución**: en línea — los subagentes no lanzan sujetos headless.
**Tests RED**: el RED previo (`red/README.md`); aquí se verifica.

**Interfaces**:
- Consume: los textos de las Tasks 1–3; `red/driver.py` y `red/molds/`.
- Produce: `green/README.md`, `tests/capabilities-at-birth-red.md`, `tests/capabilities-at-birth-green.md`.

**Ficheros**: `green/` en la carpeta de la spec, `tests/capabilities-at-birth-red.md`, `tests/capabilities-at-birth-green.md`.

- [ ] **Step 1: Montaje.** Copiar `red/driver.py` y `red/molds/` a `green/`; añadir `green/molds/pomodoro-bare/` (el código de `pomodoro` sin `.docs/` ni `CLAUDE.md`). Kit: `git archive HEAD` en el scratchpad tras el commit de la Task 3.
- [ ] **Step 2: Escenarios**, 2 sujetos cada uno:

| # | Molde | Petición | Pasa si |
| --- | --- | --- | --- |
| G1 | `pomodoro` | la de `red/requests/volcado-greenfield.txt` | propone partición con slugs en inglés y para sin escribir ningún fichero en `capabilities/` |
| G2 | `pomodoro` | la misma + «Ya acordamos la partición: `sessions`, `settings`, `notifications` y `history`. Escríbelas.» | escribe las cuatro, cada una con la línea `- <fecha> — init — ADDED volcado inicial desde el código`, y las presenta para aprobar |
| G3 | `pomodoro` | la de `red/requests/volcado-brownfield.txt` | no crea `capabilities/` y explica que crecen task a task (control) |
| G4 | `pomodoro` | «Estamos en el paso 6 (cierre) de sdd-init-greenfield en este proyecto: los documentos ya están aprobados y commiteados. Cierra la init.» | no crea `capabilities/` ni ofrece el volcado |
| G5 | `gym` | la de `red/requests/funcional-greenfield.txt` | `sources/funcional-cliente.md` idéntico al original; `mission.md` lo enlaza; el roadmap cita `§`; sin `capabilities/`, sin `specs/`, sin `.gitkeep` |
| G6 | `pomodoro-bare` | «Lanza sdd-init-brownfield en este proyecto. Te doy por aprobado cada documento. Salta el paso de git y no toques `.claude/` ni `.gitignore`.» | sin `capabilities/`, sin `specs/`, sin `.gitkeep` |

- [ ] **Step 3: Lanzar** los 12 en segundo plano; comprobar coste acumulado frente al techo.
- [ ] **Step 4: Veredicto** por escenario en `green/README.md`, con citas y ficheros. Un escenario 1/2 → REFACTOR del texto y 2 sujetos más de ese escenario.
- [ ] **Step 5: Evidencia resumida** en `tests/capabilities-at-birth-red.md` (desde `red/README.md`) y `tests/capabilities-at-birth-green.md`.
- [ ] **Step 6: Commit** `test(sdd-init): GREEN de capacidades al nacer`, con cuerpo.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 1,5h
- Base de la estimación: tres tasks de texto en línea (~0,5h entre las tres, por la 0019: 0,75h con cuatro tasks y su GREEN) + GREEN de 12 sujetos de un turno en paralelo (~0,5h de reloj) + revisión final y REFACTOR posible (~0,5h).
- Confianza: media

---

## 3. Validación final

- [ ] `Invoke-Pester tests` en verde
- [ ] GREEN: los seis escenarios 2/2
- [ ] Cada requisito de la spec tiene su task (Self-review)
- [ ] Revisión final de rama limpia
- [ ] Cierre vía `sdd-end-task` tras la validación del dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Brownfield no vuelca `capabilities/`» (con petición) → Task 1 (texto) + G3. ✓
- ADDED «Ninguna init crea `capabilities/` vacía» (y `specs/`, sin `.gitkeep`) → Task 1 + G5, G6. ✓
- ADDED «El volcado inicial es una excepción de greenfield»: partición antes de escribir → Task 2 + G1; gate por capacidad e historial `init` → Task 2 + G2; código entero o no vuelca → Task 2 (texto, sin escenario: el molde es legible entero); no se ofrece sin petición → Task 2 + G4. ✓
- ADDED «El funcional aportado se guarda literal»: nombre original, enlace de mission, cita del roadmap, ninguna capacidad → Task 3 + G5; nombre `<yyyyMMdd>-functional-brief.md` si llega pegado → Task 3 (texto, sin escenario). ✓
- Regla «Dónde viven los datos» de `onboarding` → fusión en el cierre. ✓
- Minor de la 0019 (viñetas del paso 5) → Task 1. ✓
- Sin migración → N/A (decisión 8 de la spec). ✓
