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

Describe 'el cierre de feature en campo' {
  BeforeAll {
    $script:EndFeature = Get-KitFile 'skills/sdd-end-feature/SKILL.md'
  }

  It 'el paso 0 acepta la validación en campo' {
    Get-Step $script:EndFeature 0 | Should -Match 'validation\.mode: field'
  }

  It 'el walkthrough registra la línea de campo' {
    Get-Step $script:EndFeature 1 | Should -Match 'Validación en campo:'
  }

  It 'el roadmap marca ✅ en campo' {
    Get-Step $script:EndFeature 8 | Should -Match 'validación en campo'
  }
}

Describe 'el cierre de patch en campo' {
  BeforeAll {
    $script:EndPatch = Get-KitFile 'skills/sdd-end-patch/SKILL.md'
  }

  It 'el paso 0 del patch nombra el modo de campo' {
    $step = Get-Step $script:EndPatch 0
    $step | Should -Match 'validation\.mode: field'
    $step | Should -Match 'Validación en campo:'
  }

  It 'la red flag admite la línea de campo' {
    $redFlag = ($script:EndPatch -split "`n") | Where-Object { $_ -match '^- Vas a fusionar sin la línea' }
    $redFlag | Should -Match 'Validación en campo:'
  }
}