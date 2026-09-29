BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:StartSkill = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-start-feature/SKILL.md') -Raw
  $script:EndSkill = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-end-feature/SKILL.md') -Raw

  function Get-Reference([string]$Name) {
    return Get-Content (Join-Path $script:RepoRoot "skills/sdd-start-feature/references/$Name") -Raw
  }

  function Get-Step([string]$Skill, [int]$Step) {
    return [regex]::Match($Skill, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
  }

  function Get-OverridesRow([string]$SkillName) {
    return [regex]::Match((Get-Reference 'overrides-superpowers.md'), "(?m)^\| ``$SkillName``.*$").Value
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    $Text | Should -Not -BeNullOrEmpty
    foreach ($literal in $Literals) { $Text | Should -Match ([regex]::Escape($literal)) }
  }
}

Describe 'Revisor en segundo plano' {
  It 'el paso 6 despacha el revisor final en segundo plano con el commit de la última task' {
    Assert-Literal (Get-Step $script:StartSkill 6) @('en segundo plano', 'en cuanto existe el commit de la última task', 'antes de arrancar la aplicación')
  }

  It 'el paso 7 presenta la validación cuando vuelve el revisor' {
    Assert-Literal (Get-Step $script:StartSkill 7) @('cuando vuelve el revisor')
  }

  It 'el encargo del revisor final lo aísla en un worktree desanclado' {
    Assert-Literal (Get-Reference 'encargo-revision.md') @('git worktree add --detach', 'review-<id>-<sha corto>', 'no mires ramas ni commits posteriores', 'git worktree remove')
  }

  It 'overrides dice que la revisión final de Native sale en segundo plano' {
    Assert-Literal (Get-OverridesRow 'executing-plans') @('en segundo plano')
  }
}
