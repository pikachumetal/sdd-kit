BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-SkillStep([string]$Skill, [int]$Step) {
    $text = Get-KitFile "skills/$Skill/SKILL.md"
    $pattern = "(?ms)^$Step\. \*\*.*?(?=^\d+\. \*\*|^## )"
    return [regex]::Match($text, $pattern).Value
  }

  function Get-TemplateLine([string]$Template, [string]$Label) {
    $text = Get-KitFile "skills/sdd-templates/templates/$Template"
    return [regex]::Match($text, "(?m)^.*$([regex]::Escape($Label)).*$").Value
  }
}

Describe 'Modelo de la sesión que ejecuta en Native' {
  It 'el gate de la spec en delegate ofrece parar tras el plan para bajar la sesión' {
    Get-SkillStep 'sdd-start-feature' 4 | Should -Match ([regex]::Escape('«Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media»'))
  }

  It 'el gate del plan en pair ofrece parar antes de la Task 1 para bajar la sesión' {
    Get-SkillStep 'sdd-start-feature' 5 | Should -Match ([regex]::Escape('«Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media»'))
  }

  It 'la línea Ejecución del plan registra el modelo recomendado para la sesión' {
    Get-TemplateLine 'plan-template.md' '**Ejecución**' | Should -Match ([regex]::Escape('La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.'))
  }

  It 'la línea Modelo del hilo del walkthrough pide modelo y effort de cada fase' {
    $line = Get-TemplateLine 'walkthrough-template.md' '- Modelo del hilo:'
    $line | Should -Match ([regex]::Escape('Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución)'))
    $line | Should -Match 'effort no registrado'
  }

  It 'el Art. IV recomienda gama media para la sesión de Native' {
    $constitution = Get-KitFile '.docs/sdd/constitution.md'
    $constitution | Should -Match 'La sesión que ejecuta en Native es el implementador'
    $constitution | Should -Match 'Bajar solo el effort de Opus no es gama media'
  }
}
