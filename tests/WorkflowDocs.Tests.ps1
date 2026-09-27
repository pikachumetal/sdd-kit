# Vigencia de .docs/workflow/, la documentación temprana del flujo.
#
# Estos documentos describen el kit y no viajan con él: son de este repo. Nada en las
# skills los nombra, así que sin este test el desfase vuelve solo — pasó entre julio y
# septiembre de 2026, cuando siguieron describiendo el carril `hotfix` tres releases
# después de que se llamara `patch`. El marcador de revisión al pie de cada documento
# tiene que nombrar la versión publicada o una posterior: se revisan antes del corte que
# sube la versión, y el marcador obliga a releerlos en el bump siguiente.

# Pester resuelve -ForEach en descubrimiento, antes de BeforeAll: las listas viven fuera.
# El anexo describe fuentes externas, no el kit: envejece con ellas, no con cada release.
$VersionedDocs = @('greenfield.md', 'brownfield.md', 'usage-guide.md')
$AllDocs = @('greenfield.md', 'brownfield.md', 'evidence-and-references.md', 'usage-guide.md')

BeforeAll {
  $script:KitRoot = Split-Path $PSScriptRoot -Parent
  $script:WorkflowRoot = Join-Path $script:KitRoot '.docs/workflow'
  $manifest = Get-Content (Join-Path $script:KitRoot '.claude-plugin/plugin.json') -Raw | ConvertFrom-Json
  $script:PluginVersion = $manifest.version

  function Test-MarkerCurrent([string]$Content, [version]$PluginVersion) {
    $match = [regex]::Match($Content, 'Última revisión: kit v([0-9]+\.[0-9]+\.[0-9]+)')
    if (-not $match.Success) { return $false }
    return [version]$match.Groups[1].Value -ge $PluginVersion
  }

  function Get-BrokenRelativeLink([string]$Content, [string]$BaseDirectory) {
    $targets = [regex]::Matches($Content, '\]\(([^)\s]+)\)') | ForEach-Object { $_.Groups[1].Value }
    $relative = $targets | Where-Object { $_ -notmatch ':' -and -not $_.StartsWith('#') }
    $paths = $relative | ForEach-Object { ($_ -split '#')[0] } | Select-Object -Unique
    return @($paths | Where-Object { -not (Test-Path -LiteralPath (Join-Path $BaseDirectory $_)) })
  }
}

Describe 'Documentación de flujo' {
  It 'existe la carpeta con los cuatro documentos' {
    $script:WorkflowRoot | Should -Exist
    foreach ($doc in @('greenfield.md', 'brownfield.md', 'evidence-and-references.md', 'usage-guide.md')) {
      Join-Path $script:WorkflowRoot $doc | Should -Exist
    }
  }

  It '<_> declara la versión del kit que revisó' -ForEach $VersionedDocs {
    $content = Get-Content (Join-Path $script:WorkflowRoot $_) -Raw
    Test-MarkerCurrent $content $script:PluginVersion | Should -BeTrue -Because "$_ describe el kit: si la versión subió, hay que releerlo y actualizar el marcador 'Última revisión: kit vX.Y.Z'"
  }

  It '<_> no nombra artefactos que el kit ya no produce' -ForEach $VersionedDocs {
    $content = Get-Content (Join-Path $script:WorkflowRoot $_) -Raw
    foreach ($obsoleto in @('hotfix', 'funcional\.md', 'sdd-start-release', 'sdd-(start|end)-task')) {
      $content | Should -Not -Match $obsoleto
    }
  }

  It '<_> no tiene enlaces relativos rotos' -ForEach $AllDocs {
    $content = Get-Content (Join-Path $script:WorkflowRoot $_) -Raw
    Get-BrokenRelativeLink $content $script:WorkflowRoot | Should -BeNullOrEmpty -Because "$_ remite a otros documentos en vez de repetirlos"
  }
}

Describe 'Marcador de revisión' {
  It 'acepta un marcador igual o posterior a plugin.json' {
    Test-MarkerCurrent 'Última revisión: kit v2.0.0' '1.1.0' | Should -BeTrue
    Test-MarkerCurrent 'Última revisión: kit v1.1.0' '1.1.0' | Should -BeTrue
  }

  It 'rechaza un marcador anterior a plugin.json o ausente' {
    Test-MarkerCurrent 'Última revisión: kit v1.0.0' '1.1.0' | Should -BeFalse
    Test-MarkerCurrent 'Última revisión: kit v2.0.0' '2.0.1' | Should -BeFalse
    Test-MarkerCurrent 'sin marcador' '1.1.0' | Should -BeFalse
  }
}

Describe 'Enlaces relativos' {
  It 'detecta un enlace relativo roto y descarta URLs y anclas' {
    $content = '[x](brownfeld.md) [y](greenfield.md) [z](https://a.b/c.md) [w](#ancla) [v](brownfield.md#1-fase)'
    Get-BrokenRelativeLink $content $script:WorkflowRoot | Should -Be @('brownfeld.md')
  }
}

Describe 'Guía de uso' {
  BeforeAll {
    $script:Guide = Get-Content (Join-Path $script:WorkflowRoot 'usage-guide.md') -Raw
  }

  It 'tiene las siete secciones numeradas en orden' {
    $outsideCode = $script:Guide -replace '(?ms)^```.*?^```', ''
    $sections = [regex]::Matches($outsideCode, '(?m)^## (.+)$') | ForEach-Object { $_.Groups[1].Value }
    $sections.Count | Should -Be 7
    for ($i = 0; $i -lt 7; $i++) {
      $sections[$i] | Should -Match "^$($i + 1)\. "
    }
  }

  It 'enlaza los otros tres documentos en vez de repetirlos' {
    foreach ($doc in @('greenfield.md', 'brownfield.md', 'evidence-and-references.md')) {
      $script:Guide | Should -Match ([regex]::Escape("]($doc"))
    }
  }
}
