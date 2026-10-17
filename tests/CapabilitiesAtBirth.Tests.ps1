BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:RepoRoot $RelativePath)
  }

  function Get-NumberedStep([string]$Content, [int]$Number) {
    return [regex]::Match($Content, "(?ms)^$Number\. .*?(?=^\d+\. |^## |\z)").Value
  }

  $script:Tree = Get-KitFile 'skills/sdd-init/references/structure.md'
  $script:Init = Get-KitFile 'skills/sdd-init/SKILL.md'
  $script:DocumentsStep = [regex]::Match($script:Init, '(?ms)^4\. \*\*Documents.*?(?=^\d+\. |^## |\z)').Value
}

Describe 'Carpetas que no nacen vacías' {
  It 'el árbol de sdd-init no crea <_> vacía' -ForEach @('capabilities/', 'decisions/', 'changes/') {
    $folder = $_
    $line = ($script:Tree -split "`r?`n") | Where-Object { $_ -match [regex]::Escape("── $folder") }
    $line | Should -Match 'not created'
  }

  It 'sdd-init prohíbe el .gitkeep, en el árbol y en el paso de documentos' {
    $script:Tree | Should -Match 'or with `\.gitkeep`'
    $script:DocumentsStep | Should -Match '`capabilities/`, `changes/` and `decisions/` are not created'
    $script:DocumentsStep | Should -Match 'or with `\.gitkeep`'
  }
}

Describe 'Volcado inicial de capacidades' {
  BeforeAll {
    $script:InitLine = '- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código'
    $script:ClosingStep = Get-NumberedStep $script:Init 8
    $script:CapabilityTemplate = Get-KitFile 'skills/sdd-templates/templates/capability-template.md'
  }

  It 'el cierre vuelca solo a petición del usuario, en los dos modos' {
    $script:ClosingStep | Should -Match 'only if the user asks for it'
    $script:ClosingStep | Should -Match 'never offer it'
    $script:ClosingStep | Should -Match 'in both modes'
  }

  It 'el cierre exige leer el código entero o no volcar' {
    $script:ClosingStep | Should -Match 'read the whole code'
  }

  It 'la partición se aprueba antes de escribir ningún fichero' {
    $script:ClosingStep | Should -Match 'before writing any file, propose the partition'
  }

  It 'cada capacidad pasa el gate de los documentos de anclaje' {
    $script:ClosingStep | Should -Match 'same gate as the anchor documents'
  }

  It 'ni el volcado ni la plantilla llevan línea de historial' {
    $script:ClosingStep.Contains($script:InitLine) | Should -BeFalse
    $script:ClosingStep | Should -Not -Match 'Historial'
    $script:CapabilityTemplate.Contains($script:InitLine) | Should -BeFalse
  }

  It 'la regla 4 de la plantilla dice que las init no vuelcan, salvo el volcado de sdd-init' {
    $rule = ($script:CapabilityTemplate -split "`r?`n" | Where-Object { $_ -match '^> 4\. ' })
    $rule | Should -Match 'Las init no vuelcan'
    $script:CapabilityTemplate | Should -Match 'Única excepción: el volcado inicial de `sdd-init`'
  }

  It 'sdd-init tiene una red flag contra el volcado no pedido o sin partición' {
    $redFlags = [regex]::Match($script:Init, '(?s)## Red flags.*?\|').Value
    $redFlags | Should -Match 'dumping capabilities the user didn''t ask for'
  }
}

Describe 'Funcional aportado' {
  It 'el paso de documentos lo guarda literal en sources/, con su nombre o uno fijo, y sin editar' {
    $script:DocumentsStep | Should -Match '`\.docs/sdd/sources/`'
    $script:DocumentsStep | Should -Match 'original name'
    $script:DocumentsStep | Should -Match '<yyyyMMdd>-functional-brief\.md'
    $script:DocumentsStep | Should -Match 'never edited'
  }

  It 'PRODUCT.md lo enlaza y el roadmap cita su sección' {
    $script:DocumentsStep | Should -Match '`PRODUCT\.md` links it'
    $script:DocumentsStep | Should -Match 'sources/<file> §<n>'
  }

  It 'ninguna capacidad nace del funcional' {
    $script:DocumentsStep | Should -Match 'No capability is born from it'
  }

  It 'el árbol lleva sources/ como opcional' {
    ($script:Tree -split "`r?`n" | Where-Object { $_ -match '── sources/' }) | Should -Match 'optional'
  }
}
