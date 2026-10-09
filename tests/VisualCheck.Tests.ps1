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

Describe 'Verificación visual' {
  It 'el paso 6 da el script de Playwright cuando falta el MCP, con su contraejemplo' {
    Assert-Literal (Get-Step 6) @('un script con el paquete `playwright`', '«El MCP de Playwright no está en la sesión» no es estar sin navegador', 'con el error concreto')
  }

  It 'el paso 6 conserva las capturas hasta la validación' {
    Assert-Literal (Get-Step 6) @('Guarda las capturas fuera de git hasta la validación', 'sin borrarlas al limpiar')
  }

  It 'la parada de pair y la validación enseñan medidas y capturas antes del guion' {
    Assert-Literal (Get-Step 6) @('antes del guion enseña el criterio, la salida del detector por viewport', 'cada medida con su valor y el esperado si el criterio fija un valor, y la ruta de cada captura')
    Assert-Literal (Get-Step 7) @('antes del guion van su criterio, la salida del detector por viewport', 'sus medidas solo si el criterio fija un valor', 'la ruta de cada captura', '«no probado» con su motivo')
  }

  It 'la tabla de racionalizaciones responde al «no tengo el MCP»' {
    $script:Skill | Should -Match '(?m)^\| "No tengo el MCP de Playwright[^\n]*script con el paquete `playwright`'
  }
}

Describe 'Delegación y gama media' {
  It 'la primera pregunta ofrece la variante de gama media con las tasks previstas' {
    $propose = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-propose/SKILL.md') -Raw
    $step = [regex]::Match($propose, "(?ms)^2\. .*?(?=^\d+\. |^## )").Value
    Assert-Literal $step @('«apruebo la spec por delegación, nos vemos en la validación, y paras antes de la Task 1 para que baje la sesión a gama media»', '(«prevé 3 tasks»)', "With a single task foreseen, don't offer it", 'stop before Task 1 whatever the method')
  }
}
