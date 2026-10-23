BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:Skill = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-start-feature/SKILL.md') -Raw
  $script:Implement = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-implement/SKILL.md') -Raw

  function Get-Step([int]$Step) {
    return [regex]::Match($script:Skill, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    $Text | Should -Not -BeNullOrEmpty
    foreach ($literal in $Literals) { $Text | Should -Match ([regex]::Escape($literal)) }
  }
}

Describe 'Parar lo arrancado' {
  It 'sdd-implement para por PID o por puerto y nunca por nombre ni por línea de comandos' {
    Assert-Literal $script:Implement @('stop it by that PID or by the process listening on that port', 'never by executable name', 'or a command-line pattern', '`taskkill /IM`', '`pkill -f`')
  }

  It 'el paso 7 para antes del guion salvo validation.startEnvironment' {
    Assert-Literal (Get-Step 7) @('El guion, el entorno y el panel siguen [dev-validation.md](../sdd-archive/references/dev-validation.md)')
    $reference = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-archive/references/dev-validation.md') -Raw
    Assert-Literal $reference @('`validation.startEnvironment: true`', 'stop what you started (`sdd-implement`, «Processes you start»)', 'its URL or port and the command that stops it')
  }

  It 'la tabla de racionalizaciones responde a matar todos los procesos del ejecutable' {
    $script:Implement | Should -Match '(?m)^\| "I kill every `node\.exe`[^\n]*by its PID or port'
  }

  It 'hay red flag de parar por nombre' {
    $script:Implement | Should -Match '(?m)^- You''re about to stop a process by its name or a command-line pattern'
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

  It 'el walkthrough lleva la suite con su duración, su configuración y el umbral de 10 minutos' {
    Assert-Literal $script:Walkthrough @('Suite completa: `<comando>` → <resultado> · <duración> · configuración: <la del gate | lo que se añadió>', 'sin «Presupuesto E2E» o con `pendiente`, si pasa de 10 min')
  }

  It 'el walkthrough lleva, con E2E, el entorno de la suite y su duración frente al presupuesto' {
    Assert-Literal $script:Walkthrough @('Entorno de la suite: `<comando>` · <comprobación> → <resultado>, levantado en esta sesión', 'E2E: <duración> de <Presupuesto E2E>', 'Suite que pasa de su presupuesto', '· o `no aplica`')
  }

  It 'la tabla 4.2 es una fila por THEN con su evidencia' {
    Assert-Literal $script:Walkthrough @('| THEN | Evidencia | Resultado |', '`suite` · `ejecución real` · `no probado`')
  }

  It 'la frase del dev-lead no se corrige y sus palabras se excluyen del corrector al escribirla' {
    Assert-Literal $script:Walkthrough @('la frase del dev-lead no se corrige, erratas incluidas', 'al escribirlo y no después del lint', 'todas las palabras de la frase, no solo las que','`<!-- cspell:ignore <palabras> -->`')
  }
}

Describe 'Native: sdd task done tras el commit' {
  It 'sdd task done va en su propia orden y solo si HEAD cambió' {
    Assert-Literal $script:Implement @('check the commit exists — if `HEAD` is still at the task''s base, the pre-commit rejected it', 'read its message and fix the cause', 'then, in its own call')
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
    $propose = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-propose/SKILL.md') -Raw
    $step = [regex]::Match($propose, "(?ms)^4\. .*?(?=^\d+\. |^## )").Value
    Assert-Literal $step @('write under its scenario `Se valida en:`', "also if the scenarios aren't in a capability delta")
  }
}

Describe 'El puerto es tuyo' {
  It 'sdd-implement comprueba el puerto libre antes de arrancar y libre después de parar' {
    Assert-Literal $script:Implement @('Before starting, check the port is free', 'if not, it isn''t yours: use another', 'after stopping, check it''s free again', 'if something still listens, stop that one')
  }
}
