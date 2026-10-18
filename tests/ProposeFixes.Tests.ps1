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

  $script:SpecTemplate = Get-KitFile 'skills/sdd-templates/templates/spec-template.md'
  $script:Propose = Get-KitFile 'skills/sdd-propose/SKILL.md'
  $script:Parallel = Get-KitFile 'skills/sdd-parallel-agents/SKILL.md'
  $script:PlanTemplate = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
  $script:PlanWriting = Get-KitFile 'skills/sdd-propose/references/plan-writing.md'
}

Describe 'secciones en llano' {
  It 'cada sección abre con lo que cambia para quien usa el producto' {
    $sections = Get-Section (Get-KitFile 'skills/sdd-propose/references/spec-writing.md') '## Design by sections' '## Starting right away'
    $sections | Should -Match 'for whoever uses the product'
    $sections | Should -Match 'example with data'
  }

  It 'trae el contraejemplo con nombres de código' {
    $sections = Get-Section (Get-KitFile 'skills/sdd-propose/references/spec-writing.md') '## Design by sections' '## Starting right away'
    $sections | Should -Match 'not «'
  }
}

Describe 'patch con su test' {
  It 'ProposeFixes: el patch nombra su test' {
    $patch = Get-Section $script:Propose '- **patch**' '- **lite**'
    $patch | Should -Match 'names the test'
    $patch | Should -Match 'two or more'
  }

  It 'un ajuste o una retirada nombra la captura del estado actual' {
    $patch = Get-Section $script:Propose '- **patch**' '- **lite**'
    $patch | Should -Match 'screenshot of the current state'
  }

  It 'Fixed solution trae el contraejemplo de tres comportamientos nuevos' {
    $fixed = Get-Section $script:Propose '**Fixed solution**' '**Presentation-only'
    $fixed | Should -Match 'reservas <sala>'
    $fixed | Should -Match 'lite'
  }
}

Describe 'plan-template' {
  It 'el self-review lleva una línea por cláusula y la salida sin observar' {
    $selfReview = Get-Section $script:PlanTemplate '## 4. Self-review' '@@none@@'
    $selfReview | Should -Match '<THEN o AND de la spec> → Task <n>'
    $selfReview | Should -Match 'sin observar'
  }

  It 'el self-review lleva las filas de la tabla «regla retirada»' {
    $selfReview = Get-Section $script:PlanTemplate '## 4. Self-review' '@@none@@'
    $selfReview | Should -Match 'regla retirada'
  }

  It 'la Verificación pide la línea de resumen literal, sin color' {
    $line = ($script:PlanTemplate -split '\r?\n') | Where-Object { $_ -match '^\*\*Verificación\*\*:' }
    $line | Should -Match 'línea de resumen que imprime, literal'
    $line | Should -Match 'ℹ fail 0'
    $line | Should -Match 'NO_COLOR'
  }

  It 'ProposeFixes: la verificación admite smoke manual' {
    $line = ($script:PlanTemplate -split '\r?\n') | Where-Object { $_ -match '^\*\*Verificación\*\*:' }
    $line | Should -Match 'smoke manual'
  }

  It 'plan-writing cubre cada cláusula en el self-review' {
    $script:PlanWriting | Should -Match 'each clause'
  }
}

Describe 'parallel-agents' {
  It 'la política de modelos aprobada en delegate es la confirmación de paralelizar' {
    $cap = Get-Section $script:Parallel "**The project's cap**" '### 4.'
    $cap | Should -Match 'Política de modelos'
    $cap | Should -Match '`delegate`'
    $cap | Should -Match 'confirmation'
  }

  It 'el paso de los ejes de sdd-verify toma la política aprobada como confirmación' {
    $axes = Get-Section (Get-KitFile 'skills/sdd-verify/SKILL.md') '**The axes.**' '**Read the reports by axis.**'
    $axes | Should -Match 'Política de modelos'
    $axes | Should -Match 'confirmation'
  }

  It 'lo que la línea no nombra se confirma aparte' {
    $cap = Get-Section $script:Parallel "**The project's cap**" '### 4.'
    $cap | Should -Match "doesn't name"
  }
}

Describe 'spec-template y repaso' {
  It '«Aprobaciones» no lleva la columna Rol ni el frontmatter role' {
    $script:SpecTemplate | Should -Not -Match '\| Rol \|'
    $script:SpecTemplate | Should -Not -Match 'role:'
    $script:SpecTemplate | Should -Match '\| Nombre \| Fecha \| Estado \|'
  }

  It 'el Estado de una opción va sin sufijo y la frase literal solo si se escribe' {
    $script:SpecTemplate | Should -Match 'aprobada \(opción «'
    $script:SpecTemplate | Should -Match 'aprobada: «'
  }

  It 'la ayuda del MODIFIED dice cómo se quita una línea y cómo se renombra' {
    $modified = Get-Section $script:SpecTemplate '**MODIFIED —' '**REMOVED —'
    $modified | Should -Not -Match 'lo que no esté aquí desaparece'
    $modified | Should -Match '- REMOVED <línea>'
    $modified | Should -Match 'REMOVED.*\+.*ADDED'
  }

  It 'tiene el hueco de lo que se retira o cambia de forma, con las filas que implementa' {
    $section = Get-Section $script:SpecTemplate '## Lo que se retira o cambia de forma' '## Approach'
    $section | Should -Match '\| Qué \| Dónde aparece \| Destino \|'
    $section | Should -Match 'Filas que implementa'
    $section | Should -Match 'nada: comprobado con'
  }

  It 'tiene el bloque condicional de topes de palabras con sus tres reglas' {
    $section = Get-Section $script:SpecTemplate '## Topes de palabras' '## Enmiendas'
    $section | Should -Match 'solo si el proyecto pone topes'
    $section | Should -Match '\| Fichero \| Medido / tope \| Margen \| Tope propuesto \|'
    $section | Should -Match '2 %'
    $section | Should -Match 'funde'
    $section | Should -Match 'RED'
  }

  It 'ProposeFixes: la política de modelos es solo de delegate' {
    $decisions = Get-Section $script:SpecTemplate '## ✋ Decisiones que he tomado yo' '## Intent'
    $decisions | Should -Match 'Política de modelos \(solo en `delegate`\)'
  }

  It 'el repaso de coherencia rellena la sección nueva y prueba el delta sobre una copia' {
    $pass = Get-Section $script:Propose '**Coherence pass**' '⛔ **APPROVAL GATE**'
    $pass | Should -Match 'Lo que se retira o cambia de forma'
    $pass | Should -Match 'capability merge'
    $pass | Should -Match 'copy of `\.docs/sdd`'
    $pass | Should -Match 'Política de modelos'
  }
}
