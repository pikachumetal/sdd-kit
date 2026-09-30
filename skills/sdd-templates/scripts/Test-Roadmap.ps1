<#
.SYNOPSIS
  Valida que el roadmap de un proyecto SDD tiene la forma de roadmap-template.md.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lee <Path>/roadmap.md y comprueba: que empieza por «# Roadmap»; que
  solo tiene las secciones de la plantilla, en su orden y sin repetir («Próximo», «Release <versión>», «Backlog»,
  «Deuda técnica», «Patches», «Releases cerradas»); que fuera de «Releases cerradas» solo hay tablas, salvo una línea
  con el estado de la release en una sección «Release <versión>»; que cada tabla tiene cabecera, separador y la
  cabecera literal de su sección; que los estados de «Próximo» y de las releases son los de la plantilla; que ninguna
  fila saldada de «Backlog» o «Deuda técnica» es anterior o igual a la última release cerrada; y que ninguna fila de
  una sección abierta es de una feature que ya nombra una release cerrada. Escribe una línea por fallo, con la regla
  incumplida, y sale con 1; sin fallos, «Roadmap válido» y sale con 0.
.EXAMPLE
  pwsh -NoProfile -File Test-Roadmap.ps1 -Path .docs/sdd
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Path
)
$ErrorActionPreference = 'Stop'
$script:ClosedSection = 'Releases cerradas'
$script:TemplateSections = @('Próximo', 'Release', 'Backlog', 'Deuda técnica', 'Patches', $script:ClosedSection)
$script:RequiredSections = $script:TemplateSections | Where-Object { $_ -ne 'Release' }
$script:Headers = @{
  'Próximo'       = '| # | Ítem | Estado |'
  'Release'       = '| id | Feature | Origen | Ficheros que toca | Estado |'
  'Backlog'       = '| # | Ítem | Origen |'
  'Deuda técnica' = '| Ítem | Impacto | Destino |'
  'Patches'       = '| Fecha | Id | Descripción |'
}
$script:StatePrefixes = @('⏳', '🔄', '✅', '🧪 validación diferida a', '⏸️ aparcada:')
$script:StateHelp = '⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …'
$script:ProseRule = 'fuera de «Releases cerradas» el roadmap solo lleva tablas'
$script:SeparatorPattern = '^\|(\s*:?-{3,}:?\s*\|)+\s*$'
$script:EmptyRowPattern = '^\|[\s|]*$'
$script:SettledPattern = '^\|(?:[^|]*\|)?\s*\*\*\[(?:Feature|Task|Patch) [^],]+, (\d{4}-\d{2}-\d{2}): saldada — '
# Un número corto de «Próximo» («3») aparece en cualquier resumen de release sin ser un id.
$script:MinPublishedIdLength = 4

function Get-SectionKind([string]$Title) {
  if ($Title -match '^Release(\s|$)') { return 'Release' }
  return $Title
}

function Get-RoadmapSections([string[]]$Lines) {
  $sections = [System.Collections.Generic.List[object]]::new()
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -notmatch '^## (.+?)\s*$') { continue }
    if ($sections.Count) { $sections[-1].Last = $i - 1 }
    $sections.Add([pscustomobject]@{ Title = $Matches[1]; Kind = Get-SectionKind $Matches[1]; Line = $i + 1; Last = $Lines.Count - 1 })
  }
  return $sections
}

function Get-SectionAt([object[]]$Sections, [int]$Index) {
  return $Sections | Where-Object { $Index -ge $_.Line -and $Index -le $_.Last } | Select-Object -First 1
}

function Get-SectionRank($Section) {
  return [array]::IndexOf($script:TemplateSections, $Section.Kind)
}

function Get-SectionProblem($Section, [hashtable]$Seen, $Previous) {
  if ((Get-SectionRank $Section) -lt 0) { return "sección «$($Section.Title)» fuera de la plantilla" }
  if ($Section.Kind -eq 'Release' -and $Section.Title -notmatch '^Release \d+(\.\d+)+$') {
    return "«$($Section.Title)» no lleva versión: «## Release <versión>»"
  }
  if ($Seen.ContainsKey($Section.Title)) { return "sección «$($Section.Title)» repetida" }
  if ($Previous -and (Get-SectionRank $Section) -lt (Get-SectionRank $Previous)) {
    return "«$($Section.Title)» va antes que «$($Previous.Title)»"
  }
}

function Test-SectionSet([object[]]$Sections) {
  foreach ($name in $script:RequiredSections | Where-Object { $Sections.Title -notcontains $_ }) { "falta la sección «$name»" }
  $seen = @{}
  $previous = $null
  foreach ($section in $Sections) {
    $problem = Get-SectionProblem $section $seen $previous
    if ($problem) { "línea $($section.Line): $problem" }
    $seen[$section.Title] = $true
    if ((Get-SectionRank $section) -ge 0) { $previous = $section }
  }
}

function Test-Subsections([string[]]$Lines, [object[]]$Sections) {
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -notmatch '^#{3,} (.+?)\s*$') { continue }
    $title = $Matches[1]
    $section = Get-SectionAt $Sections $i
    if (-not $section -or $section.Kind -ne $script:ClosedSection) {
      "línea $($i + 1): subsección «$title» fuera de «$script:ClosedSection»"
    }
  }
}

function Test-ProseChecked($Section, [hashtable]$StatusLines) {
  if ($Section.Kind -eq $script:ClosedSection -or (Get-SectionRank $Section) -lt 0) { return $false }
  if ($Section.Kind -ne 'Release' -or $StatusLines.ContainsKey($Section.Line)) { return $true }
  $StatusLines[$Section.Line] = $true
  return $false
}

function Test-Prose([string[]]$Lines, [object[]]$Sections) {
  $statusLines = @{}
  for ($i = 1; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -match '^\s*$|^\||^#{2,} ') { continue }
    $section = Get-SectionAt $Sections $i
    if ($section -and -not (Test-ProseChecked $section $statusLines)) { continue }
    $place = if ($section) { "«$($section.Title)»" } else { 'la cabecera' }
    "línea $($i + 1): prosa en $place; $script:ProseRule"
  }
}

function Get-Cells([string]$Line) {
  return @($Line.Trim().Trim('|') -split '(?<!\\)\|' | ForEach-Object { $_.Trim() })
}

function Get-TableBlocks([string[]]$Lines, [object[]]$Sections) {
  $i = 0
  while ($i -lt $Lines.Count) {
    if ($Lines[$i] -notmatch '^\|') { $i++; continue }
    $start = $i
    while ($i -lt $Lines.Count -and $Lines[$i] -match '^\|') { $i++ }
    $section = Get-SectionAt $Sections $start
    if ($section -and $section.Kind -eq $script:ClosedSection) { continue }
    $separator = $start..($i - 1) | Where-Object { $Lines[$_] -match $script:SeparatorPattern } | Select-Object -First 1
    $header = if ($null -ne $separator -and $separator -gt $start) { $separator - 1 } else { $null }
    [pscustomobject]@{ Start = $start; End = $i - 1; Header = $header; Section = $section }
  }
}

function Test-TableBlock([string[]]$Lines, $Block) {
  $firstRow = if ($null -eq $Block.Header) { $Block.End + 1 } else { $Block.Header }
  foreach ($n in $Block.Start..$Block.End) {
    if ($n -lt $firstRow) { "línea $($n + 1): fila fuera de una tabla con cabecera y separador" }
    elseif ($Lines[$n] -match $script:EmptyRowPattern) { "línea $($n + 1): fila vacía" }
  }
  if ($null -eq $Block.Header) { return }
  $headerCells = (Get-Cells $Lines[$Block.Header]).Count
  $separatorCells = (Get-Cells $Lines[$Block.Header + 1]).Count
  if ($headerCells -ne $separatorCells) {
    "línea $($Block.Header + 1): la cabecera tiene $headerCells celdas y el separador $separatorCells"
  }
}

function Test-HeaderMatches([string[]]$Lines, $Block) {
  if ($null -eq $Block.Header -or -not $Block.Section) { return $false }
  $expected = $script:Headers[$Block.Section.Kind]
  return $expected -and $Lines[$Block.Header].Trim() -eq $expected
}

function Test-TableHeader([string[]]$Lines, $Block) {
  if ($null -eq $Block.Header -or -not $Block.Section) { return }
  $expected = $script:Headers[$Block.Section.Kind]
  if ($expected -and -not (Test-HeaderMatches $Lines $Block)) {
    "línea $($Block.Header + 1): la cabecera de «$($Block.Section.Title)» debe ser «$expected»"
  }
}

function Get-OpenRows([string[]]$Lines, [object[]]$Blocks) {
  foreach ($block in $Blocks | Where-Object { $_.Section -and $_.Section.Kind -in 'Próximo', 'Release' }) {
    if (-not (Test-HeaderMatches $Lines $block)) { continue }
    for ($n = $block.Header + 2; $n -le $block.End; $n++) {
      if ($Lines[$n] -match $script:EmptyRowPattern) { continue }
      [pscustomobject]@{ Index = $n; Section = $block.Section; Cells = Get-Cells $Lines[$n] }
    }
  }
}

function Test-State($Row) {
  $state = $Row.Cells[-1]
  if ($script:StatePrefixes | Where-Object { $state.StartsWith($_) }) { return }
  "línea $($Row.Index + 1): estado «$state» no admitido: $script:StateHelp"
}

function Get-ClosedReleases([string[]]$Lines, [object[]]$Sections) {
  $closed = $Sections | Where-Object Kind -eq $script:ClosedSection | Select-Object -First 1
  if (-not $closed) { return }
  $current = $null
  foreach ($i in $closed.Line..$closed.Last) {
    if ($Lines[$i] -match '^### v(\S+) — (\d{4}-\d{2}-\d{2})') {
      if ($current) { $current }
      $current = [pscustomobject]@{ Version = $Matches[1]; Date = $Matches[2]; Text = '' }
    }
    elseif ($current) { $current.Text += "`n" + $Lines[$i] }
  }
  if ($current) { $current }
}

function Test-SettledRows([string[]]$Lines, [object[]]$Sections, $LastRelease) {
  if (-not $LastRelease) { return }
  foreach ($section in $Sections | Where-Object { $_.Kind -in 'Backlog', 'Deuda técnica' }) {
    foreach ($i in $section.Line..$section.Last) {
      if ($Lines[$i] -notmatch $script:SettledPattern -or $Matches[1] -gt $LastRelease.Date) { continue }
      "línea $($i + 1): fila saldada el $($Matches[1]), no posterior a la v$($LastRelease.Version) ($($LastRelease.Date)): sale en el corte"
    }
  }
}

function Test-Published($Row, [object[]]$Releases) {
  $id = $Row.Cells[0]
  if ($id.Length -lt $script:MinPublishedIdLength) { return }
  $pattern = "(?<![\w-])$([regex]::Escape($id))(?![\w-])"
  $release = $Releases | Where-Object { $_.Text -match $pattern } | Select-Object -First 1
  if ($release) { "línea $($Row.Index + 1): la $id ya está en la v$($release.Version): su fila sale de «$($Row.Section.Title)»" }
}

function Get-RoadmapProblems([string[]]$Lines) {
  $sections = @(Get-RoadmapSections $Lines)
  $blocks = @(Get-TableBlocks $Lines $sections)
  $releases = @(Get-ClosedReleases $Lines $sections)
  $rows = @(Get-OpenRows $Lines $blocks)
  if ($Lines[0] -notmatch '^# Roadmap\b') { 'línea 1: no empieza por «# Roadmap»' }
  Test-SectionSet $sections
  Test-Subsections $Lines $sections
  Test-Prose $Lines $sections
  $blocks | ForEach-Object { Test-TableBlock $Lines $_; Test-TableHeader $Lines $_ }
  $rows | ForEach-Object { Test-State $_ }
  Test-SettledRows $Lines $sections ($releases | Select-Object -First 1)
  $rows | ForEach-Object { Test-Published $_ $releases }
}

function Get-ValidationResult([string]$SddPath) {
  $file = Join-Path $SddPath 'roadmap.md'
  if (-not (Test-Path -LiteralPath $file)) { return [pscustomobject]@{ Lines = @('Sin roadmap que validar'); Code = 0 } }
  $problems = @(Get-RoadmapProblems @(Get-Content -LiteralPath $file -Encoding utf8))
  if ($problems) { return [pscustomobject]@{ Lines = @($problems | ForEach-Object { "roadmap.md: $_" }); Code = 1 } }
  return [pscustomobject]@{ Lines = @('Roadmap válido'); Code = 0 }
}

$previousEncoding = [Console]::OutputEncoding
try {
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $result = Get-ValidationResult $Path
  $result.Lines | ForEach-Object { Write-Output $_ }
}
finally {
  [Console]::OutputEncoding = $previousEncoding
}
exit $result.Code
