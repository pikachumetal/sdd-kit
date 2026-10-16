BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:SaldadaLiteral = ': saldada — <enlace>]**'
  $script:ClosingPrefix = '^\*\*\[(Feature|Task|Patch) [^],]+, \d{4}-\d{2}-\d{2}: (saldada|parcial) — \[[^\]]+\]\([^)]+\)'

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
    $script:Archive = Get-KitFile 'skills/sdd-archive/SKILL.md'
  }

  It 'la plantilla fija los dos prefijos y la regex de conteo en el bloque de Deuda técnica' {
    $script:DebtBlock | Should -Match ([regex]::Escape('**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**'))
    $script:DebtBlock | Should -Match ([regex]::Escape('**[<Feature|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**'))
    $script:DebtBlock | Should -Match ([regex]::Escape("grep -E '\| \*\*\[(Feature|Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '"))
  }

  It 'sdd-archive cierra una fila de deuda o de backlog con el prefijo literal de la plantilla' {
    # Feature 0149, a2: remitiendo a la plantilla, 1 de 2 sujetos marcó la fila con «✅»; con el literal en la skill, 2 de 2.
    $script:Archive | Should -Match ([regex]::Escape('A debt or backlog row the change settles'))
    $script:Archive | Should -Match ([regex]::Escape('**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**'))
    $script:Template | Should -Match ([regex]::Escape('**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**'))
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

Describe 'sdd-roadmap no saca el roadmap de la forma' {
  BeforeAll { $script:Roadmapper = Get-KitFile 'skills/sdd-roadmap/SKILL.md' }

  It 'ejecuta el validador tras escribir' {
    $script:Roadmapper | Should -Match 'roadmap check'
  }

  It 'no admite una sección que pide el usuario' {
    $script:Roadmapper | Should -Not -Match '(?i)or wherever the user (says|asks)'
  }
}

Describe 'los cierres avisan del roadmap fuera de forma' {
  BeforeAll {
    $script:IndexesStep = [regex]::Match((Get-KitFile 'skills/sdd-archive/SKILL.md'), '(?ms)^4\. \*\*Indexes\*\*.*?(?=^5\. \*\*)').Value
    $script:Records = Get-KitFile 'skills/sdd-archive/references/records.md'
    $script:TemplatesIndex = (Get-KitFile 'skills/sdd-templates/SKILL.md') -split "`n" | Where-Object { $_ -match '^\| `sdd roadmap check` \|' }
  }

  It 'sdd-archive ejecuta el validador en el paso del roadmap' {
    $script:IndexesStep | Should -Match 'sdd roadmap check'
    $script:Records | Should -Match 'roadmap check --path \.docs/sdd'
  }

  It 'el índice de sdd-templates nombra quién ejecuta el validador' {
    $script:TemplatesIndex | Should -Match 'sdd-end-release'
    $script:TemplatesIndex | Should -Not -Match 'Hoy lo ejecuta la migración'
  }
}
