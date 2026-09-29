BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-SkillStep([string]$Skill, [int]$Step) {
    $text = Get-KitFile "skills/$Skill/SKILL.md"
    $pattern = "(?ms)^$Step\. (⛔ )?\*\*.*?(?=^\d+\. |^## )"
    return [regex]::Match($text, $pattern).Value
  }

  $script:Skill = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
  $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
}

Describe 'Re-revisión del tramo' {
  It 'el paso 7 revisa el tramo desde el último commit revisado antes de la validación' {
    $step = Get-SkillStep 'sdd-start-feature' 7
    $step | Should -Match ([regex]::Escape('<último revisado>..HEAD'))
    $step | Should -Match ([regex]::Escape('Re-revisión: '))
  }

  It 'ningún texto cuenta el tramo desde la revisión final' {
    $script:Skill | Should -Not -Match ([regex]::Escape('<revisión final>..HEAD'))
    $script:Profiles | Should -Not -Match ([regex]::Escape('<revisión final>..HEAD'))
  }

  It 'la línea de la revisión final guarda el commit revisado' {
    $script:Skill | Should -Match ([regex]::Escape('Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>'))
  }

  It 'el ruling manda el commit posterior a la re-revisión del tramo' {
    $script:Profiles | Should -Match '(?i)si ya salió, aunque no haya vuelto, en la re-revisión del tramo'
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

Describe 'Revisión en el hilo en los pasos' {
  It 'el paso dice qué ficheros cuentan como docs y cómo se cuenta un merge' {
    $script:Skill | Should -Match ([regex]::Escape('todos sus ficheros bajo `.docs/` o `*.md` de la raíz'))
    $script:Skill | Should -Match ([regex]::Escape('en un merge, solo lo que resolvió el hilo, con `git show --remerge-diff`'))
  }

  It 'el paso 7 no empieza frase en minúscula tras la medida de p2' {
    $script:Skill | Should -Not -MatchExactly ([regex]::Escape('(`tests/post-final-review-red.md`, p2). si'))
  }
}

Describe 'Bordes del cierre' {
  It 'el cierre hace el paso 9 antes de escribir' {
    Get-SkillStep 'sdd-end-feature' 0 | Should -Match ([regex]::Escape('haz el paso 9'))
  }

  It 'el paso 9 compara HEAD con el último commit revisado y lleva las condiciones del hilo' {
    $step = Get-SkillStep 'sdd-end-feature' 9
    foreach ($anchor in '`Pasada de fix:`', '`Re-revisión:`', '<último revisado>..HEAD', 'git diff --numstat', 'git show --remerge-diff', 'No lances otra') {
      $step | Should -Match ([regex]::Escape($anchor))
    }
  }

  It 'el paso 6 apunta la pasada de fix' {
    $step = Get-SkillStep 'sdd-start-feature' 6
    $step | Should -Match ([regex]::Escape('Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN'))
  }

  It 'el paso 7 no abre re-revisión por la pasada de fix y cuenta desde el último revisado' {
    $step = Get-SkillStep 'sdd-start-feature' 7
    $step | Should -Match ([regex]::Escape('La pasada de fix de la propia revisión final no abre la re-revisión'))
    $step | Should -Match ([regex]::Escape('<último revisado>..HEAD'))
  }

  It 'el ruling saca la pasada de fix de la re-revisión del tramo' {
    $script:Profiles | Should -Match ([regex]::Escape('La pasada de fix de la propia revisión final tampoco entra'))
  }
}
