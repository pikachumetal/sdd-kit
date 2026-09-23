BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Plantilla del plan' {
  BeforeAll { $script:Template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md' }

  It 'cada task declara sus superficies' {
    $script:Template | Should -Match '\*\*Superficies\*\*:[^\n]*BD · backend · frontend · tooling · docs'
  }

  It 'la suite de BD solo corre si la task toca BD' {
    $script:Template | Should -Match 'migraciones, persistencia o dialecto'
  }

  It 'cada task declara su verificación y los dos campos opcionales' {
    $script:Template | Should -Match '\*\*Verificación\*\*:'
    $script:Template | Should -Match '\*\*Verificación visual\*\*:'
    $script:Template | Should -Match '\*\*Verificación lenta\*\*:[^\n]*10 min'
  }

  It 'De código no pide copiar el gate completo' {
    $script:Template | Should -Not -Match 'los comandos que el cambio tiene que dejar en verde'
  }

  It 'el gate de cierre se ejecuta una vez en la validación final' {
    $script:Template | Should -Match '## 3\. Validación final[\s\S]*Gate de cierre[^\n]*una vez'
  }
}
