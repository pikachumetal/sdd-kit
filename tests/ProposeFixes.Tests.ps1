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
