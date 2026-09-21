BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Perfiles de control: propuesta de partir una task grande' {
  It 'la primera pregunta propone partir por encima del umbral orientativo' {
    Get-KitFile 'skills/sdd-start-task/SKILL.md' | Should -Match 'más de 3 tasks internas'
  }
}
