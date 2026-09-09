---
id: 20260909-210515-task-0000-english-file-names
task: 0000
title: Plan de implementación — Nombres de fichero en inglés
spec: ./spec.md
status: draft
created: 2026-09-09
---

# Plan de implementación — Nombres de fichero en inglés

## Decisiones que he tomado yo — valida estas

1. **Ejecución en línea, las 4 tasks** — desvío declarado del default del kit (Art. IV: `subagent-driven-development`). Motivo: el trabajo es un rename mecánico cuyo resultado verifica un test automático, no prosa que un implementador deba interpretar. Despachar subagentes añadiría cuatro rondas de encargo y revisión para producir `git mv` y sustituciones que el test valida en un comando.
2. **Modelo: el de la sesión (Opus 5), effort medio** — al ir en línea no hay despacho que declarar modelo. Ambos valores explícitos como exige el Art. IV.
3. **El test se escribe primero y se ejecuta en RED antes de renombrar nada** — Task 1 antes que Task 2. Es el único RED genuino de esta task y pierde su valor si se escribe después del rename.
4. **Los seis tokens del test se anclan como ruta, no como palabra suelta** — `legado.md` y no `legado`, porque «legado» es palabra castellana corriente y daría falsos positivos en prosa legítima.
5. **`roadmap.md` no se toca**: su única mención (línea 55) está dentro de la release cerrada v1.0.0, que es histórico sellado por decisión 6 de la spec.
6. **Coste estimado: 1,5 h**, sin coste de despacho al ir en línea.

**Goal**: que ningún nombre de fichero o carpeta que el kit fija a un proyecto esté en castellano, y que un test impida que vuelva a ocurrir.

**Architecture**: `git mv` para ficheros y carpetas; sustitución de referencias en las 22 rutas vivas; el contenido de las capacidades lo fusiona `sdd-end-task` vía los `MODIFIED` de la spec, no se reescribe a mano. Un test Pester por lista blanca cierra la puerta.

**Tech Stack**: PowerShell 7+, Pester 5, git.

**Spec**: `./spec.md`

## Restricciones globales

- **Art. III** — nombres de skill y de fichero en inglés kebab-case; texto humano en castellano con ortografía correcta.
- **Art. VIII** — las plantillas viven SOLO en `skills/sdd-templates/templates/`; ninguna copia en ningún sitio.
- **Art. X, calidad de código** (literal): *Sin comentarios que repitan el código* — un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario; lo que se conserva es el *porqué* no deducible. El bloque de ayuda de `Get-Help` no es un comentario. *Sin comentarios que citen documentos* — un comentario nunca referencia la constitution, una spec, una task, un requisito ni la carpeta de capacidades. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
- **Histórico sellado intocable**: `.docs/sdd/specs/`, `.docs/sdd/releases/`, `.docs/sdd/changelog.md`, `.docs/sdd/roadmap.md`.
- **`.docs/sdd/capabilities/*.md` no se editan a mano** en esta task: su contenido lo fusiona `sdd-end-task`.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple? — sí se evaluó: sin el test sería un `sed` y nada más, pero entonces la regresión vuelve sin aviso, que es el fallo original.
- [ ] **YAGNI gate**: no se abstrae nada; el test es un fichero plano sin helpers.
- [ ] **Brownfield gate**: retrocompatible vía las dos migraciones; sin refactor oportunista.
- [ ] **Constitution check**: Art. I (RED mecánico, decisión 4 de la spec), III, V (migración + bump), VIII, X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/NamingConvention.Tests.ps1` — el test de lista blanca; falla si un nombre castellano vuelve a las rutas vivas.
- `skills/sdd-init-brownfield/references/migrations/v1.1.0.md` — migración para proyectos que ya declaran `1.0.0`.

**Renombrar** (`git mv`):

- `.docs/sdd/funcional/` → `.docs/sdd/capabilities/`
- `.docs/sdd/funcional/estimacion.md` → `.docs/sdd/capabilities/estimation.md`
- `.docs/sdd/funcional/migracion.md` → `.docs/sdd/capabilities/migration.md`
- `.docs/sdd/funcional/flujo-de-task.md` → `.docs/sdd/capabilities/task-flow.md`
- `skills/sdd-templates/templates/funcional-template.md` → `capability-template.md`
- `skills/sdd-templates/templates/changelog-cliente-template.md` → `client-changelog-template.md`

**Modificar** (22 rutas vivas): `README.md`; `.docs/sdd/{architecture,constitution,estimation,estimation-log,mission,tech-stack}.md`; `skills/sdd-consult/SKILL.md`; `skills/sdd-end-release/references/acta-y-retro.md`; `skills/sdd-end-task/references/aprendizajes-skills.md`; `skills/sdd-init-brownfield/references/{generacion.md,migrations/README.md,migrations/v1.0.0.md}`; `skills/sdd-init-greenfield/{SKILL.md,references/estructura.md}`; `skills/sdd-start-task/{SKILL.md,references/review-spec.md}`; `skills/sdd-templates/SKILL.md`; `skills/sdd-templates/templates/{feedback,plan,spec}-template.md` y las dos renombradas.

**NO se tocan**:

- `.docs/sdd/specs/**`, `.docs/sdd/releases/**`, `.docs/sdd/changelog.md`, `.docs/sdd/roadmap.md` — histórico sellado; describen lo entregado.
- `.docs/sdd/capabilities/*.md` (contenido) — lo fusiona `sdd-end-task`.
- `tests/*-red.md`, `tests/*-green.md`, `skills/*/references/` con nombre castellano propio, fixtures — deuda declarada (decisión 7 de la spec).

### 1.3 Migraciones

Dos rutas de entrada, un destino:

- `v1.0.0.md` corregido en sitio → proyecto sin migrar: `funcional.md` aterriza en `capabilities/legacy.md`.
- `v1.1.0.md` nuevo, idempotente por predicado → proyecto que ya declara `1.0.0`: renombra `funcional/`→`capabilities/`, `legado.md`→`legacy.md`, `changelog-cliente.md`→`client-changelog.md`. Gate por rename masivo. Si no existe `funcional/`, se salta y se dice.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Sustitución global toca histórico sellado | Media | Alto — falsea un changelog | El comando de Task 3 enumera rutas explícitas, nunca `-r` sobre `.docs/sdd/` |
| El token `legado` da falsos positivos en prosa | Alta si se ancla mal | Medio — test irrompible | Se ancla como `legado.md` (decisión 4) |
| Queda una referencia suelta | Media | Medio | Es justo lo que detecta el test de Task 1 |

### 1.8 Rollout

Bump a `1.1.0` en `.claude-plugin/plugin.json` y entrada de changelog: ambos en el cierre (`sdd-end-task` + `add-to-changelog`), no en estas tasks.

### 1.9 Excepciones a la constitution

Ninguna. La decisión 4 de la spec no es excepción al Art. I: es la vía del RED mecánico, con el RED ejecutado y documentado en Task 1.

---

## 2. Tasks

### Task 1 — Test de convención de nombres, en RED

**Modelo**: Opus 5 (sesión), effort medio
**Ejecución**: en línea — motivo en decisión 1
**Tests RED**: `tests/NamingConvention.Tests.ps1` (es el propio deliverable)

**Ficheros**: crear `tests/NamingConvention.Tests.ps1`

- [ ] **Step 1: Escribir el test**

```powershell
BeforeAll {
  $script:Root = Split-Path -Parent $PSScriptRoot

  # Lista blanca: solo rutas vivas. El historico sellado (specs/, releases/,
  # changelog.md, roadmap.md) conserva los nombres antiguos porque describe lo entregado.
  $script:LivePaths = @(
    'README.md'
    '.docs/sdd/mission.md'
    '.docs/sdd/constitution.md'
    '.docs/sdd/architecture.md'
    '.docs/sdd/tech-stack.md'
    '.docs/sdd/estimation.md'
    '.docs/sdd/estimation-log.md'
  )

  $script:ForbiddenTokens = @(
    'funcional'
    'changelog-cliente'
    'legado\.md'
    'estimacion\.md'
    'migracion\.md'
    'flujo-de-task'
  )

  function Get-LiveFile {
    $named = foreach ($relative in $script:LivePaths) {
      $full = Join-Path $script:Root $relative
      if (Test-Path $full) { Get-Item $full }
    }
    $skills = Get-ChildItem (Join-Path $script:Root 'skills') -Recurse -File -Filter '*.md'
    $capabilities = Get-ChildItem (Join-Path $script:Root '.docs/sdd/capabilities') -File -Filter '*.md' -ErrorAction SilentlyContinue
    @($named) + @($skills) + @($capabilities)
  }
}

Describe 'Convencion de nombres (Art. III)' {
  It 'ninguna ruta viva contiene el token <_>' -ForEach $script:ForbiddenTokens {
    $token = $_
    $offenders = Get-LiveFile | Where-Object {
      (Get-Content $_.FullName -Raw) -match $token
    } | ForEach-Object { $_.FullName.Replace($script:Root, '').TrimStart('\') }

    $offenders | Should -BeNullOrEmpty -Because "el Art. III exige nombres de fichero en ingles kebab-case"
  }

  It 'no existe ninguna ruta con nombre castellano en disco' {
    $paths = @(
      '.docs/sdd/funcional'
      'skills/sdd-templates/templates/funcional-template.md'
      'skills/sdd-templates/templates/changelog-cliente-template.md'
    )
    foreach ($p in $paths) {
      Test-Path (Join-Path $script:Root $p) | Should -BeFalse -Because "$p debe estar renombrado"
    }
  }
}
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `pwsh -NoProfile -Command "Invoke-Pester tests/NamingConvention.Tests.ps1 -Output Detailed"`
Esperado: FAIL en los seis tokens y en las tres rutas. Anotar el recuento de ficheros infractores (referencia de la spec: 27).

- [ ] **Step 3: Commit**

```bash
git add tests/NamingConvention.Tests.ps1
git commit -m "test(naming): RED de la convencion de nombres del Art. III"
```

### Task 2 — Renombrar ficheros y carpetas

**Modelo**: Opus 5 (sesión), effort medio
**Ejecución**: en línea
**Tests RED**: los de Task 1, ya commiteados

**Ficheros**: los seis `git mv` de §1.1

- [ ] **Step 1: Renombrar**

```bash
git mv .docs/sdd/funcional .docs/sdd/capabilities
git mv .docs/sdd/capabilities/estimacion.md .docs/sdd/capabilities/estimation.md
git mv .docs/sdd/capabilities/migracion.md .docs/sdd/capabilities/migration.md
git mv .docs/sdd/capabilities/flujo-de-task.md .docs/sdd/capabilities/task-flow.md
git mv skills/sdd-templates/templates/funcional-template.md skills/sdd-templates/templates/capability-template.md
git mv skills/sdd-templates/templates/changelog-cliente-template.md skills/sdd-templates/templates/client-changelog-template.md
```

- [ ] **Step 2: Verificar** — `git status` muestra seis renames y ninguna copia; `Test-Path .docs/sdd/funcional` → `False`.
- [ ] **Step 3: Commit**

```bash
git commit -am "refactor(sdd): renombrar a ingles la carpeta de capacidades y las plantillas"
```

### Task 3 — Actualizar las referencias en las rutas vivas

**Modelo**: Opus 5 (sesión), effort medio
**Ejecución**: en línea
**Tests RED**: Task 1

**Ficheros**: las 22 rutas de §1.1, excluido el histórico sellado y el contenido de `capabilities/`

- [ ] **Step 1: Sustituir** — `funcional/` → `capabilities/`, `funcional.md` → el nombre que corresponda por contexto, `<capacidad>` → `<capability>`, `funcional-template.md` → `capability-template.md`, `changelog-cliente` → `client-changelog`. Rutas enumeradas explícitamente; nunca `-r` sobre `.docs/sdd/`.
- [ ] **Step 2: Revisar el diff** — la prosa castellana se conserva («el documento funcional heredado» sigue siendo castellano correcto donde describe, no donde nombra un fichero).
- [ ] **Step 3: Verificación** — `Invoke-Pester tests/NamingConvention.Tests.ps1`. Esperado: PASS.
- [ ] **Step 4: Commit**

```bash
git commit -am "refactor(sdd): actualizar las referencias a la carpeta de capacidades"
```

### Task 4 — Las dos migraciones

**Modelo**: Opus 5 (sesión), effort medio
**Ejecución**: en línea
**Tests RED**: verificación por predicado sobre fixture, documentada en el walkthrough

**Ficheros**: modificar `migrations/v1.0.0.md`; crear `migrations/v1.1.0.md`

- [ ] **Step 1: Corregir `v1.0.0.md` en sitio** — su paso 1 pasa a `git mv .docs/sdd/funcional.md .docs/sdd/capabilities/legacy.md`, con la nota de excepción y la sección «Verificación» actualizadas a las rutas nuevas.
- [ ] **Step 2: Escribir `v1.1.0.md`** — pasos-predicado: si existe `.docs/sdd/funcional/` → **gate** `git mv` a `capabilities/`; si existe `capabilities/legado.md` → `git mv` a `legacy.md`; si existe `changelog-cliente.md` → `git mv` a `client-changelog.md`; actualizar las referencias en `CLAUDE.md` y `.docs/sdd/*.md` del proyecto. Sección «Verificación» con los `Test-Path` que deben dar `False`.
- [ ] **Step 3: Verificación sobre fixture** — dos proyectos de prueba en el scratchpad (uno sin marcador y con `funcional.md`; otro con `sdd-kit.json` en `1.0.0` y `funcional/legado.md`); aplicar la ruta que corresponda a cada uno y comprobar que ambos terminan en `capabilities/legacy.md` con la nota. Documentar el resultado.
- [ ] **Step 4: Suite completa** — `Invoke-Pester tests/ -Output Detailed`. Esperado: los 136 previos + los nuevos, en verde.
- [ ] **Step 5: Commit**

```bash
git commit -am "feat(migrations): corregir v1.0.0 en sitio y anadir v1.1.0 para proyectos ya migrados"
```

---

## Estimación y esfuerzo

- Tipo: chore
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1,5 h
- Base de la estimación: 4 tasks, ninguna con incertidumbre de diseño; el riesgo real es la sustitución de referencias en 22 ficheros, acotada por el test. Referencia del estimation-log: las tasks de tipo `docs`/`chore` del kit han ido entre 0,5 h y 2 h.
- Confianza: alta

---

## 3. Validación final

- [ ] `Invoke-Pester tests/ -Output Detailed` en verde
- [ ] `claude plugin validate --strict`
- [ ] Cada requisito del delta de la spec tiene su task (§4)
- [ ] Cierre vía `sdd-end-task` — ahí van el bump a 1.1.0, el changelog y la fusión de los `MODIFIED` en `capabilities/`

---

## 4. Self-review (cobertura spec → tasks)

- `funcional/` → `capabilities/` → Task 2. ✓
- `legado.md` → `legacy.md` (en migraciones) → Task 4. ✓
- placeholder `<capacidad>` → `<capability>` → Task 3. ✓
- `changelog-cliente.md` → `client-changelog.md` → Tasks 2 y 3. ✓
- plantillas renombradas → Task 2. ✓
- las 4 capacidades del repo → Task 2 (fichero) + cierre (contenido). ✓
- referencias en `skills/`, anclaje vivo y `README.md` → Task 3. ✓
- `v1.0.0.md` en sitio + `v1.1.0.md` → Task 4. ✓
- test que impide la regresión → Task 1. ✓
- histórico sellado intacto → N/A por diseño, verificado en el diff de Task 3. ✓
- los 5 `MODIFIED` de `task-flow` y los 3 de `migration` → los fusiona `sdd-end-task` en el cierre. ✓
