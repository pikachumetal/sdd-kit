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
    Get-KitFile 'skills/sdd-start-release/SKILL.md' | Should -Match 'hasRecipient'
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match 'hasRecipient'
  }

  It 'ninguna skill de task o patch presupone una release' {
    $taskAndPatchSkills = 'sdd-start-task', 'sdd-end-task', 'sdd-start-patch', 'sdd-end-patch'
    foreach ($skill in $taskAndPatchSkills) {
      Get-ChildItem (Join-Path $script:RepoRoot "skills/$skill") -Recurse -File |
        ForEach-Object { Get-Content $_.FullName -Raw } |
        Should -Not -Match '(?i)sdd-(start|end)-release|abrir una release'
    }
  }
}
