BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:RepoRoot $RelativePath)
  }

  $script:Skill = Get-KitFile 'skills/sdd-implement/SKILL.md'
}

Describe 'sdd-implement' {
  It 'tiene la sección <_>' -ForEach @('## Overview', '## Method', '## Setup', '## Before each task', '## Native loop', '## SDD loop', '## After each task', '## Deviations and rulings', '## Final review', '## Finish', '## Red flags') {
    $script:Skill | Should -Match ('(?m)^' + [regex]::Escape($_) + '\b')
  }

  It 'ninguna skill invoca <_>' -ForEach @('superpowers:executing-plans', 'superpowers:subagent-driven-development') {
    $hits = Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -File | Select-String -SimpleMatch $_
    $hits | Should -BeNullOrEmpty
  }

  It 'el paso 6 de sdd-start-feature invoca sdd-implement' {
    [regex]::Match((Get-KitFile 'skills/sdd-start-feature/SKILL.md'), '(?m)^6\. .+$').Value | Should -Match '`sdd-implement`'
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-implement/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }

  It 'cada prompt de references/ lleva «Restricciones de código» dentro del bloque' -ForEach @('implementer-prompt.md', 'task-reviewer-prompt.md', 're-review-prompt.md') {
    $prompt = Get-KitFile "skills/sdd-implement/references/$_"
    $prompt | Should -Match '(?s)```text\s+## Restricciones de código'
  }
}
