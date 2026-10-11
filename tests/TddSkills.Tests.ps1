BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:RepoRoot $RelativePath)
  }

  function Find-InSkills([string]$Text) {
    return Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -File | Select-String -SimpleMatch $Text
  }
}

Describe 'sdd-tdd' {
  It 'existe con su referencia y su NOTICE' {
    foreach ($path in 'skills/sdd-tdd/SKILL.md', 'skills/sdd-tdd/references/writing-good-tests.md', 'skills/sdd-tdd/NOTICE') {
      Join-Path $script:RepoRoot $path | Should -Exist
    }
  }

  It 'ninguna skill invoca superpowers:test-driven-development' {
    Find-InSkills 'superpowers:test-driven-development' | Should -BeNullOrEmpty
  }

  It 'sdd-implement carga sdd-tdd antes de la Task 1' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match '(?m)^5\. \*\*TDD\*\*: load `sdd-tdd`'
  }

  It 'el encargo del implementador ejecuta el RED antes de tocar el código' {
    $job = [regex]::Match((Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'), '(?s)## Your Job.+?## ').Value
    $job | Should -Match '1\. Before touching code, run `<comando de los RED>`; keep its failing output and why that failure was expected'
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-tdd/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}
