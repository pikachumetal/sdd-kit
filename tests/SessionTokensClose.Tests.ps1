BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw -Encoding utf8
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    foreach ($literal in $Literals) { $Text.Contains($literal) | Should -BeTrue -Because "falta «$literal»" }
  }
}

Describe 'El cierre mide la sesión' {
  It 'el paso de tiempo real de sdd-end-task ejecuta el script con la rama de la task' {
    $step = [regex]::Match((Get-KitFile 'skills/sdd-end-task/SKILL.md'), '(?s)2\. \*\*Tiempo real\*\*.*?(?=\n3\. )').Value
    Assert-Literal $step @('scripts/Measure-SessionTokens.ps1', '-Branch', 'Base directory', 'no medido')
  }

  It 'la plantilla del walkthrough lleva el coste de la sesión y dice de dónde salen las cifras' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-templates/templates/walkthrough-template.md'), '(?s)## 2\. .*?(?=\n## 3\. )').Value
    Assert-Literal $section @('- Coste de la sesión:', 'Measure-SessionTokens.ps1', 'sin precio', 'no medido')
    $section | Should -Not -Match 'no tiene contador expuesto'
  }
}
