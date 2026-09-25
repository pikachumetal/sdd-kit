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

Describe 'sdd-plan' {
  BeforeAll {
    $script:Plan = Get-KitFile 'skills/sdd-plan/SKILL.md'
    $script:Description = [regex]::Match($script:Plan, '(?m)^description: (.+)$').Groups[1].Value
  }

  It 'la description recoge preparar la release, las reuniones y el roadmap' {
    $script:Description | Should -Match '^Usar'
    $script:Description | Should -Match 'prepara la release'
    $script:Description | Should -Match 'reunión'
    $script:Description | Should -Match 'roadmap'
  }

  It 'distingue las cinco entradas y el scope de release' {
    foreach ($entry in 'Algo grande', 'Algo concreto', 'Items del gestor', 'Una reunión', 'Reordenar o cambiar', 'Preparar una release') {
      $script:Plan | Should -Match ([regex]::Escape($entry))
    }
  }

  It 'separa planificar de hacer por el verbo' {
    $script:Plan | Should -Match 'sdd-start-task'
    $script:Plan | Should -Match 'no lo arranques'
  }

  It 'la entrevista usa brainstorming y acaba en el roadmap, no en una spec' {
    $script:Plan | Should -Match 'superpowers:brainstorming'
    $script:Plan | Should -Match 'nunca acaba en spec'
  }

  It 'calca la propuesta de sdd-templates' {
    $script:Plan | Should -Match 'proposal-template\.md'
    $script:Plan | Should -Match 'proposal-<id>-<slug>'
  }

  It 'no arranca nada' {
    $script:Plan | Should -Match 'ni rama, ni carpeta de task, ni spec'
  }

  It 'fija las reglas del roadmap' {
    $script:Plan | Should -Match 'tras NNNN'
    $script:Plan | Should -Match '⏸️ aparcada: descartada por'
    $script:Plan | Should -Match '-Reserve -Count'
    $script:Plan | Should -Match 'sin preguntar'
  }

  It 'un cambio de definición es una enmienda fechada' {
    $script:Plan | Should -Match 'Enmiendas'
    $script:Plan | Should -Match 'solo lo pendiente'
  }

  It 'hereda la preparación de la release' {
    $script:Plan | Should -Match 'release\.hasRecipient'
    $script:Plan | Should -Match 'Ficheros que toca'
    $script:Plan | Should -Match 'nunca «por definir»'
    $script:Plan | Should -Match 'sequence'
  }

  It 'el router lleva la entrada a sdd-plan' {
    Get-KitFile 'hooks/router.md' | Should -Match 'sdd-kit:sdd-plan'
  }

  It 'el README lista sdd-plan' {
    Get-KitFile 'README.md' | Should -Match '\| `sdd-plan` \|'
  }
}
