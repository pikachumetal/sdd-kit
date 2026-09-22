BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:SaldadaLiteral = ': saldada — <enlace>]**'
  $script:ClosingPrefix = '^\*\*\[(Task|Patch) [^],]+, \d{4}-\d{2}-\d{2}: (saldada|parcial) — \[[^\]]+\]\([^)]+\)'

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-StepLine([string]$Skill, [int]$Step) {
    return ($Skill -split "`n") | Where-Object { $_ -match "^$Step\. \*\*``roadmap\.md``\*\*" }
  }

  function Get-SectionRows([string]$Markdown, [string]$Heading) {
    $section = [regex]::Match($Markdown, "(?ms)^## $Heading\r?\n(.*?)(?=^## )").Groups[1].Value
    return ($section -split "`n") | Where-Object { $_ -match '^\| ' -and $_ -notmatch '^\| (---|#|Ítem) ' }
  }

  function Get-ItemCell([string]$Row, [string]$Heading) {
    $cells = $Row.Split('|')
    $index = if ($Heading -eq 'Backlog') { 2 } else { 1 }
    return $cells[$index].Trim()
  }
}

Describe 'Formato de cierre de filas del roadmap' {
  BeforeAll {
    $script:Template = Get-KitFile 'skills/sdd-templates/templates/roadmap-template.md'
    $script:DebtBlock = [regex]::Match($script:Template, '(?ms)^## Deuda técnica\r?\n(.*?)(?=^## )').Groups[1].Value
    $script:EndTask = Get-KitFile 'skills/sdd-end-task/SKILL.md'
    $script:EndPatch = Get-KitFile 'skills/sdd-end-patch/SKILL.md'
  }

  It 'la plantilla fija los dos prefijos y la regex de conteo en el bloque de Deuda técnica' {
    $script:DebtBlock | Should -Match ([regex]::Escape('**[<Task|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**'))
    $script:DebtBlock | Should -Match ([regex]::Escape('**[<Task|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**'))
    $script:DebtBlock | Should -Match ([regex]::Escape("grep -E '\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '"))
  }

  It 'el paso 8 de sdd-end-task cita el formato de la plantilla para Deuda técnica y Backlog' {
    $line = Get-StepLine $script:EndTask 8
    $line | Should -Match 'roadmap-template\.md'
    $line | Should -Match 'Deuda técnica'
    $line | Should -Match 'Backlog'
  }

  It 'el paso 4 de sdd-end-patch cita el formato de la plantilla para Deuda técnica y Backlog' {
    $line = Get-StepLine $script:EndPatch 4
    $line | Should -Match 'roadmap-template\.md'
    $line | Should -Match 'Deuda técnica'
    $line | Should -Match 'Backlog'
  }

  It 'las skills de cierre no copian el formato: vive solo en la plantilla' {
    $script:EndTask | Should -Not -Match ([regex]::Escape($script:SaldadaLiteral))
    $script:EndPatch | Should -Not -Match ([regex]::Escape($script:SaldadaLiteral))
  }
}

Describe 'Roadmap de este repo con el formato de cierre' {
  BeforeAll {
    $script:Roadmap = Get-KitFile '.docs/sdd/roadmap.md'
  }

  It 'ninguna fila de <_> cierra con tachado, cursiva o «Saldada por»' -ForEach 'Backlog', 'Deuda técnica' {
    $heading = $_
    $items = Get-SectionRows $script:Roadmap $heading | ForEach-Object { Get-ItemCell $_ $heading }
    $items | Where-Object { $_ -match '^~~|^\*[^*]|\*saldada|Saldada por' } | Should -BeNullOrEmpty
  }

  It 'todo prefijo entre corchetes de <_> sigue el formato de cierre' -ForEach 'Backlog', 'Deuda técnica' {
    $heading = $_
    $items = Get-SectionRows $script:Roadmap $heading | ForEach-Object { Get-ItemCell $_ $heading }
    $items | Where-Object { $_ -match '^\*\*\[' -and $_ -notmatch $script:ClosingPrefix } | Should -BeNullOrEmpty
  }
}
