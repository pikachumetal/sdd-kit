<#
.SYNOPSIS
  Lectura de capacidades SDD y del delta de una spec o un patch, compartida por Test-Capabilities.ps1,
  Get-CapabilityIndex.ps1 y Merge-CapabilityDelta.ps1.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lo cargan los scripts con «.»; no se ejecuta solo.
#>

$script:DeltaHeaderPattern = '^\*\*(ADDED|MODIFIED|REMOVED|Reglas de la capacidad)\b'
$script:RuleNames = @('Dónde viven los datos', 'Idioma de los nombres', 'Límites', 'Avisos', 'Regla ante conflicto')

function Get-SectionTitle([string]$Line) {
  if ($Line -notmatch '^## (.+)$') { return $null }
  return ($Matches[1] -replace '\s*\*\(.*\)\*\s*$', '').Trim()
}

function Get-SectionLines([string[]]$Lines, [string]$Title) {
  $start = [array]::FindIndex($Lines, [Predicate[string]] { param($line) (Get-SectionTitle $line) -eq $Title })
  if ($start -lt 0) { return $null }
  $section = [System.Collections.Generic.List[string]]::new()
  for ($i = $start + 1; $i -lt $Lines.Count -and $Lines[$i] -notmatch '^## '; $i++) { $section.Add($Lines[$i]) }
  return , $section.ToArray()
}

function Get-CapabilityPurpose([string[]]$Lines) {
  $section = Get-SectionLines $Lines 'Propósito'
  if ($null -eq $section) { return $null }
  $text = @($section | ForEach-Object { $_.Trim() } | Where-Object { $_ -and -not $_.StartsWith('>') }) -join ' '
  if ($text -match '^<[^>]*>$') { return '' }
  return $text
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

function Get-DeclaredCapabilities([string[]]$Block) {
  foreach ($line in $Block) {
    if ($line -notmatch '^(?:-\s*)?(Nuevas|Modificadas):(.*)$') { continue }
    $kind = $Matches[1]
    $parts = $Matches[2] -split '—', 2
    $summary = if ($parts.Count -gt 1) { $parts[1].Trim() } else { '' }
    foreach ($match in [regex]::Matches($parts[0], '`([^`]+)`')) {
      [pscustomobject]@{ Kind = $kind; Name = $match.Groups[1].Value; Summary = $summary }
    }
  }
}

function Test-DeltaHeaderClosed([string]$Header) {
  if ($Header -notmatch '^\*\*[^*]+\*\*') { return $false }
  return ([regex]::Matches($Header, '\(').Count -le [regex]::Matches($Header, '\)').Count)
}

function Test-HeaderContinuation([string[]]$Lines, [int]$Index) {
  return $Index -lt $Lines.Count -and $Lines[$Index].Trim() -and $Lines[$Index] -notmatch '^(- |#|\*\*)'
}

function Join-DeltaHeader([string[]]$Lines, [ref]$Index) {
  $header = $Lines[$Index.Value]
  while (-not (Test-DeltaHeaderClosed $header) -and (Test-HeaderContinuation $Lines ($Index.Value + 1))) {
    $Index.Value++
    $header += ' ' + $Lines[$Index.Value].Trim()
  }
  return $header
}

function New-DeltaEntry([string]$Capability, [string]$Header) {
  $kind = [regex]::Match($Header, $script:DeltaHeaderPattern).Groups[1].Value
  if ($kind -eq 'Reglas de la capacidad') { $kind = 'RULES' }
  $title = ([regex]::Match($Header, '^\*\*\w+ —\s*([^*]+?)\s*\*\*').Groups[1].Value) -replace '\s+', ' '
  return [pscustomobject]@{ Capability = $Capability; Kind = $kind; Title = $title; Header = $Header; Lines = [System.Collections.Generic.List[string]]::new() }
}

function Get-DeltaEntries([string[]]$Lines) {
  $capability = $null
  $current = $null
  for ($i = 0; $i -lt $Lines.Count; $i++) {
    $line = $Lines[$i]
    if ($line -match '^#{1,3} ') {
      if ($current) { $current; $current = $null }
      $capability = if ($line -match '^### Capacidad: `([^`]+)`') { $Matches[1] } else { $null }
      continue
    }
    if ($capability -and $line -match $script:DeltaHeaderPattern) {
      if ($current) { $current }
      $current = New-DeltaEntry $capability (Join-DeltaHeader $Lines ([ref]$i))
      continue
    }
    if ($current) { $current.Lines.Add($line) }
  }
  if ($current) { $current }
}

function Test-IsPatch([System.IO.FileInfo]$File, [string[]]$Lines) {
  return $File.Name -eq 'patch.md' -or [bool]($Lines | Where-Object { $_ -match '^type:\s*patch\s*$' })
}
