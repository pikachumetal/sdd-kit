BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-Section([string]$Text, [string]$From, [string]$To) {
    $start = $Text.IndexOf($From)
    if ($start -lt 0) { return '' }
    $end = $Text.IndexOf($To, $start + 1)
    if ($end -lt 0) { $end = $Text.Length }
    return $Text.Substring($start, $end - $start)
  }

  $script:FrontendFields = @('URL', 'Detector', 'Viewports', 'Runner E2E', 'Acceso', 'Temas', 'Pantalla de referencia', 'Skills de apoyo')
  $script:ReferencePath = 'skills/sdd-start-feature/references/frontend-verification.md'
}

Describe 'Contrato de §Frontend' {
  It 'la plantilla de tech-stack lleva §Frontend con sus ocho campos' {
    $section = Get-Section (Get-KitFile 'skills/sdd-templates/templates/tech-stack-template.md') '## Frontend' "`n## "
    $section | Should -Not -BeNullOrEmpty
    foreach ($field in $script:FrontendFields) { $section | Should -Match "\*\*$([regex]::Escape($field))\*\*" }
  }

  It 'la referencia cita cada campo de §Frontend' {
    $reference = Get-KitFile $script:ReferencePath
    foreach ($field in $script:FrontendFields) { $reference | Should -Match "\*\*$([regex]::Escape($field))\*\*" }
  }

  It 'la referencia lleva los literales de la spec' {
    $reference = Get-KitFile $script:ReferencePath
    $literals = @(
      'composición no medida: `tech-stack.md` no declara detector en §Frontend',
      'no probado: falta el acceso en §Frontend',
      'jerarquía, ritmo de espaciado, densidad, alineación',
      '1280x800', '390x844', 'ya estaba antes', 'falso positivo', 'es intencional'
    )
    foreach ($literal in $literals) { $reference | Should -Match ([regex]::Escape($literal)) }
  }
}

Describe 'Puerta de una task full' {
  BeforeAll {
    $script:StartFeature = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
  }

  It 'el paso 6 carga la referencia y conserva la regla de cierre' {
    $step = Get-Section $script:StartFeature '6. **Implementación**' '7. ⛔'
    $step | Should -Match 'references/frontend-verification\.md'
    $step | Should -Match 'sin justificar'
  }

  It 'el paso 7 enseña la salida del detector' {
    $step = Get-Section $script:StartFeature '7. ⛔' '8. **Cierre**'
    $step | Should -Match 'detector'
    $step | Should -Match 'composición no medida'
  }

  It 'el campo del plan pide criterio y referencia' {
    $field = (Get-KitFile 'skills/sdd-templates/templates/plan-template.md') -split "`n" | Where-Object { $_.StartsWith('**Verificación visual**:') }
    $field | Should -Match 'criterio'
    $field | Should -Match 'pantalla de referencia'
  }
}

Describe 'Puertas de lite y del patch' {
  It 'lite carga la referencia y conserva la regla de cierre' {
    $lite = Get-KitFile 'skills/sdd-start-feature/references/modo-lite.md'
    $lite | Should -Match 'frontend-verification\.md'
    $lite | Should -Match 'sin justificar'
  }

  It 'el patch visual carga la referencia con la captura del antes' {
    $step = Get-Section (Get-KitFile 'skills/sdd-start-patch/SKILL.md') '4. **Fix mínimo**' '5. '
    $step | Should -Match '\.\./sdd-start-feature/references/frontend-verification\.md'
    $step | Should -Match 'antes del cambio'
    $step | Should -Match 'sin justificar'
  }

  It 'la validación del patch enseña el detector' {
    Get-Section (Get-KitFile 'skills/sdd-end-patch/SKILL.md') '0. **Validación**' '1. ' | Should -Match 'detector'
  }

  It 'la plantilla del patch tiene la fila del detector' {
    Get-Section (Get-KitFile 'skills/sdd-templates/templates/patch-template.md') '## 4.' '## 5.' | Should -Match 'detector'
  }
}

Describe 'Arranque e init' {
  It 'el paso 4 propone §Frontend si falta' {
    Get-Section (Get-KitFile 'skills/sdd-start-feature/SKILL.md') '4. **Spec**' '5. **Plan**' | Should -Match '§Frontend'
  }

  It 'greenfield pregunta la verificación en la fila 21' {
    Get-KitFile 'skills/sdd-init-greenfield/SKILL.md' | Should -Match '\| 21 \| Solo si el stack de la 11 tiene interfaz'
  }

  It 'brownfield pregunta la verificación en la fila 5' {
    Get-KitFile 'skills/sdd-init-brownfield/SKILL.md' | Should -Match '\| 5 \| Solo si el inventario encontró interfaz web'
  }

  It 'las filas 20 de greenfield y 4 de brownfield no cambian' {
    Get-KitFile 'skills/sdd-init-greenfield/SKILL.md' | Should -Match '\| 20 \| ¿Replica los patrones'
    Get-KitFile 'skills/sdd-init-brownfield/SKILL.md' | Should -Match '\| 4 \| ¿Replica los patrones'
  }

  It 'el README recomienda impeccable y Playwright' {
    $dependencies = Get-Section (Get-KitFile 'README.md') '## Dependencias' "`n## "
    $dependencies | Should -Match 'impeccable'
    $dependencies | Should -Match 'Playwright'
  }
}
