BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Plantilla del prompt de arranque' {
  BeforeAll {
    $script:TemplatePath = Join-Path $script:RepoRoot 'skills/sdd-templates/templates/launch-prompt-template.md'
  }

  It 'existe en sdd-templates' {
    $script:TemplatePath | Should -Exist
  }

  It 'lleva <_>' -ForEach @('Base:', 'Carril:', 'Decisiones ya tomadas:', 'Nada que saldar', 'Perfil', 'Al fusionar', 'arráncalo') {
    Get-Content $script:TemplatePath -Raw | Should -Match ([regex]::Escape($_))
  }

  It 'lleva la rama y el prompt en dos bloques text' {
    ([regex]::Matches((Get-Content $script:TemplatePath -Raw), '(?m)^```text$')).Count | Should -BeGreaterOrEqual 2
  }

  It 'tiene su fila en el índice de sdd-templates' {
    Get-KitFile 'skills/sdd-templates/SKILL.md' | Should -Match 'launch-prompt-template\.md'
  }
}

Describe 'Quién da el prompt de arranque' {
  It 'sdd-explore nombra la plantilla' {
    Get-KitFile 'skills/sdd-explore/SKILL.md' | Should -Match 'launch-prompt-template\.md'
  }

  It 'sdd-roadmap nombra la plantilla' -Skip {
    Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Match 'launch-prompt-template\.md'
  }
}
