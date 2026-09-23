BeforeAll {
  $script:GitEnvNames = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY')

  # El proceso que corre la suite puede ser el pre-commit, con estas variables puestas: se guardan a
  # mano, sin el helper que se está probando, y se reponen tras cada test.
  function Get-GitEnvSnapshot {
    $snapshot = @{}
    foreach ($name in $script:GitEnvNames) { $snapshot[$name] = [Environment]::GetEnvironmentVariable($name) }
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
    foreach ($name in $script:GitEnvNames) { Set-Item -LiteralPath "Env:\$name" -Value "valor-$name" }
    Clear-GitEnv | Out-Null
    $remaining = $script:GitEnvNames | Where-Object { Test-Path "Env:\$_" }
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
    foreach ($name in $script:GitEnvNames) { Remove-Item -LiteralPath "Env:\$name" -ErrorAction SilentlyContinue }
    $env:GIT_DIR = 'C:\repo\.git'
    $saved = Clear-GitEnv
    Restore-GitEnv $saved
    $present = $script:GitEnvNames | Where-Object { Test-Path "Env:\$_" }
    $present | Should -Be @('GIT_DIR')
  }

  It 'Restore-GitEnv con $null no falla' {
    . $script:HelperPath
    { Restore-GitEnv $null } | Should -Not -Throw
  }
}
