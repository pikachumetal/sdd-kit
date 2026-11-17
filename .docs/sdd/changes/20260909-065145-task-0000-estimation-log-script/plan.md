---
id: 20260909-065145-task-0000-estimation-log-script
task: 0000
title: Plan de implementación — Build-EstimationLog.ps1 genérico distribuido con el kit (T7)
spec: ./spec.md
status: approved
approved_at: 2026-09-09
created: 2026-09-09
---

# Plan de implementación — `Build-EstimationLog.ps1` genérico distribuido con el kit (T7)

> **For agentic workers:** REQUIRED SUB-SKILL: `superpowers:subagent-driven-development` (default del kit). Steps con checkbox.

**Goal**: un único `Build-EstimationLog.ps1` en `skills/sdd-templates/scripts/`, con tests Pester, que `sdd-end-task` y `sdd-end-patch` ejecutan desde el kit sin copia en el proyecto, y que lee el formato real de walkthroughs y patches produciendo factor global y por Tipo.

**Architecture**: el script unifica la copia de Alybo (la más completa) con las tolerancias de formato que el kit necesita; la localización del proyecto entra por `-Root` y el script resuelve `.docs/sdd/` o `docs/sdd/`. Se escribe por despacho con TDD sobre fixtures Pester que reproducen líneas reales de los walkthroughs del kit y de Alybo. En paralelo, un RED mide qué hacen hoy `sdd-end-task` y `sdd-end-patch` con la guidance vigente; la edición de sus textos (dos frases) va después del RED y se verifica con GREEN. Cierre con dogfooding: el log del kit se regenera con el script.

**Tech Stack**: PowerShell 7.6 (`pwsh`), Pester 6.1.0 (instalado en la máquina del dev-lead). Markdown para skills y evidencia. Subagentes Sonnet sobre fixtures desechables para el RED/GREEN.

**Spec**: `./spec.md`

## Restricciones globales

Copiadas de la spec y la constitution. Toda task las hereda; **quien despacha las incluye en el encargo**.

- **Ruta del script**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1`. Ninguna copia en ningún proyecto ni en `.tools/`. Las skills lo invocan como `<Base directory de la skill>/../sdd-templates/scripts/Build-EstimationLog.ps1`.
- **Interfaz**: `-Root <raíz del proyecto>` (default: cwd) y `-OutFile` opcional (default: `<docs>/estimation-log.md`). `<docs>` = `.docs/sdd` si existe `.docs/sdd/specs`, si no `docs/sdd`; si ninguno existe, error con mensaje.
- **Entrada**: `walkthrough.md` (sección con "estimado vs real"), `patch.md` (sección "Tiempo (ligero)") y `hotfix.md` (legacy, tipo `hotfix`). Una carpeta sin ninguno de los tres se ignora en silencio.
- **Parseo**: primer número tras la etiqueta; admite `**`, `~`, coma o punto decimal, `h` con o sin espacio, y rangos (`2 h (rango 1,5–3)` → 2). Etiquetas: walkthrough `Estimación de implementación (del plan)` / `Estimación`, `Esfuerzo real` (con o sin "de implementación"), `Tipo`; patch/hotfix `Estimación`, `Real`.
- **Tipo normalizado** al primer token `[A-Za-z][\w/-]*` (`docs (contenido) + infra/tooling` → `docs`); patch → `patch`, hotfix → `hotfix`.
- **Filas**: una por artefacto, ordenadas por nombre de carpeta; estimado vacío (`—`) permitido, ratio solo si estimado > 0 y real presente. Real ilegible con sección presente → `Write-Warning` con la carpeta y fila excluida.
- **Salida**: cabecera `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit) — no editar a mano -->`, tabla `Fecha | Task | Tipo | Est (h) | Real (h) | Ratio | Carpeta` (fecha `yyyy-MM-dd`), factor global (mediana real/estimado, n), tabla `Tipo | n | Mediana`, aviso si n < 10. Números con punto decimal, 2 decimales máximo, redondeo `AwayFromZero`. UTF-8 sin BOM.
- **Tests**: `tests/Build-EstimationLog.Tests.ps1` (Pester 6) + fixtures en `tests/fixtures/estimation-log/`. Comando: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"`.
- **Estilo de código**: comentarios en castellano con tildes; nombres en inglés; funciones ≤ 20 líneas; sin alias de PowerShell en el script.
- **Política de modelos** (Art. IV): modelo y effort explícitos; gama media como suelo; sujetos de campaña Sonnet/medium. `fable` y `opus xhigh` prohibidos.
- **Ejecución**: default agente. Las tasks de medición y las ediciones de skill van en línea (motivo en cada task).
- **Skill bajo test**: se entrega pegando por prompt el `SKILL.md` **y** sus `references/` del working tree; las de superpowers las resuelve el harness; prompt neutro; verificación en disco; preguntar a posteriori qué frase motivó la decisión.
- Art. I — guidance que el baseline ya cumple no se escribe. Art. III/VI — castellano con tildes; commits por heredoc, tipo/scope en inglés. Art. VIII — el script no es plantilla, pero vive junto a ellas por ser activo compartido. Art. IX — no hay pieza de superpowers que genere logs de estimación: no hay duplicación.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: lo simple sería copiar el script de Alybo tal cual. Rechazado: no lee los walkthroughs del kit (coma decimal, rangos) y descarta tasks sin plan. Lo que se añade es parseo tolerante y una tabla por Tipo, nada más.
- [x] **YAGNI gate**: sin parámetros de configuración por proyecto; sin formatos de salida alternativos; sin migración de Alybo/MDT; sin CI (T8).
- [x] **Brownfield gate**: `walkthrough-template.md` y `patch-template.md` no cambian; los logs generados en Alybo tienen la misma tabla más dos bloques nuevos al final.
- [x] **Constitution check**: Art. I (RED/GREEN de las dos skills), IV (modelo y effort, default agente), VII (dogfooding: el log del kit), IX (sin duplicar superpowers).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/scripts/Build-EstimationLog.ps1` — el script.
- `tests/Build-EstimationLog.Tests.ps1` — tests Pester.
- `tests/fixtures/estimation-log/proyecto/.docs/sdd/specs/<7 carpetas>/` — fixtures de walkthrough/patch/hotfix.
- `tests/fixtures/estimation-log/legacy/docs/sdd/specs/<1 carpeta>/` — fixture de ruta antigua.
- `tests/estimation-log-red.md`, `tests/estimation-log-green.md` — evidencia Art. I.
- `tasks.md` en esta carpeta — registro vivo.

**Modificar**:

- `skills/sdd-end-task/references/estimacion.md` — paso 3: ejecutar el script del kit.
- `skills/sdd-end-patch/SKILL.md` — paso 5: ídem.
- `skills/sdd-templates/SKILL.md` — sección nueva: el script y su invocación.
- `README.md` — fila de `sdd-templates` menciona el script.
- `.docs/sdd/tech-stack.md` — "sin código ejecutable" pasa a "un script PowerShell con tests Pester".
- `.docs/sdd/architecture.md` — árbol: `sdd-templates/scripts/`, `tests/fixtures/`, `tests/*.Tests.ps1`.
- `.docs/sdd/estimation-log.md` — regenerado por el script (cierre).
- `.docs/sdd/roadmap.md` — T7 al cerrar.

**NO se tocan**:

- `walkthrough-template.md`, `patch-template.md` — el script se adapta a ellas, no al revés.
- `sdd-init-greenfield`, `sdd-init-brownfield` — no copian nada al proyecto.
- Los scripts de Alybo y MDT — fuera de scope (T10 formaliza el borrado).

### 1.6 Dependencias

- Pester ≥ 5 (sintaxis `Describe/It/Should`); en la máquina del dev-lead hay 6.1.0. `pwsh` 7+ (sin operador ternario ni `-AsUTC` en el script, para no subir el suelo).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un walkthrough real con un formato no previsto se descarta en silencio | Media | Medio | Warning obligatorio si la sección existe y el real no se lee; el dogfooding sobre los 13 walkthroughs del kit y una pasada sobre Alybo en el smoke |
| El agente que cierra no encuentra el script (Base directory mal resuelto) | Media | Alto | La guidance da la ruta relativa exacta al Base directory de la skill; el GREEN lo mide con la línea `Base directory for this skill:` en el prompt, como la inyecta el harness |
| El log del kit generado pierde matices del manual (rangos, "condicionado al RED") | Alta | Bajo | El walkthrough conserva el texto; el log es tabla de calibración, no narrativa |
| Pester 6 rompe sintaxis de Pester 5 | Baja | Bajo | Se usa solo `Describe/Context/It/Should -Be/-Match/-BeNullOrEmpty/-Throw/-BeTrue` y `TestDrive` |

### 1.8 Rollout

Directo: entra en v0.6.0. Las release notes avisan a Alybo y MDT de borrar su copia local.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Script `Build-EstimationLog.ps1` con tests Pester

**Modelo**: Sonnet / medium — el código va escrito aquí, pero hay bucle de ejecución y ajuste de regex sobre Pester; el tier más barato da vueltas con expresiones regulares.
**Ejecución**: por agente (default). Encargo: esta task íntegra + "Restricciones globales".

**Ficheros**: crear `skills/sdd-templates/scripts/Build-EstimationLog.ps1`, `tests/Build-EstimationLog.Tests.ps1`, `tests/fixtures/estimation-log/**`.

**Interfaces**: produce el script con la interfaz `-Root` / `-OutFile` de las Restricciones globales; las tasks siguientes lo invocan tal cual.

- [ ] **Step 1: Fixtures**. Crear estos ficheros (contenido mínimo: frontmatter + la sección de tiempo; el resto del walkthrough no hace falta).

`tests/fixtures/estimation-log/proyecto/.docs/sdd/specs/20260901-100000-task-0001-plain/walkthrough.md`:

```markdown
---
task: 0001
---
## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 2h
```

`.../20260902-100000-task-0002-fancy/walkthrough.md` (formato real del kit):

```markdown
---
task: 0002
---
## 2. Tiempo: estimado vs real

- Tipo: docs (contenido de skills) + infra/tooling (workflows de test)
- Estimación de implementación (del plan): 2 h (rango 1,5–3)
- Esfuerzo real: **~0,5 h** (aproximado: plan aprobado 15:14 UTC, cierre 15:45 UTC)
```

`.../20260903-100000-task-0003-sinplan/walkthrough.md`:

```markdown
---
task: 0003
---
## 2. Tiempo: estimado vs real

- Tipo: infra/tooling
- Estimación: — (no hubo plan formal)
- Esfuerzo real: ~3 h (aproximado)
```

`.../20260904-100000-patch-0000-fix/patch.md`:

```markdown
---
task: 0000
---
## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,3 h
```

`.../20260905-100000-task-0004-legacy/hotfix.md`:

```markdown
---
task: 0004
---
## 5. Tiempo (ligero)

- Estimación: 1h
- Real: 2h
```

`.../20260906-100000-task-0005-roto/walkthrough.md`:

```markdown
---
task: 0005
---
## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1h
- Esfuerzo real: (pendiente de medir)
```

`.../20260907-100000-task-0006-sinbloque/walkthrough.md`:

```markdown
---
task: 0006
---
## 1. Cambios realizados

- Nada que medir.
```

`tests/fixtures/estimation-log/legacy/docs/sdd/specs/20260801-100000-task-0009-old/walkthrough.md`:

```markdown
---
task: 0009
---
## 2. Tiempo: estimado vs real

- Tipo: backend
- Estimación de implementación (del plan): 3h
- Esfuerzo real de implementación: 6h
```

- [ ] **Step 2: Tests que fallan**. `tests/Build-EstimationLog.Tests.ps1`:

```powershell
# Tests del generador de estimation-log. Fixtures en tests/fixtures/estimation-log/.
BeforeAll {
  $script:Script = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Build-EstimationLog.ps1'
  $script:Fixtures = Join-Path $PSScriptRoot 'fixtures/estimation-log'

  function Invoke-Build([string]$Root) {
    $out = Join-Path $TestDrive ([guid]::NewGuid().ToString() + '.md')
    $warnings = @()
    & $script:Script -Root $Root -OutFile $out -WarningVariable warnings -WarningAction SilentlyContinue | Out-Null
    return [pscustomobject]@{ Text = Get-Content $out -Raw; Warnings = @($warnings | ForEach-Object { $_.Message }) }
  }

  function Get-Row([string]$Text, [string]$Folder) {
    return ($Text -split "`n" | Where-Object { $_ -like "*| $Folder |*" } | Select-Object -First 1)
  }
}

Describe 'Build-EstimationLog.ps1' {
  BeforeAll { $script:Result = Invoke-Build (Join-Path $script:Fixtures 'proyecto') }

  It 'lleva cabecera AUTO-GENERADO' {
    $script:Result.Text | Should -Match '^<!-- AUTO-GENERADO por Build-EstimationLog\.ps1 \(sdd-kit\)'
  }

  It 'lee un walkthrough plano' {
    Get-Row $script:Result.Text '20260901-100000-task-0001-plain' | Should -Be '| 2026-09-01 | 0001 | docs | 4 | 2 | 0.5 | 20260901-100000-task-0001-plain |'
  }

  It 'tolera negrita, virgulilla, coma decimal, rango y Tipo compuesto' {
    Get-Row $script:Result.Text '20260902-100000-task-0002-fancy' | Should -Be '| 2026-09-02 | 0002 | docs | 2 | 0.5 | 0.25 | 20260902-100000-task-0002-fancy |'
  }

  It 'incluye una task sin plan con estimado y ratio vacíos' {
    Get-Row $script:Result.Text '20260903-100000-task-0003-sinplan' | Should -Be '| 2026-09-03 | 0003 | infra/tooling | — | 3 | — | 20260903-100000-task-0003-sinplan |'
  }

  It 'lee patch.md con tipo patch' {
    Get-Row $script:Result.Text '20260904-100000-patch-0000-fix' | Should -Be '| 2026-09-04 | 0000 | patch | 0.5 | 0.3 | 0.6 | 20260904-100000-patch-0000-fix |'
  }

  It 'lee hotfix.md legacy con tipo hotfix' {
    Get-Row $script:Result.Text '20260905-100000-task-0004-legacy' | Should -Be '| 2026-09-05 | 0004 | hotfix | 1 | 2 | 2 | 20260905-100000-task-0004-legacy |'
  }

  It 'avisa y excluye un bloque presente con real ilegible' {
    Get-Row $script:Result.Text '20260906-100000-task-0005-roto' | Should -BeNullOrEmpty
    $script:Result.Warnings -join ' ' | Should -Match '20260906-100000-task-0005-roto'
  }

  It 'ignora en silencio un walkthrough sin bloque de tiempo' {
    Get-Row $script:Result.Text '20260907-100000-task-0006-sinbloque' | Should -BeNullOrEmpty
    $script:Result.Warnings -join ' ' | Should -Not -Match 'sinbloque'
  }

  It 'calcula el factor global como mediana de los ratios' {
    # Ratios: 0.5, 0.25, 0.6, 2 → mediana (0.5 + 0.6) / 2 = 0.55, n = 4
    $script:Result.Text | Should -Match '\*\*Factor de calibración\*\* \(ratio mediano real/estimado, 4 tareas\): \*\*0\.55\*\*'
  }

  It 'calcula la mediana por Tipo' {
    $script:Result.Text | Should -Match '(?m)^\| docs \| 2 \| 0\.38 \|$'
    $script:Result.Text | Should -Match '(?m)^\| patch \| 1 \| 0\.6 \|$'
    $script:Result.Text | Should -Match '(?m)^\| hotfix \| 1 \| 2 \|$'
  }

  It 'avisa de calibración orientativa con menos de 10 ratios' {
    $script:Result.Text | Should -Match 'Con menos de 10 tareas con ratio la calibración es orientativa'
  }
}

Describe 'Resolución de la carpeta de docs' {
  It 'usa docs/sdd cuando no existe .docs/sdd' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'legacy')
    Get-Row $r.Text '20260801-100000-task-0009-old' | Should -Be '| 2026-08-01 | 0009 | backend | 3 | 6 | 2 | 20260801-100000-task-0009-old |'
  }

  It 'falla con mensaje si no hay specs' {
    { & $script:Script -Root $TestDrive -OutFile (Join-Path $TestDrive 'x.md') } | Should -Throw '*No se encuentra*'
  }

  It 'escribe por defecto en <docs>/estimation-log.md' {
    $root = Join-Path $TestDrive 'def'
    Copy-Item (Join-Path $script:Fixtures 'proyecto') $root -Recurse
    & $script:Script -Root $root -WarningAction SilentlyContinue | Out-Null
    Test-Path (Join-Path $root '.docs/sdd/estimation-log.md') | Should -BeTrue
  }
}
```

- [ ] **Step 3: Ejecutar y ver fallar**. `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"`. Esperado: todos fallan porque el script no existe.

- [ ] **Step 4: Script mínimo**. `skills/sdd-templates/scripts/Build-EstimationLog.ps1`:

```powershell
<#
.SYNOPSIS
  Regenera estimation-log.md a partir de los bloques de tiempo de walkthrough.md, patch.md y hotfix.md.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). No se copia al proyecto: se ejecuta desde el kit con -Root.
  Salida regenerable: no editar estimation-log.md a mano.
.EXAMPLE
  pwsh -NoProfile -File Build-EstimationLog.ps1 -Root D:\code\git\mi-proyecto
#>
[CmdletBinding()]
param(
  [string]$Root = (Get-Location).Path,
  [string]$OutFile
)
$ErrorActionPreference = 'Stop'

function Resolve-DocsPath([string]$ProjectRoot) {
  # .docs/sdd es la convención del kit; docs/sdd sobrevive en proyectos antiguos.
  foreach ($candidate in @('.docs/sdd', 'docs/sdd')) {
    $path = Join-Path $ProjectRoot $candidate
    if (Test-Path (Join-Path $path 'specs')) { return $path }
  }
  throw "No se encuentra '.docs/sdd/specs' ni 'docs/sdd/specs' bajo '$ProjectRoot'."
}

function Get-FieldText([string]$Content, [string]$LabelPattern) {
  # Texto tras "- Etiqueta:" (admite la etiqueta en negrita). $null si no hay línea.
  if ($Content -match "(?m)^\s*-\s*\**(?:$LabelPattern)\**\s*:\s*(.*)$") { return $Matches[1] }
  return $null
}

function ConvertTo-Hours([string]$Text) {
  # Primer número del texto; tolera '**', '~', coma decimal y unidad. '—' o prosa → $null.
  if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
  if ($Text -match '^[\s*~]*(\d+(?:[.,]\d+)?)') { return [double]($Matches[1] -replace ',', '.') }
  return $null
}

function Get-FirstToken([string]$Text, [string]$Fallback) {
  # Normaliza el Tipo: primer token alfanumérico ("docs (x) + infra" → "docs").
  if ($Text -match '^\**\s*([A-Za-z][\w/-]*)') { return $Matches[1] }
  return $Fallback
}

function Get-TaskId([string]$Content, [string]$Folder) {
  if ($Content -match '(?m)^task:\s*(\S+)') { return $Matches[1] }
  if ($Folder -match '^\d{8}-\d{6}-(?:task|patch)-([^-]+)-') { return $Matches[1] }
  return '—'
}

function Read-Walkthrough([string]$Path) {
  $content = Get-Content $Path -Raw
  if ($content -notmatch 'estimado vs real') { return $null }
  $estimateLabel = 'Estimaci[oó]n de implementaci[oó]n \(del plan\)|Estimaci[oó]n de implementaci[oó]n|Estimaci[oó]n'
  $realLabel = 'Esfuerzo real de implementaci[oó]n|Esfuerzo real'
  return [pscustomobject]@{
    Content  = $content
    Type     = Get-FirstToken (Get-FieldText $content 'Tipo') '—'
    Estimate = ConvertTo-Hours (Get-FieldText $content $estimateLabel)
    Real     = ConvertTo-Hours (Get-FieldText $content $realLabel)
  }
}

function Read-Patch([string]$Path, [string]$Type) {
  $content = Get-Content $Path -Raw
  return [pscustomobject]@{
    Content  = $content
    Type     = $Type
    Estimate = ConvertTo-Hours (Get-FieldText $content 'Estimaci[oó]n')
    Real     = ConvertTo-Hours (Get-FieldText $content 'Real')
  }
}

function Read-Artifact([System.IO.DirectoryInfo]$Dir) {
  # Prioridad: walkthrough (task) > patch > hotfix (legacy). $null si la carpeta no tiene ninguno.
  $walkthrough = Join-Path $Dir.FullName 'walkthrough.md'
  $patch = Join-Path $Dir.FullName 'patch.md'
  $hotfix = Join-Path $Dir.FullName 'hotfix.md'
  if (Test-Path $walkthrough) { return Read-Walkthrough $walkthrough }
  if (Test-Path $patch) { return Read-Patch $patch 'patch' }
  if (Test-Path $hotfix) { return Read-Patch $hotfix 'hotfix' }
  return $null
}

function Format-Number([object]$Value) {
  if ($null -eq $Value) { return '—' }
  $rounded = [math]::Round([double]$Value, 2, [System.MidpointRounding]::AwayFromZero)
  return $rounded.ToString([System.Globalization.CultureInfo]::InvariantCulture)
}

function Get-Median([double[]]$Values) {
  $sorted = @($Values | Sort-Object)
  $count = $sorted.Count
  if ($count % 2 -eq 1) { return $sorted[[math]::Floor($count / 2)] }
  return ($sorted[$count / 2 - 1] + $sorted[$count / 2]) / 2
}

function New-Row([System.IO.DirectoryInfo]$Dir, [pscustomobject]$Artifact) {
  $date = $Dir.Name.Substring(0, 8)
  $ratio = if ($null -ne $Artifact.Estimate -and $Artifact.Estimate -gt 0) { $Artifact.Real / $Artifact.Estimate } else { $null }
  return [pscustomobject]@{
    Date     = "$($date.Substring(0,4))-$($date.Substring(4,2))-$($date.Substring(6,2))"
    Task     = Get-TaskId $Artifact.Content $Dir.Name
    Type     = $Artifact.Type
    Estimate = $Artifact.Estimate
    Real     = $Artifact.Real
    Ratio    = $ratio
    Folder   = $Dir.Name
  }
}

function Get-Rows([string]$SpecsPath) {
  $rows = @()
  foreach ($dir in Get-ChildItem -Path $SpecsPath -Directory | Sort-Object Name) {
    $artifact = Read-Artifact $dir
    if ($null -eq $artifact) { continue }
    if ($null -eq $artifact.Real) {
      Write-Warning "Bloque de tiempo presente pero sin esfuerzo real legible: $($dir.Name). Fila excluida."
      continue
    }
    $rows += New-Row $dir $artifact
  }
  return $rows
}

function Add-CalibrationSection([System.Text.StringBuilder]$Builder, [object[]]$Rows) {
  $withRatio = @($Rows | Where-Object { $null -ne $_.Ratio })
  if ($withRatio.Count -eq 0) { return }
  $global = Get-Median ($withRatio | ForEach-Object { [double]$_.Ratio })
  [void]$Builder.AppendLine('')
  [void]$Builder.AppendLine("**Factor de calibración** (ratio mediano real/estimado, $($withRatio.Count) tareas): **$(Format-Number $global)**")
  [void]$Builder.AppendLine('')
  [void]$Builder.AppendLine('| Tipo | n | Mediana |')
  [void]$Builder.AppendLine('| --- | --- | --- |')
  foreach ($group in ($withRatio | Group-Object Type | Sort-Object Name)) {
    $median = Get-Median ($group.Group | ForEach-Object { [double]$_.Ratio })
    [void]$Builder.AppendLine("| $($group.Name) | $($group.Count) | $(Format-Number $median) |")
  }
  [void]$Builder.AppendLine('')
  $caveat = if ($withRatio.Count -lt 10) { 'Con menos de 10 tareas con ratio la calibración es orientativa. ' } else { '' }
  [void]$Builder.AppendLine("> ${caveat}Ver ``estimation.md``.")
}

function Format-Log([object[]]$Rows) {
  $builder = [System.Text.StringBuilder]::new()
  [void]$builder.AppendLine('<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit) — no editar a mano. Regenerar: pwsh -NoProfile -File <sdd-templates>/scripts/Build-EstimationLog.ps1 -Root <proyecto> -->')
  [void]$builder.AppendLine('# Estimation log (estimado vs real)')
  [void]$builder.AppendLine('')
  [void]$builder.AppendLine('| Fecha | Task | Tipo | Est (h) | Real (h) | Ratio | Carpeta |')
  [void]$builder.AppendLine('| --- | --- | --- | --- | --- | --- | --- |')
  foreach ($row in $Rows) {
    [void]$builder.AppendLine("| $($row.Date) | $($row.Task) | $($row.Type) | $(Format-Number $row.Estimate) | $(Format-Number $row.Real) | $(Format-Number $row.Ratio) | $($row.Folder) |")
  }
  Add-CalibrationSection $builder $Rows
  return $builder.ToString()
}

$docsPath = Resolve-DocsPath $Root
if ([string]::IsNullOrWhiteSpace($OutFile)) { $OutFile = Join-Path $docsPath 'estimation-log.md' }
$rows = Get-Rows (Join-Path $docsPath 'specs')
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($OutFile, (Format-Log $rows), $utf8NoBom)
Write-Host "Generado $OutFile con $($rows.Count) filas."
```

- [ ] **Step 5: Ejecutar hasta verde**. Mismo comando. Esperado: 14 tests PASS. Si un regex no casa, ajustar el script (no el test) salvo que el test contradiga las Restricciones globales; en ese caso, parar y reportar.

- [ ] **Step 6: Smoke real**. `pwsh -NoProfile -File skills/sdd-templates/scripts/Build-EstimationLog.ps1 -Root D:\code\git\sdd-kit -OutFile $env:TEMP\kit-log.md` y lo mismo con `-Root D:\code\git\Alybo`. Esperado: 0 warnings en el kit (13 walkthroughs + 1 patch → 14 filas, las dos primeras con estimado `—`); en Alybo el mismo número de filas que su log actual. Pegar en el informe el bloque de calibración de cada uno. **No** escribir sobre `estimation-log.md` de ningún proyecto en esta task.

- [ ] **Step 7: Commit**.

```bash
git add skills/sdd-templates/scripts/Build-EstimationLog.ps1 tests/Build-EstimationLog.Tests.ps1 tests/fixtures/estimation-log
git commit -F - <<'MSG'
feat(templates): Build-EstimationLog.ps1 genérico en el kit con tests Pester

Unifica las copias de Alybo y MDT en un único script distribuido con sdd-templates:
localiza .docs/sdd o docs/sdd bajo -Root, tolera el formato real de los walkthroughs
(negrita, ~, coma decimal, rangos), lee patch.md y hotfix.md, incluye tasks sin plan
y añade la mediana por Tipo. Primer código ejecutable del kit, con 14 tests Pester.
MSG
```

---

### Task 2 — RED: cierre de task y de patch con la guidance vigente

**Modelo**: sujetos Sonnet / medium, vía `Workflow`; el orquestador es la sesión.
**Ejecución**: en línea — los sujetos son los medidos, no implementadores; el resultado se lee en disco desde la sesión.

**Ficheros**: crear `tests/estimation-log-red.md`; fixture desechable en el scratchpad.

- [ ] **Step 1: Fixture "Ledgerly-est"** (molde sin `.git`, en el scratchpad): proyecto Node mínimo con `.docs/sdd/` (constitution corta con artículo de estimación, `estimation.md` calcado del kit, `estimation-log.md` a mano con 2 filas, roadmap, changelog) y dos carpetas de spec: `e1` = `…-task-0042-export-csv/` con spec, plan (estimación 2 h, tipo backend) y tasks hechas, sin walkthrough; `e2` = `…-patch-0000-null-date/` con `patch.md` completo salvo §5 Tiempo. Copia por run.
- [ ] **Step 2: Encargos** (neutros; no nombran el script). Ambos incluyen la línea `Base directory for this skill: D:\code\git\sdd-kit\skills\<skill>` y pegan el `SKILL.md` **vigente** más sus `references/`.
  - E1: «La task 0042 está implementada y verificada (tests verdes). Cierra la tarea con la skill pegada. El esfuerzo real fue 1,2 h.» — skill `sdd-end-task`.
  - E2: «El patch está aplicado y verificado. Ciérralo con la skill pegada. Tardé 20 min.» — skill `sdd-end-patch`.
- [ ] **Step 3: Verificación en disco** por escenario: (a) ¿ejecutó algún `Build-EstimationLog.ps1`? (log de acciones); (b) ¿`estimation-log.md` regenerado con cabecera AUTO-GENERADO o fila añadida a mano?; (c) formato de la fila a mano frente al de la tabla; (d) walkthrough/patch con bloque de tiempo parseable por el script (correr el script de Task 1 sobre la copia y ver si avisa).
- [ ] **Step 4: Pregunta a posteriori** a cada sujeto: qué frase de la skill decidió cómo rellenar el estimation-log.
- [ ] **Step 5: Redactar `tests/estimation-log-red.md`** con el formato de `tests/entorno-worktree-red.md`: fixture, escenarios, fallos F1…, positivos sin guidance, tabla de guidance respaldada. Si el baseline ejecuta el script del kit por su cuenta (encontrándolo vía Base directory), la guidance de ruta **no se escribe** y se anota.
- [ ] **Step 6: Commit** `test(skills): RED del paso estimation-log en sdd-end-task y sdd-end-patch`.

---

### Task 3 — Guidance en las skills de cierre + GREEN

**Modelo**: sujetos Sonnet / medium (GREEN). Ediciones en línea.
**Ejecución**: en línea — las ediciones de skill se deciden frase a frase contra el RED (Art. I).

**Ficheros**: modificar `skills/sdd-end-task/references/estimacion.md`, `skills/sdd-end-patch/SKILL.md`; crear `tests/estimation-log-green.md`.

- [ ] **Step 1: Editar solo lo que el RED respalde.** Texto previsto:

`skills/sdd-end-task/references/estimacion.md`, paso 3, sustituye el párrafo actual por:

```markdown
3. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — ejecuta el script del kit, que vive junto a las plantillas: `pwsh -NoProfile -File "<Base directory de esta skill>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. Regenera `estimation-log.md` entero a partir de los walkthroughs y patches: no añadas filas a mano ni busques una copia en el proyecto (si el proyecto arrastra `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/`, es una copia antigua: avísalo y no la uses). Si el script avisa de que tu walkthrough no se lee, corrige el bloque de tiempo, no el script. Solo si `pwsh` no está disponible añade la fila a mano (task, tipo, estimado, real, ratio). El walkthrough registra; el log acumula — sin fila no hay calibración.
```

`skills/sdd-end-patch/SKILL.md`, paso 5:

```markdown
5. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — ejecuta el script del kit: `pwsh -NoProfile -File "<Base directory de esta skill>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. Regenera el log desde `patch.md` (§5 Tiempo): no añadas la fila a mano ni uses una copia local del proyecto (`.tools/sdd/`, `tools/sdd/` son copias antiguas: avísalo). Solo sin `pwsh`, fila a mano (tipo, estimado si lo hubo, real).
```

- [ ] **Step 2: GREEN**: mismos dos escenarios y mismas comprobaciones que el RED, con las skills editadas. Esperado: script ejecutado desde `skills/sdd-templates/scripts/`, `estimation-log.md` con cabecera AUTO-GENERADO y la fila nueva, 0 warnings.
- [ ] **Step 3: Redactar `tests/estimation-log-green.md`** — veredicto por fallo del RED; huecos de la propia guidance si aparecen, con su REFACTOR y re-verificación en el mismo fichero.
- [ ] **Step 4: Commit** `feat(skills): sdd-end-task y sdd-end-patch ejecutan el Build-EstimationLog del kit` (cuerpo con los números del GREEN).

---

### Task 4 — Índices y documentos de anclaje

**Modelo**: en línea (ediciones de una línea con texto dado aquí).
**Ejecución**: en línea — arreglo mecánico que no justifica un despacho.

**Ficheros**: modificar `skills/sdd-templates/SKILL.md`, `README.md`, `.docs/sdd/tech-stack.md`, `.docs/sdd/architecture.md`; crear `tasks.md` (ya al empezar la implementación).

- [ ] **Step 1: `skills/sdd-templates/SKILL.md`** — tras la tabla de plantillas, sección nueva:

```markdown
## Scripts

| Script | Uso |
| --- | --- |
| `scripts/Build-EstimationLog.ps1` | Regenera `estimation-log.md` desde walkthroughs y patches. Lo ejecutan `sdd-end-task` y `sdd-end-patch` desde el kit: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. No se copia al proyecto. |
```

- [ ] **Step 2: `README.md`** — fila de `sdd-templates`: «Las 11 plantillas canónicas (…) y el script `Build-EstimationLog.ps1`». Corregir el "9" actual al contar las plantillas reales de `skills/sdd-templates/templates/`.
- [ ] **Step 3: `.docs/sdd/tech-stack.md`** — primer bullet: «Markdown puro (…) más **un script PowerShell** (`Build-EstimationLog.ps1`, distribuido con `sdd-templates`) **con tests Pester** en `tests/*.Tests.ps1` sobre fixtures versionadas en `tests/fixtures/`. Sin build, sin CI (T8). Comando: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`.» Y en Tests: «Las fixtures de Pester sí se versionan (son el contrato del formato); las de campañas de skills no.»
- [ ] **Step 4: `.docs/sdd/architecture.md`** — árbol: `sdd-templates/ (SKILL.md índice + templates/*.md — fuente única + scripts/Build-EstimationLog.ps1)`; `tests/ (evidencia RED/GREEN por skill + *.Tests.ps1 y fixtures/ de los scripts)`. En "Anatomía de la evidencia": bullet «`<script>.Tests.ps1`: tests Pester del código ejecutable del kit; sus fixtures en `tests/fixtures/<tema>/` son el contrato del formato que el script lee.»
- [ ] **Step 5: Ejecutar Pester** (verde) y **commit** `docs(sdd): documentar el script Build-EstimationLog y los tests Pester en los docs de anclaje`.

El cierre (regenerar `.docs/sdd/estimation-log.md` del kit, `funcional/estimacion.md` por fusión del delta, changelog, roadmap, walkthrough) lo hace `sdd-end-task`, no una task del plan.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,5 h
- Estimación de implementación: 1 h (rango 0,7–1,5)
- Base de la estimación: Task 1 por despacho ≈ 15 min con revisión (el código va en el plan); RED y GREEN ≈ 2 escenarios × 5 min en paralelo + 10 min de evidencia cada uno; Task 4 ≈ 10 min. Anclas del log: `workflow-ejecucion` 1,3 h (tres workflows), `entorno-por-worktree` 0,4 h (tres workflows y un despacho). Incertidumbre: el bucle de regex en Task 1.
- Confianza: media

---

## 3. Validación final

- [ ] `Invoke-Pester -Path tests` verde
- [ ] Smoke del script sobre el kit y sobre Alybo sin warnings
- [ ] GREEN 2/2 con script ejecutado desde el kit
- [ ] Cierre vía `sdd-end-task`: log del kit regenerado, `funcional/estimacion.md` fusionado

---

## 4. Self-review (cobertura spec → tasks)

- El estimation-log se genera desde los artefactos de cierre → Task 1 (script, tests `plain`, `patch`, `hotfix`, cabecera). ✓
- El script vive en el kit y las skills de cierre lo invocan → Task 2 (RED) + Task 3 (guidance y GREEN) + Task 4 (índice de `sdd-templates`). ✓
- El parseo tolera el formato real de las plantillas → Task 1 (tests `fancy`, `sinplan`, `legacy`, `docs/sdd`). ✓
- El log muestra el factor global y por Tipo → Task 1 (tests de mediana global, por Tipo y aviso < 10). ✓
- Un bloque presente sin métricas avisa → Task 1 (test `roto`). ✓
- Capacidad `estimacion` en `funcional/` → paso de fusión de `sdd-end-task` al cerrar (decisión 1 de la spec). ✓
- Log del kit regenerado (decisión 6) → cierre. ✓
- `tech-stack.md` y `architecture.md` (decisión 7) → Task 4. ✓
- Alybo/MDT, `sdd-init-*`, plantillas → N/A (no entra, confirmado en spec). ✓
