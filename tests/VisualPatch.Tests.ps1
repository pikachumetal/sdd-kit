BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-Section([string]$Text, [string]$From, [string]$To) {
    $start = $Text.IndexOf($From)
    $end = $Text.IndexOf($To, $start + 1)
    return $Text.Substring($start, $end - $start)
  }

  $script:PredicateLiterals = @('solo plantillas o estilos', '`@if`', 'claves de i18n', 'TypeScript', 'solo toco la plantilla')
}

Describe 'Puertas del patch visual' {
  BeforeAll {
    $script:StartPatch = Get-KitFile 'skills/sdd-start-patch/SKILL.md'
  }

  It 'la puerta de using-sdd lleva el predicado entero' {
    $door = Get-KitFile 'skills/using-sdd/SKILL.md'
    foreach ($literal in $script:PredicateLiterals) { $door | Should -Match ([regex]::Escape($literal)) }
  }

  It 'el paso 2 de sdd-start-feature lleva el predicado entero' {
    $step = Get-Section (Get-KitFile 'skills/sdd-start-feature/SKILL.md') '2. **Enrutado**' '3. **Branch**'
    foreach ($literal in $script:PredicateLiterals) { $step | Should -Match ([regex]::Escape($literal)) }
  }

  It 'el árbol de sdd-start-patch pregunta por la presentación' {
    Get-Section $script:StartPatch '```dot' '## Flujo' | Should -Match '¿Solo presentación'
  }

  It 'la description de sdd-start-patch admite el ajuste visual' {
    ($script:StartPatch -split "`n" | Where-Object { $_ -like 'description:*' }) | Should -Match 'solo de presentación'
  }
}

Describe 'Recorrido y cierre del patch visual' {
  It 'el paso 1 de sdd-start-patch tiene la variante de intención' {
    $step = Get-Section (Get-KitFile 'skills/sdd-start-patch/SKILL.md') '1. **Causa raíz' '2. **Carpeta**'
    $step | Should -Match 'intención en una frase'
    $step | Should -Match 'captura'
  }

  It 'el cierre registra el ajuste visual como Changed' {
    Get-KitFile 'skills/sdd-end-patch/SKILL.md' | Should -Match '`Changed`'
  }

  It 'la plantilla admite la intención en §2' {
    $template = Get-KitFile 'skills/sdd-templates/templates/patch-template.md'
    $template | Should -Match '## 2\. Causa raíz \(o intención, en un ajuste visual\)'
    $template | Should -Match '## 5\. Tiempo'
  }
}
