BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { git -C $PSScriptRoot rev-parse --show-toplevel }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Frenos de alcance en la ejecución' {
  BeforeAll {
    $script:Profiles = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $script:Skill = Get-KitFile 'skills/sdd-start-task/SKILL.md'
  }

  It 'control-profiles define los tres frenos y el solape de la enmienda' {
    $script:Profiles | Should -Match '(?m)^## Frenos de alcance'
    foreach ($anchor in '3.º fix', 'salida observable', 'git merge-base', 'solape no comprobable') {
      $script:Profiles | Should -Match ([regex]::Escape($anchor))
    }
  }

  It 'la tabla de gates para en el freno de alcance en pair y delegate' {
    $row = ($script:Profiles -split "`n") | Where-Object { $_ -match '^\| Freno de alcance' }
    $row | Should -Not -BeNullOrEmpty
    $cells = $row.Split('|') | ForEach-Object { $_.Trim() }
    $cells[2] | Should -Be 'para'
    $cells[3] | Should -Be 'para'
  }

  It 'sdd-start-task nombra el freno en el paso 6 y en el trabajo descubierto, y enlaza la referencia' {
    ([regex]::Matches($script:Skill, '(?i)freno de alcance')).Count | Should -BeGreaterOrEqual 2
    $script:Skill | Should -Match '\(references/control-profiles\.md\)'
  }

  It 'sdd-start-task no copia el umbral: vive en la referencia' {
    $script:Skill | Should -Not -Match ([regex]::Escape('3.º fix'))
  }

  It 'el encabezado de Fixes adicionales lleva el contador' {
    Get-KitFile 'skills/sdd-templates/templates/tasks-template.md' | Should -Match '(?m)^## Fixes adicionales.*freno de alcance'
  }

  It 'los overrides arbitran los frenos frente a subagent-driven-development' {
    Get-KitFile 'skills/sdd-start-task/references/overrides-superpowers.md' | Should -Match 'frenos de alcance'
  }
}
