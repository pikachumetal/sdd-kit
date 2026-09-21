BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Perfiles de control: arranque y ejecución' {
  It 'la tabla de gates existe y nombra los tres perfiles' {
    $table = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    foreach ($profileName in 'pair', 'delegate', 'unattended') { $table | Should -Match "``$profileName``" }
  }

  It 'la tabla declara las claves de control con su default' {
    $table = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $keys = 'control.profile', 'control.maxParallelAgents', 'control.silence.betweenStepsMinutes',
      'control.silence.longCommandMinutes', 'merge.into', 'merge.noFf', 'merge.removeWorktree'
    foreach ($key in $keys) { $table | Should -Match ([regex]::Escape($key)) }
  }

  It 'sdd-start-task enlaza la tabla en vez de copiarla' {
    $skill = Get-KitFile 'skills/sdd-start-task/SKILL.md'
    $skill | Should -Match '\(references/control-profiles\.md\)'
    $skill | Should -Not -Match 'maxParallelAgents'
  }

  It 'los overrides arbitran rulings y merge' {
    $overrides = Get-KitFile 'skills/sdd-start-task/references/overrides-superpowers.md'
    $overrides | Should -Match 'finishing-a-development-branch'
    $overrides | Should -Match '(?i)ruling'
  }

  It 'la review de spec no se propone por defecto' {
    Get-KitFile 'skills/sdd-start-task/references/review-spec.md' | Should -Match '4 señales o más'
  }

  It 'la plantilla de spec admite perfil y enmiendas' {
    $template = Get-KitFile 'skills/sdd-templates/templates/spec-template.md'
    $template | Should -Match '(?m)^profile:'
    $template | Should -Match '## Enmiendas'
  }
}
