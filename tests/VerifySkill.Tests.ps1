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

Describe 'Encargos de los ejes' -Tag 'Slow' {
  It 'el Quick Diagnostic de <_> es el de Wondel 1.8.0' -ForEach @('clean-code', 'refactoring-patterns', 'software-design-philosophy', 'pragmatic-programmer', 'clean-architecture') {
    $clone = if ($env:SDD_UPSTREAM_DIR) { Join-Path $env:SDD_UPSTREAM_DIR 'wondelai-skills' }
    if (-not $clone -or -not (Test-Path $clone)) { Set-ItResult -Skipped -Because 'sin el clone de wondelai/skills en SDD_UPSTREAM_DIR'; return }
    $encoding = [Console]::OutputEncoding
    [Console]::OutputEncoding = [Text.Encoding]::UTF8
    try { $source = (git -C $clone show "v1.8.0:$_/SKILL.md") -join "`n" } finally { [Console]::OutputEncoding = $encoding }
    $table = [regex]::Match($source, '(?ms)^## Quick Diagnostic\s*\n\s*\n(\|.*?)(?=\n\s*\n)').Groups[1].Value
    $table | Should -Not -BeNullOrEmpty
    $prompt = if ($_ -eq 'clean-architecture') { 'architecture' } else { 'code' }
    (Get-KitFile "skills/sdd-verify/references/$prompt-reviewer-prompt.md").Replace("`r`n", "`n") | Should -Match ([regex]::Escape($table))
  }
}

Describe 'Cierre de la revisión' {
  It 'ningún fichero de skills/ invoca las skills sustituidas' {
    $hits = Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -File |
      Where-Object { $_.FullName -notlike '*sdd-verify*NOTICE' } |
      Select-String -Pattern 'superpowers:verification-before-completion', 'superpowers:requesting-code-review', 'code-reviewer\.md'
    $hits | ForEach-Object { "$($_.Path):$($_.LineNumber)" } | Should -BeNullOrEmpty
  }

  It 'el cierre vive en sdd-verify' {
    $script:Skill | Should -Match '(?m)^## Closing the review\s*$'
  }

  It 'un Critical residual no se adjudica y una re-revisión no abre otra' {
    $script:Skill | Should -Match 'A Critical is never adjudicated'
    $script:Skill | Should -Match 'A re-review never opens another'
    $script:Skill | Should -Match ([regex]::Escape('sin revisar: <sha> — <what it changes>'))
  }

  It 'un «no verificado» lo verifica el hilo o lo adjudica antes de la validación' {
    $script:Skill | Should -Match '«no verificado»[^\n]*yourself[^\n]*`Final: Ruling:'
  }

  It 'un commit tras la re-revisión se revisa en el hilo con la regla entera de sdd-implement' {
    $script:Skill | Should -Not -Match 'documentation under 20 lines'
    $script:Skill | Should -Match 'A commit after it[^\n]*«Every commit of yours»'
  }

  It 'las órdenes de la CLI llevan su ruta y --path' {
    $script:Skill | Should -Match ([regex]::Escape('node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js"'))
    $script:Skill | Should -Match 'decision index --path \.docs/sdd'
    $script:Skill | Should -Match 'capability index --path \.docs/sdd'
  }

  It 'el ejemplo de la línea de campo de <_> lleva los ejes' -ForEach @('skills/sdd-start-feature/references/control-profiles.md') {
    $text = Get-KitFile $_
    $text | Should -Not -Match 'revisión final opus limpia'
    $text | Should -Match 'revisión final Spec y Código'
  }

  It 'la ADR 0015 cubre a <_>' -ForEach @('skills/sdd-start-feature/SKILL.md', 'skills/sdd-start-feature/references/control-profiles.md', 'skills/sdd-start-feature/references/commit-milestones.md', 'skills/sdd-propose/references/plan-writing.md', 'skills/sdd-templates/templates/plan-template.md') {
    Push-Location $script:RepoRoot
    try { $index = node cli/bin/sdd.js decision index --path .docs/sdd --files $_ } finally { Pop-Location }
    ($index -join "`n") | Should -Match '`0015`'
  }
}