# Vigencia de .docs/workflow/, la documentación temprana del flujo.
#
# Estos documentos describen el kit y no viajan con él: son de este repo. Nada en las
# skills los nombra, así que sin este test el desfase vuelve solo — pasó entre julio y
# septiembre de 2026, cuando siguieron describiendo el carril `hotfix` tres releases
# después de que se llamara `patch`. El marcador de revisión al pie de cada documento
# tiene que nombrar la versión publicada: actualizarlo obliga a releerlos en cada bump.

# Pester resuelve -ForEach en descubrimiento, antes de BeforeAll: la lista vive fuera.
# El anexo describe fuentes externas, no el kit: envejece con ellas, no con cada release.
$VersionedDocs = @('greenfield.md', 'brownfield.md')

BeforeAll {
  $script:KitRoot = Split-Path $PSScriptRoot -Parent
  $script:WorkflowRoot = Join-Path $script:KitRoot '.docs/workflow'
  $manifest = Get-Content (Join-Path $script:KitRoot '.claude-plugin/plugin.json') -Raw | ConvertFrom-Json
  $script:PluginVersion = $manifest.version
}

Describe 'Documentación de flujo' {
  It 'existe la carpeta con los tres documentos' {
    $script:WorkflowRoot | Should -Exist
    foreach ($doc in @('greenfield.md', 'brownfield.md', 'evidence-and-references.md')) {
      Join-Path $script:WorkflowRoot $doc | Should -Exist
    }
  }

  It '<_> declara la versión del kit que revisó' -ForEach $VersionedDocs {
    $content = Get-Content (Join-Path $script:WorkflowRoot $_) -Raw
    $match = [regex]::Match($content, 'Última revisión: kit v([0-9]+\.[0-9]+\.[0-9]+)')
    $match.Success | Should -BeTrue -Because "$_ necesita su marcador 'Última revisión: kit vX.Y.Z'"
    $match.Groups[1].Value | Should -Be $script:PluginVersion -Because "$_ describe el kit: si la versión subió, hay que releerlo y actualizar el marcador"
  }

  It '<_> no nombra artefactos que el kit ya no produce' -ForEach $VersionedDocs {
    $content = Get-Content (Join-Path $script:WorkflowRoot $_) -Raw
    foreach ($obsoleto in @('hotfix', 'funcional\.md')) {
      $content | Should -Not -Match $obsoleto
    }
  }
}
