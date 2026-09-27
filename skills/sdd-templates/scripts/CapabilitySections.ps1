<#
.SYNOPSIS
  Lectura de secciones de una capacidad SDD, compartida por Test-Capabilities.ps1 y Get-CapabilityIndex.ps1.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lo cargan los scripts con «.»; no se ejecuta solo.
#>

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
