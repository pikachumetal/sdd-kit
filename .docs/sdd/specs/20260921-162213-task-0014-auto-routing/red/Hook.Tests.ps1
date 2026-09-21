BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:HooksDir = Join-Path $script:KitRoot 'hooks'
  $script:Script = Join-Path $script:HooksDir 'session-start'

  # En Windows, `bash` del PATH suele ser el lanzador de WSL, que no ejecuta el script: se prefiere Git Bash.
  function Resolve-Bash {
    $gitBash = @("$env:ProgramFiles\Git\bin\bash.exe", "${env:ProgramFiles(x86)}\Git\bin\bash.exe") |
      Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($gitBash) { return $gitBash }
    $onPath = Get-Command bash -ErrorAction SilentlyContinue
    if ($onPath -and $onPath.Source -notmatch 'System32') { return $onPath.Source }
  }
  $script:Bash = Resolve-Bash

  function New-ProjectDir([bool]$WithSdd) {
    $dir = Join-Path ([IO.Path]::GetTempPath()) ('hook-' + [guid]::NewGuid().ToString('N'))
    $target = if ($WithSdd) { Join-Path $dir '.docs/sdd' } else { $dir }
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    return $dir
  }

  function Invoke-SessionStart([string]$ProjectDir) {
    $previous = $env:CLAUDE_PROJECT_DIR
    $env:CLAUDE_PROJECT_DIR = $ProjectDir
    try { $output = & $script:Bash $script:Script }
    finally { $env:CLAUDE_PROJECT_DIR = $previous }
    return [pscustomobject]@{ Output = ($output -join "`n"); ExitCode = $LASTEXITCODE }
  }
}

Describe 'hooks/hooks.json' {
  It 'declara un hook SessionStart que ejecuta session-start' {
    $config = Get-Content (Join-Path $script:HooksDir 'hooks.json') -Raw | ConvertFrom-Json
    $command = $config.hooks.SessionStart[0].hooks[0].command
    $command | Should -Match 'hooks/session-start'
  }
}

Describe 'hooks/router.md' {
  It 'es corto (150 palabras como máximo)' {
    $words = (Get-Content (Join-Path $script:HooksDir 'router.md') -Raw -ErrorAction Stop) -split '\s+' | Where-Object { $_ }
    $words.Count | Should -BeLessOrEqual 150
  }
}

Describe 'hooks/session-start' {
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
