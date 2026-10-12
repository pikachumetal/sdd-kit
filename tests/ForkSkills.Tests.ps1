BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:RepoRoot $RelativePath)
  }

  function Find-InSkills([string]$Text) {
    return Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -File | Select-String -SimpleMatch $Text
  }
}

Describe 'sdd-worktrees' {
  It 'existe con su NOTICE' {
    foreach ($path in 'skills/sdd-worktrees/SKILL.md', 'skills/sdd-worktrees/NOTICE') {
      Join-Path $script:RepoRoot $path | Should -Exist
    }
  }

  It 'ninguna skill invoca superpowers:using-git-worktrees' {
    Find-InSkills 'superpowers:using-git-worktrees' | Should -BeNullOrEmpty
  }

  It 'sdd-implement prepara el worktree con sdd-worktrees' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match '(?m)^1\. \*\*Worktree\*\*: invoke `sdd-worktrees`'
  }

  It 'la baseline usa el gate de cierre del proyecto y no se inventa un comando' {
    $skill = Get-KitFile 'skills/sdd-worktrees/SKILL.md'
    $skill | Should -Match 'Gate de cierre'
    $skill | Should -Match 'never make one up'
  }

  It 'el gate de cierre de sdd-implement cuenta la baseline de sdd-worktrees' {
    $implement = Get-KitFile 'skills/sdd-implement/SKILL.md'
    $implement | Should -Not -Match 'runs once, in the final validation'
    $implement | Should -Match 'at the baseline of `sdd-worktrees` and once in the final validation'
  }

  It 'con environments.md ejecuta env:setup' {
    Get-KitFile 'skills/sdd-worktrees/SKILL.md' | Should -Match 'environments\.md.+env:setup'
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-worktrees/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}

Describe 'sdd-parallel-agents' {
  It 'existe con su NOTICE' {
    foreach ($path in 'skills/sdd-parallel-agents/SKILL.md', 'skills/sdd-parallel-agents/NOTICE') {
      Join-Path $script:RepoRoot $path | Should -Exist
    }
  }

  It 'ninguna skill invoca superpowers:dispatching-parallel-agents' {
    Find-InSkills 'superpowers:dispatching-parallel-agents' | Should -BeNullOrEmpty
  }

  It 'review-spec.md despacha los dos revisores con sdd-parallel-agents' {
    Get-KitFile 'skills/sdd-start-feature/references/review-spec.md' | Should -Match 'dos revisores.+`sdd-parallel-agents`'
  }

  It 'aplica el tope de agentes del proyecto y no reparte tasks del plan' {
    $skill = Get-KitFile 'skills/sdd-parallel-agents/SKILL.md'
    $skill | Should -Match 'control\.maxParallelAgents'
    $skill | Should -Match 'Not for plan tasks'
  }

  It 'nadie remite ya el tope de agentes a la task 0022 (patch 0174)' {
    foreach ($file in 'skills/sdd-config/SKILL.md', 'skills/sdd-start-feature/references/control-profiles.md') {
      $text = Get-KitFile $file
      $text | Should -Not -Match 'tope de agentes[^.]*task 0022|maxParallelAgents` solo se declara aquí: su conducta la define la task 0022'
      $text | Should -Match 'sdd-parallel-agents'
    }
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-parallel-agents/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}
