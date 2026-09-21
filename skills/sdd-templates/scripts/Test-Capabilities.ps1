<#
.SYNOPSIS
  Valida la forma del delta de capacidades de un spec.md o un patch.md.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). No se copia al proyecto: se ejecuta desde el kit con -Path y -ProjectRoot.
  Comprueba solo cuatro cosas: que exista la línea o sección de capacidad, que un slug de capacidad nueva esté en
  kebab-case ASCII o ya tenga fichero, que un ADDED no repita un requisito existente, y que un MODIFIED no traiga
  menos cláusulas que el requisito vigente sin declarar los (retira: ...) que faltan. No juzga pertenencia ni idioma.
.EXAMPLE
  pwsh -NoProfile -File Test-Capabilities.ps1 -Path D:\code\mi-proyecto\.docs\sdd\specs\...\spec.md -ProjectRoot D:\code\mi-proyecto
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)]
  [string]$Path,
  [Parameter(Mandatory)]
  [string]$ProjectRoot
)
$ErrorActionPreference = 'Stop'

$script:KebabPattern = '^[a-z0-9]+(-[a-z0-9]+)*$'
$script:ClausePattern = '^- (GIVEN|WHEN|THEN|AND) '
$script:HeadingPattern = '^#+\s'
$script:CapabilityHeadingPattern = '^###\s+Capacidad:\s*`([^`]+)`'
$script:MarkerTypePattern = '(ADDED|MODIFIED|REMOVED)'
$script:MarkerStartPattern = "^\*\*$script:MarkerTypePattern\s+—"
$script:MarkerPattern = "$script:MarkerStartPattern\s+(.+?)\*\*(.*)$"
$script:BlockStopPattern = "($script:MarkerStartPattern)|($script:HeadingPattern)"

function Format-Case([string]$FileName, [string]$Label, [string]$Message) {
  return "${FileName}: ${Label}: ${Message}"
}

function Test-KebabSlug([string]$Slug) {
  return $Slug -cmatch $script:KebabPattern
}

function Get-CapabilityContent([string]$CapabilitiesDir, [string]$Slug) {
  $capFile = Join-Path $CapabilitiesDir "$Slug.md"
  if (-not (Test-Path -LiteralPath $capFile)) { return $null }
  return Get-Content -LiteralPath $capFile -Raw -Encoding utf8
}

function Measure-ClauseLines([string[]]$Lines, [int]$StartIndex, [string]$StopPattern) {
  $count = 0
  for ($i = $StartIndex; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -match $StopPattern) { break }
    if ($Lines[$i] -match $script:ClausePattern) { $count++ }
  }
  return $count
}

function Find-RequirementHeadingIndex([string[]]$Lines, [string]$TrimmedTitle) {
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -match '^###\s+(.+)$' -and $Matches[1].Trim() -eq $TrimmedTitle) { return $i }
  }
  return -1
}

function Get-RequirementClauseCount([string]$CapabilityContent, [string]$Title) {
  $lines = $CapabilityContent -split "`r?`n"
  $headingIndex = Find-RequirementHeadingIndex $lines $Title.Trim()
  if ($headingIndex -lt 0) { return $null }
  return Measure-ClauseLines $lines ($headingIndex + 1) $script:HeadingPattern
}

function Test-CapabilityLineSpec([string]$Content) {
  if ($Content.Contains('Capacidad(es) del delta:')) { return $null }
  return [pscustomobject]@{
    Label   = '(general)'
    Message = 'falta una línea con «Capacidad(es) del delta:» (o el opt-out «ninguna — <motivo>»).'
  }
}

function Test-CapabilityLinePatch([string]$Content) {
  if ($Content -match '(?m)^##\s+Delta de capacidades\s*$') { return $null }
  return [pscustomobject]@{
    Label   = '(general)'
    Message = 'falta la sección «## Delta de capacidades».'
  }
}

function Get-DeltaSectionPatch([string]$Content) {
  $heading = [regex]::Match($Content, '(?m)^##\s+Delta de capacidades\s*$')
  if (-not $heading.Success) { return '' }
  $rest = $Content.Substring($heading.Index + $heading.Length)
  $nextHeading = [regex]::Match($rest, '(?m)^##\s+\S')
  if ($nextHeading.Success) { return $rest.Substring(0, $nextHeading.Index) }
  return $rest
}

function Test-NewCapabilitySlug([string]$Slug, [string]$CapabilitiesDir) {
  $exists = $null -ne (Get-CapabilityContent $CapabilitiesDir $Slug)
  if ($exists -or (Test-KebabSlug $Slug)) { return $null }
  return [pscustomobject]@{
    Label   = $Slug
    Message = 'el slug no existe como capacidad en capabilities/ y no está en kebab-case ASCII (^[a-z0-9]+(-[a-z0-9]+)*$).'
  }
}

function Test-AddedDuplicate([pscustomobject]$Marker, [string]$CapabilityContent) {
  if ($null -eq $CapabilityContent) { return $null }
  if ($null -eq (Get-RequirementClauseCount $CapabilityContent $Marker.Title)) { return $null }
  return [pscustomobject]@{
    Label   = $Marker.Title
    Message = 'ya existe como requisito de esta capacidad; usa MODIFIED en vez de ADDED.'
  }
}

function Test-ModifiedBlockLength([pscustomobject]$Marker, [string]$CapabilityContent) {
  if ($null -eq $CapabilityContent) { return $null }
  $currentCount = Get-RequirementClauseCount $CapabilityContent $Marker.Title
  if ($null -eq $currentCount) { return $null }
  $total = $Marker.BlockCount + $Marker.RetiraCount
  if ($total -ge $currentCount) { return $null }
  return [pscustomobject]@{
    Label   = $Marker.Title
    Message = "el MODIFIED trae $($Marker.BlockCount) cláusula(s) y declara $($Marker.RetiraCount) retirada(s) " +
      "(total $total); el requisito vigente tiene $currentCount. Incluye el bloque entero o los «(retira: ...)» que faltan."
  }
}

function New-DeltaMarker([hashtable]$MatchResult, [string[]]$Lines, [int]$Index) {
  return [pscustomobject]@{
    Type        = $MatchResult[1]
    Title       = $MatchResult[2].Trim()
    BlockCount  = Measure-ClauseLines $Lines ($Index + 1) $script:BlockStopPattern
    RetiraCount = ([regex]::Matches($MatchResult[3], '\(retira:')).Count
  }
}

function Get-DeltaCases([string[]]$Lines, [string]$CapabilitiesDir) {
  $cases = @()
  $currentSlug = $null
  $capabilityContent = $null

  for ($i = 0; $i -lt $Lines.Count; $i++) {
    $line = $Lines[$i]

    if ($line -match $script:CapabilityHeadingPattern) {
      $currentSlug = $Matches[1]
      $capabilityContent = Get-CapabilityContent $CapabilitiesDir $currentSlug
      $cases += Test-NewCapabilitySlug $currentSlug $CapabilitiesDir
      continue
    }

    if ($null -eq $currentSlug) { continue }
    if (-not ($line -match $script:MarkerPattern)) { continue }

    $marker = New-DeltaMarker $Matches $Lines $i
    if ($marker.Type -eq 'ADDED') { $cases += Test-AddedDuplicate $marker $capabilityContent }
    if ($marker.Type -eq 'MODIFIED') { $cases += Test-ModifiedBlockLength $marker $capabilityContent }
  }

  return @($cases | Where-Object { $null -ne $_ })
}

if (-not (Test-Path -LiteralPath $Path)) {
  Write-Error "No existe el fichero '$Path'." -ErrorAction Continue
  exit 2
}

$fileName = Split-Path -Path $Path -Leaf
if ($fileName -ne 'spec.md' -and $fileName -ne 'patch.md') {
  Write-Error "«$Path» no es un spec.md ni un patch.md." -ErrorAction Continue
  exit 2
}

$content = Get-Content -LiteralPath $Path -Raw -Encoding utf8
$capabilitiesDir = Join-Path $ProjectRoot '.docs/sdd/capabilities'

if ($fileName -eq 'spec.md') {
  $lineCase = Test-CapabilityLineSpec $content
  $deltaLines = $content -split "`r?`n"
}
else {
  $lineCase = Test-CapabilityLinePatch $content
  $deltaLines = (Get-DeltaSectionPatch $content) -split "`r?`n"
}

$cases = @()
if ($null -ne $lineCase) { $cases += $lineCase }
$cases += Get-DeltaCases $deltaLines $capabilitiesDir

if ($cases.Count -eq 0) {
  Write-Output 'Sin problemas de forma.'
  exit 0
}

foreach ($case in $cases) { Write-Output (Format-Case $fileName $case.Label $case.Message) }
exit 1
