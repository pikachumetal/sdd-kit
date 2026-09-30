BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-Step([string]$Skill, [int]$Step) {
    return [regex]::Match($Skill, "(?ms)^$Step\. (⛔ )?\*\*.*?(?=^$($Step + 1)\. (⛔ )?\*\*|^## )").Value
  }

  function Get-Section([string]$Markdown, [string]$Heading) {
    return [regex]::Match($Markdown, "(?ms)^## $Heading\r?\n(.*?)(?=^## |\z)").Groups[1].Value
  }
}

Describe 'la validación en campo en control-profiles y en el paso 7' {
  BeforeAll {
    $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
    $script:StartFeature = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
  }

  It 'la tabla de gates nombra el modo de campo' {
    $row = ($script:Profiles -split "`n") | Where-Object { $_ -match '^\| Validación \(cierre' }
    $row | Should -Match 'validation\.mode: field'
  }

  It 'control-profiles tiene la sección de campo con su línea' {
    $script:Profiles | Should -Match '(?m)^## Validación en campo'
    Get-Section $script:Profiles 'Validación en campo' | Should -Match 'Validación en campo: <fecha>'
  }

  It 'la clave está en la tabla de claves' {
    Get-Section $script:Profiles 'Claves de sdd-kit.json' | Should -Match '\| `validation\.mode` \|'
  }

  It 'el paso 7 nombra el modo de campo' {
    Get-Step $script:StartFeature 7 | Should -Match 'validation\.mode: field'
  }

  It 'las plantillas admiten la línea de campo' {
    Get-KitFile 'skills/sdd-templates/templates/walkthrough-template.md' | Should -Match 'Validación en campo:'
    Get-KitFile 'skills/sdd-templates/templates/patch-template.md' | Should -Match 'Validación en campo:'
  }
}
