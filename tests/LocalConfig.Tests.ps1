BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:LocalFile = '.docs/sdd/sdd-kit.local.json'

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-Section([string]$Text, [string]$Heading) {
    return [regex]::Match($Text, "(?ms)^## $([regex]::Escape($Heading))\r?$.*?(?=^## |\z)").Value
  }

  function Get-SkillStep([int]$Number) {
    $skill = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
    return [regex]::Match($skill, "(?ms)^$Number\. \*\*.*?(?=^$($Number + 1)\. \*\*)").Value
  }

  $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
}

Describe 'Precedencia con el fichero local' {
  It 'la precedencia tiene cuatro niveles, con el fichero local en segundo lugar' {
    $levels = [regex]::Matches((Get-Section $script:Profiles 'Precedencia'), '(?m)^\d\. (.+)$') | ForEach-Object { $_.Groups[1].Value }
    $levels.Count | Should -Be 4
    $levels[1] | Should -Match ([regex]::Escape($script:LocalFile))
  }

  It 'la regla de execution va de la task al fichero local y al proyecto, con auto como nivel' {
    $section = Get-Section $script:Profiles 'sdd-kit.local.json'
    $section | Should -Match 'execution.*feature.*sdd-kit\.local\.json.*sdd-kit\.json'
    $section | Should -Match '`execution: auto`.*cuenta'
  }
}

Describe 'Sección del fichero local' {
  It 'nombra las tres claves admitidas' {
    $section = Get-Section $script:Profiles 'sdd-kit.local.json'
    foreach ($key in 'control.profile', 'execution', 'validation.startEnvironment') {
      $section | Should -Match ([regex]::Escape("``$key``"))
    }
  }

  It 'lleva literal el aviso de clave no admitida' {
    $warning = 'Aviso: se ignora <clave> de sdd-kit.local.json: solo admite control.profile, execution y validation.startEnvironment; lo demás es del proyecto y va en sdd-kit.json.'
    (Get-Section $script:Profiles 'sdd-kit.local.json').Contains($warning) | Should -BeTrue
  }

  It 'lleva literal el aviso de valor no admitido' {
    $warning = 'Aviso: se ignora <clave> de sdd-kit.local.json: <valor> no es un valor admitido.'
    (Get-Section $script:Profiles 'sdd-kit.local.json').Contains($warning) | Should -BeTrue
  }

  It 'dice que el nombre de quien trabaja sale de git config user.name' {
    Get-Section $script:Profiles 'sdd-kit.local.json' | Should -Match 'git config user\.name'
  }

  It 'la tabla de claves tiene validation.startEnvironment, booleano con default false' {
    $row = ($script:Profiles -split "`r?`n") | Where-Object { $_ -match '^\| `validation\.startEnvironment`' }
    $row | Should -Match 'booleano'
    $row | Should -Match '`false`'
  }
}

Describe 'sdd-start-feature lee el fichero local' {
  It 'el paso 2 nombra el fichero local y el nivel del que sale el perfil' {
    $step = Get-SkillStep 2
    $step | Should -Match 'sdd-kit\.local\.json'
    $step | Should -Match 'nivel'
  }

  It 'el paso 5 nombra el fichero local como sitio donde se fija execution' {
    Get-SkillStep 5 | Should -Match 'sdd-kit\.local\.json'
  }

  It 'el paso 5 dice que la cabecera nombra el fichero que fija el método, aunque la plantilla solo nombre sdd-kit.json' {
    $step = Get-SkillStep 5
    $step | Should -Match 'fijado en <fichero>'
    $step | Should -Match '`auto` en `sdd-kit\.local\.json`'
  }

  It 'los cierres de task y de patch también leen el fichero local' {
    $section = Get-Section $script:Profiles 'sdd-kit.local.json'
    $section | Should -Match '`sdd-end-feature`'
    $section | Should -Match '`sdd-end-patch`'
  }

  It 'generacion.md cita el changelog con la numeración nueva de brownfield' {
    Get-KitFile 'skills/sdd-init-brownfield/references/generacion.md' | Should -Not -Match 'preguntas 6 y 7'
  }
}

Describe 'El fichero local queda fuera de git' {
  It 'el .gitignore del repo lo ignora' {
    (Get-KitFile '.gitignore') -split "`r?`n" | Should -Contain $script:LocalFile
  }

  It '<_> lo añade a .gitignore' -ForEach @(
    'skills/sdd-init-greenfield/SKILL.md',
    'skills/sdd-init-greenfield/references/estructura.md',
    'skills/sdd-init-brownfield/references/generacion.md'
  ) {
    Get-KitFile $_ | Should -Match ([regex]::Escape("``$script:LocalFile``"))
  }

  It 'la migración v1.2.0 lo declara en su línea Escribe y lo verifica' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    $write = ($migration -split "`r?`n") | Where-Object { $_ -match '^\*\*Escribe\*\*:' }
    $write | Should -Match ([regex]::Escape("``$script:LocalFile``"))
    $migration | Should -Match ([regex]::Escape("sdd-kit\.local\.json"))
  }
}
