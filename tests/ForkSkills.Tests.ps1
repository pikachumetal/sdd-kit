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

  It 'con environments.md ejecuta env:setup' {
    Get-KitFile 'skills/sdd-worktrees/SKILL.md' | Should -Match 'environments\.md.+env:setup'
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-worktrees/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}
