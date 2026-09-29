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

Describe 'Borradores de cierre' {
  It 'el paso 7 escribe los borradores sin commitear' {
    Assert-Literal (Get-Step $script:StartSkill 7) @('sin commitear', '`walkthrough.md` sin la verificación ni el tiempo')
  }

  It 'el cierre parte de los borradores' {
    Assert-Literal (Get-Step $script:EndSkill 0) @('borradores')
  }
}

Describe 'Sha alcanzable' {
  It 'commit-milestones reescribe las líneas del tramo juntado' {
    Assert-Literal (Get-Reference 'commit-milestones.md') @('juntada en el cierre', 'git merge-base --is-ancestor')
  }

  It 'el paso 10 reescribe antes de juntar' {
    Assert-Literal (Get-Step $script:EndSkill 10) @('juntada en el cierre')
  }

  It 'el último revisado cubre la línea juntada en <Where>' -ForEach @(
    @{ Where = 'el paso 7 de sdd-start-feature'; Text = { Get-Step $script:StartSkill 7 } }
    @{ Where = 'el paso 9 de sdd-end-feature'; Text = { Get-Step $script:EndSkill 9 } }
    @{ Where = 'control-profiles.md'; Text = { Get-Reference 'control-profiles.md' } }
  ) {
    Assert-Literal (& $Text) @('si la línea dice «juntada en el cierre», el commit de cierre')
  }
}

Describe 'Commit del hilo mientras revisa el revisor final' {
  It 'va a la re-revisión del tramo si la revisión final ya salió, en <Where>' -ForEach @(
    @{ Where = 'el paso 6 de sdd-start-feature'; Text = { Get-Step $script:StartSkill 6 } }
    @{ Where = 'control-profiles.md'; Text = { Get-Reference 'control-profiles.md' } }
  ) {
    Assert-Literal (& $Text) @('y la revisión final aún no ha salido, en la de la revisión final de rama; y si ya salió, aunque no haya vuelto, en la re-revisión')
  }

  It 'overrides no lo manda a la final ya despachada' {
    Assert-Literal (Get-OverridesRow 'subagent-driven-development') @('en la final si aún no ha salido, y si ya salió, en la re-revisión del tramo')
  }
}
