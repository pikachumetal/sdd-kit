BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  $script:Profiles = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
  $script:Section = [regex]::Match($script:Profiles, '(?s)## Vigía de silencio\r?\n(.*?)(?=\r?\n## )').Groups[1].Value
}

Describe 'Vigía de silencio' {
  It 'control-profiles tiene la sección y ya no remite la conducta a la task 0022' {
    $script:Section | Should -Not -BeNullOrEmpty
    $script:Profiles | Should -Not -Match 'control\.silence\.\*` (solo se declaran aquí|que esa task lee)'
  }

  It 'la sección lanza el script por la description del despacho y por la salida de la verificación lenta' {
    $script:Section | Should -Match 'Watch-SubagentSilence\.ps1'
    $script:Section | Should -Match '-Description'
    $script:Section | Should -Match '-Path'
    $script:Section | Should -Match 'run_in_background'
  }

  It 'la sección dice qué hacer con cada primera línea' {
    foreach ($head in 'SILENCIO:', 'TERMINADO:', 'SIN TRANSCRIPT:') { $script:Section | Should -Match ([regex]::Escape($head)) }
  }

  It 'la sección fija la conducta ante un cuelgue' {
    $script:Section | Should -Match 'petición de permiso pendiente'
    $script:Section | Should -Match 'segundo cuelgue'
    $script:Section | Should -Match '⏸️ aparcada: cuelgue repetido'
    $script:Section | Should -Match 'Cuelgue: <tipo de subagente o comando>, <herramienta> sin respuesta, <minutos> min'
  }

  It 'ninguna orden del vigía lleva los umbrales escritos' {
    $script:Section | Should -Not -Match '\b(8|20) min'
    $script:Section | Should -Not -Match 'betweenStepsMinutes\s*[:=]|longCommandMinutes\s*[:=]'
  }

  It 'el paso 6 de sdd-start-feature lanza el vigía y enlaza la sección' {
    $skill = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
    $skill | Should -Match 'Watch-SubagentSilence\.ps1'
    $skill | Should -Match '\(references/control-profiles\.md#vigía-de-silencio\)'
  }

  It 'los demás puntos de despacho remiten al vigía' {
    foreach ($file in 'skills/sdd-start-feature/references/encargo-revision.md', 'skills/sdd-start-feature/references/review-spec.md',
      'skills/sdd-end-feature/SKILL.md') {
      Get-KitFile $file | Should -Match 'vigía de silencio' -Because $file
    }
  }

  It 'sdd-config ya no dice que la conducta del vigía la define la task 0022' {
    Get-KitFile 'skills/sdd-config/SKILL.md' | Should -Not -Match 'su conducta la define la task 0022'
  }
}
