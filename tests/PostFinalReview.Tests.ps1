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
  $script:Implement = Get-KitFile 'skills/sdd-implement/SKILL.md'
  $script:Verify = Get-KitFile 'skills/sdd-verify/SKILL.md'
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
    $script:Verify | Should -Match ([regex]::Escape('Revisión final: Spec opus+high, <verdict> · Código sonnet+high, <verdict> · Arquitectura <opus+high, <verdict> | no (plan)>, sobre <sha corto>'))
  }

  It 'el ruling manda el commit posterior a la re-revisión del tramo' {
    $script:Profiles | Should -Match '(?i)si ya salió, aunque no haya vuelto, en la única re-revisión del tramo'
  }
}

Describe 'Revisión en el hilo' {
  It 'el ruling fija el umbral de solo docs' {
    foreach ($anchor in 'menos de 20 líneas', 'git diff --numstat', 'git show --remerge-diff', 'revisado en el hilo: <sha> · <ficheros> · <n> líneas') {
      $script:Profiles | Should -Match ([regex]::Escape($anchor))
    }
  }

  It 'sdd-implement nombra el tamaño y enlaza la referencia' {
    $script:Implement | Should -Match ([regex]::Escape('a commit under 20 lines (`git diff --numstat`)'))
    $script:Implement | Should -Match '(?i)revisado en el hilo'
  }

  It 'la excepción se decide por lo que cambia, no por la ruta' {
    foreach ($anchor in '`*.md` of any path', 'comment lines', 'instructions', 'a template') {
      $script:Implement | Should -Match ([regex]::Escape($anchor))
    }
    $texts = $script:Profiles, (Get-SkillStep 'sdd-end-feature' 9)
    foreach ($text in $texts) {
      $text | Should -Not -Match ([regex]::Escape('`*.md` de la raíz'))
      foreach ($anchor in '`*.md` de cualquier ruta', 'líneas de comentario', 'instrucciones', 'plantilla') {
        $text | Should -Match ([regex]::Escape($anchor))
      }
    }
  }

  It 'el ruling saca de la excepción el comentario que una herramienta interpreta' {
    $script:Profiles | Should -Match ([regex]::Escape('eslint-disable'))
  }
}

Describe 'Reproducir antes de arreglar' {
  It 'la ronda de fix pide el RED de un hallazgo de ejecución' {
    $script:Implement | Should -Match '(?i)claims something about execution'
    $script:Implement | Should -Match ([regex]::Escape('NEEDS_CONTEXT'))
  }
}

Describe 'Revisión en el hilo en los pasos' {
  It 'el paso dice cómo se cuenta un merge' {
    $script:Implement | Should -Match ([regex]::Escape('in a merge, only what you resolved, with `git show --remerge-diff`'))
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
    foreach ($anchor in '`Re-revisión:`', '<último revisado>..HEAD', 'git diff --numstat', 'git show --remerge-diff', 'No lances otra') {
      $step | Should -Match ([regex]::Escape($anchor))
    }
  }

  It 'sdd-verify apunta la pasada de fix' {
    $step = $script:Verify
    $step | Should -Match ([regex]::Escape('Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN'))
  }

  It 'el paso 7 cierra con la única re-revisión, que cubre la pasada de fix, y cuenta desde el último revisado' {
    $step = Get-SkillStep 'sdd-start-feature' 7
    $step | Should -Match ([regex]::Escape('que cubre la pasada de fix y tus commits posteriores'))
    $step | Should -Match ([regex]::Escape('<último revisado>..HEAD'))
  }

  It 'el ruling mete la pasada de fix en la única re-revisión' {
    $script:Profiles | Should -Match ([regex]::Escape('La pasada de fix de la propia revisión final entra en esa re-revisión'))
  }
}
