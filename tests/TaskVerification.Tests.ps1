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

Describe 'Plantilla de tasks' {
  BeforeAll { $script:TasksTemplate = Get-KitFile 'skills/sdd-templates/templates/tasks-template.md' }

  It 'remite al campo «Verificación» de la task, no a la política del proyecto' {
    $script:TasksTemplate | Should -Match 'campo «Verificación»'
    $script:TasksTemplate | Should -Not -Match 'según la política del proyecto'
  }
}

Describe 'Despacho' {
  It 'el encargo del implementador lleva la verificación de su task' {
    $brief = Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'
    $brief | Should -Match '## Verificación[\s\S]*campo «Verificación»'
    $brief | Should -Match 'No ejecutes[^\n]*suite completa'
    $brief | Should -Match 'Verificación lenta[^\n]*no la ejecutes'
  }

  It 'el prompt del implementador sustituye la suite completa de superpowers' {
    $prompt = Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'
    $prompt | Should -Match 'replaces superpowers'' «run the full suite once before committing»'
  }

  It 'sdd-implement dice quién mira la UI y quién lanza la verificación lenta' {
    $skill = Get-KitFile 'skills/sdd-implement/SKILL.md'
    $skill | Should -Match '«Verificación visual»[^\n]*browser[^\n]*no probado'
    $skill | Should -Match '«Verificación lenta»[^\n]*background'
    $skill | Should -Match 'closing gate[^\n]*runs once'
  }
}
