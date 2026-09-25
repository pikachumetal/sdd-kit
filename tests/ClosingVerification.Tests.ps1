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
