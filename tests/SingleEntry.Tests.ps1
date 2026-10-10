BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw -Encoding utf8
  }

  function Get-Step([string]$Text, [int]$Number) {
    return [regex]::Match($Text, "(?ms)^$Number\. .*?(?=^\d+\. |^## )").Value
  }

  $script:Propose = Get-KitFile 'skills/sdd-propose/SKILL.md'
  $script:StartPatch = Get-KitFile 'skills/sdd-start-patch/SKILL.md'
}

Describe 'Entrada única: la estimación del patch no depende de que haya pregunta' {
  It 'sdd-propose estima también sin pregunta del carril' {
    Get-Step $script:Propose 2 | Should -Match 'without a question'
  }

  It 'el traspaso a sdd-start-patch lleva la estimación' {
    Get-Step $script:Propose 6 | Should -Match 'with its class[^\n]*and the estimate'
  }

  It 'sdd-start-patch escribe la estimación también sin pregunta' {
    Get-Step $script:StartPatch 3 | Should -Match 'sin pregunta'
  }
}

Describe 'Entrada única: sin la primera pregunta de antes' {
  It 'sdd-propose no habla de una primera pregunta' {
    $script:Propose | Should -Not -Match '(?i)first question'
  }

  It 'las referencias y las otras puertas nombran sdd-propose, no las puertas viejas' {
    Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md' | Should -Not -Match 'la primera pregunta y el plan'
    Get-KitFile 'skills/sdd-start-feature/references/overrides-superpowers.md' | Should -Not -Match 'sale por el enrutado \(paso 2\) a `sdd-explore`'
    Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Not -Match 'sdd-start-feature o sdd-start-patch|`sdd-start-feature`, `sdd-start-patch`'
    Get-KitFile 'skills/sdd-explore/SKILL.md' | Should -Not -Match 'implementar una feature \(sdd-start-feature\)'
  }
}

Describe 'Entrada única: el anuncio de feature y spike' {
  It 'el aviso de una clave local ignorada es el literal del contrato de control-profiles' {
    $script:Propose | Should -Match ([regex]::Escape('Aviso: se ignora <clave> de sdd-kit.local.json'))
    $script:Propose | Should -Not -Match 'Ignoro de sdd-kit\.local\.json'
    $script:Propose | Should -Not -Match 'no cuenta: es del equipo'
  }

  It 'el bloque del anuncio lleva las frases de cambiar de perfil y de parar antes de la Task 1' {
    $block = [regex]::Match($script:Propose, '(?ms)```text\r?\nCarril:.*?```').Value
    $block | Should -Match ([regex]::Escape('«perfil `<otro>` para esta feature»'))
    $block | Should -Match 'paras antes de la Task 1'
  }
}

Describe 'Entrada única: config y peticiones mixtas' {
  It 'config baja a tech-stack.md cuando operations.md no tiene gate' {
    $script:Propose | Should -Match 'without that gate, the one in `tech-stack\.md` §Testing'
  }

  It 'una petición mixta dice qué parte va dentro de la más pesada' {
    Get-Step $script:Propose 2 | Should -Match 'say which part rides inside it'
  }
}
