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

# Etiquetas del bloque de tiempo. Las largas van primero: el motor de regex prueba las
# alternativas en orden y la corta dejaría fuera el resto de la etiqueta antes de los dos puntos.
# Las comparten walkthrough.md y patch.md porque en la práctica un patch.md se escribe con
# cualquiera de las dos formas.
$script:EstimateLabel = 'Estimaci[oó]n de implementaci[oó]n(?: \([^)]*\))?|Estimaci[oó]n'
$script:RealLabel = 'Esfuerzo real de implementaci[oó]n|Esfuerzo real|Real'

function Resolve-DocsPath([string]$ProjectRoot) {
  # .docs/sdd es la convención del kit; docs/sdd sobrevive en proyectos antiguos.
  foreach ($candidate in @('.docs/sdd', 'docs/sdd')) {
    $path = Join-Path $ProjectRoot $candidate
    if (Test-Path (Join-Path $path 'specs')) { return $path }
  }
  throw "No se encuentra '.docs/sdd/specs' ni 'docs/sdd/specs' bajo '$ProjectRoot'."
}

function Get-FieldText([string]$Content, [string]$LabelPattern) {
  if ($Content -match "(?m)^\s*-\s*\**(?:$LabelPattern)\**\s*:\s*(.*)$") { return $Matches[1] }
  return $null
}

function Get-TimeSection([string]$Content, [string]$HeadingPattern) {
  if ($Content -match "$HeadingPattern[\s\S]*?(?=`n#+\s|\z)") { return $Matches[0] }
  return $null
}

function ConvertTo-Hours([string]$Text) {
  if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
  # Prefijos tolerados delante de la cifra: espacios, negrita markdown y las marcas de
  # aproximación que se escriben a mano (~, ≈, ≃).
  if ($Text -match '^[\s*~≈≃]*(\d+(?:[.,]\d+)?)') { return [double]($Matches[1] -replace ',', '.') }
  return $null
}

function Get-FirstToken([string]$Text, [string]$Fallback) {
  if ($Text -match '^\**\s*([A-Za-z][\w/-]*)') { return $Matches[1] }
  return $Fallback
}

function Get-TaskId([string]$Content, [string]$Folder) {
  if ($Content -match '(?m)^task:\s*(\S+)') { return $Matches[1] }
  if ($Folder -match '^\d{8}-\d{6}-(?:task|patch|hotfix)-([^-]+)-') { return $Matches[1] }
  return '—'
}

function Get-FolderDate([string]$FolderName) {
  if ($FolderName -match '^(\d{4})(\d{2})(\d{2})-\d{6}-') { return "$($Matches[1])-$($Matches[2])-$($Matches[3])" }
  return '—'
}

function Read-Walkthrough([string]$Path) {
  $content = Get-Content $Path -Raw
  $section = Get-TimeSection $content '(?m)^#+.*estimado vs real'
  if ($null -eq $section) { return $null }
  return [pscustomobject]@{
    Content  = $content
    Type     = Get-FirstToken (Get-FieldText $section 'Tipo') '—'
    Estimate = ConvertTo-Hours (Get-FieldText $section $script:EstimateLabel)
    Real     = ConvertTo-Hours (Get-FieldText $section $script:RealLabel)
  }
}

function Read-Patch([string]$Path, [string]$Type) {
  $content = Get-Content $Path -Raw
  $section = Get-TimeSection $content '(?m)^#+\s*(?:\d+\.\s*)?Tiempo\b'
  if ($null -eq $section) { return $null }
  return [pscustomobject]@{
    Content  = $content
    Type     = $Type
    Estimate = ConvertTo-Hours (Get-FieldText $section $script:EstimateLabel)
    Real     = ConvertTo-Hours (Get-FieldText $section $script:RealLabel)
  }
}

function Read-Artifact([System.IO.DirectoryInfo]$Dir) {
  $walkthrough = Join-Path $Dir.FullName 'walkthrough.md'
  $patch = Join-Path $Dir.FullName 'patch.md'
  $hotfix = Join-Path $Dir.FullName 'hotfix.md'
  if (Test-Path $walkthrough) {
    $artifact = Read-Walkthrough $walkthrough
    if ($null -ne $artifact) { return $artifact }
  }
  if (Test-Path $patch) {
    $artifact = Read-Patch $patch 'patch'
    if ($null -ne $artifact) { return $artifact }
  }
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
  $ratio = if ($null -ne $Artifact.Estimate -and $Artifact.Estimate -gt 0) { $Artifact.Real / $Artifact.Estimate } else { $null }
  return [pscustomobject]@{
    Date     = Get-FolderDate $Dir.Name
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
  $globalMedian = Get-Median ($withRatio | ForEach-Object { [double]$_.Ratio })
  $unit = if ($withRatio.Count -eq 1) { 'artefacto' } else { 'artefactos' }
  [void]$Builder.AppendLine('')
  [void]$Builder.AppendLine("**Factor de calibración** (ratio mediano real/estimado, $($withRatio.Count) $unit): **$(Format-Number $globalMedian)**")
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

function Test-ManualLog([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return $false }
  $firstLine = Get-Content -LiteralPath $Path -TotalCount 1
  return ($firstLine -notmatch '^<!-- AUTO-GENERADO')
}

if (-not (Test-Path -LiteralPath $Root)) {
  throw "No se encuentra '.docs/sdd/specs' ni 'docs/sdd/specs' bajo '$Root'."
}
$Root = (Resolve-Path -LiteralPath $Root).Path
$docsPath = Resolve-DocsPath $Root
if ([string]::IsNullOrWhiteSpace($OutFile)) { $OutFile = Join-Path $docsPath 'estimation-log.md' }
$OutFile = [System.IO.Path]::GetFullPath($OutFile, (Get-Location).Path)
$rows = Get-Rows (Join-Path $docsPath 'specs')
# Salida con saltos de línea LF exclusivamente (AppendLine usa CRLF en Windows).
$text = (Format-Log $rows) -replace "`r`n", "`n"
if (Test-ManualLog $OutFile) {
  Write-Warning "El fichero $OutFile no es un log generado (sin cabecera AUTO-GENERADO): se sobreescribe un log mantenido a mano. Revisa el diff antes de commitear."
}
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($OutFile, $text, $utf8NoBom)
Write-Host "Generado $OutFile con $($rows.Count) filas."
