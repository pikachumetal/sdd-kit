BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-MarkdownSection([string]$Text, [string]$Heading, [string]$NextHeadingPattern) {
    $pattern = '(?ms)^' + [regex]::Escape($Heading) + '\r?$(.*?)(?=' + $NextHeadingPattern + '|\z)'
    $match = [regex]::Match($Text, $pattern)
    if (-not $match.Success) { return $null }
    return $match.Groups[1].Value
  }
}

Describe 'Cruce de los ficheros de la task con la base antes de cada despacho' {
  BeforeAll {
    $script:Profiles = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $script:Skill = Get-KitFile 'skills/sdd-start-task/SKILL.md'
    $script:Brake = Get-MarkdownSection $script:Profiles '### Fichero de la task cambiado en la base' '^##'
    $script:Crossing = 'git diff --name-only $(git merge-base HEAD <integración>) <integración>'
  }

  It 'control-profiles tiene el cuarto freno, tras el de la fila y dentro de «Frenos de alcance»' {
    $script:Brake | Should -Not -BeNullOrEmpty
    $frenos = Get-MarkdownSection $script:Profiles '## Frenos de alcance' '^## '
    $frenos | Should -Match '(?m)^### Fichero de la task cambiado en la base'
    $frenos.IndexOf('### Fichero de la task cambiado en la base') | Should -BeGreaterThan $frenos.IndexOf('### Fila cambiada en la base')
    $frenos | Should -Match 'Cuatro situaciones'
  }

  It 'el freno da el cruce literal contra «Crear» y «Modificar», antes de los tests RED' {
    $script:Brake | Should -Match ([regex]::Escape($script:Crossing))
    $script:Brake | Should -Match '«Crear»'
    $script:Brake | Should -Match '«Modificar»'
    $script:Brake | Should -Match '(?i)antes de escribir sus tests RED'
  }

  It 'el cruce no cuenta los tres registros compartidos y cualquier otro fichero sigue parando (patch 0069)' {
    $script:Brake | Should -Match 'En el cruce no cuentan los tres registros compartidos'
    foreach ($registry in 'roadmap.md', 'changelog.md', 'estimation-log.md') {
      $script:Brake | Should -Match ([regex]::Escape(".docs/sdd/$registry"))
    }
    $script:Brake | Should -Match '«Fila cambiada en la base»'
    $script:Brake | Should -Match 'merge de sincronización del cierre'
    $script:Brake | Should -Match 'Cualquier otro fichero para igual'
  }

  It 'el freno para en pair y delegate y registra enmienda sin aprobar en unattended' {
    $script:Brake | Should -Match '`pair` y `delegate`[^\r\n]*para'
    $script:Brake | Should -Match '`unattended`[^\r\n]*enmienda sin aprobar'
  }

  It 'la fila de la tabla de gates nombra el fichero y sigue parando en pair y delegate' {
    $row = ($script:Profiles -split "`n") | Where-Object { $_ -match '^\| Freno de alcance' }
    $row | Should -Match ([regex]::Escape('fila o fichero de la task cambiados en la base'))
    $cells = $row.Split('|') | ForEach-Object { $_.Trim() }
    $cells[2] | Should -Be 'para'
    $cells[3] | Should -Be 'para'
  }

  It 'el paso 6 de sdd-start-task hace el cruce y lo nombra como freno' {
    $script:Skill | Should -Match ([regex]::Escape($script:Crossing))
    $script:Skill | Should -Match '(?i)fichero de la task cambiado en la base'
  }

  It 'sdd-start-task lleva la red flag y la racionalización del RED' {
    $script:Skill | Should -Match '(?i)sin cruzar sus ficheros con la base'
    $script:Skill | Should -Match ([regex]::Escape('no toca esa fila'))
  }
}
