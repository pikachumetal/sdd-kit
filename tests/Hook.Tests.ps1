BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:HooksDir = Join-Path $script:KitRoot 'hooks'
  $script:Script = Join-Path $script:HooksDir 'session-start'

  . (Join-Path $PSScriptRoot 'Resolve-Bash.ps1')
  $script:Bash = Resolve-Bash

  function New-ProjectDir([bool]$WithSdd) {
    $dir = Join-Path ([IO.Path]::GetTempPath()) ('hook-' + [guid]::NewGuid().ToString('N'))
    $target = if ($WithSdd) { Join-Path $dir '.docs/sdd' } else { $dir }
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    return $dir
  }

  $script:HookCommand = (Get-Content (Join-Path $script:HooksDir 'hooks.json') -Raw | ConvertFrom-Json).hooks.SessionStart[0].hooks[0].command

  function Invoke-SessionStart([string]$ProjectDir) {
    $previous = @{ Project = $env:CLAUDE_PROJECT_DIR; Plugin = $env:CLAUDE_PLUGIN_ROOT }
    $env:CLAUDE_PROJECT_DIR = $ProjectDir
    $env:CLAUDE_PLUGIN_ROOT = $script:KitRoot -replace '\\', '/'
    try { $output = & $script:Bash -c $script:HookCommand }
    finally {
      $env:CLAUDE_PROJECT_DIR = $previous.Project
      $env:CLAUDE_PLUGIN_ROOT = $previous.Plugin
    }
    return [pscustomobject]@{ Output = ($output -join "`n"); ExitCode = $LASTEXITCODE }
  }
}

Describe 'hooks/hooks.json' {
  BeforeAll {
    $script:Config = Get-Content (Join-Path $script:HooksDir 'hooks.json') -Raw | ConvertFrom-Json
    $script:Command = $script:Config.hooks.SessionStart[0].hooks[0].command
  }

  It 'declara un hook SessionStart que ejecuta session-start' {
    $script:Command | Should -Match 'hooks/session-start'
  }

  It 'no antepone un bash literal al comando' {
    $script:Command | Should -Not -Match '^\s*"?bash(\.exe)?"?\s'
  }

  It 'delega la resolución del intérprete en el campo shell' {
    $script:Config.hooks.SessionStart[0].hooks[0].shell | Should -Be 'bash'
  }
}

Describe 'hooks/router.md' {
  It 'es corto (150 palabras como máximo)' {
    $words = (Get-Content (Join-Path $script:HooksDir 'router.md') -Raw -ErrorAction Stop) -split '\s+' | Where-Object { $_ }
    $words.Count | Should -BeLessOrEqual 150
  }
}

Describe 'hooks/session-start' {
  It 'es ejecutable en git, porque hooks.json lo invoca por ruta' {
    $entry = git -C $script:KitRoot ls-files -s hooks/session-start 2>$null
    if (-not $entry) { Set-ItResult -Skipped -Because 'la raíz del kit no es un repositorio git'; return }
    $entry | Should -Match '^100755 '
  }

  It 'se guarda con finales de línea LF' {
    $bytes = [IO.File]::ReadAllBytes($script:Script)
    $bytes | Should -Not -Contain 13
  }

  It 'no inyecta nada sin .docs/sdd/' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $false)
    $result.ExitCode | Should -Be 0
    $result.Output.Trim() | Should -BeNullOrEmpty
  }

  It 'inyecta el router con .docs/sdd/' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $true)
    $result.ExitCode | Should -Be 0
    $context = ($result.Output | ConvertFrom-Json).hookSpecificOutput
    $context.hookEventName | Should -Be 'SessionStart'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-start-task'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-start-patch'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-consult'
  }
}

Describe '.githooks/pre-merge-commit' {
  BeforeAll {
    $script:MergeHook = Join-Path $script:KitRoot '.githooks/pre-merge-commit'
  }

  It 'existe, porque git no ejecuta pre-commit en un merge sin conflictos' {
    $script:MergeHook | Should -Exist
  }

  It 'es ejecutable en git' {
    if (-not (git -C $script:KitRoot rev-parse --git-dir 2>$null)) { Set-ItResult -Skipped -Because 'la raíz del kit no es un repositorio git'; return }
    $entry = git -C $script:KitRoot ls-files -s .githooks/pre-merge-commit 2>$null
    $entry | Should -Match '^100755 '
  }

  It 'delega en pre-commit en vez de duplicar la suite' {
    $content = Get-Content $script:MergeHook -Raw
    $content | Should -Match 'pre-commit'
    $content | Should -Not -Match 'Invoke-Pester'
  }
}