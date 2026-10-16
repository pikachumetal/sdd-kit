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

  It 'enlaza la referencia <_>, que existe' -ForEach @('merge-recipe.md', 'estimation.md', 'aprendizajes-skills.md', 'records.md') {
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

Describe 'sdd-archive: rama de patch' {
  It 'la fila «Patch:» de «Próximo» se marca ✅ y se queda' {
    $script:Skill | Should -Match '`Patch only:`[^\n]*«Patch:» row[^\n]*`✅`[^\n]*stays'
  }

  It 'el paso 5 de sdd-start-patch deja la fila de deuda al cierre' {
    Get-KitFile 'skills/sdd-start-patch/SKILL.md' | Should -Match ([regex]::Escape('La fila de deuda que salda el patch la cierra `sdd-archive`; el commit del fix no la toca.'))
  }

  It 'el paso 6 de sdd-start-patch cierra con sdd-archive' {
    Get-KitFile 'skills/sdd-start-patch/SKILL.md' | Should -Match '(?m)^6\. \*\*Cierre\*\* — `sdd-archive`\.'
  }

  It 'la ayuda de «Capacidades» de patch-template.md usa sdd capability index' {
    Get-KitFile 'skills/sdd-templates/templates/patch-template.md' | Should -Match ([regex]::Escape('con la salida de `sdd capability index`'))
  }
}

Describe 'sdd-archive: rama de hotfix' {
  It 'pregunta por la migración con su literal' {
    $script:Skill | Should -Match ([regex]::Escape('«¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?»'))
  }

  It 'comprueba la rama estable con merge --check --into' {
    $script:Skill | Should -Match 'merge --check --into <stable>'
  }

  It 'fusiona con --into, --tag y la frase del dev-lead en --order' {
    $script:Skill | Should -Match '--into <stable> --tag <version> --order "<their words>"'
  }

  It '--push solo si la frase pide publicar' {
    $script:Skill | Should -Match '`--push` only if those words ask to publish'
  }

  It 'el paso de migración solo con la carpeta del kit' {
    $script:Skill | Should -Match 'skills/sdd-init-brownfield/references/migrations/'
  }
}

Describe 'sdd-archive: receta del merge' {
  BeforeAll { $script:Recipe = Get-KitFile 'skills/sdd-archive/references/merge-recipe.md' }

  It 'la receta explica la salida <_>' -ForEach @('destino sacado:', 'base: conflicto en', 'merge: conflicto en', 'vuelta: conflicto en', 'base: en rojo', 'base: en verde', 'sigue moviéndose', 'verificación: omitida', 'push: no hecho: sin remoto') {
    $script:Recipe | Should -Match ([regex]::Escape($_))
  }

  It 'la receta usa --verified-at' {
    $script:Recipe | Should -Match '--verified-at <sha'
  }

  It 'el merge de sincronización va tras el commit de cierre' {
    $script:Recipe | Should -Match 'After the closing commit, `git fetch`'
  }

  It 'la suite se repite solo si la base trae algo fuera de docs' {
    $script:Recipe | Should -Match ([regex]::Escape("git diff --quiet <sha> HEAD -- . ':!.docs' ':!*.md'"))
  }

  It 'el rojo se contrasta en un worktree desanclado y se busca en la deuda' {
    $script:Recipe | Should -Match 'git worktree add --detach'
    $script:Recipe | Should -Match 'search the first error lines'
  }

  It 'el informe de rojo lleva el destino sin tocar' {
    $script:Recipe | Should -Match ([regex]::Escape('«`develop` sin tocar en `<hash>`»'))
  }

  It 'ya no relanza el script tras un conflicto de registros' {
    $script:Recipe | Should -Not -Match 'Relanza el script'
  }

  It 'tiene la sección <_>' -ForEach @('## Integrated base', '## A red suite', '## Its outputs', '## Push', '## Hotfix', '## Denied by the environment') {
    $script:Recipe | Should -Match ('(?m)^' + [regex]::Escape($_) + '\s*$')
  }
}

Describe 'sdd-worktrees: línea base en rojo' {
  It 'contrasta la línea base con la rama de integración y busca en la deuda' {
    $worktrees = Get-KitFile 'skills/sdd-worktrees/SKILL.md'
    $worktrees | Should -Match 'detached worktree of the integration branch'
    $worktrees | Should -Match "project's debt"
  }
}
