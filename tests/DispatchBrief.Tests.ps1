BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-ImplementerBrief {
    $brief = Get-KitFile 'skills/sdd-start-task/references/encargo-revision.md'
    return $brief.Substring($brief.IndexOf('## Encargo del implementador'))
  }
}

Describe 'Encargo del implementador' {
  It 'lleva las reglas fijas del implementador' {
    $brief = Get-ImplementerBrief
    $brief | Should -Match '## Reglas del implementador'
    $brief | Should -Match 'mensaje literal'
    $brief | Should -Match 'nombre y su mensaje'
    $brief | Should -Match 'Nunca `git stash`'
  }

  It 'dice de dónde sale el bloque de restricciones en modo lite' {
    foreach ($path in 'skills/sdd-start-task/references/encargo-revision.md', 'skills/sdd-start-task/SKILL.md') {
      $text = Get-KitFile $path
      $text | Should -Match 'modo lite[^\n]*artículo de calidad de código[^\n]*política de modelos'
    }
  }
}

Describe 'La task del plan viaja sola' {
  BeforeAll {
    $script:PlanTemplate = 'skills/sdd-templates/templates/plan-template.md'
  }

  It 'cada task de la plantilla declara sus interfaces y no remite a otras secciones' {
    $template = Get-KitFile $script:PlanTemplate
    $template | Should -Match '\*\*Interfaces\*\*:\s*\r?\n- Consume:[^\n]*\r?\n- Produce:'
    $template | Should -Match 'no remite a otras secciones'
    $template | Should -Not -Match 'La API va en §1\.4'
  }

  It 'task-brief de superpowers extrae las interfaces con la task' {
    $taskBrief = Get-ChildItem (Join-Path $HOME '.claude/plugins/cache/claude-plugins-official/superpowers') -Recurse -Filter 'task-brief' -ErrorAction SilentlyContinue |
      Select-Object -First 1
    $bash = Get-Command bash -ErrorAction SilentlyContinue
    if (-not $taskBrief -or -not $bash) { Set-ItResult -Skipped -Because 'sin bash o sin superpowers instalado'; return }
    $outFile = Join-Path ([System.IO.Path]::GetTempPath()) "task-brief-$([guid]::NewGuid()).md"
    $templatePath = (Join-Path $script:RepoRoot $script:PlanTemplate).Replace('\', '/')
    & $bash.Source $taskBrief.FullName.Replace('\', '/') $templatePath 1 $outFile.Replace('\', '/') | Out-Null
    $brief = Get-Content $outFile -Raw
    Remove-Item $outFile
    $brief | Should -Match '\*\*Interfaces\*\*'
  }
}
