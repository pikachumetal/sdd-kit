BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:SkillPath = 'skills/sdd-config/SKILL.md'
  $script:Consumers = 'skills/sdd-init/SKILL.md', 'skills/sdd-upgrade/references/migrations/v2.0.0.md'

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-CatalogRows {
    $catalog = [regex]::Match((Get-KitFile $script:SkillPath), '(?ms)^## Catalog\r?$.*?(?=^## |\z)').Value
    return $catalog -split "`r?`n" | Where-Object { $_ -match '^\| \d+ \|' }
  }

  function Get-FilesOutsideSkill {
    Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -Filter *.md -File |
      Where-Object { $_.FullName -notmatch 'skills[\\/]sdd-config[\\/]' }
  }
}

Describe 'Anatomía de sdd-config' {
  It 'tiene name, description que empieza por Use y Overview' {
    $skill = Get-KitFile $script:SkillPath
    $skill | Should -Match '(?m)^name: sdd-config\r?$'
    $skill | Should -Match '(?m)^description: Use '
    $skill | Should -Match '(?m)^## Overview'
  }

  It 'el catálogo tiene diez preguntas, en su orden' {
    $rows = Get-CatalogRows
    $rows.Count | Should -Be 10
    $rows[0] | Should -Match 'ids\.mode'
    $rows[1] | Should -Match 'control\.profile'
    $rows[2] | Should -Match '`merge`'
    $rows[3] | Should -Match 'merge\.push'
    $rows[4] | Should -Match 'control\.maxParallelAgents'
    $rows[5] | Should -Match '`execution`'
    $rows[6] | Should -Match 'validation\.mode'
    $rows[7] | Should -Match 'validation\.startEnvironment'
    $rows[8] | Should -Match 'review\.minors'
    $rows[9] | Should -Match '`pricing\.'
  }

  It 'la pregunta <_> escribe en sdd-kit.json' -ForEach @(9, 10) {
    (Get-CatalogRows)[$_ - 1] | Should -Match '\| `sdd-kit\.json` \|\s*$'
  }

  It 'la pregunta de los Minor recomienda defer' {
    (Get-CatalogRows)[8] | Should -Match 'Recommended `defer`'
  }

  It 'la pregunta de los precios nombra la fuente oficial, pricing.source y pricing.updated' {
    $row = (Get-CatalogRows)[9]
    $row | Should -Match 'https://platform\.claude\.com/docs/en/about-claude/pricing'
    $row | Should -Match 'pricing\.source'
    $row | Should -Match 'pricing\.updated'
  }

  It 'la pregunta del entorno escribe solo en el fichero local' {
    (Get-CatalogRows)[7] | Should -Match 'sdd-kit\.local\.json'
  }

  It 'la pregunta de quién valida escribe en sdd-kit.json y recomienda manual' {
    $row = (Get-CatalogRows)[6]
    $row | Should -Match '\| `sdd-kit\.json` \|\s*$'
    $row | Should -Not -Match 'sdd-kit\.local\.json'
    $row | Should -Match 'Recommended `manual`'
  }

  It 'una respuesta field deja su frase y la fecha para el commit de sdd-kit.json' {
    Get-KitFile $script:SkillPath | Should -Match 'literal phrase and the date go in the body of the commit that carries `sdd-kit\.json`'
  }

  It 'la migración a v2.3.0 guarda la frase de field en el informe y en el commit, también al reanudar' {
    $migration = Get-KitFile 'skills/sdd-upgrade/references/migrations/v2.3.0.md'
    $migration | Should -Match 'van al informe y al cuerpo del commit que lleve la clave, aunque sea el de otra sesión'
    $migration | Should -Match 'el cuerpo del commit que la escribió cita la respuesta del dev-lead y la fecha'
  }

  It 'una init o una migración hacen de la 1 a la 7, la 9 y la 10' {
    Get-KitFile $script:SkillPath | Should -Match 'do 1 to 7, 9 and 10'
  }

  It 'enseña cada clave con su valor, su fichero o el default antes de preguntar' {
    Get-KitFile $script:SkillPath | Should -Match 'before the first question'
  }

  It 'invocada por una init o por una migración, no escribe: devuelve las respuestas a quien la invocó' {
    Get-KitFile $script:SkillPath | Should -Match 'init or a migration invokes you, you don''t write: you return the answers'
  }

  It 'pone la línea de .gitignore antes de escribir el fichero local y no lo commitea' {
    $skill = Get-KitFile $script:SkillPath
    $skill | Should -Match '`\.docs/sdd/sdd-kit\.local\.json`.*\.gitignore'
    $skill | Should -Match 'is never committed'
  }
}

Describe 'Fuente única de la entrevista de claves' {
  It '«<_>» solo aparece en sdd-config' -ForEach @('Which control profile do you work with', 'How are features numbered') {
    $text = $_
    $hits = Get-FilesOutsideSkill | Where-Object { (Get-Content $_.FullName -Raw).Contains($text) }
    $hits | Should -BeNullOrEmpty
  }

  It '<_> invoca sdd-config' -ForEach @(
    'skills/sdd-init/SKILL.md',
    'skills/sdd-upgrade/references/migrations/v2.0.0.md',
    'skills/sdd-upgrade/references/migrations/v2.3.0.md'
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
