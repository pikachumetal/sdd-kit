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

  $script:PredicateLiterals = @('only touches templates or styles', '`@if`', 'i18n keys', 'TypeScript', 'I only touch the template')
}

Describe 'Puertas del patch visual' {
  BeforeAll {
    $script:StartPatch = Get-KitFile 'skills/sdd-start-patch/SKILL.md'
    $script:Propose = Get-KitFile 'skills/sdd-propose/SKILL.md'
  }

  It 'sdd-propose lleva el predicado entero' {
    foreach ($literal in $script:PredicateLiterals) { $script:Propose | Should -Match ([regex]::Escape($literal)) }
  }

  It 'la puerta de using-sdd manda el ajuste de presentación a sdd-propose, que tiene el predicado' {
    $door = Get-KitFile 'skills/using-sdd/SKILL.md'
    $door | Should -Match 'un ajuste o una retirada de presentación'
    $door | Should -Not -Match 'claves de i18n'
  }

  It 'el paso 2 de sdd-propose remite al predicado' {
    Get-Section $script:Propose '2. **Classify**' '3. **Branch**' | Should -Match 'Is it really a patch\?'
  }

  It 'el árbol de sdd-propose pregunta por la presentación' {
    Get-Section $script:Propose '```dot' '## Red flags' | Should -Match 'Presentation only or removal'
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
    $template | Should -Match '## 2\. Causa raíz \(o intención, en un ajuste visual;'
    $template | Should -Match '## 5\. Tiempo'
  }
}

Describe 'Arreglos de la revisión final del patch visual' {
  BeforeAll {
    $script:Door = Get-KitFile 'skills/using-sdd/SKILL.md'
    $script:Propose = Get-KitFile 'skills/sdd-propose/SKILL.md'
    $script:Routing = Get-Section $script:Propose '2. **Classify**' '3. **Branch**'
    $script:Patch = Get-KitFile 'skills/sdd-start-patch/SKILL.md'
  }

  It 'el árbol separa el ajuste pedido de un fallo que se arregla en CSS' {
    Get-Section $script:Propose '```dot' '## Red flags' | Should -Match 'not a failure'
  }

  It 'el predicado deja mover un elemento que ya lleva binding o evento' {
    $script:Propose | Should -Match 'without adding, removing or changing bindings'
  }

  It 'sdd-propose lleva el predicado entero, con las directivas y las capacidades' {
    foreach ($literal in @('`*ngIf`', '`v-if`', '`@for`', 'capabilities', 'moves, wraps or changes the class')) {
      $script:Propose | Should -Match ([regex]::Escape($literal))
    }
  }

  It 'el paso 4 del patch visual para y pasa a feature, y dice qué pasa con la carpeta y el id' {
    $step = Get-Section $script:Patch '4. **Fix mínimo**' '5. **Commit del fix**'
    $step | Should -Match 'sdd-propose'
    $step | Should -Match 'borra la carpeta del patch'
    $step | Should -Match 'id reservado'
  }

  It 'el red flag de fallo no reproducido no para un ajuste visual' {
    $script:Patch | Should -Match 'cuyo fallo no has reproducido \(salvo en un ajuste visual'
  }
}
