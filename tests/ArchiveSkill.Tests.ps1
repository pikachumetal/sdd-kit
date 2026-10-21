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
    $script:Skill | Should -Match '(?m)^name: sdd-archive\r?$'
  }

  It 'la description recoge «<_>»' -ForEach @('cierra la feature', 'cierra la tarea', 'cierra el patch', 'hemos acabado', 'haz el walkthrough') {
    $script:Description | Should -Match ([regex]::Escape($_))
  }

  It 'marca las ramas de carril con <_>' -ForEach @('`Feature only:`', '`Patch only:`', '`Hotfix only:`') {
    $script:Skill | Should -Match ([regex]::Escape($_))
  }

  It 'enlaza la referencia <_>, que existe' -ForEach @('merge-recipe.md', 'aprendizajes-skills.md', 'records.md', 'e2e-suite.md') {
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
    $script:Skill | Should -Match '`--check --into <stable>`'
  }

  It 'fusiona con --into, --tag y la frase del dev-lead en --order' {
    $script:Skill | Should -Match '--into <stable> --tag <version> --order "<their words>"'
  }

  It '--push solo si la frase pide publicar' {
    $script:Skill | Should -Match '`--push` only if those words ask to publish'
  }

  It 'el paso de migración solo con la carpeta del kit' {
    $script:Skill | Should -Match 'skills/sdd-upgrade/references/migrations/'
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
    $script:Recipe | Should -Match 'After the closing commit, in the change''s worktree: `sdd merge --sync'
  }

  It 'la suite se repite solo si la base trae algo fuera de docs' {
    $script:Recipe | Should -Match ([regex]::Escape("git diff --quiet <sha> HEAD -- . ':!.docs' ':!*.md'"))
  }

  It 'el rojo se contrasta en un worktree desanclado y se busca en la deuda' {
    $script:Recipe | Should -Match 'git worktree add --detach'
    $script:Recipe | Should -Match 'search the first error lines'
  }

  It 'el informe de rojo lleva el destino sin tocar' {
    $script:Recipe | Should -Match ([regex]::Escape('«`<merge.into>` sin tocar en `<hash>`»'))
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

Describe 'sdd-archive: registros, ADR y qué sigue' {
  BeforeAll { $script:Records = Get-KitFile 'skills/sdd-archive/references/records.md' }

  It 'escribe cada ADR candidata con su línea en el walkthrough' {
    $script:Skill | Should -Match ([regex]::Escape('`ADR: <candidata> → decisions/NNNN-<slug>.md`'))
  }

  It 'ejecuta sdd decision check, también sin candidatas y en un patch' {
    $script:Skill | Should -Match 'decision check --path \.docs/sdd'
    $script:Skill | Should -Match 'with or without candidates, in a patch too'
  }

  It 'una ADR ajena rota también para el cierre' {
    $script:Skill | Should -Match "an ADR you didn't write stops the close too"
  }

  It 'busca el literal viejo de un MODIFIED en toda la capacidad y lo corrige por el delta' {
    $script:Skill | Should -Match 'search the old clause of each `MODIFIED`'
    $script:Skill | Should -Match 'through the artifact''s delta'
  }

  It 'con ROADMAP.md la fila queda en Now y la deuda saldada sale de «Lista»' {
    $script:Skill | Should -Match '`ROADMAP\.md` at the root'
    $script:Records | Should -Match 'stays in Now'
    $script:Records | Should -Match '«Lista» of `\.docs/sdd/steering/debt\.md`'
  }

  It 'qué sigue: <_>' -ForEach @(
    '«Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.»',
    '«Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.»',
    '«Para acabar la propuesta `<N>` falta: …»',
    '«La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.»'
  ) {
    $script:Records | Should -Match ([regex]::Escape($_))
  }

  It 'qué sigue lee el parent: de patch.md también' {
    $script:Records | Should -Match 'frontmatter of the `spec\.md` or `patch\.md`'
  }

  It 'la madre cerrada no se anuncia' {
    $script:Records | Should -Match 'A mother already closed: only the open sisters'
  }

  It 'el mensaje final nombra qué sigue antes de la oferta del ticket' {
    $msg = $script:Skill.Substring($script:Skill.IndexOf('9. **Final message**'))
    $msg.IndexOf("What's next") | Should -BeGreaterThan -1
    $msg.IndexOf("What's next") | Should -BeLessThan $msg.IndexOf('The ticket offer')
  }

  It 'commit-milestones guarda los shas de cualquier artefacto' {
    $milestones = Get-KitFile 'skills/sdd-start-feature/references/commit-milestones.md'
    $milestones | Should -Match '`walkthrough\.md`, `patch\.md`, la deuda o una ADR'
  }
}

Describe 'sdd-archive: retirada de las skills viejas' {
  It 'ya no existe la carpeta <_>' -ForEach @('sdd-end-feature', 'sdd-end-patch') {
    Test-Path (Join-Path $script:RepoRoot "skills/$_") | Should -BeFalse
  }

  It 'ningún fichero de skills/ nombra <_>, salvo la procedencia de sdd-archive y las migraciones pasadas' -ForEach @('finishing-a-development-branch', 'sdd-end-feature', 'sdd-end-patch') {
    $name = $_
    $allowed = @('skills[\\/]sdd-archive[\\/]NOTICE$', 'migrations[\\/]v0\.4\.0\.md$', 'migrations[\\/]v2\.0\.0\.md$', 'migrations[\\/]v3\.0\.0\.md$')
    if ($name -eq 'finishing-a-development-branch') { $allowed += 'skills[\\/]sdd-archive[\\/]SKILL\.md$' }
    $hits = Get-ChildItem -LiteralPath (Join-Path $script:RepoRoot 'skills') -Recurse -File |
      Where-Object { $path = $_.FullName; -not ($allowed | Where-Object { $path -match $_ }) } |
      Where-Object { (Get-Content -Raw -Encoding utf8 $_.FullName) -match [regex]::Escape($name) } |
      ForEach-Object { $_.FullName.Substring($script:RepoRoot.Path.Length) }
    $hits | Should -BeNullOrEmpty
  }
}

Describe 'sdd-archive: pasada de fix de la revisión final' {
  BeforeAll {
    $script:Recipe = Get-KitFile 'skills/sdd-archive/references/merge-recipe.md'
    $script:Records = Get-KitFile 'skills/sdd-archive/references/records.md'
  }

  It 'conserva la racionalización de la fuente «<_>»' -ForEach @("'Yeah, get rid of it' counts as confirmation", 'The PR is up, so the worktree is clutter now', 'The merged-result failure is probably flaky', 'The base branch is obviously main', 'The push was rejected — force-push will fix it') {
    $script:Skill | Should -Match ([regex]::Escape($_))
  }

  It 'el descarte lista lo que se borra y pide la palabra literal' {
    $script:Skill | Should -Match 'list what would be deleted and wait for the typed word `discard`'
  }

  It 'el 4.1 da el sha de la validación y el mensaje final el de la base integrada' {
    $script:Skill | Should -Match '«4\.1 Builds» gives the full suite''s command, result, duration and the sha of the validation'
    $script:Skill | Should -Match 'the full suite again on the integrated base, with its result and its sha'
  }

  It 'un patch diferido lleva el prefijo 🧪 en su fila de «Patches»' {
    $script:Skill | Should -Match ([regex]::Escape('its «Patches» row starts with `🧪 validación diferida a <disparador> — `'))
  }

  It 'el estimation-log admite la fila a mano solo sin la CLI' {
    $script:Skill | Should -Match 'only if the kit''s CLI isn''t available, add the row by hand and say so'
  }

  It 'el mensaje final lleva los literales completos de «qué sigue»' {
    $msg = $script:Skill.Substring($script:Skill.IndexOf('9. **Final message**'))
    $msg | Should -Match ([regex]::Escape('«Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.»'))
    $msg | Should -Match ([regex]::Escape('«Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.»'))
    $msg | Should -Match ([regex]::Escape('«La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.»'))
  }

  It 'la línea ADR se copia tal cual' {
    $script:Skill | Should -Match 'record this line, literal, in the walkthrough: `ADR: <candidata> → decisions/NNNN-<slug>\.md`'
  }

  It 'sin avance de la base no hay merge de sincronización ni segunda suite' {
    $script:Recipe | Should -Match "there's nothing to integrate: no sync merge, no second suite"
  }

  It 'un conflicto que la CLI no resuelve aborta el merge de sincronización' {
    $script:Recipe | Should -Match '`base: conflicto en <files>\.`: the script ran `git merge --abort`'
  }

  It 'la receta reconoce los registros de la 3.0.0' {
    $script:Recipe | Should -Match '`ROADMAP\.md`, `CHANGELOG\.md` and `\.docs/sdd/steering/debt\.md`'
  }

  It 'el informe de rojo usa merge.into, no develop' {
    $script:Recipe | Should -Match ([regex]::Escape('«`<merge.into>` sin tocar en `<hash>`»'))
  }

  It 'el pre-check del hotfix es merge --check --into' {
    [regex]::Match($script:Skill, '(?ms)^0\. \*\*Pre-checks\*\*.*?(?=^1\. )').Value | Should -Match '`Hotfix only:` `--check --into <stable>`'
  }

  It 'el patch comprueba su patch.md en las comprobaciones previas' {
    [regex]::Match($script:Skill, '(?ms)^0\. \*\*Pre-checks\*\*.*?(?=^1\. )').Value | Should -Match '`Patch only:` is `patch\.md` complete'
  }

  It 'un sha citado tiene de 7 a 40 caracteres hexadecimales' {
    $script:Skill | Should -Match 'a cited sha is any 7 to 40 hex characters'
  }

  It 'el worktree se borra con merge.removeWorktree' {
    $script:Skill | Should -Match 'With `merge\.removeWorktree: true`'
    $script:Skill | Should -Match 'git worktree remove'
  }

  It 'las red flags recogen el merge sin decisión y el patch.md sin hash' {
    $flags = [regex]::Match($script:Skill, '(?ms)^## Red flags.*?(?=^\| Excuse)').Value
    $flags | Should -Match 'without the user deciding it or the `merge` block declaring it'
    $flags | Should -Match '`patch\.md` without the fix''s commit hash'
  }
}
