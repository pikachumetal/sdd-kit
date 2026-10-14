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

Describe 'Revisión final por ejes' {
  It 'sdd-implement ya no tiene Final review' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Not -Match '(?m)^## Final review\s*$'
  }

  It 'sdd-verify tiene Final review' {
    $script:Skill | Should -Match '(?m)^## Final review\s*$'
  }

  It 'el eje <Axis> va con <Model>' -ForEach @(
    @{ Axis = 'Spec'; Model = 'opus' }, @{ Axis = 'Code'; Model = 'sonnet' }, @{ Axis = 'Architecture'; Model = 'opus' }
  ) {
    $script:Skill | Should -Match ('(?m)^\| ' + $Axis + ' \|.*`sdd-kit:effort-high` \+ `' + $Model + '`')
  }

  It 'el encargo <_> lleva «Restricciones de código» dentro del bloque' -ForEach @('spec-reviewer-prompt.md', 'code-reviewer-prompt.md', 'architecture-reviewer-prompt.md') {
    Get-KitFile "skills/sdd-verify/references/$_" | Should -Match '(?s)```text\s+## Restricciones de código'
  }

  It 'encargo-revision.md vive en sdd-verify' {
    Test-Path (Join-Path $script:RepoRoot 'skills/sdd-verify/references/encargo-revision.md') | Should -BeTrue
    Test-Path (Join-Path $script:RepoRoot 'skills/sdd-start-feature/references/encargo-revision.md') | Should -BeFalse
  }

  It 'la description de sdd-parallel-agents nombra los ejes de la revisión final' {
    [regex]::Match((Get-KitFile 'skills/sdd-parallel-agents/SKILL.md'), '(?m)^description: .+$').Value | Should -Match 'axes of the final review'
  }

  It 'la cabecera de plan-template.md lleva la línea Eje Arquitectura' {
    Get-KitFile 'skills/sdd-templates/templates/plan-template.md' | Should -Match '(?m)^\*\*Eje Arquitectura\*\*: '
  }
}