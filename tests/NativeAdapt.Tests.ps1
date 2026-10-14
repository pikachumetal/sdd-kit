BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-SkillStep([string]$Skill, [int]$Step) {
    $text = Get-KitFile "skills/$Skill/SKILL.md"
    $pattern = "(?ms)^$Step\. \*\*.*?(?=^\d+\. \*\*|^## )"
    return [regex]::Match($text, $pattern).Value
  }

  function Get-NativeParagraph {
    return [regex]::Match((Get-KitFile 'skills/sdd-implement/SKILL.md'), '(?ms)^## Setup.*?(?=^## SDD loop)').Value
  }

  $script:Overrides = 'skills/sdd-start-feature/references/overrides-superpowers.md'
  $script:Dispatch = 'skills/sdd-verify/references/encargo-revision.md'
}

Describe 'Task 1 — bucle Native' {
  It 'el párrafo Native dice que los verbos llevan el ledger del workspace' {
    Get-NativeParagraph | Should -Match '`<workspace>/progress.md`'
  }

  It 'el paso 6 tiene un párrafo Native con sdd task start y sdd task done' {
    $paragraph = Get-NativeParagraph
    $paragraph | Should -Match 'sdd\.js" task start'
    $paragraph | Should -Match 'sdd\.js" task done'
  }

  It 'el párrafo Native comprueba la base antes de cada task' {
    Get-NativeParagraph | Should -Match 'Every task, the second and later ones too, in both methods'
  }

  It 'el párrafo Native aparta y compara los RED' {
    $paragraph = Get-NativeParagraph
    $paragraph | Should -Match 'Keep a copy outside the repo'
    $paragraph | Should -Match '`git diff --no-index`'
  }

  It 'el párrafo Native fija el orden del cierre de la task' {
    Get-NativeParagraph | Should -Match 'Close, in this order'
  }

  It 'los verbos no dejan rutas POSIX que traducir en overrides ni en el encargo' {
    Get-KitFile $script:Overrides | Should -Not -Match 'cygpath'
    Get-KitFile $script:Dispatch | Should -Not -Match 'cygpath'
  }
}

Describe 'Task 2 — historia de commits' {
  BeforeAll { $script:Recipe = Get-KitFile 'skills/sdd-start-feature/references/commit-milestones.md' }

  It 'la receta vale también con un solo commit en el rango' {
    $script:Recipe | Should -Match 'también con un solo commit'
    $script:Recipe | Should -Not -Match 'no hay nada que juntar'
  }

  It 'la fila Task N dice cuándo se junta en Native' {
    $row = $script:Recipe -split "`r?`n" | Where-Object { $_.StartsWith('| Task N |') }
    $row | Should -Match 'en Native, con su contrato de cierre cumplido y antes de `sdd task done`'
  }

  It 'con un RED en el árbol, el hilo lo aparta para commitear' {
    $section = [regex]::Match($script:Recipe, '(?ms)^## Tests RED sin commitear.*').Value
    $section | Should -Match 'antes de escribir los RED'
    $section | Should -Match 'apártalo'
  }

  It 'el paso 5 junta la apertura antes de los RED' {
    Get-SkillStep 'sdd-propose' 5 | Should -Match "Before writing the first task's RED tests, put the opening in a commit"
  }

  It 'sdd-implement pide escribir el mensaje del hito aunque haya un solo commit' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match 'with a message you write, even with a single commit'
  }
}

Describe 'Task 3 — revisión final y cierre' {
  It 'el Art. IV fija los modelos de los ejes de la revisión final' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Match 'Spec y Arquitectura en Opus, Código en Sonnet, con effort high'
  }

  It 'el revisor final se despacha con effort-high y opus' {
    $section = [regex]::Match((Get-KitFile $script:Dispatch), '(?ms)^## Revisor final.*?(?=^## )').Value
    $section | Should -Match '`subagent_type: sdd-kit:effort-high` \+ `model: opus`'
  }

  It 'sdd-implement comprueba el tipo de effort antes del primer despacho' {
    $step = Get-KitFile 'skills/sdd-implement/SKILL.md'
    $step | Should -Match 'before the first dispatch of the feature'
    $step | Should -Match 'effort: no disponible en este harness, hereda el de la sesión'
  }

  It 'el paso 9 del cierre no repite la revisión final' {
    $step = Get-SkillStep 'sdd-end-feature' 9
    $step | Should -Match 'No lances otra'
    $step | Should -Not -Match 'solo si la task se ejecutó \*\*en línea\*\*'
  }

  It 'el paso 1 del cierre vuelca los rulings y los minors de sdd-implement' {
    $step = Get-SkillStep 'sdd-end-feature' 1
    $step | Should -Match '`sdd-implement`'
    $step | Should -Match 'Deferred minors'
  }
}

Describe 'Task 4 — cambio tras compactar' {
  It 'la cabecera Ejecución de la plantilla lleva la frase del cambio de método' {
    $line = (Get-KitFile 'skills/sdd-templates/templates/plan-template.md') -split "`r?`n" | Where-Object { $_.StartsWith('**Ejecución**') }
    $line | Should -Match ([regex]::Escape('Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger.'))
  }

  It 'el paso 5 dice que tras compactar se relee el plan y no la skill' {
    Get-SkillStep 'sdd-propose' 5 | Should -Match 'after compaction, the session rereads the plan and the ledger'
  }

  It 'sdd-implement cambia a subagentes tras compactar' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match 'After a compaction in Native with two or more tasks without their `complete` line'
  }
}

Describe 'Task 5 — REFACTOR del GREEN' {
  It 'sdd-implement escribe los RED con la apertura ya juntada' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match 'with the opening already in its commit'
  }
}

Describe 'Revisión final — pase de fix' {
  It 'la fila Apertura se junta antes de los RED y, en Native, antes de sdd task start' {
    $row = (Get-KitFile 'skills/sdd-start-feature/references/commit-milestones.md') -split "`r?`n" | Where-Object { $_.StartsWith('| Apertura |') }
    $row | Should -Not -Match 'justo antes del primer despacho'
    $row | Should -Match 'antes de escribir los RED de la primera task \(en Native, antes de su `sdd task start`\)'
  }

  It 'el paso 5 junta la apertura antes del sdd task start de la primera task en Native' {
    Get-SkillStep 'sdd-propose' 5 | Should -Match 'in Native, before its `sdd task start`'
  }

  It 'sdd-implement apunta la revisión final en tasks.md' {
    Get-KitFile 'skills/sdd-verify/SKILL.md' | Should -Match 'write `Revisión final: Spec opus\+high'
  }

  It 'el paso 9 del cierre busca la revisión final en tasks.md y no en el ledger' {
    $step = Get-SkillStep 'sdd-end-feature' 9
    $step | Should -Match 'la línea `Revisión final:` de `tasks.md`'
    $step | Should -Not -Match 'queda en el ledger'
  }
}

Describe 'Decisión del dev-lead — native fijado también cambia tras compactar' {
  It 'la pregunta 6 de sdd-config describe native con la excepción de la compactación' {
    $row = (Get-KitFile 'skills/sdd-config/SKILL.md') -split "`r?`n" | Where-Object { $_.StartsWith('| 6 |') }
    $row | Should -Not -Match 'siempre en la sesión'
    $row | Should -Match '`native` \(en la sesión; tras una compactación con dos o más tasks pendientes, lo que queda va con subagentes\)'
  }
}

Describe 'Patch 0110 — los verbos de task desde cualquier shell' {
  It 'el párrafo Native lanza los verbos con node, desde cualquier shell' {
    $paragraph = Get-NativeParagraph
    $paragraph | Should -Match 'from any shell'
    $paragraph | Should -Not -Match 'Git Bash|cygpath'
  }

  It 'el párrafo Native dice que sdd task done registra la task aunque el comando no imprima nada' {
    Get-NativeParagraph | Should -Match 'It records the task even if the command prints nothing'
  }
}
