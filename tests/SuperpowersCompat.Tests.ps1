BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-OverrideRow([string]$Anchor) {
    $table = Get-KitFile 'skills/sdd-start-feature/references/overrides-superpowers.md'
    return ($table -split "`n") | Where-Object { $_ -match '^\|' -and $_.Contains($Anchor) }
  }
}

Describe 'Compatibilidad con superpowers 7.0.0' {
  It 'ninguna skill invoca brainstorming ni writing-plans de superpowers' {
    $hits = Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -Filter '*.md' |
      Select-String -Pattern 'superpowers:(brainstorming|writing-plans)'
    $hits | ForEach-Object { "$($_.Path):$($_.LineNumber)" } | Should -BeNullOrEmpty
  }

  It 'cada referencia forkeada abre con su origen' {
    Get-KitFile 'skills/sdd-propose/references/spec-writing.md' | Should -Match 'Adapted from superpowers 7\.0\.0 `brainstorming` \(MIT, see NOTICE\)'
    Get-KitFile 'skills/sdd-propose/references/plan-writing.md' | Should -Match 'Adapted from superpowers 7\.0\.0 `writing-plans` \(MIT, see NOTICE\)'
  }

  It 'sdd-propose lleva el NOTICE de superpowers con su licencia' {
    $notice = Get-KitFile 'skills/sdd-propose/NOTICE'
    $notice | Should -Match 'MIT License'
    $notice | Should -Match 'Jesse Vincent'
  }

  It 'los pasos 4 y 5 de sdd-propose empiezan por leer su referencia' {
    $skill = (Get-KitFile 'skills/sdd-propose/SKILL.md') -split "`n"
    ($skill | Where-Object { $_ -match '^4\. \*\*Spec\*\*' }) | Should -Match 'First thing in this step: read \[references/spec-writing\.md\]'
    ($skill | Where-Object { $_ -match '^5\. \*\*Plan\*\*' }) | Should -Match 'First thing in this step: read \[references/plan-writing\.md\]'
  }

  It 'spec-writing no ofrece saltarse las preguntas y escribe la spec si piden empezar ya' {
    $ref = Get-KitFile 'skills/sdd-propose/references/spec-writing.md'
    $ref | Should -Match 'Never offer to skip the questions'
    $ref | Should -Match 'put its gaps in ✋'
  }

  It 'spec-writing presenta el diseño por secciones desde 4 tasks previstas' {
    $ref = Get-KitFile 'skills/sdd-propose/references/spec-writing.md'
    $ref | Should -Match '## Design by sections'
    $ref | Should -Match '4 or more tasks foreseen'
    $ref | Should -Match '«¿va bien\?»'
    $ref | Should -Match 'inside the spec''s stop, not a new stop of the profile'
  }

  It 'el paso 4 de sdd-propose dispara las secciones' {
    $step = ((Get-KitFile 'skills/sdd-propose/SKILL.md') -split "`n") | Where-Object { $_ -match '^4\. \*\*Spec\*\*' }
    $step | Should -Match 'With 4 or more tasks foreseen'
  }

  It 'sdd-grilling dice con qué se enseña el boceto' {
    $skill = Get-KitFile 'skills/sdd-grilling/SKILL.md'
    $skill | Should -Match 'on the running app with what `§Frontend` declares'
    $skill | Should -Match 'an Artifact with the options'
    $skill | Should -Match 'describe each option in text with its scene'
  }

  It 'overrides ya no ajusta brainstorming ni writing-plans' {
    foreach ($anchor in 'Size the Work', 'Builder check', 'no list of example answers', 'Execution Handoff', 'Frequent commits') {
      Get-OverrideRow $anchor | Should -BeNullOrEmpty -Because "la fila «$anchor» pasa al fork"
    }
  }

  It 'el README declara validada la 7.0.0' {
    Get-KitFile 'README.md' | Should -Match 'Versión validada: 7\.0\.0'
  }

  It 'las referencias de vigilancia declaran validada la 7.0.0 en la caché de superpowers-marketplace' {
    Get-KitFile '.docs/sdd/tech-stack.md' | Should -Match 'superpowers — .*cache/superpowers-marketplace/superpowers/.*Validado: 7\.0\.0'
  }

  It 'el paso de implementación de plan-template sigue «What a Step Contains» de writing-plans 6.4.2' {
    $step = (Get-KitFile 'skills/sdd-templates/templates/plan-template.md' -split "`n") | Where-Object { $_ -match '\*\*Step 1: Implementación\*\*' }
    $step | Should -Not -Match 'código real cuando ayude'
    foreach ($literal in 'firma', 'fichero', 'valores de la spec', 'asserts como código', 'algoritmo') {
      $step | Should -Match $literal -Because "falta $literal"
    }
  }
}
