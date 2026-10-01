BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }

  function Get-KitFile([string]$RelativePath) {
    Get-Content -LiteralPath (Join-Path $script:KitRoot $RelativePath) -Raw
  }

  function Get-Section([string]$Text, [string]$From, [string]$To) {
    $start = $Text.IndexOf($From)
    if ($start -lt 0) { return '' }
    $end = $Text.IndexOf($To, $start + 1)
    if ($end -lt 0) { $end = $Text.Length }
    $Text.Substring($start, $end - $start)
  }

  function Get-TableRow([string]$Text, [string]$Door) {
    ($Text -split '\r?\n') | Where-Object { $_ -match '^\|' -and $_ -match [regex]::Escape($Door) } | Select-Object -First 1
  }

  $script:StartPatch = Get-KitFile 'skills/sdd-start-patch/SKILL.md'
  $script:EndPatch = Get-KitFile 'skills/sdd-end-patch/SKILL.md'
  $script:Template = Get-KitFile 'skills/sdd-templates/templates/patch-template.md'
  $script:Door = Get-KitFile 'skills/using-sdd/SKILL.md'
  $script:StartFeature = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
}

Describe 'criterio: lo decide quién fija la solución' {
  It 'el árbol de sdd-start-patch pregunta quién fija la solución' {
    Get-Section $script:StartPatch '```dot' '## Flujo' | Should -Match 'petición cerrada'
    $script:StartPatch | Should -Match 'solución fijada'
  }

  It 'la guía nombra el contraejemplo de la puerta trasera' {
    $script:StartPatch | Should -Match 'avisa cuando el total pase de 1\.000 €'
  }

  It 'una solución propuesta para un fallo no lo convierte en petición cerrada' {
    $script:StartPatch | Should -Match 'Una solución propuesta para un fallo no lo convierte en petición cerrada'
  }

  It 'la petición cerrada comprueba lo que da por existente antes de abrir' {
    $step = Get-Section $script:StartPatch '1. **' '2. **Carpeta**'
    $step | Should -Match 'da por existente'
  }

  It 'el freno de tamaño va en el paso 4' {
    Get-Section $script:StartPatch '4. **Fix mínimo**' '5. **Commit' | Should -Match 'más de 10 ficheros o más de 300 líneas'
  }

  It 'el tipo fix es solo para un fallo' {
    Get-Section $script:StartPatch '5. **Commit' '6. **Cierre**' | Should -Match '`fix` solo para un fallo'
  }

  It 'la description de sdd-start-patch habla de la solución fijada' {
    ($script:StartPatch -split '\r?\n' | Where-Object { $_ -like 'description:*' }) | Should -Match 'solución'
  }
}

Describe 'criterio: patch.md registra quién decidió' {
  It 'la plantilla lleva solution en el frontmatter con sus tres valores' {
    $script:Template | Should -Match '(?m)^solution: <causa raíz \| ticket \| dev-lead>'
  }

  It 'la plantilla lleva la lista Decisiones con autor en §3' {
    $fix = Get-Section $script:Template '## 3. Fix' '## 4.'
    $fix | Should -Match '\*\*Decisiones\*\*'
    $fix | Should -Match 'ticket \| dev-lead \| sin el dev-lead'
  }

  It 'sdd-start-patch saca del carril una decisión visible sin el dev-lead' {
    Get-Section $script:StartPatch '3. **`patch.md`**' '4. **Fix mínimo**' | Should -Match 'sin el dev-lead'
  }

  It 'la escalada de sdd-end-patch cuenta decisiones sin el dev-lead, no módulos' {
    $clause = Get-Section $script:EndPatch '**Cláusula de escalada**' '## Checklist'
    $clause | Should -Match 'sin el dev-lead'
    $clause | Should -Not -Match 'varios módulos'
  }

  It 'el mensaje final de sdd-end-patch lee la lista Decisiones' {
    Get-Section $script:EndPatch '8. **Mensaje final**' '## Red flags' | Should -Match 'lista `Decisiones`'
  }

  It 'el changelog de una petición cerrada va en Added o Changed' {
    Get-Section $script:EndPatch '3. **Changelog**' '4. **`roadmap.md`**' | Should -Match 'petición cerrada'
    Get-Section $script:EndPatch '3. **Changelog**' '4. **`roadmap.md`**' | Should -Match '`Added`'
  }
}

Describe 'criterio: las puertas dicen lo mismo' {
  It 'using-sdd manda a patch un cambio con la solución ya fijada' {
    Get-TableRow $script:Door 'sdd-kit:sdd-start-patch' | Should -Match 'solución ya fijada'
  }

  It 'using-sdd manda a feature lo que hay que decidir' {
    Get-TableRow $script:Door 'sdd-kit:sdd-start-feature' | Should -Match 'decidir cómo es'
  }

  It 'el paso 2 de sdd-start-feature nombra la petición cerrada' {
    Get-Section $script:StartFeature '2. **Enrutado**' '3. **Branch**' | Should -Match 'petición cerrada'
  }

  It 'una lectura propia de lo que dijo el dev-lead es sin el dev-lead' {
    $script:StartPatch | Should -Match 'tu lectura de lo que dijo el dev-lead es tuya'
  }

  It 'el predicado visual va en sdd-start-patch y en la puerta, no en el paso 2 de sdd-start-feature' {
    Get-TableRow $script:Door 'sdd-kit:sdd-start-patch' | Should -Match 'claves de i18n'
    Get-Section $script:StartFeature '2. **Enrutado**' '3. **Branch**' | Should -Not -Match 'claves de i18n'
    $script:StartPatch | Should -Match 'claves de i18n'
  }
}

Describe 'retirada en el patch visual' {
  It 'el predicado admite la retirada y lo que queda muerto' {
    $predicate = Get-Section $script:StartPatch '**Predicado del ajuste solo de presentación**' '## Flujo'
    $predicate | Should -Match 'retirada'
    $predicate | Should -Match 'lo que queda muerto'
  }

  It 'la retirada solo quita lo que nadie más usa' {
    $script:StartPatch | Should -Match 'la retirada solo quita lo que nadie más usa'
  }

  It 'una retirada no añade nada, con su contraejemplo' {
    $script:StartPatch | Should -Match 'una retirada no añade nada'
    $script:StartPatch | Should -Match 'Quita Borrar y añade Archivar'
  }

  It 'el paso 4 verifica cada símbolo retirado' {
    Get-Section $script:StartPatch '4. **Fix mínimo**' '5. **Commit' | Should -Match 'sin otros usos'
  }

  It 'la plantilla lista lo retirado y lo que el usuario deja de poder hacer' {
    $fix = Get-Section (Get-KitFile 'skills/sdd-templates/templates/patch-template.md') '## 3. Fix' '## 4.'
    $fix | Should -Match '\*\*Retirado\*\*'
    $fix | Should -Match 'Lo que el usuario deja de poder hacer'
  }

  It 'el cierre registra la retirada como Removed' {
    Get-Section $script:EndPatch '3. **Changelog**' '4. **`roadmap.md`**' | Should -Match '`Removed`'
  }
}

Describe 'lite con migración de datos y deuda parcial' {
  It 'lite solo se descarta por un cambio de schema' {
    $lite = Get-KitFile 'skills/sdd-start-feature/references/modo-lite.md'
    $lite | Should -Match 'No cambia el schema de datos'
    $lite | Should -Not -Match 'ni exige migración'
  }

  It 'una migración solo de datos, idempotente y reversible, no descarta lite y se nombra' {
    $lite = Get-KitFile 'skills/sdd-start-feature/references/modo-lite.md'
    $lite | Should -Match 'solo de datos, idempotente y reversible'
    $lite | Should -Match 'la spec la nombra'
  }

  It 'el paso 4 de sdd-end-patch nombra el formato parcial' {
    $step = Get-Section (Get-KitFile 'skills/sdd-end-patch/SKILL.md') '4. **`roadmap.md`**' '5. **estimation-log**'
    $step | Should -Match 'parcial —'
    $step | Should -Match 'queda:'
  }
}

Describe 'pasada de fix de la revisión final' {
  It 'el paso 3 solo deja preguntar cerrado si las opciones ya están escritas' {
    Get-Section $script:StartPatch '3. **`patch.md`**' '4. **Fix mínimo**' | Should -Match 'si el ticket o la fila ya escriben las opciones'
  }

  It 'el paso 1 dice la misma salida que el paso 3' {
    Get-Section $script:StartPatch '1. **' '2. **Carpeta**' | Should -Match 'opciones ya escritas'
  }

  It 'el paso 4 solo saca a feature un ajuste visual que no es retirada' {
    Get-Section $script:StartPatch '4. **Fix mínimo**' '5. **Commit' | Should -Match 'En un ajuste visual que no es retirada, si el cambio necesita'
  }

  It 'la guía de uso da la condición de lite nueva' {
    $guide = Get-KitFile '.docs/workflow/usage-guide.md'
    $guide | Should -Not -Match 'ni exige migración'
    $guide | Should -Match 'migración solo de datos'
  }
}
Describe 'pasada de fix: control c2' {
  It 'dar a elegir opciones que escribe el agente no fija la solución' {
    $script:StartPatch | Should -Match 'escribir tú las opciones es diseñar la solución'
  }
}