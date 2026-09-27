BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:Roadmap = Join-Path $script:KitRoot '.docs/sdd/roadmap.md'
  # Extracto literal del roadmap de 0fc231e^: dos filas encima de «# Roadmap», una fila pegada en
  # la cabecera de «Próximo» y dos filas vacías en la deuda (ticket 0063 §1, patch 0069 §1a).
  $script:BrokenFixture = Join-Path $PSScriptRoot 'fixtures/roadmap-structure/roadmap-0fc231e-parent.md'

  function Get-CellCount([string]$Line) {
    return @($Line.Trim().Trim('|') -split '(?<!\\)\|').Count
  }

  # Una tabla es un bloque de líneas «|» seguidas: cabecera, separador y filas.
  function Get-RoadmapStructureProblems([string[]]$Lines) {
    $problems = [Collections.Generic.List[string]]::new()
    if ($Lines[0] -notmatch '^# Roadmap\b') { $problems.Add('línea 1: no empieza por «# Roadmap»') }

    $separatorPattern = '^\|(\s*:?-{3,}:?\s*\|)+\s*$'
    $i = 0
    while ($i -lt $Lines.Count) {
      if ($Lines[$i] -notmatch '^\|') { $i++; continue }
      $start = $i
      while ($i -lt $Lines.Count -and $Lines[$i] -match '^\|') { $i++ }
      $block = $start..($i - 1)

      $separator = $block | Where-Object { $Lines[$_] -match $separatorPattern } | Select-Object -First 1
      $header = if ($null -ne $separator -and $separator -gt $start) { $separator - 1 } else { $i }
      foreach ($n in $block) {
        if ($n -lt $header) { $problems.Add("línea $($n + 1): fila fuera de una tabla con cabecera y separador") }
        elseif ($Lines[$n] -match '^\|[\s|]*$') { $problems.Add("línea $($n + 1): fila vacía") }
      }
      if ($header -lt $i -and (Get-CellCount $Lines[$header]) -ne (Get-CellCount $Lines[$separator])) {
        $problems.Add("línea $($header + 1): la cabecera tiene $(Get-CellCount $Lines[$header]) celdas y el separador $(Get-CellCount $Lines[$separator])")
      }
    }
    return $problems
  }
}

Describe 'Estructura del roadmap' {
  It 'el roadmap del repo no tiene filas sueltas, cabeceras descuadradas ni filas vacías' {
    $problems = Get-RoadmapStructureProblems (Get-Content -LiteralPath $script:Roadmap -Encoding utf8)
    $problems | Should -BeNullOrEmpty -Because 'una fila fuera de su tabla no la encuentra ninguna skill, y Get-NextSddId.ps1 calcula el id sobre esas tablas'
  }

  It 'las tablas de release llevan la cabecera literal de roadmap-template.md' {
    # Las skills leen la tabla por sus columnas: la cabecera vieja (Task, Peticiones, Tamaño) hizo
    # que el cierre del patch 0083 escribiera un estado en la columna del tamaño (ticket 0083 §1).
    $template = Join-Path $script:KitRoot 'skills/sdd-templates/templates/roadmap-template.md'
    $expected = (Get-Content -LiteralPath $template -Encoding utf8 | Where-Object { $_ -match '^> \| id \|' }) -replace '^> '
    $expected | Should -Not -BeNullOrEmpty
    $headers = Get-Content -LiteralPath $script:Roadmap -Encoding utf8 | Where-Object { $_ -match '^\| id \|' }
    $headers | Should -Not -BeNullOrEmpty
    $headers | Where-Object { $_ -ne $expected } | Should -BeNullOrEmpty
  }

  It 'detecta los cuatro defectos del roadmap roto de 0fc231e^' {
    $problems = Get-RoadmapStructureProblems (Get-Content -LiteralPath $script:BrokenFixture -Encoding utf8)
    $problems | Should -Be @(
      'línea 1: no empieza por «# Roadmap»'
      'línea 1: fila fuera de una tabla con cabecera y separador'
      'línea 2: fila fuera de una tabla con cabecera y separador'
      'línea 7: fila fuera de una tabla con cabecera y separador'
      'línea 8: la cabecera tiene 1 celdas y el separador 3'
      'línea 21: fila vacía'
      'línea 22: fila vacía'
    )
  }
}
