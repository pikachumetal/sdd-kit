BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:SkillPath = 'skills/sdd-config/SKILL.md'
  $script:Consumers = 'skills/sdd-init-greenfield/SKILL.md', 'skills/sdd-init-brownfield/SKILL.md',
    'skills/sdd-init-brownfield/references/migrations/v2.0.0.md'

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

  It 'el catálogo tiene ocho preguntas, en su orden' {
    $rows = Get-CatalogRows
    $rows.Count | Should -Be 8
    $rows[0] | Should -Match 'ids\.mode'
    $rows[1] | Should -Match 'control\.profile'
    $rows[2] | Should -Match '`merge`'
    $rows[3] | Should -Match 'merge\.push'
    $rows[4] | Should -Match 'control\.maxParallelAgents'
    $rows[5] | Should -Match '`execution`'
    $rows[6] | Should -Match 'validation\.mode'
    $rows[7] | Should -Match 'validation\.startEnvironment'
  }

  It 'la pregunta del entorno escribe solo en el fichero local' {
    (Get-CatalogRows)[7] | Should -Match 'sdd-kit\.local\.json'
  }

  It 'la pregunta de quién valida escribe en sdd-kit.json y recomienda manual' {
    $row = (Get-CatalogRows)[6]
    $row | Should -Match '\| `sdd-kit\.json` \|\s*$'
    $row | Should -Not -Match 'sdd-kit\.local\.json'
    $row | Should -Match 'Recomendado `manual`'
  }

  It 'una respuesta field deja su frase y la fecha para el commit de sdd-kit.json' {
    Get-KitFile $script:SkillPath | Should -Match 'frase literal y la fecha van al cuerpo del commit que lleve `sdd-kit\.json`'
  }

  It 'la migración a v2.3.0 guarda la frase de field en el informe y en el commit, también al reanudar' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v2.3.0.md'
    $migration | Should -Match 'van al informe y al cuerpo del commit que lleve la clave, aunque sea el de otra sesión'
    $migration | Should -Match 'el cuerpo del commit que la escribió cita la respuesta del dev-lead y la fecha'
  }

  It 'una init o una migración hacen de la 1 a la 7' {
    Get-KitFile $script:SkillPath | Should -Match 'hacen de la 1 a la 7'
  }

  It 'enseña cada clave con su valor, su fichero o el default antes de preguntar' {
    Get-KitFile $script:SkillPath | Should -Match 'antes de la primera pregunta'
  }

  It 'invocada por una init o por una migración, no escribe: devuelve las respuestas a quien la invocó' {
    Get-KitFile $script:SkillPath | Should -Match 'init o una migración, no escribes: devuelves las respuestas'
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
    'skills/sdd-init-brownfield/references/migrations/v2.0.0.md',
    'skills/sdd-init-brownfield/references/migrations/v2.3.0.md'
  ) {
    Get-KitFile $_ | Should -Match '`sdd-config`'
  }

  It 'control-profiles apunta a sdd-config en lugar de llevar las preguntas' {
    $profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
    $profiles | Should -Not -Match '(?m)^## Preguntas de las claves de control'
    $profiles | Should -Match '`sdd-config`'
  }

  It 'el README cataloga sdd-config' {
    Get-KitFile 'README.md' | Should -Match '\| `sdd-config` \|'
  }
}
