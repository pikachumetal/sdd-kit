BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  $script:Skill = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
  $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
}

Describe 'Re-revisión del tramo' {
  It 'el paso 7 revisa el tramo posterior a la revisión final antes de la validación' {
    $script:Skill | Should -Match ([regex]::Escape('<revisión final>..HEAD'))
    $script:Skill | Should -Match ([regex]::Escape('Re-revisión: '))
  }

  It 'la línea de la revisión final guarda el commit revisado' {
    $script:Skill | Should -Match ([regex]::Escape('Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>'))
  }

  It 'el ruling manda el commit posterior a la re-revisión del tramo' {
    $script:Profiles | Should -Match '(?i)si la revisión final ya volvió, en la re-revisión del tramo'
  }
}
