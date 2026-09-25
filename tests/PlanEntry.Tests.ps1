BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
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

Describe 'Retirada de sdd-start-release' {
  It 'la skill ya no existe' {
    Join-Path $script:RepoRoot 'skills/sdd-start-release' | Should -Not -Exist
  }

  It 'solo la nombran la migración que avisa y sdd-end-release, que es de otra task' {
    $paths = @('skills', 'hooks', 'README.md', '.docs/workflow', '.docs/sdd/architecture.md', '.docs/sdd/mission.md')
    $mentions = @(git -C $script:RepoRoot grep -l 'sdd-start-release' -- @paths)
    $mentions | Should -Be @('skills/sdd-end-release/SKILL.md', 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md')
  }

  It 'la consulta pasa la planificación a sdd-plan' {
    Get-KitFile 'skills/sdd-consult/SKILL.md' | Should -Match 'sdd-plan'
  }

  It 'la migración avisa de la retirada' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    $migration | Should -Match 'sdd-start-release'
    $migration | Should -Match 'sdd-plan'
  }

  It 'los documentos del flujo la tienen por artefacto retirado' {
    Get-KitFile 'tests/WorkflowDocs.Tests.ps1' | Should -Match "'sdd-start-release'"
  }
}

Describe 'Rama sin id' {
  BeforeAll {
    $script:Naming = Get-KitFile 'skills/sdd-start-task/references/nombrado.md'
    $script:PatchStep2 = [regex]::Match((Get-KitFile 'skills/sdd-start-patch/SKILL.md'), '(?ms)^2\. \*\*Carpeta\*\*.*?(?=^3\. )').Value
  }

  It 'el nombrado renombra la rama sin id y sin commits propios' {
    $script:Naming | Should -Match 'git branch -m feature/<id>-<slug>'
    $script:Naming | Should -Match 'sin id'
    $script:Naming | Should -Match 'sin commits propios'
  }

  It 'el paso 2 del patch aplica la regla del nombrado' {
    $script:PatchStep2 | Should -Match 'git branch -m'
    $script:PatchStep2 | Should -Match 'sin id'
  }

  It 'ninguno de los dos renombra una rama que ya lleva otro id' {
    $script:Naming | Should -Not -Match 'otro id o ninguno'
    $script:PatchStep2 | Should -Not -Match 'otro id o ninguno'
  }
}

Describe 'Revisión final' {
  BeforeAll {
    $script:Plan = Get-KitFile 'skills/sdd-plan/SKILL.md'
    $script:Checklist = (($script:Plan -split '## Checklist')[1] -split '## Lo que deja')[0]
    $script:Naming = Get-KitFile 'skills/sdd-start-task/references/nombrado.md'
    $script:PatchStep2 = [regex]::Match((Get-KitFile 'skills/sdd-start-patch/SKILL.md'), '(?ms)^2\. \*\*Carpeta\*\*.*?(?=^3\. )').Value
  }

  It 'la regla de la task en marcha vale para toda entrada, en el checklist' {
    $script:Checklist | Should -Match 'task en marcha'
    $script:Checklist | Should -Match 'tras'
    $script:Checklist | Should -Match 'cerrada'
  }

  It 'la red flag y la racionalización de la task en marcha vuelven' {
    $script:Plan | Should -Match 'Vas a editar la fila o la spec de una task en marcha'
    $script:Plan | Should -Match 'La nota es del tema de la task en marcha'
  }

  It 'el renombrado nunca toca la rama de integración ni la estable' {
    foreach ($text in $script:Naming, $script:PatchStep2) {
      $text | Should -Match 'feature/<slug>'
      $text | Should -Match 'nunca .*rama de integración'
    }
  }

  It 'el paso 2 del patch usa las mismas condiciones que el nombrado' {
    $script:PatchStep2 | Should -Match 'frente a la rama de integración'
    $script:PatchStep2 | Should -Match 'antes del primer commit'
  }
}
