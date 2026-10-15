BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw -Encoding utf8
  }

  function Get-Section([string]$Text, [string]$Pattern) {
    return [regex]::Match($Text, $Pattern).Value
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    foreach ($literal in $Literals) { $Text.Contains($literal) | Should -BeTrue -Because "falta «$literal»" }
  }
}

Describe 'Plantillas del cierre' {
  It 'tasks.md tiene la sección de rulings que pega sdd-implement' {
    Assert-Literal (Get-KitFile 'skills/sdd-templates/templates/tasks-template.md') @('## Rulings', 'sdd ledger rulings', '_Ninguno_')
  }

  It 'el tiempo del patch marca post hoc, pega el esfuerzo real medido y tiene el coste de sujetos' {
    $section = Get-Section (Get-KitFile 'skills/sdd-templates/templates/patch-template.md') '(?s)## 5\. .*?(?=\n## 6\. )'
    Assert-Literal $section @('(post hoc)', '- Esfuerzo real:', 'sdd session tokens', '- Coste de sujetos:')
  }

  It 'el método dice desde dónde cuenta el real, que las esperas van aparte y qué es post hoc' {
    Assert-Literal (Get-KitFile 'skills/sdd-templates/templates/estimation-template.md') @('arranque de la sesión', 'espera', 'post hoc')
  }
}
