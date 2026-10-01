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

Describe 'Un ticket por feature o patch' {
  It 'la skill solo amplía el ticket de la misma feature o patch' {
    Get-KitFileContent $script:SkillFile | Should -Match 'Un ticket por feature o patch'
  }

  It 'la skill pasa el lint de docs del proyecto' {
    Get-KitFileContent $script:SkillFile | Should -Match 'lint de docs'
  }

  It '<_> no condiciona la oferta a la sesión' -ForEach @('sdd-end-feature', 'sdd-end-patch') {
    Get-KitFileContent (Join-Path $script:KitRoot "skills/$_/SKILL.md") | Should -Not -Match 'esta sesión ya haya generado el suyo'
  }
}

Describe 'Oferta en el cierre de cada carril' {
  It 'la ofrece <_>' -ForEach @('sdd-end-feature', 'sdd-end-patch') {
    Get-KitFileContent (Join-Path $script:KitRoot "skills/$_/SKILL.md") | Should -Match 'sdd-feedback'
  }
}
