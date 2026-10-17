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

Describe 'Merge de sincronización tras el commit de cierre' {
  BeforeAll {
    $script:Recipe = Get-KitFile 'skills/sdd-archive/references/merge-recipe.md'
    $script:Section = Get-MarkdownSection $script:Recipe '## Integrated base'
    $script:Anchor = 'merge-recipe.md#integrated-base'
  }

  It 'la receta tiene la sección y va antes de la del script' {
    $script:Section | Should -Not -BeNullOrEmpty
    $script:Recipe.IndexOf('## Integrated base') | Should -BeLessThan $script:Recipe.IndexOf('## The merge is a script')
  }

  It 'la sección nombra los tres registros' {
    foreach ($register in '.docs/sdd/changelog.md', '.docs/sdd/roadmap.md', '.docs/sdd/estimation-log.md') {
      $script:Section | Should -Match ([regex]::Escape($register))
    }
  }

  It 'la sección da el merge de sincronización literal y el abort' {
    $script:Section | Should -Match ([regex]::Escape('git merge --no-edit <remote>/<merge.into>'))
    $script:Section | Should -Match ([regex]::Escape('git merge --abort'))
  }

  It 'la sección regenera el log con la CLI y no lo edita' {
    $script:Section | Should -Match ([regex]::Escape('sdd estimation log'))
  }

  It 'la sección prohíbe --no-verify' {
    $script:Section | Should -Match ([regex]::Escape('--no-verify'))
  }

  It 'el paso de la base integrada de sdd-archive remite a la receta para los registros' {
    $step = [regex]::Match((Get-KitFile 'skills/sdd-archive/SKILL.md'), '(?ms)^6\. \*\*Integrated base\*\*.*?(?=^7\. )').Value
    $step | Should -Match 'A conflict only in the three registers you resolve as the recipe says'
  }

  It 'commit-milestones añade el merge de sincronización a la tabla de hitos y enlaza la receta' {
    $milestones = Get-KitFile 'skills/sdd-start-feature/references/commit-milestones.md'
    $milestones | Should -Match '(?m)^\| Merge de sincronización \|'
    $milestones | Should -Match ([regex]::Escape($script:Anchor))
  }
}
