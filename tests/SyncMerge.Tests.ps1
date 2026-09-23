BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-MarkdownSection([string]$Text, [string]$Heading) {
    $pattern = '(?ms)^' + [regex]::Escape($Heading) + '\r?$(.*?)(?=^## |\z)'
    $match = [regex]::Match($Text, $pattern)
    if (-not $match.Success) { return $null }
    return $match.Groups[1].Value
  }
}

Describe 'Merge de sincronización ante un conflicto solo en los registros' {
  BeforeAll {
    $script:Recipe = Get-KitFile 'skills/sdd-end-task/references/merge-recipe.md'
    $script:Section = Get-MarkdownSection $script:Recipe '## Conflicto solo en los registros'
    $script:Anchor = 'merge-recipe.md#conflicto-solo-en-los-registros'
  }

  It 'la receta tiene la sección, justo después de «Si el script falla»' {
    $script:Section | Should -Not -BeNullOrEmpty
    $failIndex = $script:Recipe.IndexOf('## Si el script falla')
    $syncIndex = $script:Recipe.IndexOf('## Conflicto solo en los registros')
    $failIndex | Should -BeGreaterThan -1
    $syncIndex | Should -BeGreaterThan $failIndex
    $between = $script:Recipe.Substring($failIndex + 2, $syncIndex - $failIndex - 2)
    $between | Should -Not -Match '(?m)^## '
  }

  It 'la sección nombra los tres registros' {
    foreach ($register in '.docs/sdd/changelog.md', '.docs/sdd/roadmap.md', '.docs/sdd/estimation-log.md') {
      $script:Section | Should -Match ([regex]::Escape($register))
    }
  }

  It 'la sección da el merge de sincronización literal, el abort y el relanzamiento único' {
    $script:Section | Should -Match ([regex]::Escape('git merge --no-edit <merge.into>'))
    $script:Section | Should -Match ([regex]::Escape('git merge --abort'))
    $script:Section | Should -Match '(?i)una vez'
  }

  It 'la sección regenera el log con el script y no lo edita' {
    $script:Section | Should -Match ([regex]::Escape('Build-EstimationLog.ps1'))
  }

  It 'la sección prohíbe --no-verify' {
    $script:Section | Should -Match ([regex]::Escape('--no-verify'))
  }

  It '«Si el script falla» remite a la sección como salvedad' {
    $failSection = Get-MarkdownSection $script:Recipe '## Si el script falla'
    $failSection | Should -Match '(?i)salvo[^\r\n]*registros'
  }

  It 'el paso 10 de sdd-end-task y el paso 6 de sdd-end-patch enlazan la excepción' {
    foreach ($skill in 'skills/sdd-end-task/SKILL.md', 'skills/sdd-end-patch/SKILL.md') {
      Get-KitFile $skill | Should -Match ([regex]::Escape($script:Anchor))
    }
  }

  It 'commit-milestones añade el merge de sincronización a la tabla de hitos y enlaza la receta' {
    $milestones = Get-KitFile 'skills/sdd-start-task/references/commit-milestones.md'
    $milestones | Should -Match '(?m)^\| Merge de sincronización \|'
    $milestones | Should -Match ([regex]::Escape($script:Anchor))
  }
}
