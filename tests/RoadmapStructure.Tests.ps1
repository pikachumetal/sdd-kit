BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:Roadmap = Join-Path $script:KitRoot '.docs/sdd/roadmap.md'
  $script:Cli = Join-Path $script:KitRoot 'cli/bin/sdd.js'
  $script:Tables = Join-Path $script:KitRoot 'cli/src/roadmap/tables.ts'
}

Describe 'Estructura del roadmap' {
  It 'el roadmap del repo tiene la forma de la plantilla' {
    $previousEncoding = [Console]::OutputEncoding
    [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
    try { $output = & node $script:Cli roadmap check --path (Join-Path $script:KitRoot '.docs/sdd') }
    finally { [Console]::OutputEncoding = $previousEncoding }
    # Los avisos de destino y de cierre no son fallos: normalizar las filas del repo es deuda del lienzo 0131.
    $output | Where-Object { $_ -notmatch '^roadmap\.md: aviso: ' } | Should -Be @('Roadmap válido') -Because 'el roadmap solo lleva las secciones y las tablas de roadmap-template.md'
    $LASTEXITCODE | Should -Be 0
  }

  It 'la cabecera de release del validador es la de roadmap-template.md' {
    $template = Join-Path $script:KitRoot 'skills/sdd-templates/templates/roadmap-template.md'
    $expected = (Get-Content -LiteralPath $template -Encoding utf8 | Where-Object { $_ -match '^> \| id \|' }) -replace '^> '
    $expected | Should -Not -BeNullOrEmpty
    (Get-Content -LiteralPath $script:Tables -Raw -Encoding utf8).Contains("'$expected'") | Should -BeTrue
  }
}
