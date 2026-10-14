BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    $path = Join-Path $script:RepoRoot $RelativePath
    if (-not (Test-Path $path)) { return '' }
    return Get-Content -Raw -Encoding utf8 $path
  }

  $script:Skill = Get-KitFile 'skills/sdd-verify/SKILL.md'
}

Describe 'sdd-verify' {
  It 'el contrato de cierre de sdd-implement carga sdd-verify' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match '\*\*REQUIRED SUB-SKILL:\*\* `sdd-verify`'
  }

  It 'conserva la sección <_> de su fuente' -ForEach @('## Overview', '## The Iron Law', '## The Gate Function', '## Common Failures', '## Red Flags - STOP', '## Rationalization Prevention', '## Key Patterns', '## When To Apply', '## Requesting review') {
    $script:Skill | Should -Match ('(?m)^' + [regex]::Escape($_) + '\s*$')
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-verify/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}
