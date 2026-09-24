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
