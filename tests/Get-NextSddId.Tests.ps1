BeforeAll {
  $script:Script = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Get-NextSddId.ps1'
  $script:Fixtures = Join-Path $PSScriptRoot 'fixtures/task-ids'
  $script:RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

  function Invoke-NextId([string]$Root) {
    if (-not (Test-Path $script:Script)) { throw "No existe el script $script:Script" }
    $errFile = Join-Path (New-TempDirectory) 'stderr.txt'
    $stdout = & pwsh -NoProfile -File $script:Script -ProjectRoot $Root 2>$errFile
    return [pscustomobject]@{
      Id       = ($stdout | Out-String).Trim()
      Error    = (Get-Content $errFile -Raw)
      ExitCode = $LASTEXITCODE
    }
  }

  function New-TempDirectory {
    # Directorio propio y no el del repo: un git init con la ruta mal resuelta reinicializaría
    # el worktree en el que corre la suite.
    $path = Join-Path ([System.IO.Path]::GetTempPath()) ('sdd-task-ids-' + [guid]::NewGuid().ToString())
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    return (Resolve-Path $path).Path
  }

  function Invoke-GitIsolated([string]$Repo, [string[]]$GitArguments) {
    # Un hook de git exporta GIT_DIR y GIT_WORK_TREE al entorno, y con ellas puestas `git -C`
    # opera sobre el repositorio del hook: un `git init` aquí reinicializaría el repo del kit.
    $names = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR')
    $saved = @{}
    foreach ($name in $names) {
      $saved[$name] = [Environment]::GetEnvironmentVariable($name)
      Remove-Item "Env:\$name" -ErrorAction SilentlyContinue
    }
    try { return (& git -C $Repo @GitArguments) }
    finally {
      foreach ($name in $names) {
        if ($null -ne $saved[$name]) { Set-Item "Env:\$name" $saved[$name] }
      }
    }
  }

  function Copy-FixtureToRepo([string]$Name, [string[]]$Branches) {
    $repo = Join-Path (New-TempDirectory) 'project'
    Copy-Item -Recurse (Join-Path $script:Fixtures $Name) $repo
    Invoke-GitIsolated $repo @('init', '-q', '-b', 'main') | Out-Null
    Invoke-GitIsolated $repo @('add', '-A') | Out-Null
    Invoke-GitIsolated $repo @('-c', 'user.email=fixture@local', '-c', 'user.name=Fixture', 'commit', '-qm', 'fixture') | Out-Null
    foreach ($branch in $Branches) { Invoke-GitIsolated $repo @('branch', $branch) | Out-Null }
    return $repo
  }
}

Describe 'Get-NextSddId.ps1' {
  Context 'proyecto en modo sequence' {
    BeforeAll { $script:Result = Invoke-NextId (Join-Path $script:Fixtures 'sequence-project') }

    It 'devuelve el id siguiente al mayor de specs/ y del roadmap' {
      $script:Result.Id | Should -Be '0006'
    }

    It 'sale con código 0 cuando devuelve un id' {
      $script:Result.ExitCode | Should -Be 0
    }

    It 'no confunde fechas, versiones ni cantidades del roadmap con ids' {
      $script:Result.Id | Should -Not -Be '2027'
      $script:Result.Id | Should -Not -Be '1025'
    }
  }

  Context 'secuencia única de tasks y patches' {
    It 'cuenta el id de un patch como ocupado' {
      # El mayor id de sequence-project es el del patch 0004 en specs/; si solo contara las
      # tasks, el siguiente saldría de 0003 y no de 0005 (la fila del roadmap).
      (Invoke-NextId (Join-Path $script:Fixtures 'sequence-project')).Id | Should -Be '0006'
    }

    It 'avisa y no devuelve id cuando dos carpetas comparten id entre carriles' {
      $result = Invoke-NextId (Join-Path $script:Fixtures 'duplicate-ids')
      $result.Id | Should -BeNullOrEmpty
      $result.Error | Should -Match '0003'
      $result.ExitCode | Should -Be 1
    }
  }

  Context 'proyecto sin ids reales' {
    It 'devuelve 0001 cuando todo el histórico es 0000' {
      (Invoke-NextId (Join-Path $script:Fixtures 'only-zeros')).Id | Should -Be '0001'
    }
  }

  Context 'proyecto en modo tracker' {
    It 'avisa y no devuelve id con ids.mode tracker' {
      $result = Invoke-NextId (Join-Path $script:Fixtures 'tracker-project')
      $result.Id | Should -BeNullOrEmpty
      $result.Error | Should -Match 'tracker|gestor'
      $result.ExitCode | Should -Be 1
    }

    It 'trata la ausencia del campo ids como modo tracker' {
      $result = Invoke-NextId (Join-Path $script:Fixtures 'no-ids-field')
      $result.Id | Should -BeNullOrEmpty
      $result.ExitCode | Should -Be 1
    }
  }

  Context 'ramas del repositorio' {
    It 'cuenta el id de una rama aunque no tenga carpeta en specs/' {
      $repo = Copy-FixtureToRepo 'sequence-project' @('feature/0009-export')
      (Invoke-NextId $repo).Id | Should -Be '0010'
    }

    It 'cuenta las ramas de cualquier prefijo, no solo feature/' {
      $repo = Copy-FixtureToRepo 'sequence-project' @('hotfix/0011')
      (Invoke-NextId $repo).Id | Should -Be '0012'
    }

    It 'ignora las variables de entorno de git del proceso que lo invoca' {
      # Un hook de git exporta GIT_DIR y GIT_WORK_TREE, y con ellas en el entorno `git -C`
      # responde por el repositorio del hook en vez de por el del proyecto.
      $kitGitDir = Invoke-GitIsolated $script:RepoRoot @('rev-parse', '--absolute-git-dir')
      try {
        $env:GIT_DIR = $kitGitDir
        $env:GIT_WORK_TREE = $script:RepoRoot
        (Invoke-NextId (Join-Path $script:Fixtures 'sequence-project')).Id | Should -Be '0006'
      }
      finally {
        Remove-Item Env:\GIT_DIR -ErrorAction SilentlyContinue
        Remove-Item Env:\GIT_WORK_TREE -ErrorAction SilentlyContinue
      }
    }

    It 'funciona en un directorio que no es repositorio git' {
      $plain = Join-Path (New-TempDirectory) 'project'
      Copy-Item -Recurse (Join-Path $script:Fixtures 'sequence-project') $plain
      (Invoke-NextId $plain).Id | Should -Be '0006'
    }
  }

  Context 'el script no modifica el proyecto' {
    It 'deja el árbol de trabajo sin cambios' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Invoke-NextId $repo | Out-Null
      Invoke-GitIsolated $repo @('status', '--porcelain') | Should -BeNullOrEmpty
    }

    It 'no contacta con el remoto' {
      Get-Content $script:Script -Raw -ErrorAction Stop | Should -Not -Match 'git\s+fetch'
    }
  }
}
