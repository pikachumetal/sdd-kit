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
  It 'el paso 6 tiene un párrafo Native con task-start y task-done' {
    $paragraph = Get-NativeParagraph
    $paragraph | Should -Match 'scripts/task-start'
    $paragraph | Should -Match 'scripts/task-done'
  }

  It 'el párrafo Native comprueba la base antes de cada task' {
    Get-NativeParagraph | Should -Match 'Antes de empezar \*\*cada\*\* task'
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
