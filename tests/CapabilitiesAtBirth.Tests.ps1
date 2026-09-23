BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:RepoRoot $RelativePath)
  }

  function Get-NumberedStep([string]$Content, [int]$Number) {
    return [regex]::Match($Content, "(?ms)^$Number\. .*?(?=^\d+\. |^## |\z)").Value
  }

  $script:Tree = Get-KitFile 'skills/sdd-init-greenfield/references/estructura.md'
  $script:BrownfieldStructure = Get-NumberedStep (Get-KitFile 'skills/sdd-init-brownfield/references/generacion.md') 5
  $script:BrownfieldSkillStep = Get-NumberedStep (Get-KitFile 'skills/sdd-init-brownfield/SKILL.md') 5
}

Describe 'Carpetas que no nacen vacías' {
  It 'el árbol de greenfield no crea <_> vacía' -ForEach @('capabilities/', 'specs/') {
    $folder = $_
    $line = ($script:Tree -split "`r?`n") | Where-Object { $_ -match [regex]::Escape("── $folder") }
    $line | Should -Match 'no se crea'
  }

  It 'greenfield prohíbe el .gitkeep' {
    $script:Tree | Should -Match 'ni con `\.gitkeep`'
  }

  It 'brownfield no crea capabilities/ ni specs/ y prohíbe el .gitkeep' {
    $script:BrownfieldStructure | Should -Match '`capabilities/` y `specs/` no se crean'
    $script:BrownfieldStructure | Should -Match 'ni con `\.gitkeep`'
  }

  It 'brownfield no vuelca aunque el usuario lo pida, en generacion.md y en el SKILL.md' {
    $script:BrownfieldStructure | Should -Match 'aunque el usuario lo pida'
    $script:BrownfieldSkillStep | Should -Match 'aunque el usuario lo pida'
  }

  It 'el paso 5 de generacion.md va en viñetas' {
    @($script:BrownfieldStructure -split "`r?`n" | Where-Object { $_ -match '^   - ' }).Count | Should -BeGreaterOrEqual 6
  }
}
