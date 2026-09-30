BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Carril release opcional' {
  It 'el marcador del propio kit declara si sus releases tienen destinatario' {
    $marker = Get-KitFile '.docs/sdd/sdd-kit.json' | ConvertFrom-Json
    $marker.release.hasRecipient | Should -BeOfType [bool]
  }

  It 'las dos skills del carril leen el campo de destinatario' {
    Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Match 'hasRecipient'
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match 'hasRecipient'
  }

  It 'ninguna skill de task o patch presupone una release' {
    $taskAndPatchSkills = 'sdd-start-feature', 'sdd-end-feature', 'sdd-start-patch', 'sdd-end-patch'
    foreach ($skill in $taskAndPatchSkills) {
      Get-ChildItem (Join-Path $script:RepoRoot "skills/$skill") -Recurse -File |
        ForEach-Object { Get-Content $_.FullName -Raw } |
        Should -Not -Match '(?i)sdd-(start|end)-release|abrir una release'
    }
  }
}

Describe 'sdd-end-release es solo el corte' {
  BeforeAll { $script:EndRelease = Get-KitFile 'skills/sdd-end-release/SKILL.md' }

  It 'el checklist tiene cinco pasos numerados' {
    $checklist = (($script:EndRelease -split '## Checklist de cierre')[1] -split '## Red flags')[0]
    ([regex]::Matches($checklist, '(?m)^\d+\. \*\*')).Count | Should -Be 5
  }

  It 'no escribe el acta de la reunión' {
    $script:EndRelease | Should -Not -Match 'feedback\.md'
  }

  It 'remite el feedback de una reunión a sdd-roadmap' {
    $script:EndRelease | Should -Match 'sdd-roadmap'
  }
}

Describe 'sdd-end-release mantiene el roadmap en la forma' {
  BeforeAll {
    $script:EndRelease = Get-KitFile 'skills/sdd-end-release/SKILL.md'
    $script:RoadmapStep = [regex]::Match($script:EndRelease, '(?ms)^4\. \*\*Colapsar el roadmap\*\*.*?(?=^5\. \*\*)').Value
    $script:CollapseRecipe = Get-KitFile 'skills/sdd-end-release/references/notas-y-roadmap.md'
  }

  It 'ejecuta el validador en el paso del roadmap' {
    $script:RoadmapStep | Should -Match 'Test-Roadmap\.ps1'
  }

  It 'manda a la migración un roadmap fuera de la forma' {
    $script:RoadmapStep | Should -Match 'migrations/v2\.3\.0\.md'
  }

  It 'no ejecuta el paso 5 con el roadmap en rojo' {
    $script:RoadmapStep | Should -Match 'Roadmap válido'
  }

  It 'deja las validaciones pendientes en su línea' {
    $script:CollapseRecipe | Should -Match 'validaciones pendientes:'
  }

  It 'el paso del roadmap de sdd-end-release acepta un proyecto sin roadmap' {
    $script:RoadmapStep | Should -Match 'Sin roadmap que validar'
  }
}
