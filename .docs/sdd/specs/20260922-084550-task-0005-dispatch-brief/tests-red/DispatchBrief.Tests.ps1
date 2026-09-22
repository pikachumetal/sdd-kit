BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-ImplementerBrief {
    $brief = Get-KitFile 'skills/sdd-start-task/references/encargo-revision.md'
    return $brief.Substring($brief.IndexOf('## Encargo del implementador'))
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
    foreach ($path in 'skills/sdd-start-task/references/encargo-revision.md', 'skills/sdd-start-task/SKILL.md') {
      $text = Get-KitFile $path
      $text | Should -Match 'modo lite[^\n]*artículo de calidad de código[^\n]*política de modelos'
    }
  }
}
