BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Tipos de agente por effort' {
  It 'el plugin entrega exactamente effort-low, effort-medium y effort-high' {
    $names = Get-ChildItem (Join-Path $script:RepoRoot 'agents') -Filter *.md | ForEach-Object BaseName | Sort-Object
    $names | Should -Be @('effort-high', 'effort-low', 'effort-medium')
  }

  It '<Level> hereda el modelo, fija su effort y no recorta herramientas' -ForEach @(
    @{ Level = 'low' }, @{ Level = 'medium' }, @{ Level = 'high' }
  ) {
    $definition = Get-KitFile "agents/effort-$Level.md"
    $definition | Should -Match "(?m)^name: effort-$Level\s*$"
    $definition | Should -Match '(?m)^description: .+'
    $definition | Should -Match '(?m)^model: inherit\s*$'
    $definition | Should -Match "(?m)^effort: $Level\s*$"
    $definition | Should -Not -Match '(?m)^tools:'
  }
}

Describe 'El effort declarado se despacha con el tipo de agente' {
  It 'el campo Modelo del plan nombra el tipo y el modelo del despacho' {
    $template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $template | Should -Match '\*\*Modelo\*\*:[^\n]*subagent_type: sdd-kit:effort-'
    $template | Should -Match '\*\*Modelo\*\*:[^\n]*model: '
  }

  It 'el campo Modelo dice qué escribir si el harness no expone el effort' {
    Get-KitFile 'skills/sdd-templates/templates/plan-template.md' |
      Should -Match 'effort: no disponible en este harness, hereda el de la sesión'
  }

  It 'el campo Modelo ya no dice que el effort cae al defecto del modelo' {
    Get-KitFile 'skills/sdd-templates/templates/plan-template.md' | Should -Not -Match 'defecto de ese modelo'
  }

  It 'el revisor de spec se despacha con effort-medium y Sonnet' {
    $reviewSpec = Get-KitFile 'skills/sdd-start-feature/references/review-spec.md'
    $reviewSpec | Should -Match 'subagent_type: sdd-kit:effort-medium'
    $reviewSpec | Should -Match 'model: sonnet'
  }

  It 'el Art. IV dice que el effort omitido hereda el de la sesión' {
    $constitution = Get-KitFile '.docs/sdd/constitution.md'
    $constitution | Should -Match 'hereda el de la sesión'
    $constitution | Should -Not -Match 'defecto de ese modelo'
  }
}
