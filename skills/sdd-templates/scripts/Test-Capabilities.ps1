<#
.SYNOPSIS
  Valida las capacidades de un proyecto SDD y, si se le pasa, el bloque «Capacidades» de una spec o un patch.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lee <Path>/capabilities/*.md y comprueba en cada una: el título
  «# Capacidad — <nombre del fichero>», que solo haya las secciones «Propósito», «Requisitos» y «Reglas de la
  capacidad», que «Propósito» sea la primera y diga en 300 caracteres como máximo qué cubre la capacidad, que cada
  requisito tenga líneas - GIVEN, - WHEN y - THEN, que no queden marcas de delta y que la sección de reglas tenga sus
  cinco entradas por nombre. Con -Artifact, que se ejecuta después de fusionar el delta, comprueba además que el
  bloque «## Capacidades» del artefacto nombra las mismas capacidades que su delta. Escribe una línea por fallo y
  sale con 1; sin fallos, «Capacidades válidas: <n>» y sale con 0.
.EXAMPLE
  pwsh -NoProfile -File Test-Capabilities.ps1 -Path .docs/sdd -Artifact .docs/sdd/specs/<carpeta>/spec.md
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Path,
  [string]$Artifact
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'CapabilitySections.ps1')
$script:RuleNames = @('Dónde viven los datos', 'Idioma de los nombres', 'Límites', 'Avisos', 'Regla ante conflicto')
$script:AllowedSections = @('Propósito', 'Requisitos', 'Reglas de la capacidad')
$script:ScenarioKeywords = @('GIVEN', 'WHEN', 'THEN')
$script:PurposeMaxLength = 300

function Test-CapabilityTitle([string]$Slug, [string[]]$Lines) {
  $title = $Lines | Where-Object { $_.Trim() } | Select-Object -First 1
  if ($title -ne "# Capacidad — $Slug") { "el título debe ser «# Capacidad — $Slug»" }
}

function Test-CapabilitySections([string[]]$Lines) {
  $sections = $Lines | ForEach-Object { Get-SectionTitle $_ } | Where-Object { $_ }
  if ($sections -notcontains 'Requisitos') { 'falta la sección «Requisitos»' }
  foreach ($section in $sections | Where-Object { $script:AllowedSections -notcontains $_ }) {
    if ($section -eq 'Historial') { 'sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0'; continue }
    "sección «$section» no admitida: solo «Propósito», «Requisitos» y «Reglas de la capacidad»"
  }
}

function Test-CapabilityPurpose([string[]]$Lines) {
  $sections = @($Lines | ForEach-Object { Get-SectionTitle $_ } | Where-Object { $_ })
  if ($sections -notcontains 'Propósito') { return 'falta la sección «Propósito»' }
  if ($sections[0] -ne 'Propósito') { '«Propósito» debe ser la primera sección' }
  $purpose = Get-CapabilityPurpose $Lines
  if (-not $purpose) { return '«Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad' }
  if ($purpose.Length -gt $script:PurposeMaxLength) {
    "«Propósito» tiene $($purpose.Length) caracteres; el máximo es $script:PurposeMaxLength (una o dos frases)"
  }
}

function Get-Requirements([string[]]$Lines) {
  $current = $null
  foreach ($line in $Lines) {
    if ($line -match '^### (.+)$') {
      if ($current) { $current }
      $current = [pscustomobject]@{ Title = $Matches[1].Trim(); Lines = [System.Collections.Generic.List[string]]::new() }
      continue
    }
    if ($current) { $current.Lines.Add($line) }
  }
  if ($current) { $current }
}

function Test-RequirementScenarios([string[]]$Lines) {
  $requirements = Get-SectionLines $Lines 'Requisitos'
  if ($null -eq $requirements) { return }
  foreach ($requirement in Get-Requirements $requirements) {
    $missing = $script:ScenarioKeywords | Where-Object { $keyword = $_; -not ($requirement.Lines | Where-Object { $_ -match "^- $keyword\b" }) }
    if ($missing) { "«$($requirement.Title)» no tiene escenario completo (falta $(($missing | ForEach-Object { "- $_" }) -join ', '))" }
  }
}

function Test-DeltaLeftovers([string[]]$Lines) {
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    if ($Lines[$i] -match '^\*\*(ADDED|MODIFIED|REMOVED) —') { "resto de delta «**$($Matches[1]) —» en la línea $($i + 1)" }
    if ($Lines[$i] -match '^\*\*Reglas de la capacidad\*\*') {
      "resto de delta «**Reglas de la capacidad**» en la línea $($i + 1): sus entradas van en «## Reglas de la capacidad»"
    }
  }
}

function Test-CapabilityRules([string[]]$Lines) {
  $rules = Get-SectionLines $Lines 'Reglas de la capacidad'
  if ($null -eq $rules) { return }
  foreach ($name in $script:RuleNames) {
    if (-not ($rules | Where-Object { $_.StartsWith("- **$name**:") })) { "a «Reglas de la capacidad» le falta «$name»" }
  }
}

function Test-CapabilityFile([System.IO.FileInfo]$File) {
  $lines = @(Get-Content -Encoding utf8 -Path $File.FullName)
  $problems = @(
    Test-CapabilityTitle $File.BaseName $lines
    Test-CapabilitySections $lines
    Test-CapabilityPurpose $lines
    Test-RequirementScenarios $lines
    Test-DeltaLeftovers $lines
    Test-CapabilityRules $lines
  )
  $problems | ForEach-Object { "$($File.Name): $_" }
}

function Get-DeclaredCapabilities([string[]]$Block) {
  foreach ($line in $Block) {
    if ($line -notmatch '^(?:-\s*)?(Nuevas|Modificadas):(.*)$') { continue }
    $kind = $Matches[1]
    $names = ($Matches[2] -split '—', 2)[0]
    foreach ($match in [regex]::Matches($names, '`([^`]+)`')) {
      [pscustomobject]@{ Kind = $kind; Name = $match.Groups[1].Value }
    }
  }
}

function Test-NoneLine([string[]]$Block, [string[]]$DeltaNames) {
  $none = $Block | Where-Object { $_ -match '^(?:-\s*)?Ninguna\b' } | Select-Object -First 1
  if (-not $none) { return }
  if ($none -notmatch '^(?:-\s*)?Ninguna, porque\s+\S') { '«Ninguna» sin motivo: escribe «Ninguna, porque <motivo>»' }
  if ($DeltaNames) { 'el bloque dice «Ninguna» y hay delta' }
}

function Test-EmptyBlock([string[]]$Block, [object[]]$Declared) {
  if ($Declared -or ($Block | Where-Object { $_ -match '^(?:-\s*)?Ninguna\b' })) { return }
  'el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»'
}

function Test-BlockAgainstDelta([object[]]$Declared, [string[]]$DeltaNames, [string]$CapabilitiesDir) {
  $declaredNames = @($Declared | ForEach-Object Name | Select-Object -Unique)
  foreach ($name in $declaredNames | Where-Object { $DeltaNames -notcontains $_ }) {
    "«$name» está en el bloque «Capacidades» y no tiene subsección en el delta"
  }
  foreach ($name in $DeltaNames | Where-Object { $declaredNames -notcontains $_ }) {
    "el delta tiene «$name» y el bloque «Capacidades» no la nombra"
  }
  foreach ($name in $declaredNames | Where-Object { -not (Test-Path (Join-Path $CapabilitiesDir "$_.md")) }) {
    "«$name» no tiene fichero en capabilities/"
  }
}

function Test-IsPatch([System.IO.FileInfo]$File, [string[]]$Lines) {
  return $File.Name -eq 'patch.md' -or [bool]($Lines | Where-Object { $_ -match '^type:\s*patch\s*$' })
}

function Test-ArtifactBlock([System.IO.FileInfo]$File, [string]$CapabilitiesDir) {
  $lines = @(Get-Content -Encoding utf8 -Path $File.FullName)
  $block = Get-SectionLines $lines 'Capacidades'
  if ($null -eq $block) { return "$($File.Name): falta el bloque «## Capacidades»" }
  $deltaNames = @($lines | Where-Object { $_ -match '^### Capacidad: `([^`]+)`' } | ForEach-Object { [regex]::Match($_, '`([^`]+)`').Groups[1].Value })
  $declared = @(Get-DeclaredCapabilities $block)
  $problems = @(
    Test-EmptyBlock $block $declared
    Test-NoneLine $block $deltaNames
    Test-BlockAgainstDelta $declared $deltaNames $CapabilitiesDir
    if ((Test-IsPatch $File $lines) -and ($declared | Where-Object Kind -eq 'Nuevas')) { 'un patch no crea capacidades: quita «Nuevas»' }
  )
  $problems | ForEach-Object { "$($File.Name): $_" }
}

function Get-CapabilityFiles([string]$CapabilitiesDir) {
  if (-not (Test-Path $CapabilitiesDir)) { return @() }
  return @(Get-ChildItem -Path $CapabilitiesDir -Filter '*.md' -File | Sort-Object Name)
}

function Get-ValidationResult([string]$SddPath, [string]$ArtifactPath) {
  $capabilitiesDir = Join-Path $SddPath 'capabilities'
  $files = Get-CapabilityFiles $capabilitiesDir
  $problems = @($files | ForEach-Object { Test-CapabilityFile $_ })
  if ($ArtifactPath) { $problems += @(Test-ArtifactBlock (Get-Item $ArtifactPath) $capabilitiesDir) }
  if ($problems) { return [pscustomobject]@{ Lines = $problems; Code = 1 } }
  if (-not $files -and -not $ArtifactPath) { return [pscustomobject]@{ Lines = @('Sin capacidades que validar'); Code = 0 } }
  return [pscustomobject]@{ Lines = @("Capacidades válidas: $($files.Count)"); Code = 0 }
}

$previousEncoding = [Console]::OutputEncoding
try {
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $result = Get-ValidationResult $Path $Artifact
  $result.Lines | ForEach-Object { Write-Output $_ }
}
finally {
  [Console]::OutputEncoding = $previousEncoding
}
exit $result.Code
