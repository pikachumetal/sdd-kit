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
    return [regex]::Match((Get-SkillStep 'sdd-start-task' 6), '(?m)^\s*\*\*En Native\*\*.*$').Value
  }

  $script:Overrides = 'skills/sdd-start-task/references/overrides-superpowers.md'
  $script:Dispatch = 'skills/sdd-start-task/references/encargo-revision.md'
}

Describe 'Task 1 — bucle Native' {
  It 'el párrafo Native dice que los scripts son de executing-plans y no del kit' {
    Get-NativeParagraph | Should -Match 'son de esa skill de superpowers, no del kit'
  }

  It 'el paso 6 tiene un párrafo Native con task-start y task-done' {
    $paragraph = Get-NativeParagraph
    $paragraph | Should -Match 'scripts/task-start'
    $paragraph | Should -Match 'scripts/task-done'
  }

  It 'el párrafo Native comprueba la base antes de cada task' {
    Get-NativeParagraph | Should -Match 'Cada task, también la segunda y las siguientes, se abre en este orden: `task-start`, la comprobación de la base'
  }

  It 'el párrafo Native aparta y compara los RED' {
    $paragraph = Get-NativeParagraph
    $paragraph | Should -Match 'guarda una copia fuera del repo'
    $paragraph | Should -Match '`git diff --no-index`'
  }

  It 'el párrafo Native fija el orden del cierre de la task' {
    Get-NativeParagraph | Should -Match 'comparar los RED, el commit de la task y `task-done`'
  }

  It 'las rutas de Windows cubren task-start en overrides y en el encargo' {
    Get-KitFile $script:Overrides | Should -Match '`task-start` de `executing-plans`, en Windows'
    Get-KitFile $script:Dispatch | Should -Match '`sdd-workspace`, `task-brief`, `task-start` y `review-package` imprimen'
  }
}

Describe 'Task 2 — historia de commits' {
  BeforeAll { $script:Recipe = Get-KitFile 'skills/sdd-start-task/references/commit-milestones.md' }

  It 'la receta vale también con un solo commit en el rango' {
    $script:Recipe | Should -Match 'también con un solo commit'
    $script:Recipe | Should -Not -Match 'no hay nada que juntar'
  }

  It 'la fila Task N dice cuándo se junta en Native' {
    $row = $script:Recipe -split "`r?`n" | Where-Object { $_.StartsWith('| Task N |') }
    $row | Should -Match 'en Native, con su contrato de cierre cumplido y antes de `task-done`'
  }

  It 'con un RED en el árbol, el hilo lo aparta para commitear' {
    $section = [regex]::Match($script:Recipe, '(?ms)^## Tests RED sin commitear.*').Value
    $section | Should -Match 'antes de escribir los RED'
    $section | Should -Match 'apártalo'
  }

  It 'el paso 5 junta la apertura antes de los RED' {
    Get-SkillStep 'sdd-start-task' 5 | Should -Match 'Antes de escribir los RED de la primera task, junta la apertura'
  }

  It 'el paso 6 pide escribir el mensaje del hito aunque haya un solo commit' {
    Get-SkillStep 'sdd-start-task' 6 | Should -Match 'con el mensaje que escribes tú, también si el rango tiene un solo commit'
  }
}

Describe 'Task 3 — revisión final y cierre' {
  It 'el Art. IV fija el techo del revisor final de Native' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Match 'va con Opus y effort high \(`sdd-kit:effort-high`\): es el techo por defecto'
  }

  It 'el revisor final se despacha con effort-high y opus' {
    $section = [regex]::Match((Get-KitFile $script:Dispatch), '(?ms)^## Revisor final.*?(?=^## )').Value
    $section | Should -Match '`subagent_type: sdd-kit:effort-high` \+ `model: opus`'
  }

  It 'el paso 6 comprueba el tipo de effort antes del primer despacho' {
    $step = Get-SkillStep 'sdd-start-task' 6
    $step | Should -Match 'Antes del primer despacho de la task'
    $step | Should -Match 'effort: no disponible en este harness, hereda el de la sesión'
  }

  It 'el paso 9 del cierre no repite la revisión final' {
    $step = Get-SkillStep 'sdd-end-task' 9
    $step | Should -Match 'No lances otra'
    $step | Should -Not -Match 'solo si la task se ejecutó \*\*en línea\*\*'
  }

  It 'el paso 1 del cierre vuelca los rulings y los minors de executing-plans' {
    $step = Get-SkillStep 'sdd-end-task' 1
    $step | Should -Match '`executing-plans`'
    $step | Should -Match 'Deferred minors'
  }
}

Describe 'Task 4 — cambio tras compactar' {
  It 'la cabecera Ejecución de la plantilla lleva la frase del cambio de método' {
    $line = (Get-KitFile 'skills/sdd-templates/templates/plan-template.md') -split "`r?`n" | Where-Object { $_.StartsWith('**Ejecución**') }
    $line | Should -Match ([regex]::Escape('Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.'))
  }

  It 'el paso 5 dice que tras compactar se relee el plan y no la skill' {
    Get-SkillStep 'sdd-start-task' 5 | Should -Match 'tras compactar, la sesión relee el plan y el ledger'
  }

  It 'la fila de executing-plans en overrides cambia a subagentes tras compactar' {
    $row = (Get-KitFile $script:Overrides) -split "`r?`n" | Where-Object { $_.StartsWith('| `executing-plans` (Native) |') }
    $row | Should -Match 'Tras una compactación con dos o más tasks pendientes'
  }
}

Describe 'Task 5 — REFACTOR del GREEN' {
  It 'el paso 6 escribe los RED de SDD con la apertura ya juntada' {
    Get-SkillStep 'sdd-start-task' 6 | Should -Match 'con la apertura ya juntada en su commit'
  }
}
