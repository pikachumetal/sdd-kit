BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    $path = Join-Path $script:RepoRoot $RelativePath
    if (-not (Test-Path $path)) { return '' }
    return Get-Content -Raw -Encoding utf8 $path
  }

  $script:Skill = Get-KitFile 'skills/sdd-archive/SKILL.md'
  $script:Description = [regex]::Match($script:Skill, '(?m)^description: .+$').Value
}

Describe 'sdd-archive: anatomía' {
  It 'se llama sdd-archive' {
    $script:Skill | Should -Match '(?m)^name: sdd-archive$'
  }

  It 'la description recoge «<_>»' -ForEach @('cierra la feature', 'cierra la tarea', 'cierra el patch', 'hemos acabado', 'haz el walkthrough') {
    $script:Description | Should -Match ([regex]::Escape($_))
  }

  It 'marca las ramas de carril con <_>' -ForEach @('`Feature only:`', '`Patch only:`', '`Hotfix only:`') {
    $script:Skill | Should -Match ([regex]::Escape($_))
  }

  It 'enlaza la referencia <_>, que existe' -ForEach @('merge-recipe.md', 'estimation.md', 'aprendizajes-skills.md') {
    $script:Skill | Should -Match ([regex]::Escape("(references/$_"))
    Test-Path (Join-Path $script:RepoRoot "skills/sdd-archive/references/$_") | Should -BeTrue
  }

  It 'NOTICE nombra finishing-a-development-branch de superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-archive/NOTICE'
    $notice | Should -Match '`finishing-a-development-branch`'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}

Describe 'sdd-archive: comprobaciones previas' {
  It 'pregunta por los cambios sin commitear con su literal' {
    $script:Skill | Should -Match ([regex]::Escape('«Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?»'))
  }

  It 'ejecuta sdd merge --check antes de escribir' {
    $script:Skill | Should -Match 'merge --check --project-root'
  }

  It 'avisa de las otras ramas abiertas con su literal' {
    $script:Skill | Should -Match ([regex]::Escape('«Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.»'))
  }

  It 'el orden es árbol limpio, merge --check y otras ramas' {
    $status = $script:Skill.IndexOf('git status --porcelain')
    $check = $script:Skill.IndexOf('merge --check')
    $others = $script:Skill.IndexOf('git worktree list')
    $status | Should -BeGreaterThan -1
    $check | Should -BeGreaterThan $status
    $others | Should -BeGreaterThan $check
  }
}

Describe 'sdd-archive: rama de feature' {
  It 'el 4.1 del walkthrough lleva el sha de la suite' {
    $script:Skill | Should -Match '«4\.1 Builds» gives the full suite''s command, result, duration and the sha it ran on'
  }

  It 'un workaround en el stack lleva su fila de deuda' {
    $script:Skill | Should -Match 'A workaround you write into `tech-stack\.md`.{0,120}gets its own debt row'
  }

  It 'un destino que falta se crea con su aviso literal' {
    $script:Skill | Should -Match ([regex]::Escape('«`<documento>` no existía: creado desde la plantilla»'))
  }
}
