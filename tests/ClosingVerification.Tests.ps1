BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:Skill = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-start-feature/SKILL.md') -Raw

  function Get-Step([int]$Step) {
    return [regex]::Match($script:Skill, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    $Text | Should -Not -BeNullOrEmpty
    foreach ($literal in $Literals) { $Text | Should -Match ([regex]::Escape($literal)) }
  }
}

Describe 'Parar lo arrancado' {
  It 'el paso 6 para por PID o por puerto y nunca por nombre ni por línea de comandos' {
    Assert-Literal (Get-Step 6) @('párala por ese PID o por el proceso que escucha en ese puerto', 'nunca por el nombre del ejecutable', 'ni por un patrón de su línea de comandos', '`taskkill /IM`', '`pkill -f`')
  }

  It 'el paso 7 para antes del guion salvo validation.startEnvironment' {
    Assert-Literal (Get-Step 7) @('Antes de presentar el guion, para lo que arrancaste, con la regla del paso 6', '`validation.startEnvironment: true`', 'en qué puerto está y cómo pararla')
  }

  It 'la tabla de racionalizaciones responde a matar todos los procesos del ejecutable' {
    $script:Skill | Should -Match '(?m)^\| "Mato todos los `node\.exe`[^\n]*por su PID o por el puerto'
  }

  It 'hay red flag de parar por nombre' {
    $script:Skill | Should -Match '(?m)^- Vas a parar un proceso por su nombre o por un patrón de su línea de comandos'
  }
}

Describe 'Evidencia por THEN' {
  BeforeAll { $script:Walkthrough = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-templates/templates/walkthrough-template.md') -Raw }

  It 'el paso 7 da una fila por THEN con tres valores cerrados' {
    Assert-Literal (Get-Step 7) @('una fila por THEN de la spec con su evidencia', '`suite`, `ejecución real` o `no probado`', 'solo cuenta como verificado con `ejecución real`')
  }

  It 'el paso 7 provoca de verdad los THEN de fallo' {
    Assert-Literal (Get-Step 7) @('se provoca de verdad con la entrada que falla', '«lo cubre el test» es `suite`')
  }

  It 'el paso 7 dice cuánto tardó la suite' {
    Assert-Literal (Get-Step 7) @('cuánto tardó la suite completa')
  }

  It 'el walkthrough lleva la suite con su duración y el umbral de 10 minutos' {
    Assert-Literal $script:Walkthrough @('Suite completa: `<comando>` → <resultado> · <duración>', 'más de 10 min')
  }

  It 'la tabla 4.2 es una fila por THEN con su evidencia' {
    Assert-Literal $script:Walkthrough @('| THEN | Evidencia | Resultado |', '`suite` · `ejecución real` · `no probado`')
  }
}

Describe 'Native: task-done tras el commit' {
  It 'task-done va en su propia orden y solo si HEAD cambió' {
    Assert-Literal (Get-Step 6) @('`task-done` va en su propia orden, después de comprobar que el commit existe', 'si `HEAD` sigue en la base de la task, el pre-commit lo rechazó', 'lee su mensaje y arregla la causa')
  }
}

Describe 'Se valida en' {
  BeforeAll { $script:SpecTemplate = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-templates/templates/spec-template.md') -Raw }

  It 'la plantilla de spec pide la vía de validación de un THEN que depende de la base' {
    Assert-Literal $script:SpecTemplate @('- Se valida en:', '`worktree con la base al día`', '`validación post-merge con fecha`', 'de la rama de integración, del historial de git, del remoto')
  }

  It 'el paso 7 prepara ese entorno' {
    Assert-Literal (Get-Step 7) @('Si un THEN de la spec lleva `Se valida en:`, prepara ese entorno')
  }
}

Describe 'Se valida en, en el paso que escribe los escenarios' {
  It 'el paso 4 pide la línea bajo el escenario, también sin delta de capacidad' {
    Assert-Literal (Get-Step 4) @('escribe bajo su escenario `Se valida en:`', 'también si los escenarios no van en un delta de capacidad')
  }
}

Describe 'El puerto es tuyo' {
  It 'el paso 6 comprueba el puerto libre antes de arrancar y libre después de parar' {
    Assert-Literal (Get-Step 6) @('antes de arrancar, comprueba que el puerto está libre', 'si no lo está, no es tuyo: usa otro', 'tras parar, comprueba que quedó libre', 'si sigue escuchando, para el que escucha')
  }
}
