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
  It 'una fila de overrides integra el Execution Handoff en la tabla de gates, sin la frase de la HARD-GATE que la 7.0.0 quitó' {
    $row = Get-OverrideRow 'Execution Handoff'
    $row | Should -Not -BeNullOrEmpty
    $row | Should -Match 'Native'
    $row | Should -Not -Match 'reviews the written implementation plan'
  }

  It 'una fila de overrides deja el tamaño de brainstorming sin gobernar los artefactos y no ofrece saltarse las preguntas' {
    $row = Get-OverrideRow 'Size the Work'
    $row | Should -Not -BeNullOrEmpty
    $row | Should -Match 'toda feature tiene `spec.md` y su gate'
    $row | Should -Match 'No se ofrece saltarse las preguntas'
    Get-OverrideRow 'spike / bounded / architectural' | Should -BeNullOrEmpty
  }

  It 'el paso de la spec de sdd-propose no ofrece saltarse las preguntas de brainstorming' {
    $step = ((Get-KitFile 'skills/sdd-propose/SKILL.md') -split "`n") | Where-Object { $_ -match '^4\. \*\*Spec\*\*' }
    $step | Should -Match "Don't offer to skip the questions"
  }

  It 'una fila de overrides sustituye el builder check por la review de spec del kit' {
    Get-OverrideRow 'Builder check' | Should -Match 'No se despacha[^|]*review-spec\.md'
  }

  It 'una fila de overrides manda las preguntas a sdd-grilling' {
    Get-OverrideRow 'no list of example answers' | Should -Match 'sdd-grilling'
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
