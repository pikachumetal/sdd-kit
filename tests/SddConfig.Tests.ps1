BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:SkillPath = 'skills/sdd-config/SKILL.md'
  $script:Consumers = 'skills/sdd-init-greenfield/SKILL.md', 'skills/sdd-init-brownfield/SKILL.md',
    'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-CatalogRows {
    $catalog = [regex]::Match((Get-KitFile $script:SkillPath), '(?ms)^## Catálogo\r?$.*?(?=^## |\z)').Value
    return $catalog -split "`r?`n" | Where-Object { $_ -match '^\| \d+ \|' }
  }

  function Get-FilesOutsideSkill {
    Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -Filter *.md -File |
      Where-Object { $_.FullName -notmatch 'skills[\\/]sdd-config[\\/]' }
  }
}

Describe 'Anatomía de sdd-config' {
  It 'tiene name, description que empieza por Usar y Overview' {
    $skill = Get-KitFile $script:SkillPath
    $skill | Should -Match '(?m)^name: sdd-config\r?$'
    $skill | Should -Match '(?m)^description: Usar '
    $skill | Should -Match '(?m)^## Overview'
  }

  It 'el catálogo tiene siete preguntas, en su orden' {
    $rows = Get-CatalogRows
    $rows.Count | Should -Be 7
    $rows[0] | Should -Match 'ids\.mode'
    $rows[1] | Should -Match 'control\.profile'
    $rows[2] | Should -Match '`merge`'
    $rows[3] | Should -Match 'merge\.push'
    $rows[4] | Should -Match 'control\.maxParallelAgents'
    $rows[5] | Should -Match '`execution`'
    $rows[6] | Should -Match 'validation\.startEnvironment'
  }

  It 'la pregunta del entorno escribe solo en el fichero local' {
    (Get-CatalogRows)[6] | Should -Match 'sdd-kit\.local\.json'
  }

  It 'enseña cada clave con su valor, su fichero o el default antes de preguntar' {
    Get-KitFile $script:SkillPath | Should -Match 'antes de la primera pregunta'
  }

  It 'invocada por una init o por la migración, escribe solo en sdd-kit.json' {
    Get-KitFile $script:SkillPath | Should -Match 'init o (por )?la migración.*solo en `sdd-kit\.json`'
  }

  It 'pone la línea de .gitignore antes de escribir el fichero local y no lo commitea' {
    $skill = Get-KitFile $script:SkillPath
    $skill | Should -Match '`\.docs/sdd/sdd-kit\.local\.json`.*\.gitignore'
    $skill | Should -Match 'no se commitea'
  }
}

Describe 'Fuente única de la entrevista de claves' {
  It '«<_>» solo aparece en sdd-config' -ForEach @('¿Con qué perfil de control trabajáis', '¿Cómo se numeran las tasks') {
    $text = $_
    $hits = Get-FilesOutsideSkill | Where-Object { (Get-Content $_.FullName -Raw).Contains($text) }
    $hits | Should -BeNullOrEmpty
  }

  It '<_> invoca sdd-config' -ForEach @(
    'skills/sdd-init-greenfield/SKILL.md', 'skills/sdd-init-brownfield/SKILL.md',
    'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
  ) {
    Get-KitFile $_ | Should -Match '`sdd-config`'
  }

  It 'control-profiles apunta a sdd-config en lugar de llevar las preguntas' {
    $profiles = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $profiles | Should -Not -Match '(?m)^## Preguntas de las claves de control'
    $profiles | Should -Match '`sdd-config`'
  }

  It 'el README cataloga sdd-config' {
    Get-KitFile 'README.md' | Should -Match '\| `sdd-config` \|'
  }
}
