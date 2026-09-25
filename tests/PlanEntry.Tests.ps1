BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Carril proposal' {
  BeforeAll {
    $script:Proposal = Get-KitFile 'skills/sdd-templates/templates/proposal-template.md'
  }

  It 'la plantilla de la propuesta lleva sus seis secciones en orden' {
    $headings = @([regex]::Matches($script:Proposal, '(?m)^## (.+)$') | ForEach-Object { $_.Groups[1].Value.Trim() })
    $headings | Should -Be @('Por qué', 'Reglas de negocio', 'Capacidades que toca', 'Reparto', 'Acta', 'Enmiendas')
  }

  It 'el frontmatter de la propuesta declara su id y su origen' {
    $script:Proposal | Should -Match '(?m)^proposal: '
    $script:Proposal | Should -Match '(?m)^source: interview \| meeting'
  }

  It 'cada regla de negocio lleva un ejemplo con datos' {
    $script:Proposal | Should -Match 'ejemplo con datos'
  }

  It 'el reparto es la lista completa y no lleva estado' {
    $script:Proposal | Should -Match '\| Orden \| Id \| Feature \| Tras \|'
    $script:Proposal | Should -Match 'no lleva estado'
    $script:Proposal | Should -Match 'lista completa'
  }

  It 'las enmiendas van fechadas, la más reciente arriba, sin reescribir las reglas' {
    $script:Proposal | Should -Match 'más reciente arriba'
    $script:Proposal | Should -Match 'no se reescrib'
  }

  It 'la spec puede apuntar a su propuesta' {
    Get-KitFile 'skills/sdd-templates/templates/spec-template.md' | Should -Match '(?m)^proposal: <id>'
  }

  It 'el nombrado de carpetas incluye el carril proposal' {
    Get-KitFile 'skills/sdd-start-task/references/nombrado.md' | Should -Match '\(task\|patch\|proposal\)'
    Get-KitFile 'skills/sdd-templates/SKILL.md' | Should -Match '\(task\|patch\|proposal\)'
  }

  It 'el roadmap escribe la dependencia en la fila' {
    Get-KitFile 'skills/sdd-templates/templates/roadmap-template.md' | Should -Match 'tras NNNN'
  }

  It 'las plantillas del roadmap y del acta nombran sdd-plan, no sdd-start-release' {
    foreach ($template in 'roadmap-template.md', 'feedback-template.md') {
      $content = Get-KitFile "skills/sdd-templates/templates/$template"
      $content | Should -Match 'sdd-plan'
      $content | Should -Not -Match 'sdd-start-release'
    }
  }
}
