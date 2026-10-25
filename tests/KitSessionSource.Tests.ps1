BeforeAll {
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  # Dentro del pre-commit, GIT_DIR apunta al repo del kit: sin esto, git init lo reinicializa como bare.
  $script:SavedGitEnv = Clear-GitEnv
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:HookScript = Join-Path $script:KitRoot '.claude/hooks/Test-KitSessionSource.ps1'
  $script:ProjectDir = Join-Path ([IO.Path]::GetTempPath()) ('kit-session-' + [guid]::NewGuid().ToString('N'))
  New-Item -ItemType Directory -Path $script:ProjectDir -Force | Out-Null
  git init --quiet $script:ProjectDir
  git -C $script:ProjectDir config core.hooksPath .githooks

  function Invoke-KitSessionHook([AllowNull()][string]$SessionRoot, [string]$ProjectDir) {
    $previous = @{ Root = $env:SDD_KIT_SESSION_ROOT; Project = $env:CLAUDE_PROJECT_DIR }
    if ($SessionRoot) { $env:SDD_KIT_SESSION_ROOT = $SessionRoot } else { Remove-Item Env:\SDD_KIT_SESSION_ROOT -ErrorAction SilentlyContinue }
    $env:CLAUDE_PROJECT_DIR = $ProjectDir
    $global:LASTEXITCODE = -1
    try { $output = & $script:HookScript }
    finally {
      if ($null -eq $previous.Root) { Remove-Item Env:\SDD_KIT_SESSION_ROOT -ErrorAction SilentlyContinue } else { $env:SDD_KIT_SESSION_ROOT = $previous.Root }
      if ($null -eq $previous.Project) { Remove-Item Env:\CLAUDE_PROJECT_DIR -ErrorAction SilentlyContinue } else { $env:CLAUDE_PROJECT_DIR = $previous.Project }
    }
    return [pscustomobject]@{ Output = (@($output) -join "`n"); ExitCode = $LASTEXITCODE }
  }
}

AfterAll {
  Remove-Item -LiteralPath $script:ProjectDir -Recurse -Force -ErrorAction SilentlyContinue
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'Hook SessionStart del repo' {
  It 'la sesión lanzada con el script no escribe nada y sale con 0' {
    $result = Invoke-KitSessionHook $script:ProjectDir $script:ProjectDir
    $result.Output | Should -BeNullOrEmpty
    $result.ExitCode | Should -Be 0
  }

  It 'la misma carpeta escrita de otra forma tampoco avisa' {
    $sameFolder = ($script:ProjectDir.ToUpperInvariant() -replace '\\', '/') + '/'
    (Invoke-KitSessionHook $sameFolder $script:ProjectDir).Output | Should -BeNullOrEmpty
  }

  Context 'sin SDD_KIT_SESSION_ROOT' {
    BeforeAll {
      $script:Result = Invoke-KitSessionHook $null $script:ProjectDir
      $script:Json = $script:Result.Output | ConvertFrom-Json
    }

    It 'sale con 0' {
      $script:Result.ExitCode | Should -Be 0
    }

    It 'systemMessage nombra Start-KitSession.ps1' {
      $script:Json.systemMessage | Should -Match 'Start-KitSession\.ps1'
    }

    It 'hookSpecificOutput es de SessionStart' {
      $script:Json.hookSpecificOutput.hookEventName | Should -Be 'SessionStart'
    }

    It 'additionalContext dice que las skills vienen de la caché' {
      $script:Json.hookSpecificOutput.additionalContext | Should -Match 'caché'
    }

    It 'additionalContext manda contrastar con skills/<nombre>/SKILL.md de la rama' {
      $script:Json.hookSpecificOutput.additionalContext | Should -Match ([regex]::Escape('skills/<nombre>/SKILL.md'))
    }

    It 'systemMessage nombra las skills y los agentes' {
      $script:Json.systemMessage | Should -Match 'Las skills y los agentes del kit'
    }

    It 'additionalContext nombra los agentes sdd-kit:*' {
      $script:Json.hookSpecificOutput.additionalContext | Should -Match ([regex]::Escape('Las skills y los agentes sdd-kit:*'))
    }

    It 'additionalContext manda leer de la rama una skill que no resuelve' {
      $script:Json.hookSpecificOutput.additionalContext | Should -Match 'no resuelve'
    }

    It 'systemMessage dice cómo reanudar con el script' {
      $script:Json.systemMessage | Should -Match '--resume'
      $script:Json.systemMessage | Should -Match '--continue'
    }

    It 'no avisa de los hooks de git si core.hooksPath es .githooks' {
      $script:Json.systemMessage | Should -Not -Match 'core\.hooksPath'
    }
  }

  Context 'con SDD_KIT_SESSION_ROOT de otro worktree' {
    BeforeAll {
      $script:OtherRoot = Join-Path ([IO.Path]::GetTempPath()) 'otro-worktree'
      $script:Json = (Invoke-KitSessionHook $script:OtherRoot $script:ProjectDir).Output | ConvertFrom-Json
    }

    It 'avisa nombrando las skills y los agentes' {
      $script:Json.systemMessage | Should -Match 'Las skills y los agentes del kit'
    }

    It 'avisa nombrando las dos carpetas' {
      $script:Json.systemMessage | Should -Match ([regex]::Escape($script:OtherRoot))
      $script:Json.systemMessage | Should -Match ([regex]::Escape($script:ProjectDir))
    }

    It 'da al agente la misma instrucción' {
      $script:Json.hookSpecificOutput.additionalContext | Should -Match ([regex]::Escape('skills/<nombre>/SKILL.md'))
    }
  }

  It 'con SDD_KIT_SESSION_ROOT inválida avisa y sale con 0' {
    $result = Invoke-KitSessionHook '   ' $script:ProjectDir
    $result.ExitCode | Should -Be 0
    ($result.Output | ConvertFrom-Json).systemMessage | Should -Not -BeNullOrEmpty
  }
}

Describe 'Hook SessionStart: hooks de git' {
  BeforeAll {
    $script:BareProject = Join-Path ([IO.Path]::GetTempPath()) ('kit-session-' + [guid]::NewGuid().ToString('N'))
    git init --quiet $script:BareProject
    $script:Result = Invoke-KitSessionHook $script:BareProject $script:BareProject
    $script:Json = $script:Result.Output | ConvertFrom-Json
  }

  AfterAll {
    Remove-Item -LiteralPath $script:BareProject -Recurse -Force -ErrorAction SilentlyContinue
  }

  It 'sin core.hooksPath avisa aunque la sesión salga del script, y sale con 0' {
    $script:Result.ExitCode | Should -Be 0
    $script:Json.systemMessage | Should -Match 'hooks de git'
  }

  It 'systemMessage da el comando para activarlos' {
    $script:Json.systemMessage | Should -Match ([regex]::Escape('git config core.hooksPath .githooks'))
  }

  It 'additionalContext avisa al agente de que el pre-commit no corre' {
    $script:Json.hookSpecificOutput.additionalContext | Should -Match 'pre-commit'
  }

  It 'no da el aviso de la caché si la sesión salió del script' {
    $script:Json.systemMessage | Should -Not -Match 'caché'
  }
}

Describe 'Start-KitSession.ps1' {
  BeforeAll {
    $script:Launcher = @(Get-Content (Join-Path $script:KitRoot 'Start-KitSession.ps1'))
    $script:ExportLine = [array]::FindIndex([string[]]$script:Launcher, [Predicate[string]] { param($l) $l -match '^\s*\$env:SDD_KIT_SESSION_ROOT\s*=\s*\$PSScriptRoot\s*$' })
    $script:ClaudeLine = [array]::FindIndex([string[]]$script:Launcher, [Predicate[string]] { param($l) $l -match '^\s*claude\s' })
  }

  It 'exporta SDD_KIT_SESSION_ROOT con su carpeta antes de invocar claude' {
    $script:ExportLine | Should -BeGreaterOrEqual 0
    $script:ClaudeLine | Should -BeGreaterThan $script:ExportLine
  }

  It 'documenta cómo reanudar una sesión' {
    ($script:Launcher -join "`n") | Should -Match '--resume'
    ($script:Launcher -join "`n") | Should -Match '--continue'
  }

  It 'restaura la variable al salir claude' {
    ($script:Launcher -join "`n") | Should -Match 'finally\s*\{[^}]*SDD_KIT_SESSION_ROOT'
  }
}

Describe '.claude/settings.json' {
  It 'registra un hook SessionStart que ejecuta Test-KitSessionSource.ps1 con pwsh' {
    $settings = Get-Content (Join-Path $script:KitRoot '.claude/settings.json') -Raw | ConvertFrom-Json
    $commands = @($settings.hooks.SessionStart | ForEach-Object { $_.hooks } | ForEach-Object { $_.command })
    $commands | Where-Object { $_ -match '\bpwsh\b' -and $_ -match 'Test-KitSessionSource\.ps1' } | Should -Not -BeNullOrEmpty
  }
}
