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

Describe 'Arreglos de la revisión final del patch visual' {
  BeforeAll {
    $script:Door = Get-KitFile 'skills/using-sdd/SKILL.md'
    $script:Routing = Get-Section (Get-KitFile 'skills/sdd-start-feature/SKILL.md') '2. **Enrutado**' '3. **Branch**'
    $script:Patch = Get-KitFile 'skills/sdd-start-patch/SKILL.md'
  }

  It 'el árbol separa el ajuste pedido de un fallo que se arregla en CSS' {
    Get-Section $script:Patch '```dot' '## Flujo' | Should -Match 'no un fallo'
  }

  It 'las puertas dejan mover un elemento que ya lleva binding o evento' {
    $script:Door | Should -Match 'sin cambiar bindings'
    $script:Routing | Should -Match 'sin añadir, quitar ni cambiar bindings'
  }

  It 'using-sdd lleva el predicado entero, con las directivas y las capacidades' {
    foreach ($literal in @('`*ngIf`', '`v-if`', '`@for`', 'capacidades', 'mueve, envuelve o cambia la clase')) {
      $script:Door | Should -Match ([regex]::Escape($literal))
    }
  }

  It 'el paso 4 del patch visual para y pasa a feature, y dice qué pasa con la carpeta y el id' {
    $step = Get-Section $script:Patch '4. **Fix mínimo**' '5. **Commit del fix**'
    $step | Should -Match 'sdd-start-feature'
    $step | Should -Match 'borra la carpeta del patch'
    $step | Should -Match 'id reservado'
  }

  It 'el red flag de fallo no reproducido no para un ajuste visual' {
    $script:Patch | Should -Match 'cuyo fallo no has reproducido \(salvo en un ajuste visual'
  }
}
