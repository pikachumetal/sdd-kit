BeforeAll {
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:TempRoot = Join-Path (Split-Path $PSScriptRoot) '.temp'
}

Describe 'La carpeta temporal de los Pester del kit' {
  It 'TEMP cuelga de .temp del repo' {
    [IO.Path]::GetFullPath($env:TEMP) | Should -BeLike "$([IO.Path]::GetFullPath($script:TempRoot))*"
  }

  It 'git no sube del TestDrive al repo del kit' {
    $saved = Clear-GitEnv
    try {
      git -C $TestDrive rev-parse --show-toplevel 2>$null
      $LASTEXITCODE | Should -Not -Be 0
    }
    finally { Restore-GitEnv $saved }
  }
}
