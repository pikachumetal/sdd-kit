BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Perfiles de control: aprobación explícita y 🧪 sin validar en la release' {
  It 'elegir un alcance no cuenta como aprobar la spec' {
    Get-KitFile 'skills/sdd-start-task/SKILL.md' | Should -Match '(?i)elegir un alcance'
  }

  It 'la task 🧪 que el smoke no valida conserva la forma con disparador nuevo' {
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match 'disparador nuevo'
  }
}
