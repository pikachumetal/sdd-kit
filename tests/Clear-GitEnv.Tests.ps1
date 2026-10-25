BeforeAll {
  $script:ExpectedGitEnvNames = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY')

  # El proceso que corre la suite puede ser el pre-commit, con estas variables puestas: se guardan a
  # mano, sin el helper que se está probando, y se reponen tras cada test.
  function Get-GitEnvSnapshot {
    $snapshot = @{}
    foreach ($name in $script:ExpectedGitEnvNames) { $snapshot[$name] = [Environment]::GetEnvironmentVariable($name) }
    return $snapshot
  }

  function Set-GitEnvSnapshot([hashtable]$Snapshot) {
    foreach ($name in $Snapshot.Keys) {
      if ($null -eq $Snapshot[$name]) { Remove-Item -LiteralPath "Env:\$name" -ErrorAction SilentlyContinue; continue }
      Set-Item -LiteralPath "Env:\$name" -Value $Snapshot[$name]
    }
  }

  $script:Original = Get-GitEnvSnapshot
  $script:HelperPath = Join-Path $PSScriptRoot 'Clear-GitEnv.ps1'
}

AfterAll {
  Set-GitEnvSnapshot $script:Original
}

Describe 'Clear-GitEnv.ps1' {
  AfterEach {
    Set-GitEnvSnapshot $script:Original
  }

  It 'dot-sourcearlo no borra ninguna variable' {
    $env:GIT_INDEX_FILE = 'C:\repo\.git\index.lock'
    . $script:HelperPath
    Test-Path Env:\GIT_INDEX_FILE | Should -BeTrue
  }

  It 'Clear-GitEnv borra las cinco variables, no las deja vacías' {
    . $script:HelperPath
    foreach ($name in $script:ExpectedGitEnvNames) { Set-Item -LiteralPath "Env:\$name" -Value "valor-$name" }
    Clear-GitEnv | Out-Null
    $remaining = $script:ExpectedGitEnvNames | Where-Object { Test-Path "Env:\$_" }
    $remaining | Should -BeNullOrEmpty
  }

  It 'Restore-GitEnv repone el valor exacto de las que existían' {
    . $script:HelperPath
    $env:GIT_DIR = 'C:\ruta con espacios\.git'
    $env:GIT_INDEX_FILE = 'C:\ruta con espacios\.git\index'
    $saved = Clear-GitEnv
    Restore-GitEnv $saved
    @($env:GIT_DIR, $env:GIT_INDEX_FILE) | Should -Be @('C:\ruta con espacios\.git', 'C:\ruta con espacios\.git\index')
  }

  It 'Restore-GitEnv deja sin existir las que no existían' {
    . $script:HelperPath
    foreach ($name in $script:ExpectedGitEnvNames) { Remove-Item -LiteralPath "Env:\$name" -ErrorAction SilentlyContinue }
    $env:GIT_DIR = 'C:\repo\.git'
    $saved = Clear-GitEnv
    Restore-GitEnv $saved
    $present = $script:ExpectedGitEnvNames | Where-Object { Test-Path "Env:\$_" }
    $present | Should -Be @('GIT_DIR')
  }

  It 'Restore-GitEnv con $null no falla' {
    . $script:HelperPath
    { Restore-GitEnv $null } | Should -Not -Throw
  }
}

# Desde el pre-commit, un git init sin Clear-GitEnv reinicializó el repo del kit como bare (patch 0217).
Describe 'Los tests que llaman a git limpian las variables de git' {
  BeforeAll {
    # Leer la raíz del kit desde un hook es inocuo: el GIT_DIR del hook apunta a ese mismo repo.
    $script:KitRootNames = @('$script:KitRoot', '$script:RepoRoot')

    function Find-Commands($Ast) {
      $Ast.FindAll({ $args[0] -is [Management.Automation.Language.CommandAst] }, $true)
    }

    function Test-GitEnvRule([string]$Path) {
      $commands = Find-Commands ([Management.Automation.Language.Parser]::ParseFile($Path, [ref]$null, [ref]$null))
      $needsClear = $commands | Where-Object {
        if ($_.GetCommandName() -ne 'git') { return $false }
        $words = @($_.CommandElements | Select-Object -Skip 1 | ForEach-Object { $_.Extent.Text })
        $at = [array]::IndexOf($words, '-C')
        ($words -contains 'init') -or ($at -ge 0 -and $words[$at + 1] -notin $script:KitRootNames)
      }
      if (-not $needsClear) { return $true }
      foreach ($block in ($commands | Where-Object { $_.GetCommandName() -eq 'BeforeAll' })) {
        $inner = Find-Commands $block
        $sourced = $inner | Where-Object { $_.InvocationOperator -eq 'Dot' -and $_.Extent.Text -match 'Clear-GitEnv\.ps1' }
        if ($sourced -and ($inner | Where-Object { $_.GetCommandName() -eq 'Clear-GitEnv' })) { return $true }
      }
      return $false
    }

    $script:Fixture = Join-Path $TestDrive 'X.Tests.ps1'
  }

  It 'señala un test con <_> sin Clear-GitEnv' -ForEach @('git init $dir', 'git -C $dir commit -m x') {
    Set-Content $script:Fixture "BeforeAll { $_ }"
    Test-GitEnvRule $script:Fixture | Should -BeFalse
  }

  It 'acepta el mismo test con Clear-GitEnv en su BeforeAll' {
    Set-Content $script:Fixture 'BeforeAll { . (Join-Path $PSScriptRoot ''Clear-GitEnv.ps1''); $saved = Clear-GitEnv; git init $dir }'
    Test-GitEnvRule $script:Fixture | Should -BeTrue
  }

  It 'no señala una lectura de la raíz del kit ni un git init dentro de un texto' {
    Set-Content $script:Fixture "It 'x' { git -C `$script:KitRoot ls-files; 'git init `$dir' }"
    Test-GitEnvRule $script:Fixture | Should -BeTrue
  }

  It 'cada tests/*.Tests.ps1 que llama a git limpia las variables en un BeforeAll' {
    $offenders = Get-ChildItem $PSScriptRoot -Filter '*.Tests.ps1' | Where-Object { -not (Test-GitEnvRule $_.FullName) } | ForEach-Object Name
    $offenders | Should -BeNullOrEmpty -Because 'tech-stack.md: dentro de un hook de git, git -C no basta; hay que cargar tests/Clear-GitEnv.ps1 y llamar a Clear-GitEnv en un BeforeAll'
  }
}
