<#
.SYNOPSIS
  Fusiona el delta de capacidades de una spec o un patch.md en <Path>/capabilities/.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lee las subsecciones «### Capacidad: `<nombre>`» del artefacto y,
  en cada capacidad: ADDED añade el requisito al final de «## Requisitos», MODIFIED sustituye entero el que tiene ese
  título, REMOVED lo quita y cada entrada de «Reglas de la capacidad» sustituye o añade, en su orden, la que tiene su
  nombre. Del delta solo pasan los escenarios: quedan fuera «- Se valida en:», «- motivo:», las líneas de ayuda «>» y el
  «(antes: …)» del encabezado. Los ficheros que toca quedan con una línea en blanco tras cada título y entre bloques.

  Todo o nada: con cualquier fallo (un MODIFIED que no está, un ADDED con otro texto ya presente, una cita de una
  decisión de la spec por número, un hueco <…> de la plantilla, una capacidad sin fichero que el bloque «Capacidades»
  no declara en «Nuevas», un MODIFIED que perdería un «- AND» del vivo) escribe una línea por fallo, sale con 1 y no cambia ningún fichero. Sin fallos, una línea
  por cambio y sale con 0. Volver a ejecutarlo sobre lo ya fusionado no cambia nada.
.EXAMPLE
  pwsh -NoProfile -File Merge-CapabilityDelta.ps1 -Path .docs/sdd -Artifact .docs/sdd/specs/<carpeta>/spec.md
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Path,
  [Parameter(Mandatory)][string]$Artifact
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'CapabilitySections.ps1')

function Remove-InlineCode([string]$Text) { return $Text -replace '`[^`]*`', '' }

function Find-Pattern([string]$Text, [string]$Pattern) {
  $match = [regex]::Match((Remove-InlineCode $Text), $Pattern)
  if ($match.Success) { return $match.Value }
}

function Format-Title([string]$Title) { return ($Title -replace '\s+', ' ').Trim() }

function Get-MergeableLines([string[]]$Lines) {
  return @($Lines | Where-Object { $_.Trim() -and $_ -notmatch '^\s*>' -and $_ -notmatch '^- (Se valida en|motivo):' -and $_ -notmatch '^- REMOVED ' } |
      ForEach-Object { $_.TrimEnd() })
}

function Get-OutcomeLines([string[]]$Lines) {
  return @($Lines | Where-Object { $_ -match '^- (THEN|AND)\b' } | ForEach-Object { Format-Title $_ })
}

function Get-LostLines([object]$Existing, [object]$Entry) {
  # ponytail: cuenta, no empareja; editar una línea no la pierde. Si el delta quita una y añade otra, no lo ve.
  $live = Get-OutcomeLines $Existing.Body
  $kept = Get-OutcomeLines $Entry.Lines
  $retired = @($Entry.Lines | Where-Object { $_ -match '^- REMOVED (.+)$' } | ForEach-Object { '- ' + (Format-Title $Matches[1]) } |
      Where-Object { $live -ccontains $_ })
  if ($kept.Count + $retired.Count -ge $live.Count) { return }
  return @($live | Where-Object { $kept -cnotcontains $_ -and $retired -cnotcontains $_ })
}

function Test-DeltaEntry([object]$Entry, [string]$ArtifactName) {
  if ($Entry.Kind -ne 'RULES' -and -not $Entry.Title) {
    return "${ArtifactName}: no leo el título de «$($Entry.Header)»: escríbelo como «**$($Entry.Kind) — <título>**», con raya"
  }
  $body = Get-MergeableLines $Entry.Lines
  $gap = @($Entry.Capability, $Entry.Title) + $body | ForEach-Object { Find-Pattern $_ '<[^<>\s][^<>]*>' } | Select-Object -First 1
  if ($gap) { return "${ArtifactName}: «$gap» es un hueco de la plantilla: rellénalo o borra lo que no aplique" }
  $citation = $body | ForEach-Object { Find-Pattern $_ '(?i)decisi[oó]n(es)?\s+\d+' } | Select-Object -First 1
  if (-not $citation) { return }
  $label = if ($Entry.Title) { $Entry.Title } else { 'Reglas de la capacidad' }
  return "${ArtifactName}: «$label» cita la spec («$citation»): reescríbelo en el delta sin la referencia y vuelve a ejecutar"
}

function New-Document([string]$File, [string[]]$Lines, [string]$Newline) {
  return [pscustomobject]@{
    File = $File; Name = Split-Path -Leaf $File; Newline = $Newline
    Lines = [System.Collections.Generic.List[string]]::new([string[]]$Lines)
  }
}

function Read-Document([string]$File) {
  $raw = [System.IO.File]::ReadAllText($File)
  $newline = if ($raw.Contains("`r`n")) { "`r`n" } else { "`n" }
  return New-Document $File ($raw -split '\r?\n') $newline
}

function Get-Document([object]$Run, [string]$Name) {
  $file = Join-Path $Run.CapabilitiesDir "$Name.md"
  if (Test-Path -LiteralPath $file) { return Read-Document $file }
  $declared = $Run.Declared | Where-Object { $_.Kind -eq 'Nuevas' -and $_.Name -eq $Name } | Select-Object -First 1
  if (-not $declared -or $Run.IsPatch) {
    return "$($Run.ArtifactName): «$Name» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»"
  }
  return New-Document $file @("# Capacidad — $Name", '', '## Propósito', '', $declared.Summary, '', '## Requisitos', '') "`n"
}

function Find-SectionIndex([object]$Document, [string]$Title) {
  return $Document.Lines.FindIndex([Predicate[string]] { param($line) (Get-SectionTitle $line) -eq $Title })
}

function Get-SectionEnd([object]$Document, [string]$Title) {
  $start = Find-SectionIndex $Document $Title
  if ($start -lt 0) { return -1 }
  $end = $start + 1
  while ($end -lt $Document.Lines.Count -and $Document.Lines[$end] -notmatch '^## ') { $end++ }
  return $end
}

function Get-RequirementsEnd([object]$Document) {
  $end = Get-SectionEnd $Document 'Requisitos'
  if ($end -ge 0) { return $end }
  $rules = Find-SectionIndex $Document 'Reglas de la capacidad'
  $at = if ($rules -ge 0) { $rules } else { $Document.Lines.Count }
  $Document.Lines.InsertRange($at, [string[]]@('', '## Requisitos', ''))
  return $at + 3
}

function Find-Requirement([object]$Document, [string]$Title) {
  $lines = $Document.Lines
  for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -notmatch '^### (.+)$' -or (Format-Title $Matches[1]) -cne $Title) { continue }
    $end = $i + 1
    while ($end -lt $lines.Count -and $lines[$end] -notmatch '^#{1,3} ') { $end++ }
    return [pscustomobject]@{ Start = $i; End = $end; Body = @($lines.GetRange($i + 1, $end - $i - 1)) }
  }
}

function New-RequirementBlock([object]$Entry) {
  return , [string[]](@('', "### $($Entry.Title)", '') + (Get-MergeableLines $Entry.Lines) + @(''))
}

function Add-Requirement([object]$Run, [object]$Document, [object]$Entry) {
  $existing = Find-Requirement $Document $Entry.Title
  if (-not $existing) {
    $Document.Lines.InsertRange((Get-RequirementsEnd $Document), (New-RequirementBlock $Entry))
    return $Run.Messages.Add("$($Document.Name): añadido «$($Entry.Title)»")
  }
  if (((Get-MergeableLines $existing.Body) -join "`n") -ceq ((Get-MergeableLines $Entry.Lines) -join "`n")) {
    return $Run.Messages.Add("$($Document.Name): «$($Entry.Title)» ya estaba")
  }
  $Run.Errors.Add("$($Run.ArtifactName): «$($Entry.Title)» del ADDED ya está en capabilities/$($Document.Name) con otro texto: usa MODIFIED")
}

function Set-Requirement([object]$Run, [object]$Document, [object]$Entry) {
  $existing = Find-Requirement $Document $Entry.Title
  if (-not $existing) {
    return $Run.Errors.Add("$($Run.ArtifactName): «$($Entry.Title)» del MODIFIED no está en capabilities/$($Document.Name)")
  }
  $lost = Get-LostLines $existing $Entry
  foreach ($line in $lost) {
    $Run.Errors.Add("$($Run.ArtifactName): «$($Entry.Title)» del MODIFIED perdería «$line» de capabilities/$($Document.Name): cópiala en el delta o retírala con «- REMOVED $($line.Substring(2))»")
  }
  if ($lost) { return }
  $Document.Lines.RemoveRange($existing.Start, $existing.End - $existing.Start)
  $Document.Lines.InsertRange($existing.Start, (New-RequirementBlock $Entry))
  $Run.Messages.Add("$($Document.Name): sustituido «$($Entry.Title)»")
}

function Remove-Requirement([object]$Run, [object]$Document, [object]$Entry) {
  $existing = Find-Requirement $Document $Entry.Title
  if (-not $existing) { return $Run.Messages.Add("$($Document.Name): «$($Entry.Title)» ya no estaba") }
  $Document.Lines.RemoveRange($existing.Start, $existing.End - $existing.Start)
  $Run.Messages.Add("$($Document.Name): quitado «$($Entry.Title)»")
}

function Get-RuleEntries([string[]]$Lines) {
  $current = $null
  foreach ($line in Get-MergeableLines $Lines) {
    if ($line -match '^- \*\*(.+?)\*\*:') {
      if ($current) { $current }
      $current = [pscustomobject]@{ Name = $Matches[1]; Lines = [System.Collections.Generic.List[string]]::new() }
    }
    if ($current) { $current.Lines.Add($line) }
  }
  if ($current) { $current }
}

function Find-Rule([object]$Document, [string]$Name) {
  $lines = $Document.Lines
  $start = $lines.FindIndex([Predicate[string]] { param($line) $line.StartsWith("- **$Name**:") })
  if ($start -lt 0) { return $null }
  $end = $start + 1
  while ($end -lt $lines.Count -and $lines[$end] -match '^\s+\S') { $end++ }
  return [pscustomobject]@{ Start = $start; End = $end }
}

function Get-RulesSectionEnd([object]$Document) {
  $end = Get-SectionEnd $Document 'Reglas de la capacidad'
  if ($end -lt 0) {
    $Document.Lines.AddRange([string[]]@('', '## Reglas de la capacidad', ''))
    return $Document.Lines.Count
  }
  while ($end -gt 0 -and -not $Document.Lines[$end - 1].Trim()) { $end-- }
  return $end
}

function Get-RuleInsertIndex([object]$Document, [string]$Name) {
  $index = [array]::IndexOf($script:RuleNames, $Name)
  if ($index -ge 0) {
    foreach ($next in $script:RuleNames | Select-Object -Skip ($index + 1)) {
      $found = Find-Rule $Document $next
      if ($found) { return $found.Start }
    }
  }
  return Get-RulesSectionEnd $Document
}

function Set-Rule([object]$Run, [object]$Document, [object]$Rule) {
  $existing = Find-Rule $Document $Rule.Name
  if (-not $existing) {
    $Document.Lines.InsertRange((Get-RuleInsertIndex $Document $Rule.Name), [string[]]$Rule.Lines)
    return $Run.Messages.Add("$($Document.Name): regla «$($Rule.Name)» añadida")
  }
  $Document.Lines.RemoveRange($existing.Start, $existing.End - $existing.Start)
  $Document.Lines.InsertRange($existing.Start, [string[]]$Rule.Lines)
  $Run.Messages.Add("$($Document.Name): regla «$($Rule.Name)» sustituida")
}

function Invoke-DeltaEntry([object]$Run, [object]$Document, [object]$Entry) {
  switch ($Entry.Kind) {
    'ADDED' { Add-Requirement $Run $Document $Entry }
    'MODIFIED' { Set-Requirement $Run $Document $Entry }
    'REMOVED' { Remove-Requirement $Run $Document $Entry }
    'RULES' { foreach ($rule in Get-RuleEntries $Entry.Lines) { Set-Rule $Run $Document $rule } }
  }
}

function Format-CapabilityLines([string[]]$Lines) {
  $result = [System.Collections.Generic.List[string]]::new()
  foreach ($line in $Lines) {
    $previous = if ($result.Count) { $result[$result.Count - 1] } else { $null }
    if (-not $line.Trim()) {
      if ($previous) { $result.Add('') }
      continue
    }
    if ($previous -and ($line -match '^#{1,3} ' -or $previous -match '^#{1,3} ')) { $result.Add('') }
    $result.Add($line)
  }
  while ($result.Count -and $result[$result.Count - 1] -eq '') { $result.RemoveAt($result.Count - 1) }
  return , $result.ToArray()
}

function Save-Document([object]$Document) {
  $content = ((Format-CapabilityLines $Document.Lines) -join $Document.Newline) + $Document.Newline
  New-Item -ItemType Directory -Force -Path (Split-Path $Document.File) | Out-Null
  [System.IO.File]::WriteAllText($Document.File, $content, [System.Text.UTF8Encoding]::new($false))
}

function New-MergeRun([string]$SddPath, [string]$ArtifactPath) {
  $file = Get-Item -LiteralPath $ArtifactPath
  $lines = @(Get-Content -Encoding utf8 -LiteralPath $file.FullName)
  $block = Get-SectionLines $lines 'Capacidades'
  return [pscustomobject]@{
    CapabilitiesDir = Join-Path $SddPath 'capabilities'; ArtifactName = $file.Name
    IsPatch = Test-IsPatch $file $lines
    Declared = @(if ($null -ne $block) { Get-DeclaredCapabilities $block })
    Entries = @(Get-DeltaEntries $lines)
    Errors = [System.Collections.Generic.List[string]]::new(); Messages = [System.Collections.Generic.List[string]]::new()
  }
}

function Merge-Capability([object]$Run, [string]$Name, [object[]]$Entries) {
  $document = Get-Document $Run $Name
  if ($document -is [string]) { return $Run.Errors.Add($document) }
  foreach ($entry in $Entries) { Invoke-DeltaEntry $Run $document $entry }
  return $document
}

function Get-MergeResult([string]$SddPath, [string]$ArtifactPath) {
  $run = New-MergeRun $SddPath $ArtifactPath
  if (-not $run.Entries) { return [pscustomobject]@{ Lines = @('Sin delta que fusionar'); Code = 0 } }
  foreach ($entry in $run.Entries) { Test-DeltaEntry $entry $run.ArtifactName | ForEach-Object { $run.Errors.Add($_) } }
  $documents = @($run.Entries | Group-Object Capability | ForEach-Object { Merge-Capability $run $_.Name @($_.Group) })
  if ($run.Errors.Count) { return [pscustomobject]@{ Lines = @($run.Errors); Code = 1 } }
  $documents | ForEach-Object { Save-Document $_ }
  return [pscustomobject]@{ Lines = @($run.Messages); Code = 0 }
}

$previousEncoding = [Console]::OutputEncoding
try {
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $result = Get-MergeResult $Path $Artifact
  $result.Lines | ForEach-Object { Write-Output $_ }
}
finally {
  [Console]::OutputEncoding = $previousEncoding
}
exit $result.Code
