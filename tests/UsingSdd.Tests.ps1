BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:SkillPath = Join-Path $script:KitRoot 'skills/using-sdd/SKILL.md'
  $script:Skill = if (Test-Path $script:SkillPath) { Get-Content $script:SkillPath -Raw } else { '' }

  function Get-Description([string]$SkillName) {
    $text = Get-Content (Join-Path $script:KitRoot "skills/$SkillName/SKILL.md") -Raw
    if ($text -match '(?m)^description:\s*(.+)$') { return $Matches[1] }
    return ''
  }
}

Describe 'skills/using-sdd' {
  It 'existe' {
    $script:SkillPath | Should -Exist
  }

  It 'cabe en 530 palabras, porque el hook la carga en cada sesión' {
    $words = $script:Skill -split '\s+' | Where-Object { $_ }
    $words.Count | Should -BeGreaterThan 0
    $words.Count | Should -BeLessOrEqual 530
  }

  It 'nombra la puerta <_>' -ForEach @(
    'sdd-kit:sdd-init-greenfield', 'sdd-kit:sdd-init-brownfield', 'sdd-kit:sdd-consult', 'sdd-kit:sdd-roadmap',
    'sdd-kit:sdd-start-feature', 'sdd-kit:sdd-start-patch', 'sdd-kit:sdd-end-release', 'sdd-kit:sdd-config'
  ) {
    $script:Skill | Should -Match ([regex]::Escape($_))
  }

  It 'define lo grande con el criterio de partir de sdd-start-feature, sin números de tamaño' {
    $row = ($script:Skill -split '\r?\n') | Where-Object { $_ -match '^\|' -and $_ -match 'sdd-kit:sdd-roadmap' } | Select-Object -First 1
    $row | Should -Match 'partir'
    $row | Should -Match 'sdd-start-feature'
    $row | Should -Not -Match '\d'
  }

  It 'lleva a sdd-roadmap lo que se planifica sin hacerlo todavía, como hacía el router' {
    $row = ($script:Skill -split '\r?\n') | Where-Object { $_ -match '^\|' -and $_ -match 'sdd-kit:sdd-roadmap' } | Select-Object -First 1
    $row | Should -Match 'sin hacerlo todavía'
    $row | Should -Match 'apunta en el roadmap'
  }

  It 'lleva los items asignados del gestor a sdd-roadmap' {
    $row = ($script:Skill -split '\r?\n') | Where-Object { $_ -match '^\|' -and $_ -match 'sdd-kit:sdd-roadmap' } | Select-Object -First 1
    $row | Should -Match 'asignado'
  }

  It 'lleva las preferencias a sdd-config y no a la memoria del agente' {
    $row = ($script:Skill -split '\r?\n') | Where-Object { $_ -match '^\|' -and $_ -match 'sdd-kit:sdd-config' } | Select-Object -First 1
    $row | Should -Match 'me paras mucho'
    $row | Should -Match 'memoria'
  }

  It 'lleva la regla de duda: una sola pregunta, con la recomendación primero' {
    $script:Skill | Should -Match 'una sola pregunta'
    $script:Skill | Should -Match 'recomendación primero'
  }

  It 'prevalece sobre brainstorming de superpowers' {
    $script:Skill | Should -Match 'prevalece'
    $script:Skill | Should -Match 'brainstorming'
  }
}

Describe 'description de las skills de entrada' {
  It 'sdd-config recoge las preferencias de cómo trabajar' {
    $description = Get-Description 'sdd-config'
    $description | Should -Match 'me paras mucho'
    $description | Should -Match 'menos preguntas'
  }

  It 'sdd-roadmap recoge los items del gestor aunque estén asignados para hacerlos' {
    Get-Description 'sdd-roadmap' | Should -Match 'asignado'
  }
}

Describe 'hooks/router.md' {
  It 'ya no existe: la única fuente de las puertas es using-sdd' {
    Join-Path $script:KitRoot 'hooks/router.md' | Should -Not -Exist
  }
}
