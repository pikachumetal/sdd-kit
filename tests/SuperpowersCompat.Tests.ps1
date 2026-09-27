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

Describe 'Compatibilidad con superpowers 6.4.2' {
  It 'una fila de overrides integra el Execution Handoff en la tabla de gates' {
    $row = Get-OverrideRow 'Execution Handoff'
    $row | Should -Not -BeNullOrEmpty
    $row | Should -Match 'Native'
    $row | Should -Match 'HARD-GATE'
  }

  It 'una fila de overrides convierte la ruta de sdd-workspace con cygpath -w' {
    $row = Get-OverrideRow 'sdd-workspace'
    $row | Where-Object { $_.Contains('cygpath -w') } | Should -Not -BeNullOrEmpty
  }

  It 'encargo-revision remite a la conversión de la ruta del workspace' {
    Get-KitFile 'skills/sdd-start-feature/references/encargo-revision.md' | Should -Match '(?m)^## Rutas del workspace en Windows[\s\S]*cygpath -w'
  }

  It 'el README declara validada la 6.4.2' {
    Get-KitFile 'README.md' | Should -Match 'Versión validada: 6\.4\.2'
  }

  It 'las referencias de vigilancia declaran validada la 6.4.2 en la caché de superpowers-marketplace' {
    Get-KitFile '.docs/sdd/roadmap.md' | Should -Match 'superpowers — .*cache/superpowers-marketplace/superpowers/.*Validado: 6\.4\.2'
  }

  It 'el paso de implementación de plan-template sigue «What a Step Contains» de writing-plans 6.4.2' {
    $step = (Get-KitFile 'skills/sdd-templates/templates/plan-template.md' -split "`n") | Where-Object { $_ -match '\*\*Step 1: Implementación\*\*' }
    $step | Should -Not -Match 'código real cuando ayude'
    foreach ($literal in 'firma', 'fichero', 'valores de la spec', 'asserts como código', 'algoritmo') {
      $step | Should -Match $literal -Because "falta $literal"
    }
  }
}
