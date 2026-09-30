BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:Roadmap = Join-Path $script:KitRoot '.docs/sdd/roadmap.md'
  $script:Validator = Join-Path $script:KitRoot 'skills/sdd-templates/scripts/Test-Roadmap.ps1'
}

Describe 'Estructura del roadmap' {
  It 'el roadmap del repo tiene la forma de la plantilla' {
    $output = & $script:Validator -Path (Join-Path $script:KitRoot '.docs/sdd')
    $output | Should -Be @('Roadmap válido') -Because 'el roadmap solo lleva las secciones y las tablas de roadmap-template.md'
    $LASTEXITCODE | Should -Be 0
  }

  It 'la cabecera de release del validador es la de roadmap-template.md' {
    $template = Join-Path $script:KitRoot 'skills/sdd-templates/templates/roadmap-template.md'
    $expected = (Get-Content -LiteralPath $template -Encoding utf8 | Where-Object { $_ -match '^> \| id \|' }) -replace '^> '
    $expected | Should -Not -BeNullOrEmpty
    (Get-Content -LiteralPath $script:Validator -Raw -Encoding utf8).Contains("'$expected'") | Should -BeTrue
  }
}
