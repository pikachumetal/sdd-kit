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

Describe 'Verificación visual' {
  It 'sdd-implement da el script de Playwright cuando falta el MCP, con su contraejemplo' {
    Assert-Literal $script:Implement @('a script with the `playwright` package', '«The Playwright MCP isn''t in the session» is not «no browser»', 'said with the concrete error')
  }

  It 'sdd-implement conserva las capturas hasta la validación' {
    Assert-Literal $script:Implement @('Keep the screenshots outside git until validation', 'don''t delete them when cleaning')
  }

  It 'la parada de pair y la validación enseñan medidas y capturas antes del guion' {
    Assert-Literal $script:Implement @('before the script show the criterion, the detector output per viewport', 'each measurement with its value and the expected one if the criterion fixes a value, and each screenshot''s path')
    Assert-Literal (Get-Step 7) @('antes del guion van su criterio, la salida del detector por viewport', 'sus medidas solo si el criterio fija un valor', 'la ruta de cada captura', '«no probado» con su motivo')
  }

  It 'la tabla de racionalizaciones responde al «no tengo el MCP»' {
    $script:Implement | Should -Match '(?m)^\| "No Playwright MCP: the visual check stays «no probado»"[^\n]*script with the `playwright` package'
  }
}

Describe 'Delegación y gama media' {
  It 'la primera pregunta ofrece la variante de gama media con las tasks previstas' {
    $propose = Get-Content (Join-Path $script:RepoRoot 'skills/sdd-propose/SKILL.md') -Raw
    $step = [regex]::Match($propose, "(?ms)^2\. .*?(?=^\d+\. |^## )").Value
    Assert-Literal $step @('«apruebo la spec por delegación, nos vemos en la validación, y paras antes de la Task 1 para que baje la sesión a gama media»', '(«prevé 3 tasks»)', "With a single task foreseen, don't offer it", 'stop before Task 1 whatever the method')
  }
}
