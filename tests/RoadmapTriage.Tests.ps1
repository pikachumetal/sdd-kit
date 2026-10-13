BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:KitRoot $RelativePath) -Raw -Encoding utf8
  }

  $script:Roadmapper = Get-KitFile 'skills/sdd-roadmap/SKILL.md'
  $script:Description = ($script:Roadmapper -split "`n" | Where-Object { $_ -match '^description:' }) -join ''
}

Describe 'sdd-roadmap escribe la forma 3.0.0' {
  It 'nombra la plantilla de <_>' -ForEach @('now-next-later-template.md', 'debt-template.md') {
    $script:Roadmapper | Should -Match ([regex]::Escape($_))
  }

  It 'tiene la entrada de triaje' {
    $script:Roadmapper | Should -Match '\*\*Triage\*\*'
  }

  It 'su description dispara el triaje' {
    $script:Description | Should -Match '(?i)triage'
  }

  It 'lleva la equivalencia 2.x de <_>' -ForEach @('Esperar 2.º ticket') {
    $script:Roadmapper | Should -Match ([regex]::Escape($_))
  }

  It 'propone en Descartadas lo que caduca, con el motivo literal' {
    $script:Roadmapper | Should -Match '`caducada`'
  }

  It 'da tamaño a la fila nueva con el umbral de partir' {
    $script:Roadmapper | Should -Match '`S`[^\n]*`M`[^\n]*`L`'
  }
}

Describe 'El freno de alcance y el perfil de la release leen ROADMAP.md' {
  BeforeAll {
    $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
  }

  It 'el freno de alcance lee el «Toca:» del brief' {
    $script:Profiles | Should -Match ([regex]::Escape('**Toca:**'))
  }

  It 'el perfil de la release va bajo `## Now`' {
    $script:Profiles | Should -Match ([regex]::Escape('## Now'))
  }
}
