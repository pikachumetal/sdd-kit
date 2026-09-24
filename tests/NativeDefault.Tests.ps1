BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-TableRow([string]$RelativePath, [string]$Anchor) {
    return (Get-KitFile $RelativePath) -split "`r?`n" | Where-Object { $_ -match '^\|' -and $_.Contains($Anchor) }
  }

  $script:ControlProfiles = 'skills/sdd-start-task/references/control-profiles.md'
  $script:Overrides = 'skills/sdd-start-task/references/overrides-superpowers.md'
}

Describe 'Task 1 — contrato del método' {
  It 'el Art. IV deja que el handoff de writing-plans elija el método' {
    $constitution = Get-KitFile '.docs/sdd/constitution.md'
    $constitution | Should -Match 'que elige para cada plan el handoff de `writing-plans` con `execution: auto` en `sdd-kit.json`'
    $constitution | Should -Not -Match 'con la ejecución en línea como excepción que el plan declara por task'
  }

  It 'la mission describe la ejecución en la sesión o con subagentes' {
    Get-KitFile '.docs/sdd/mission.md' | Should -Match 'ejecuta en la propia sesión \(Native\) o, en los planes largos, con subagentes'
  }

  It 'en pair la parada del plan aprueba y elige el método en una sola pregunta' {
    $row = Get-TableRow $script:ControlProfiles '| Plan |'
    $row | Should -Match 'una sola pregunta aprueba el plan y elige el método'
  }

  It 'en delegate el plan escribe el método recomendado sin parar' {
    $row = Get-TableRow $script:ControlProfiles '| Plan |'
    $row | Should -Match 'sin gate: comprueba escenario → task, escribe el método que recomienda el handoff'
  }

  It 'la clave execution tiene tres valores y auto por defecto' {
    $row = Get-TableRow $script:ControlProfiles '| `execution` |'
    $row | Should -Match '`auto` \\\| `native` \\\| `subagent`'
    $row | Should -Match '`"auto"`'
  }

  It 'un método fijado en sdd-kit.json no se pregunta y manda sobre el handoff' {
    $profiles = Get-KitFile $script:ControlProfiles
    $profiles | Should -Match 'Ejecución: <valor>, fijado en sdd-kit.json`, aunque el handoff recomiende el otro'
    $profiles | Should -Match 'No tiene nivel de task ni de release'
  }

  It 'la pregunta 5 pregunta el método con auto recomendado' {
    $row = Get-TableRow $script:ControlProfiles '| 5 |'
    $row | Should -Match '¿Cómo se ejecutan los planes'
    $row | Should -Match 'Recomendado `auto`'
    $row | Should -Match '`execution`'
  }

  It 'overrides: subagent-driven-development deja de ser el default' {
    $overrides = Get-KitFile $script:Overrides
    $overrides | Should -Not -Match 'Es el default del kit'
    $overrides | Should -Match 'Es el método de los planes largos o con revisión por task'
  }

  It 'overrides: el handoff se adopta y solo se sobrescribe dónde se para' {
    $row = Get-TableRow $script:Overrides 'Execution Handoff'
    $row | Should -Match 'Se adopta la recomendación'
    $row | Should -Match 'Ejecución: <native \\\| subagent>, porque <motivo del plan>'
    $row | Should -Match 'You review the saved plan before anything runs'
    $row | Should -Not -Match 'No se pregunta el método ni se ofrece'
  }

  It 'la plantilla del plan lleva el método en la cabecera y ninguna task lo declara' {
    $template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $template | Should -Match '(?m)^\*\*Ejecución\*\*: <native \| subagent>, porque <motivo del plan>'
    $template | Should -Not -Match 'omitir si va por agente'
    $template | Should -Not -Match 'default del kit'
  }

  It 'el paso 5 nombra el método del handoff y la clave execution' {
    Get-KitFile 'skills/sdd-start-task/SKILL.md' | Should -Match 'El método lo recomienda el handoff de `writing-plans`, salvo que `execution` lo fije en `sdd-kit.json`'
  }

  It 'el paso 6 enruta por la línea Ejecución del plan' {
    Get-KitFile 'skills/sdd-start-task/SKILL.md' | Should -Match '6\. \*\*Implementación\*\* — según la línea `Ejecución` del plan: `superpowers:executing-plans` \(Native\) o `superpowers:subagent-driven-development`'
  }
}
