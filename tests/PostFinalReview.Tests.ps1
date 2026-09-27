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

Describe 'Revisión en el hilo' {
  It 'el ruling fija el umbral de solo docs' {
    foreach ($anchor in 'bajo `.docs/` o son `*.md` de la raíz', 'menos de 20 líneas', 'git diff --numstat', 'git show --remerge-diff', 'revisado en el hilo: <sha> · <ficheros> · <n> líneas') {
      $script:Profiles | Should -Match ([regex]::Escape($anchor))
    }
  }

  It 'el paso 6 nombra el tamaño y enlaza la referencia' {
    $script:Skill | Should -Match ([regex]::Escape('de solo docs y de menos de 20 líneas, contadas con `git diff --numstat`'))
    $script:Skill | Should -Match '(?i)revisado en el hilo'
  }
}

Describe 'Reproducir antes de arreglar' {
  It 'la ronda de fix pide el RED de un hallazgo de ejecución' {
    $script:Skill | Should -Match '(?i)afirma algo de ejecución'
    $script:Skill | Should -Match ([regex]::Escape('NEEDS_CONTEXT'))
  }
}
