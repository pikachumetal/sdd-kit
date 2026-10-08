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
  It 'existe <_>-template.md' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog', 'PRODUCT', 'operations', 'adr') {
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

  It '<_>-template.md no nombra proyectos reales' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog', 'PRODUCT', 'operations', 'adr') {
    Get-TemplateContent $_ | Should -Not -Match '(?i)alybo|sifacademy|sifrest|\bmdt\b|quartz|legalrep|medysif|statusline|salas'
  }
}

Describe 'Plantillas de documentos de la 3.0.0' {
  BeforeAll {
    function Get-Headings([string]$Content, [string]$Level) {
      return [regex]::Matches($Content, "(?m)^$Level (.+?)\s*$") | ForEach-Object { $_.Groups[1].Value }
    }

    function Get-Section([string]$Content, [string]$Heading) {
      $match = [regex]::Match($Content, '(?ms)^' + [regex]::Escape($Heading) + '\s*$(.*?)(?=^## |\z)')
      return $match.Groups[1].Value
    }

    function Get-BoldFields([string]$Section) {
      return [regex]::Matches($Section, '(?m)^- \*\*([^*]+)\*\*:') | ForEach-Object { $_.Groups[1].Value }
    }
  }

  It 'PRODUCT-template.md tiene Users, Product Purpose, Capabilities and Constraints y Terminology en orden y sin impeccable:product-schema' {
    $content = Get-TemplateContent 'PRODUCT'
    Get-Headings $content '##' | Should -Be @('Users', 'Product Purpose', 'Capabilities and Constraints', 'Terminology')
    $content | Should -Not -Match 'impeccable:product-schema'
  }

  It 'Terminology muestra **<Término>**: y _Evitar_:' {
    $terminology = Get-Section (Get-TemplateContent 'PRODUCT') '## Terminology'
    $terminology | Should -Match '(?m)^\*\*<Término>\*\*:'
    $terminology | Should -Match '(?m)^_Evitar_:'
  }

  It 'operations-template.md tiene Comandos, Testing, Frontend y Entornos, sin versiones ni Decisiones abiertas' {
    $content = Get-TemplateContent 'operations'
    Get-Headings $content '##' | Should -Be @('Comandos', 'Testing', 'Frontend', 'Entornos')
    $content | Should -Not -Match '\| Versión \|'
    $content | Should -Not -Match 'Decisiones abiertas'
  }

  It '§Testing pide <_>' -ForEach @('comando', 'duración', 'lo afectado', 'gate de cierre', 'gate de merge', 'cómo entra el agente', 'motor de producción') {
    Get-Section (Get-TemplateContent 'operations') '## Testing' | Should -Match ([regex]::Escape($_))
  }

  It '§Frontend de operations tiene los campos de tech-stack' {
    $expected = Get-BoldFields (Get-Section (Get-TemplateContent 'tech-stack') '## Frontend')
    $expected.Count | Should -BeGreaterThan 0
    Get-BoldFields (Get-Section (Get-TemplateContent 'operations') '## Frontend') | Should -Be $expected
  }

  It 'el índice de sdd-templates da el destino <Destination> a <Template>' -ForEach @(
    @{ Template = 'PRODUCT-template.md'; Destination = '`PRODUCT.md` en la raíz' }
    @{ Template = 'constitution-template.md'; Destination = '`.docs/sdd/steering/constitution.md`' }
    @{ Template = 'operations-template.md'; Destination = '`.docs/sdd/steering/operations.md`' }
    @{ Template = 'architecture-template.md'; Destination = '`.docs/sdd/steering/architecture.md`' }
    @{ Template = 'estimation-template.md'; Destination = '`.docs/sdd/steering/estimation.md`' }
    @{ Template = 'roadmap-template.md'; Destination = '`ROADMAP.md` en la raíz' }
    @{ Template = 'changelog-template.md'; Destination = '`CHANGELOG.md` en la raíz' }
    @{ Template = 'adr-template.md'; Destination = '`.docs/sdd/decisions/' }
  ) {
    $row = (Get-KitFileContent 'skills/sdd-templates/SKILL.md') -split "`n" | Where-Object { $_ -match "\[$([regex]::Escape($Template))\]" }
    $row | Should -Not -BeNullOrEmpty
    $row | Should -Match ([regex]::Escape($Destination))
  }

  It 'el índice marca 2.x <Template> con la feature que la retira' -ForEach @(
    @{ Template = 'mission-template.md'; Feature = '0156' }
    @{ Template = 'tech-stack-template.md'; Feature = '0156' }
    @{ Template = 'environments-template.md'; Feature = '0156' }
    @{ Template = 'client-changelog-template.md'; Feature = '0150' }
  ) {
    $row = (Get-KitFileContent 'skills/sdd-templates/SKILL.md') -split "`n" | Where-Object { $_ -match "\[$([regex]::Escape($Template))\]" }
    $row | Should -Match ([regex]::Escape("2.x: la retira la $Feature"))
  }
}

Describe 'Consumidores de las plantillas de anclaje' {
  It 'el cierre calca el destino que falta desde su plantilla' {
    Get-KitFileContent 'skills/sdd-end-feature/references/aprendizajes-skills.md' | Should -Match '(?s)destino no existe.*calcando su plantilla'
  }

  It 'el cierre dice en el informe que el destino no existía' {
    Get-KitFileContent 'skills/sdd-end-feature/references/aprendizajes-skills.md' | Should -Match 'informe final del cierre'
  }

  It 'la regla del destino que falta está en el checklist, no solo en references' {
    Get-KitFileContent 'skills/sdd-end-feature/SKILL.md' | Should -Match '(?s)Si el destino no existe.*calcando su plantilla'
  }

  It 'nombrado.md dice de dónde sale la forma de architecture.md' {
    Get-KitFileContent 'skills/sdd-start-feature/references/nombrado.md' | Should -Match 'architecture-template\.md'
  }

  It 'greenfield calca <_>-template.md' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog') {
    Get-KitFileContent 'skills/sdd-init-greenfield/references/estructura.md' | Should -Match ([regex]::Escape("$_-template.md"))
  }

  It 'brownfield calca <_>-template.md' -ForEach @('mission', 'constitution', 'tech-stack', 'architecture', 'roadmap', 'estimation', 'changelog') {
    Get-KitFileContent 'skills/sdd-init-brownfield/references/generacion.md' | Should -Match ([regex]::Escape("$_-template.md"))
  }
}
