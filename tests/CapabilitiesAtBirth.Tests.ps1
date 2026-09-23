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

Describe 'Volcado inicial en greenfield' {
  BeforeAll {
    $script:InitLine = '- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código'
    $script:Greenfield = Get-KitFile 'skills/sdd-init-greenfield/SKILL.md'
    $script:ClosingStep = Get-NumberedStep $script:Greenfield 6
    $script:CapabilityTemplate = Get-KitFile 'skills/sdd-templates/templates/capability-template.md'
  }

  It 'el cierre de greenfield vuelca solo a petición del usuario' {
    $script:ClosingStep | Should -Match 'solo si el usuario lo pide'
    $script:ClosingStep | Should -Match 'nunca lo ofrezcas'
  }

  It 'el cierre exige leer el código entero o no volcar' {
    $script:ClosingStep | Should -Match 'código entero'
  }

  It 'la partición se aprueba antes de escribir ningún fichero' {
    $script:ClosingStep | Should -Match 'Antes de escribir ningún fichero'
    $script:ClosingStep | Should -Match 'partición'
  }

  It 'cada capacidad pasa el gate de los documentos de anclaje' {
    $script:ClosingStep | Should -Match 'mismo gate que los documentos de anclaje'
  }

  It 'el cierre y la plantilla llevan la línea de historial init' {
    $script:ClosingStep.Contains($script:InitLine) | Should -BeTrue
    $script:CapabilityTemplate.Contains($script:InitLine) | Should -BeTrue
  }

  It 'la regla 4 de la plantilla dice que las init no vuelcan, salvo la excepción de greenfield' {
    $rule = ($script:CapabilityTemplate -split "`r?`n" | Where-Object { $_ -match '^> 4\. ' })
    $rule | Should -Match 'Las init no vuelcan'
    $script:CapabilityTemplate | Should -Match 'Única excepción: el volcado inicial de `sdd-init-greenfield`'
  }

  It 'greenfield tiene una red flag contra el volcado no pedido o sin partición' {
    $redFlags = [regex]::Match($script:Greenfield, '(?s)## Red flags.*?\|').Value
    $redFlags | Should -Match 'volcando capacidades'
  }
}

Describe 'Funcional aportado en greenfield' {
  BeforeAll {
    $script:StructureStep = Get-NumberedStep (Get-KitFile 'skills/sdd-init-greenfield/SKILL.md') 3
  }

  It 'el paso 3 guarda el funcional literal en sources/' {
    $script:StructureStep | Should -Match '`\.docs/sdd/sources/`'
    $script:StructureStep | Should -Match 'nombre original'
    $script:StructureStep | Should -Match 'No se edita nunca'
  }

  It 'el funcional pegado en el chat tiene nombre fijo' {
    $script:StructureStep | Should -Match '<yyyyMMdd>-functional-brief\.md'
  }

  It 'mission lo enlaza y el roadmap cita su sección' {
    $script:StructureStep | Should -Match '`mission\.md` lo enlaza'
    $script:StructureStep | Should -Match 'sources/<fichero> §<n>'
  }

  It 'ninguna capacidad nace del funcional' {
    $script:StructureStep | Should -Match 'Ninguna capacidad nace de él'
  }

  It 'el árbol de greenfield lleva sources/ como opcional' {
    ($script:Tree -split "`r?`n" | Where-Object { $_ -match '── sources/' }) | Should -Match 'opcional'
  }
}
