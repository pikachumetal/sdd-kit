BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:Roadmap = Join-Path $script:KitRoot '.docs/sdd/roadmap.md'
  $script:Validator = Join-Path $script:KitRoot 'skills/sdd-templates/scripts/Test-Roadmap.ps1'
}

Describe 'Estructura del roadmap' {
  It 'el roadmap del repo no tiene filas sueltas, cabeceras descuadradas ni filas vacías' {
    $output = & $script:Validator -Path (Join-Path $script:KitRoot '.docs/sdd')
    $output | Where-Object { $_ -match 'fila fuera de una tabla|fila vacía|la cabecera tiene|no empieza por' } |
      Should -BeNullOrEmpty -Because 'una fila fuera de su tabla no la encuentra ninguna skill, y Get-NextSddId.ps1 calcula el id sobre esas tablas'
  }

  It 'las tablas de release llevan la cabecera literal de roadmap-template.md' {
    $template = Join-Path $script:KitRoot 'skills/sdd-templates/templates/roadmap-template.md'
    $expected = (Get-Content -LiteralPath $template -Encoding utf8 | Where-Object { $_ -match '^> \| id \|' }) -replace '^> '
    $expected | Should -Not -BeNullOrEmpty
    $headers = Get-Content -LiteralPath $script:Roadmap -Encoding utf8 | Where-Object { $_ -match '^\| id \|' }
    $headers | Should -Not -BeNullOrEmpty
    $headers | Where-Object { $_ -ne $expected } | Should -BeNullOrEmpty
  }
}
