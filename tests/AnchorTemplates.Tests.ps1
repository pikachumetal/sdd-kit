BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:TemplatesDir = Join-Path $script:KitRoot 'skills/sdd-templates/templates'

  function Get-KitFileContent([string]$RelativePath) {
    $path = Join-Path $script:KitRoot $RelativePath
    if (-not (Test-Path $path)) { return '' }
    return Get-Content $path -Raw
  }

  function Get-TemplateContent([string]$Name) {
    return Get-KitFileContent "skills/sdd-templates/templates/$Name-template.md"
  }
}

Describe 'Plantillas de anclaje' {
  It 'existe <_>-template.md' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog') {
    Test-Path (Join-Path $script:TemplatesDir "$_-template.md") | Should -BeTrue
  }

  It 'el roadmap lleva la sección <_> que leen otras skills' -ForEach @('## Backlog', '## Deuda técnica', '## Patches') {
    Get-TemplateContent 'roadmap' | Should -Match ([regex]::Escape($_))
  }

  It 'el roadmap lleva la cabecera literal de la tabla de patches' {
    Get-TemplateContent 'roadmap' | Should -Match ([regex]::Escape('| Fecha | Id | Descripción |'))
  }

  It 'el changelog lleva la sección [Unreleased]' {
    Get-TemplateContent 'changelog' | Should -Match ([regex]::Escape('## [Unreleased]'))
  }

  It 'la constitution nombra la regla de producto <_>' -ForEach @('Dónde viven los datos', 'Idioma de los nombres', 'Límites', 'Avisos', 'Regla ante conflicto') {
    Get-TemplateContent 'constitution' | Should -Match ([regex]::Escape($_))
  }

  It 'la estimación deja vacía la calibración del proyecto' {
    Get-TemplateContent 'estimation' | Should -Match 'Notas de calibración de este proyecto'
  }

  It '<_>-template.md no nombra proyectos reales' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog') {
    Get-TemplateContent $_ | Should -Not -Match '(?i)alybo|sifacademy|sifrest|\bmdt\b|quartz|legalrep|medysif|statusline|salas'
  }
}

Describe 'Consumidores de las plantillas de anclaje' {
  It 'el cierre calca el destino que falta desde su plantilla' {
    Get-KitFileContent 'skills/sdd-end-task/references/aprendizajes-skills.md' | Should -Match '(?s)destino no existe.*calcando su plantilla'
  }

  It 'el cierre dice en el informe que el destino no existía' {
    Get-KitFileContent 'skills/sdd-end-task/references/aprendizajes-skills.md' | Should -Match 'informe final del cierre'
  }

  It 'la regla del destino que falta está en el checklist, no solo en references' {
    Get-KitFileContent 'skills/sdd-end-task/SKILL.md' | Should -Match '(?s)Si el destino no existe.*calcando su plantilla'
  }

  It 'nombrado.md dice de dónde sale la forma de architecture.md' {
    Get-KitFileContent 'skills/sdd-start-task/references/nombrado.md' | Should -Match 'architecture-template\.md'
  }

  It 'greenfield calca <_>-template.md' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog') {
    Get-KitFileContent 'skills/sdd-init-greenfield/references/estructura.md' | Should -Match ([regex]::Escape("$_-template.md"))
  }

  It 'brownfield calca <_>-template.md' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog') {
    Get-KitFileContent 'skills/sdd-init-brownfield/references/generacion.md' | Should -Match ([regex]::Escape("$_-template.md"))
  }
}
