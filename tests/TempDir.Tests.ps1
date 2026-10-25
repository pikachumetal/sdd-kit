BeforeAll {
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv
  $script:TempRoot = Join-Path (Split-Path $PSScriptRoot) '.temp'
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'La carpeta temporal de los Pester del kit' {
  It 'TEMP cuelga de .temp del repo' {
    [IO.Path]::GetFullPath($env:TEMP) | Should -BeLike "$([IO.Path]::GetFullPath($script:TempRoot))*"
  }

  It 'git no sube del TestDrive al repo del kit' {
    git -C $TestDrive rev-parse --show-toplevel 2>$null
    $LASTEXITCODE | Should -Not -Be 0
  }
}

Describe 'Start-KitSession.ps1 y los temporales de Claude Code' {
  It 'lanza claude con CLAUDE_CODE_TMPDIR en .temp/ y restaura el valor anterior' {
    $before = $env:CLAUDE_CODE_TMPDIR
    $env:CLAUDE_CODE_TMPDIR = 'antes'
    function claude { $global:SeenTmpDir = $env:CLAUDE_CODE_TMPDIR }
    try {
      & (Join-Path (Split-Path $PSScriptRoot) 'Start-KitSession.ps1')

      $global:SeenTmpDir | Should -Be $script:TempRoot
      $env:CLAUDE_CODE_TMPDIR | Should -Be 'antes'
    }
    finally { $env:CLAUDE_CODE_TMPDIR = $before; Remove-Variable -Name SeenTmpDir -Scope Global -ErrorAction SilentlyContinue }
  }
}
