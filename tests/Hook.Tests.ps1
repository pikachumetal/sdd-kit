BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:HooksDir = Join-Path $script:KitRoot 'hooks'
  $script:Script = Join-Path $script:HooksDir 'session-start'

  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv

  . (Join-Path $PSScriptRoot 'Resolve-Bash.ps1')
  $script:Bash = Resolve-Bash

  function New-ProjectDir([bool]$WithSdd, [string]$KitVersion) {
    $dir = Join-Path ([IO.Path]::GetTempPath()) ('hook-' + [guid]::NewGuid().ToString('N'))
    $target = if ($WithSdd) { Join-Path $dir '.docs/sdd' } else { $dir }
    New-Item -ItemType Directory -Path $target -Force | Out-Null
    if ($KitVersion) {
      Set-Content -Path (Join-Path $target 'sdd-kit.json') -Value ('{"version":"' + $KitVersion + '","channel":"plugin","ids":{"mode":"sequence"}}') -NoNewline
    }
    return $dir
  }

  $script:LoadedVersion = (Get-Content (Join-Path $script:KitRoot '.claude-plugin/plugin.json') -Raw | ConvertFrom-Json).version

  $script:LatestMigration = Get-ChildItem (Join-Path $script:KitRoot 'skills/sdd-init-brownfield/references/migrations') -Filter 'v*.md' |
    ForEach-Object { [version]$_.BaseName.Substring(1) } | Sort-Object -Descending | Select-Object -First 1 | ForEach-Object ToString

  function New-KitCopyWithoutMigrations {
    $root = Join-Path ([IO.Path]::GetTempPath()) ('kit-' + [guid]::NewGuid().ToString('N'))
    foreach ($relative in 'hooks', '.claude-plugin', 'skills/using-sdd') {
      $target = Join-Path $root $relative
      New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
      Copy-Item -Path (Join-Path $script:KitRoot $relative) -Destination $target -Recurse
    }
    return $root
  }

  $script:HookCommand = (Get-Content (Join-Path $script:HooksDir 'hooks.json') -Raw | ConvertFrom-Json).hooks.SessionStart[0].hooks[0].command

  function Invoke-SessionStart([string]$ProjectDir, [string]$PluginRoot = $script:KitRoot) {
    $previous = @{ Project = $env:CLAUDE_PROJECT_DIR; Plugin = $env:CLAUDE_PLUGIN_ROOT; Encoding = [Console]::OutputEncoding }
    $env:CLAUDE_PROJECT_DIR = $ProjectDir
    $env:CLAUDE_PLUGIN_ROOT = $PluginRoot -replace '\\', '/'
    # Lanzado desde Git Bash, pwsh decodifica la salida del hijo con la página de códigos ibm437 y rompe las tildes.
    [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
    try { $output = & $script:Bash -c $script:HookCommand }
    finally {
      $env:CLAUDE_PROJECT_DIR = $previous.Project
      $env:CLAUDE_PLUGIN_ROOT = $previous.Plugin
      [Console]::OutputEncoding = $previous.Encoding
    }
    return [pscustomobject]@{ Output = ($output -join "`n"); ExitCode = $LASTEXITCODE }
  }
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
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

  It 'no inyecta nada sin .docs/sdd/' -Tag 'Slow' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $false)
    $result.ExitCode | Should -Be 0
    $result.Output.Trim() | Should -BeNullOrEmpty
  }

  It 'inyecta la skill using-sdd con .docs/sdd/' -Tag 'Slow' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $true)
    $result.ExitCode | Should -Be 0
    $context = ($result.Output | ConvertFrom-Json).hookSpecificOutput
    $context.hookEventName | Should -Be 'SessionStart'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-start-feature'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-start-patch'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-consult'
    $context.additionalContext | Should -Match 'name: using-sdd'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-config'
    $context.additionalContext | Should -Match 'sdd-kit:sdd-roadmap'
  }

  It 'avisa con las dos versiones y los comandos cuando el proyecto pide un kit mayor' -Tag 'Slow' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    # 10.0.0 frente a 2.x: una comparación de texto diría que es menor.
    $result = Invoke-SessionStart (New-ProjectDir $true '10.0.0')
    $result.ExitCode | Should -Be 0
    $json = $result.Output | ConvertFrom-Json
    foreach ($text in $json.systemMessage, $json.hookSpecificOutput.additionalContext) {
      $text | Should -Match '10\.0\.0'
      $text | Should -Match ([regex]::Escape($script:LoadedVersion))
      $text | Should -Match ([regex]::Escape('claude plugin update sdd-kit@sdd-kit --scope project'))
      $text | Should -Match 'reinici'
      $text | Should -Match '/reload-plugins'
    }
    $json.hookSpecificOutput.additionalContext | Should -Match 'name: using-sdd'
  }

  It 'no avisa cuando el proyecto pide la versión cargada o una menor' -Tag 'Slow' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    foreach ($version in $script:LoadedVersion, '1.9.9', $null) {
      $result = Invoke-SessionStart (New-ProjectDir $true $version)
      $result.ExitCode | Should -Be 0
      $result.Output | Should -Not -Match 'plugin update'
      ($result.Output | ConvertFrom-Json).hookSpecificOutput.additionalContext | Should -Match 'name: using-sdd'
    }
  }

  It 'avisa de migraciones pendientes con las dos versiones y la frase de migrar' -Tag 'Slow' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $true '2.0.0')
    $result.ExitCode | Should -Be 0
    $json = $result.Output | ConvertFrom-Json
    foreach ($text in $json.systemMessage, $json.hookSpecificOutput.additionalContext) {
      $text | Should -Match 'el proyecto tiene aplicado el kit 2\.0\.0'
      $text | Should -Match ('migraciones hasta la ' + [regex]::Escape($script:LatestMigration))
      $text | Should -Match 'ponme el proyecto al día con sdd-init-brownfield'
    }
    $json.hookSpecificOutput.additionalContext | Should -Match 'name: using-sdd'
  }

  It 'no avisa de migraciones con el proyecto al día o sin sdd-kit.json' -Tag 'Slow' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    foreach ($version in $script:LatestMigration, $null) {
      $result = Invoke-SessionStart (New-ProjectDir $true $version)
      $result.ExitCode | Should -Be 0
      $result.Output | Should -Not -Match 'migraciones hasta'
      ($result.Output | ConvertFrom-Json).hookSpecificOutput.additionalContext | Should -Match 'name: using-sdd'
    }
  }

  It 'no avisa ni se cae sin carpeta de migraciones en el kit cargado' -Tag 'Slow' {
    if (-not $script:Bash) { Set-ItResult -Skipped -Because 'no hay bash ejecutable'; return }
    $result = Invoke-SessionStart (New-ProjectDir $true '2.0.0') (New-KitCopyWithoutMigrations)
    $result.ExitCode | Should -Be 0
    $result.Output | Should -Not -Match 'migraciones hasta'
    ($result.Output | ConvertFrom-Json).hookSpecificOutput.additionalContext | Should -Match 'name: using-sdd'
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