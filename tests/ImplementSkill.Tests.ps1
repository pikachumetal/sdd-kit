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

Describe 'Reglas nuevas de implement' {
  It 'la plantilla del walkthrough lleva la línea Compactación' {
    Get-KitFile 'skills/sdd-templates/templates/walkthrough-template.md' | Should -Match '(?m)^- Compactación: '
  }

  It 'el ledger registra la compactación con su línea fija' {
    $script:Skill | Should -Match ([regex]::Escape('`Task <N>: Ruling: compactación — sigo con <Native | SDD> — quedan <k> tasks`'))
  }

  It 'el prompt del implementador lleva el decálogo tras las restricciones, y mandan las restricciones' {
    $prompt = Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'
    $prompt | Should -Match '(?s)## Restricciones de código.*## Quality decalogue.*## Tests RED'
    $prompt | Should -Match ([regex]::Escape('Si una regla de aquí choca con las Restricciones de código, mandan las Restricciones.'))
    ([regex]::Matches($prompt, '(?m)^\d+\. ')).Count | Should -BeGreaterOrEqual 10
  }

  It 'el despacho del implementador manda el decálogo tal cual' {
    $script:Skill | Should -Match ([regex]::Escape('the `## Quality decalogue`, as is'))
  }

  It 'el revisor de task no recibe el decálogo' {
    Get-KitFile 'skills/sdd-implement/references/task-reviewer-prompt.md' | Should -Not -Match 'Quality decalogue'
  }

  It 'la preparación anuncia el workspace en el mensaje siguiente, con su red flag' {
    $script:Skill | Should -Match ([regex]::Escape('**Your next message to the user**, right under its phase notice'))
    $script:Skill | Should -Match ([regex]::Escape('haven''t carried the `Workspace del plan: …` line'))
  }

  It 'la preparación anuncia el workspace con su línea fija' {
    $script:Skill | Should -Match ([regex]::Escape('`Workspace del plan: <ruta> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`'))
  }

  It 'la recuperación tiene su sección y su línea de ledger' {
    $script:Skill | Should -Match '(?m)^## Recovery'
    $script:Skill | Should -Match ([regex]::Escape('`Task <N>: Ruling: recuperación tras <caída | corte por cuota> — <qué se retomó>`'))
  }

  It 'el método nombra los cuatro factores y la plantilla del plan los pide' {
    $script:Skill | Should -Match 'weighs four factors by name, with no numeric threshold'
    Get-KitFile 'skills/sdd-templates/templates/plan-template.md' | Should -Match 'si el plan cabe en un contexto, sin umbral'
  }
}
