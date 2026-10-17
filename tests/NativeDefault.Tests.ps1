BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-TableRow([string]$RelativePath, [string]$Anchor) {
    return (Get-KitFile $RelativePath) -split "`r?`n" | Where-Object { $_ -match '^\s*\|' -and $_.Contains($Anchor) }
  }

  $script:ControlProfiles = 'skills/sdd-start-feature/references/control-profiles.md'
  $script:Overrides = 'skills/sdd-start-feature/references/overrides-superpowers.md'
}

Describe 'Task 1 — contrato del método' {
  It 'el Art. IV deja que el handoff de plan-writing elija el método' {
    $constitution = Get-KitFile '.docs/sdd/constitution.md'
    $constitution | Should -Match 'que elige para cada plan el handoff de `plan-writing.md` de `sdd-propose` con `execution: auto` en `sdd-kit.json`'
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
    $profiles | Should -Match 'Ejecución: <valor>, fijado en <fichero>` —`sdd-kit.json` o `sdd-kit.local.json`, el que lo fija—, aunque el handoff recomiende el otro'
    $profiles | Should -Match 'No tiene nivel de release'
  }

  It 'la pregunta 6 de sdd-config pregunta el método con auto recomendado' {
    $row = Get-TableRow 'skills/sdd-config/SKILL.md' '| 6 |'
    $row | Should -Match '¿Cómo se ejecutan los planes'
    $row | Should -Match 'Recomendado `auto`'
    $row | Should -Match '`execution`'
  }

  It 'overrides: subagent-driven-development deja de ser el default' {
    $overrides = Get-KitFile $script:Overrides
    $overrides | Should -Not -Match 'Es el default del kit'
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match 'Use it when a review gate per task is wanted, or when the plan is long enough'
  }

  It 'plan-writing: el handoff recomienda y solo pair pregunta' {
    $ref = Get-KitFile 'skills/sdd-propose/references/plan-writing.md'
    $ref | Should -Match '`Ejecución` line as `<native \| subagent>, porque <reason from the plan>`'
    $ref | Should -Match 'only `pair` asks'
    $ref | Should -Match "don't ask it in any profile"
  }

  It 'la plantilla del plan lleva el método en la cabecera y ninguna task lo declara' {
    $template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $template | Should -Match '(?m)^\*\*Ejecución\*\*: <native \| subagent>, porque <motivo del plan>'
    $template | Should -Not -Match 'omitir si va por agente'
    $template | Should -Not -Match 'default del kit'
  }

  It 'plan-writing nombra el método del handoff y la clave execution' {
    Get-KitFile 'skills/sdd-propose/references/plan-writing.md' | Should -Match 'If the method is already given —`execution: native` or `subagent` in `.docs/sdd/sdd-kit.local.json` or `sdd-kit.json`'
  }

  It 'el paso 6 enruta por la línea Ejecución del plan' {
    Get-KitFile 'skills/sdd-start-feature/SKILL.md' | Should -Match 'es invocar `sdd-implement` con `Skill`[^\n]*Ejecuta el plan con el método de su línea `Ejecución`'
  }
}

Describe 'Task 2 — init y migración' {
  It 'greenfield pregunta el método de ejecución a través de sdd-config' {
    $row = Get-TableRow 'skills/sdd-init-greenfield/SKILL.md' '| 19 |'
    $row | Should -Match '`sdd-config`.*método de ejecución'
  }

  It 'greenfield escribe las claves respondidas en la 19' {
    Get-KitFile 'skills/sdd-init-greenfield/SKILL.md' | Should -Match 'las claves que el usuario respondió en la 19'
  }

  It 'la estructura de greenfield saca ids.mode de la pregunta 19' {
    Get-KitFile 'skills/sdd-init-greenfield/references/estructura.md' |
      Should -Match ([regex]::Escape('con `ids.mode` de la pregunta 19 (`sdd-config`)'))
  }

  It 'brownfield pregunta el método de ejecución a través de sdd-config' {
    $row = Get-TableRow 'skills/sdd-init-brownfield/SKILL.md' '| 1 |'
    $row | Should -Match '`sdd-config`.*método de ejecución'
  }

  It 'brownfield escribe execution en el marcador solo si se respondió' {
    $generation = Get-KitFile 'skills/sdd-init-brownfield/references/generacion.md'
    $generation | Should -Match '"execution"\?'
    $generation | Should -Match 'con `control`, `merge`, `execution` y `validation.mode` solo con lo respondido'
  }

  It 'la migración a v2.0.0 pregunta execution si falta y la escribe' {
    $migration = Get-KitFile 'skills/sdd-init/references/migrations/v2.0.0.md'
    $migration | Should -Match 'o `execution`'
    $migration | Should -Match '`execution: auto`'
    $migration | Should -Match '"execution"'
  }

  It 'la línea Escribe de la migración declara execution' {
    $line = (Get-KitFile 'skills/sdd-init/references/migrations/v2.0.0.md') -split "`r?`n" | Where-Object { $_ -match '^\*\*Escribe\*\*:' }
    $line | Should -Match '`merge\.push`, `execution`'
  }
}

Describe 'REFACTOR — la pregunta del gate del plan en pair' {
  It 'el paso 5 da la forma de la pregunta con el método y la recomendada primero' {
    $skill = Get-KitFile 'skills/sdd-propose/SKILL.md'
    $skill | Should -Match 'In `pair`, the gate question approves the plan and chooses the method at once'
    $skill | Should -Match '«Apruebo, con <método recomendado> \(Recomendada\)», «Apruebo, con <el otro método>» and «Cambios»'
  }
}

Describe 'Revisión final — huecos del método' {
  It 'sdd-implement para en los frenos y en pair tras cada task además de las cuatro paradas' {
    $row = Get-KitFile 'skills/sdd-implement/SKILL.md'
    $row | Should -Match 'a fifth class, not an exception to the four'
    $row | Should -Match 'scope brake'
    $row | Should -Match 'the stop after each task'
  }

  It 'greenfield escribe execution en el marcador solo si se respondió' {
    $structure = Get-KitFile 'skills/sdd-init-greenfield/references/estructura.md'
    $structure | Should -Match '"execution"\?'
    $structure | Should -Match '`control`, `merge` y `execution`'
  }

  It 'el paso 6 dice cómo se ejecuta una task lite' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match 'In lite mode, without a plan, `spec.md` is the plan: the method is `execution` if `sdd-kit.json` fixes it, and Native with `auto`'
  }

  It 'un método que el dev-lead nombró para la task también deja solo Apruebo y Cambios' {
    Get-KitFile 'skills/sdd-propose/SKILL.md' | Should -Match 'with `execution` fixed \(`native` or `subagent` that no `auto` in `sdd-kit.local.json` overrides\), or a method the dev-lead already named for the feature, only «Apruebo» and «Cambios»'
  }

  It 'la celda de pair dice que con execution fijado solo se aprueba' {
    Get-TableRow $script:ControlProfiles '| Plan |' | Should -Match 'con `execution` fijado, solo aprueba'
  }

  It 'la migración verifica execution como las demás claves' {
    Get-KitFile 'skills/sdd-init/references/migrations/v2.0.0.md' | Should -Match '(?m)^.*Verificaci[\s\S]*`execution`'
  }

  It 'el README describe la ejecución en la sesión o por subagentes' {
    Get-KitFile 'README.md' | Should -Not -Match 'la implementación por subagentes con los tests escritos antes'
  }
}
