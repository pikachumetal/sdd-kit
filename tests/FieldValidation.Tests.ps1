BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-Step([string]$Skill, [int]$Step) {
    return [regex]::Match($Skill, "(?ms)^$Step\. (⛔ )?\*\*.*?(?=^$($Step + 1)\. (⛔ )?\*\*|^## )").Value
  }

  function Get-Section([string]$Markdown, [string]$Heading) {
    return [regex]::Match($Markdown, "(?ms)^## $Heading\r?\n(.*?)(?=^## |\z)").Groups[1].Value
  }
}

Describe 'la validación en campo en control-profiles y en el paso 7' {
  BeforeAll {
    $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
    $script:StartFeature = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
  }

  It 'la tabla de gates nombra el modo de campo' {
    $row = ($script:Profiles -split "`n") | Where-Object { $_ -match '^\| Validación \(cierre' }
    $row | Should -Match 'validation\.mode: field'
  }

  It 'control-profiles tiene la sección de campo con su línea' {
    $script:Profiles | Should -Match '(?m)^## Validación en campo'
    Get-Section $script:Profiles 'Validación en campo' | Should -Match 'Validación en campo: <fecha>'
  }

  It 'la clave está en la tabla de claves' {
    Get-Section $script:Profiles 'Claves de sdd-kit.json' | Should -Match '\| `validation\.mode` \|'
  }

  It 'el paso 7 nombra el modo de campo' {
    Get-Step $script:StartFeature 7 | Should -Match 'validation\.mode: field'
  }

  It 'las plantillas admiten la línea de campo' {
    Get-KitFile 'skills/sdd-templates/templates/walkthrough-template.md' | Should -Match 'Validación en campo:'
    Get-KitFile 'skills/sdd-templates/templates/patch-template.md' | Should -Match 'Validación en campo:'
  }
}

Describe 'el cierre en campo' {
  BeforeAll {
    $script:Archive = Get-KitFile 'skills/sdd-archive/SKILL.md'
  }

  It 'la validación acepta la validación en campo y registra su línea' {
    $step = Get-Step $script:Archive 1
    $step | Should -Match 'validation\.mode: field'
    $step | Should -Match 'Validación en campo: <fecha> · <verificación del agente>'
  }

  It 'el roadmap marca ✅ en campo' {
    Get-Step $script:Archive 4 | Should -Match 'in field, `✅`'
  }

  It 'la red flag admite la línea de campo' {
    $redFlag = ($script:Archive -split "`n") | Where-Object { $_ -match '^- You''re about to merge without the' }
    $redFlag | Should -Match 'Validación en campo:'
  }
}

Describe 'la validación en campo sin contradicciones ni huecos' {
  BeforeAll {
    $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
    $script:StartFeature = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
    $script:Archive = Get-KitFile 'skills/sdd-archive/SKILL.md'
  }

  It 'ninguna frase dice que la validación no se quita sin exceptuar el campo' {
    $absolutes = 'la validación del paso 7 no se quita nunca', 'en `delegate` la validación para siempre', 'Con el usuario ausente, la feature espera', 'con el usuario ausente, la feature espera', 'si no está, espera', 'the change waits', 'validation stops'
    foreach ($skill in $script:StartFeature, $script:Archive) {
      $lines = ($skill -split "`n") | Where-Object { $line = $_; $absolutes | Where-Object { $line.Contains($_) } }
      $lines | Where-Object { $_ -notmatch 'validation\.mode: field|Without the key, with `manual`' } | Should -BeNullOrEmpty
    }
  }

  It 'el cierre registra Validado si el usuario dice qué probó, también en campo' {
    Get-Step $script:Archive 1 | Should -Match 'If the user does say what they tried, the line is `Validado`'
  }

  It 'un valor distinto de manual o field cuenta como manual con aviso literal' {
    Get-Step $script:StartFeature 7 | Should -Match 'otro valor'
    Get-Step $script:Archive 1 | Should -Match 'another value\*\* \(which counts as `manual`; say so\)'
    Get-Section $script:Profiles 'Validación en campo' | Should -Match 'no admitido en `sdd-kit\.json`: rige `manual`'
  }

  It 'la regla del atajo autoconcedido incluye validation.mode' {
    $rules = ($script:Profiles -split "`n") | Where-Object { $_ -match 'nunca escribe, sin la frase literal' }
    $rules.Count | Should -Be 2
    $rules | ForEach-Object { $_ | Should -Match '`validation\.mode`' }
  }

  It 'el paso 7 en campo conserva las reglas de verificación que siguen' {
    Get-Step $script:StartFeature 7 | Should -Match 'Lo que sigue vale en los dos modos, salvo el guion, la pregunta de validación y la espera'
  }
}

Describe 'el cierre de patch en campo' {
  It 'la validación del patch registra la línea de campo bajo la tabla de patch.md §4' {
    Get-Step (Get-KitFile 'skills/sdd-archive/SKILL.md') 1 | Should -Match '`Patch only:` under the table of `patch\.md` §4'
  }
}