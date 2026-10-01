BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:SkillFile = Join-Path $script:KitRoot 'skills/sdd-feedback/SKILL.md'
  $script:TemplateFile = Join-Path $script:KitRoot 'skills/sdd-templates/templates/kit-feedback-template.md'

  function Get-KitFileContent([string]$Path) {
    if (-not (Test-Path $Path)) { return '' }
    return Get-Content $Path -Raw
  }
}

Describe 'Skill sdd-feedback' {
  It 'existe' {
    Test-Path $script:SkillFile | Should -BeTrue
  }

  It 'manda calcar la plantilla del kit en vez de describir su forma' {
    Get-KitFileContent $script:SkillFile | Should -Match 'kit-feedback-template\.md'
  }

  It 'escribe el ticket en la carpeta acordada' {
    Get-KitFileContent $script:SkillFile | Should -Match '\.docs/sdd/kit-feedback/'
  }
}

Describe 'Plantilla kit-feedback-template.md' {
  It 'existe' {
    Test-Path $script:TemplateFile | Should -BeTrue
  }

  It 'lleva <Section>' -ForEach @(
    @{ Section = 'Ticket mínimo' }
    @{ Section = 'Funcionó' }
    @{ Section = 'iniciativa propia' }
    @{ Section = '## Menores' }
    @{ Section = '**Verificada**' }
  ) {
    Get-KitFileContent $script:TemplateFile | Should -Match ([regex]::Escape($Section))
  }

  It 'ya no lleva la sección de errores del agente' {
    Get-KitFileContent $script:TemplateFile | Should -Not -Match 'Errores míos'
  }
}

Describe 'Reglas de ruido de la skill' {
  It 'la skill lleva la regla de <Rule>' -ForEach @(
    @{ Rule = 'ticket mínimo'; Pattern = 'ticket mínimo' }
    @{ Rule = 'un ticket por feature o patch'; Pattern = 'Un ticket por feature o patch' }
    @{ Rule = 'propuesta verificada'; Pattern = 'sin verificar' }
    @{ Rule = 'coste respaldado'; Pattern = 'sin respaldo' }
    @{ Rule = 'menores'; Pattern = '«Menores»' }
    @{ Rule = 'lint de docs'; Pattern = 'lint de docs' }
    @{ Rule = 'fallo de shell cubierto por el kit'; Pattern = 'que una regla del kit cubre también es hallazgo' }
  ) {
    Get-KitFileContent $script:SkillFile | Should -Match ([regex]::Escape($Pattern))
  }

  It 'la plantilla trata igual que la skill el fallo de shell cubierto por el kit' {
    Get-KitFileContent $script:TemplateFile | Should -Match 'un fallo del shell o del\s+(>\s*)?harness, que una regla del kit pudo evitar es un hallazgo'
  }
}

Describe 'Oferta por feature o patch' {
  It '<_> ofrece el ticket salvo que ya tenga el suyo' -ForEach @('sdd-end-feature', 'sdd-end-patch') {
    $content = Get-KitFileContent (Join-Path $script:KitRoot "skills/$_/SKILL.md")
    $content | Should -Match 'ya tenga el suyo'
    $content | Should -Not -Match 'esta sesión ya haya generado el suyo'
  }
}

Describe 'Oferta en el cierre de cada carril' {
  It 'la ofrece <_>' -ForEach @('sdd-end-feature', 'sdd-end-patch') {
    Get-KitFileContent (Join-Path $script:KitRoot "skills/$_/SKILL.md") | Should -Match 'sdd-feedback'
  }
}
