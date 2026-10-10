BeforeAll {
  . (Join-Path $PSScriptRoot 'Resolve-Bash.ps1')
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-ImplementerBrief {
    return Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'
  }
}

Describe 'Encargo del implementador' {
  It 'lleva las reglas fijas del implementador' {
    $brief = Get-ImplementerBrief
    $brief | Should -Match '## Reglas del implementador'
    $brief | Should -Match 'mensaje literal'
    $brief | Should -Match 'nombre y su mensaje'
    $brief | Should -Match 'Nunca `git stash`'
  }

  It 'dice de dónde sale el bloque de restricciones en modo lite' {
    $prompt = Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'
    $prompt | Should -Match 'modo lite[^\n]*artículo de calidad de código'
    $prompt | Should -Not -Match 'modo lite[^\n]*artículo de calidad de código y la política de modelos'
    $skill = Get-KitFile 'skills/sdd-implement/SKILL.md'
    $skill | Should -Match 'in lite mode, the constitution''s code-quality article'
    $skill | Should -Not -Match 'in lite mode, the constitution''s code-quality article and the model policy'
  }
}

Describe 'La task del plan viaja sola' {
  BeforeAll {
    $script:PlanTemplate = 'skills/sdd-templates/templates/plan-template.md'
  }

  It 'cada task de la plantilla declara sus interfaces y no remite a otras secciones' {
    $template = Get-KitFile $script:PlanTemplate
    $template | Should -Match '\*\*Interfaces\*\*:\s*\r?\n- Consume:[^\n]*\r?\n- Produce:'
    $template | Should -Match 'no remite a otras secciones'
    $template | Should -Not -Match 'La API va en §1\.4'
  }

}
