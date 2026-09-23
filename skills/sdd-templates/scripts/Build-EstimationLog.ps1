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
# Las etiquetas de coste admiten formas anteriores que siguen vivas en walkthroughs ya
# cerrados: su cuerpo no se reescribe.
$script:ThreadTokensLabel = 'Tokens del hilo'
$script:SubagentTokensLabel = 'Tokens de subagentes|Coste de subagentes'
$script:SubjectCostLabel = 'Coste de los sujetos headless|Coste de sujetos'

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

function Get-DeclaredAbsence([string]$Text) {
  if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
  $normalized = ($Text -replace '\*', '').Trim()
  foreach ($answer in @('no medido', 'no aplica')) {
    if ($normalized -like "$answer*") { return $answer }
  }
  return $null
}

function Remove-ThousandsSeparator([string]$Text) {
  # Un punto entre dígitos y seguido de exactamente tres es separador de miles en castellano;
  # el decimal se escribe con coma.
  return ($Text -replace '(?<=\d)\.(?=\d{3}(?!\d))', '')
}

function ConvertTo-Thousands([string]$RawText) {
  $absence = Get-DeclaredAbsence $RawText
  if ($null -ne $absence) { return $absence }
  $Text = Remove-ThousandsSeparator $RawText
  if ($Text -notmatch '^[\s*~≈≃]*(\d+(?:[.,]\d+)?)\s*([kKmM])?') { return $null }
  $amount = [double]($Matches[1] -replace ',', '.')
  $thousands = switch -Regex ($Matches[2]) {
    '[mM]' { $amount * 1000 }
    '[kK]' { $amount }
    default { $amount / 1000 }
  }
  return '{0}k' -f [math]::Round($thousands, 0, [System.MidpointRounding]::AwayFromZero)
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

function ConvertTo-Money([string]$RawText) {
  $absence = Get-DeclaredAbsence $RawText
  if ($null -ne $absence) { return $absence }
  $Text = Remove-ThousandsSeparator $RawText
  if ($Text -notmatch '^[\s*~≈≃]*(\d+(?:[.,]\d+)?)\s*\$') { return $null }
  return Format-Number ([double]($Matches[1] -replace ',', '.'))
}

function Read-CostFields([string]$Section) {
  return [pscustomobject]@{
    ThreadTokens   = ConvertTo-Thousands (Get-FieldText $Section $script:ThreadTokensLabel)
    SubagentTokens = ConvertTo-Thousands (Get-FieldText $Section $script:SubagentTokensLabel)
    SubjectCost    = ConvertTo-Money (Get-FieldText $Section $script:SubjectCostLabel)
  }
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
    Cost     = Read-CostFields $section
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
    Cost     = Read-CostFields $section
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

function Format-Text([object]$Value) {
  if ([string]::IsNullOrWhiteSpace($Value)) { return '—' }
  return $Value
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
    Date           = Get-FolderDate $Dir.Name
    Task           = Get-TaskId $Artifact.Content $Dir.Name
    Type           = $Artifact.Type
    Estimate       = $Artifact.Estimate
    Real           = $Artifact.Real
    Ratio          = $ratio
    ThreadTokens   = $Artifact.Cost.ThreadTokens
    SubagentTokens = $Artifact.Cost.SubagentTokens
    SubjectCost    = $Artifact.Cost.SubjectCost
    Folder         = $Dir.Name
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

function Get-Percentile([double[]]$Values, [double]$Percentile) {
  $sorted = @($Values | Sort-Object)
  $rank = $Percentile * ($sorted.Count - 1)
  $lowIndex = [math]::Floor($rank)
  $highIndex = [math]::Ceiling($rank)
  if ($lowIndex -eq $highIndex) { return $sorted[$lowIndex] }
  $fraction = $rank - $lowIndex
  return $sorted[$lowIndex] + $fraction * ($sorted[$highIndex] - $sorted[$lowIndex])
}

function Format-Percent([int]$Part, [int]$Total) {
  $value = [math]::Round(($Part / $Total) * 100, 0, [System.MidpointRounding]::AwayFromZero)
  return "$value %"
}

function Get-CalibrationHeaderLine([double[]]$Ratios) {
  $median = Get-Median $Ratios
  $mean = ($Ratios | Measure-Object -Sum).Sum / $Ratios.Count
  $unit = if ($Ratios.Count -eq 1) { 'artefacto' } else { 'artefactos' }
  return "**Factor de calibración** (ratio mediano real/estimado, $($Ratios.Count) $unit): **$(Format-Number $median)** · media $(Format-Number $mean)"
}

function Get-BandLabel([double]$Ratio) {
  if ($Ratio -lt 0.5) { return '<0.5' }
  if ($Ratio -lt 0.8) { return '0.5–0.8' }
  if ($Ratio -lt 1.25) { return '0.8–1.25' }
  if ($Ratio -lt 2) { return '1.25–2' }
  return '≥2'
}

function Get-BandCount([object[]]$Grouped, [string]$Label) {
  $group = $Grouped | Where-Object { $_.Name -eq $Label }
  if ($null -eq $group) { return 0 }
  return $group.Count
}

function Add-HistogramTable([System.Text.StringBuilder]$Builder, [double[]]$Ratios) {
  $labels = @('<0.5', '0.5–0.8', '0.8–1.25', '1.25–2', '≥2')
  if ($Ratios.Count -lt 5) { return }
  $grouped = $Ratios | ForEach-Object { Get-BandLabel $_ } | Group-Object
  [void]$Builder.AppendLine('')
  [void]$Builder.AppendLine('| Tramo del ratio | n | % |')
  [void]$Builder.AppendLine('| --- | --- | --- |')
  foreach ($label in $labels) {
    $n = Get-BandCount $grouped $label
    [void]$Builder.AppendLine("| $label | $n | $(Format-Percent $n $Ratios.Count) |")
  }
}

function Add-PercentileLines([System.Text.StringBuilder]$Builder, [double[]]$Ratios) {
  $p25 = Format-Number (Get-Percentile $Ratios 0.25)
  $p75 = Format-Number (Get-Percentile $Ratios 0.75)
  $p80 = Format-Number (Get-Percentile $Ratios 0.80)
  [void]$Builder.AppendLine("- p25–p75: $p25–$p75")
  [void]$Builder.AppendLine("- p80: $p80 — para comprometer una fecha, multiplica la estimación por el p80: así cubre 4 de cada 5 artefactos.")
}

function Add-BandPercentLine([System.Text.StringBuilder]$Builder, [double[]]$Ratios) {
  $within = @($Ratios | Where-Object { $_ -ge 0.75 -and $_ -le 1.25 }).Count
  $overestimated = @($Ratios | Where-Object { $_ -lt 0.75 }).Count
  $underestimated = @($Ratios | Where-Object { $_ -gt 1.25 }).Count
  $total = $Ratios.Count
  [void]$Builder.AppendLine("- Dentro de ±25 %: $(Format-Percent $within $total) · sobreestimadas: $(Format-Percent $overestimated $total) · infraestimadas: $(Format-Percent $underestimated $total)")
}

function Add-AbsoluteErrorLine([System.Text.StringBuilder]$Builder, [object[]]$WithRatio) {
  $errors = @($WithRatio | ForEach-Object { [math]::Abs([double]$_.Real - [double]$_.Estimate) })
  $mean = ($errors | Measure-Object -Sum).Sum / $errors.Count
  [void]$Builder.AppendLine("- Error absoluto (h): media $(Format-Number $mean) · mediana $(Format-Number (Get-Median $errors))")
}

function Add-DispersionSummary([System.Text.StringBuilder]$Builder, [object[]]$WithRatio) {
  if ($WithRatio.Count -lt 5) {
    [void]$Builder.AppendLine('- n insuficiente (hacen falta 5)')
    return
  }
  $ratios = @($WithRatio | ForEach-Object { [double]$_.Ratio })
  Add-PercentileLines $Builder $ratios
  Add-BandPercentLine $Builder $ratios
  Add-AbsoluteErrorLine $Builder $WithRatio
}

function Add-TrendLine([System.Text.StringBuilder]$Builder, [double[]]$Ratios) {
  if ($Ratios.Count -lt 20) {
    [void]$Builder.AppendLine('- Tendencia: n insuficiente (hacen falta 20)')
    return
  }
  $first = Format-Number (Get-Median $Ratios[0..9])
  $last = Format-Number (Get-Median $Ratios[-10..-1])
  [void]$Builder.AppendLine("- Tendencia (mediana de las 10 primeras frente a las 10 últimas): $first frente a $last")
}

function Add-TypeRow([System.Text.StringBuilder]$Builder, [object]$Group) {
  $values = @($Group.Group | ForEach-Object { [double]$_.Ratio })
  $median = Format-Number (Get-Median $values)
  $range = '—'
  if ($values.Count -ge 5) {
    $range = "$(Format-Number (Get-Percentile $values 0.25))–$(Format-Number (Get-Percentile $values 0.75))"
  }
  [void]$Builder.AppendLine("| $($Group.Name) | $($Group.Count) | $median | $range |")
}

function Add-TypeTable([System.Text.StringBuilder]$Builder, [object[]]$WithRatio) {
  [void]$Builder.AppendLine('| Tipo | n | Mediana | p25–p75 |')
  [void]$Builder.AppendLine('| --- | --- | --- | --- |')
  foreach ($group in ($WithRatio | Group-Object Type | Sort-Object Name)) {
    Add-TypeRow $Builder $group
  }
}

function Get-ReleaseVersions([string]$ChangelogPath) {
  if (-not (Test-Path -LiteralPath $ChangelogPath)) { return @() }
  $content = Get-Content -LiteralPath $ChangelogPath -Raw
  $found = [regex]::Matches($content, '(?m)^##\s*\[([^\]]+)\]\s*[-—]\s*(\d{4}-\d{2}-\d{2})\s*$')
  $versions = foreach ($item in $found) {
    [pscustomobject]@{ Name = $item.Groups[1].Value; Date = $item.Groups[2].Value }
  }
  return @($versions | Sort-Object Date)
}

function Get-ReleaseLabel([object]$Row, [object[]]$Versions) {
  if ($Row.Date -eq '—') { return 'sin fecha' }
  $match = $Versions | Where-Object { $_.Date -ge $Row.Date } | Select-Object -First 1
  if ($null -eq $match) { return 'sin publicar' }
  return $match.Name
}

function Get-SubjectSum([object[]]$Rows) {
  $numbers = $Rows | ForEach-Object { $_.SubjectCost } |
    Where-Object { $_ -match '^\d+(\.\d+)?$' } | ForEach-Object { [double]$_ }
  if ($numbers.Count -eq 0) { return '—' }
  return Format-Number (($numbers | Measure-Object -Sum).Sum)
}

function Add-ReleaseRow([System.Text.StringBuilder]$Builder, [string]$Label, [object[]]$Rows) {
  $hours = Format-Number (($Rows | ForEach-Object { [double]$_.Real } | Measure-Object -Sum).Sum)
  $withRatio = @($Rows | Where-Object { $null -ne $_.Ratio })
  $median = '—'
  if ($withRatio.Count -gt 0) { $median = Format-Number (Get-Median ($withRatio | ForEach-Object { [double]$_.Ratio })) }
  [void]$Builder.AppendLine("| $Label | $($Rows.Count) | $hours | $median | $(Get-SubjectSum $Rows) |")
}

function Add-ReleaseTable([System.Text.StringBuilder]$Builder, [object[]]$Rows, [string]$DocsPath) {
  $versions = Get-ReleaseVersions (Join-Path $DocsPath 'changelog.md')
  if ($versions.Count -eq 0) { return }
  $labels = @($versions | ForEach-Object { $_.Name }) + @('sin publicar', 'sin fecha')
  $byLabel = $Rows | Group-Object { Get-ReleaseLabel $_ $versions }
  [void]$Builder.AppendLine('')
  [void]$Builder.AppendLine('| Release | Artefactos | Horas reales | Mediana | Sujetos ($) |')
  [void]$Builder.AppendLine('| --- | --- | --- | --- | --- |')
  foreach ($label in $labels) {
    $group = $byLabel | Where-Object { $_.Name -eq $label }
    if ($null -ne $group) { Add-ReleaseRow $Builder $label $group.Group }
  }
}

function Add-CalibrationSection([System.Text.StringBuilder]$Builder, [object[]]$Rows, [string]$DocsPath) {
  $withRatio = @($Rows | Where-Object { $null -ne $_.Ratio })
  if ($withRatio.Count -eq 0) { return }
  $ratios = @($withRatio | ForEach-Object { [double]$_.Ratio })
  [void]$Builder.AppendLine('')
  [void]$Builder.AppendLine((Get-CalibrationHeaderLine $ratios))
  [void]$Builder.AppendLine('')
  Add-DispersionSummary $Builder $withRatio
  Add-TrendLine $Builder $ratios
  Add-HistogramTable $Builder $ratios
  [void]$Builder.AppendLine('')
  Add-TypeTable $Builder $withRatio
  Add-ReleaseTable $Builder $Rows $DocsPath
  [void]$Builder.AppendLine('')
  $caveat = if ($withRatio.Count -lt 10) { 'Con menos de 10 tareas con ratio la calibración es orientativa. ' } else { '' }
  [void]$Builder.AppendLine("> ${caveat}Ver ``estimation.md``.")
}

function Format-Log([object[]]$Rows, [string]$DocsPath) {
  $builder = [System.Text.StringBuilder]::new()
  [void]$builder.AppendLine('<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit) — no editar a mano. Regenerar: pwsh -NoProfile -File <sdd-templates>/scripts/Build-EstimationLog.ps1 -Root <proyecto> -->')
  [void]$builder.AppendLine('# Estimation log (estimado vs real)')
  [void]$builder.AppendLine('')
  [void]$builder.AppendLine('| Fecha | Task | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Carpeta |')
  [void]$builder.AppendLine('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |')
  foreach ($row in $Rows) {
    $hours = "$(Format-Number $row.Estimate) | $(Format-Number $row.Real) | $(Format-Number $row.Ratio)"
    $cost = "$(Format-Text $row.ThreadTokens) | $(Format-Text $row.SubagentTokens) | $(Format-Text $row.SubjectCost)"
    [void]$builder.AppendLine("| $($row.Date) | $($row.Task) | $($row.Type) | $hours | $cost | $($row.Folder) |")
  }
  Add-CalibrationSection $builder $Rows $DocsPath
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
$text = (Format-Log $rows $docsPath) -replace "`r`n", "`n"
if (Test-ManualLog $OutFile) {
  Write-Warning "El fichero $OutFile no es un log generado (sin cabecera AUTO-GENERADO): se sobreescribe un log mantenido a mano. Revisa el diff antes de commitear."
}
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($OutFile, $text, $utf8NoBom)
Write-Host "Generado $OutFile con $($rows.Count) filas."
