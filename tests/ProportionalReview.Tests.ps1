BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Restricciones globales en dos bloques' {
  It 'la plantilla del plan separa código y proceso' {
    $template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $template | Should -Match '## Restricciones globales\s*\r?\n[\s\S]*### De código[\s\S]*### De proceso'
    $template | Should -Match 'De proceso[^\n]*no viaja[^\n]*revisor'
  }

  It 'el paso 6 despacha solo el bloque de código' {
    Get-KitFile 'skills/sdd-start-feature/SKILL.md' | Should -Match 'bloque «De código»'
  }
}

Describe 'Encargo de revisión' {
  BeforeAll { $script:Brief = Get-KitFile 'skills/sdd-start-feature/references/encargo-revision.md' }

  It 'no convierte en Important todo incumplimiento' {
    $script:Brief | Should -Not -Match 'Todo hallazgo que las incumpla es \*\*Important\*\*'
  }

  It 'da tolerancia de una unidad a los umbrales numéricos' {
    $script:Brief | Should -Match 'una unidad[^\n]*Minor'
  }

  It 'define qué es modificar un test RED' {
    $script:Brief | Should -Match 'aserción[^\n]*nombre[^\n]*dato[^\n]*linter'
  }

  It 'dice al revisor final que lea el paquete y no ejecute la suite' {
    $script:Brief | Should -Match 'revisor final[\s\S]*paquete[\s\S]*No ejecutes la suite'
  }
}

Describe 'Constitution' {
  It 'el Art. X declara la tolerancia' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Match 'Art\. X[\s\S]*una unidad[^\n]*Minor'
  }
}

Describe 'Paso 4' {
  It 'repasa la coherencia de la spec antes del gate' {
    $skill = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
    $skill | Should -Match 'Spec Self-Review'
    $skill | Should -Match 'literal[^\n]*más de un sitio'
    $skill | Should -Match 'busca todas sus apariciones'
  }
}
