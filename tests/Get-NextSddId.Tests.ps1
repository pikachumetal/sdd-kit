BeforeAll {
  $script:Script = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Get-NextSddId.ps1'
  $script:Fixtures = Join-Path $PSScriptRoot 'fixtures/task-ids'
  $script:RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv

  function Invoke-NextId([string]$Root, [string[]]$Arguments = @()) {
    if (-not (Test-Path $script:Script)) { throw "No existe el script $script:Script" }
    $errFile = Join-Path (New-TempDirectory) 'stderr.txt'
    $stdout = & pwsh -NoProfile -File $script:Script -ProjectRoot $Root @Arguments 2>$errFile
    return [pscustomobject]@{
      Id       = ($stdout | Out-String).Trim()
      Ids      = @($stdout)
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
    return (& git -C $Repo @GitArguments)
  }

  function Copy-FixtureToRepo([string]$Name, [string[]]$Branches, [string]$FolderName = 'project') {
    $repo = Join-Path (New-TempDirectory) $FolderName
    Copy-Item -Recurse (Join-Path $script:Fixtures $Name) $repo
    Invoke-GitIsolated $repo @('init', '-q', '-b', 'main') | Out-Null
    Invoke-GitIsolated $repo @('add', '-A') | Out-Null
    Invoke-GitIsolated $repo @('-c', 'user.email=fixture@local', '-c', 'user.name=Fixture', 'commit', '-qm', 'fixture') | Out-Null
    foreach ($branch in $Branches) { Invoke-GitIsolated $repo @('branch', $branch) | Out-Null }
    return $repo
  }

  function Add-UnmergedCommit([string]$Repo, [string]$Branch, [string]$RelativePath, [string]$Line) {
    # Commit en otra rama sin fusionar, como el de otro worktree que parte o reserva en paralelo.
    $current = Invoke-GitIsolated $Repo @('branch', '--show-current')
    Invoke-GitIsolated $Repo @('switch', '-qc', $Branch) | Out-Null
    $path = Join-Path $Repo $RelativePath
    New-Item -ItemType Directory -Force -Path (Split-Path $path) | Out-Null
    Add-Content -LiteralPath $path -Value $Line
    Invoke-GitIsolated $Repo @('add', '-A') | Out-Null
    Invoke-GitIsolated $Repo @('-c', 'user.email=fixture@local', '-c', 'user.name=Fixture', 'commit', '-qm', "trabajo en $Branch") | Out-Null
    Invoke-GitIsolated $Repo @('switch', '-q', $current) | Out-Null
  }

  function Get-CounterPath([string]$Repo) {
    return Join-Path $Repo '.git/sdd-ids'
  }

  function Get-Counter([string]$Repo) {
    $path = Get-CounterPath $Repo
    if (-not (Test-Path -LiteralPath $path)) { return $null }
    return (Get-Content -LiteralPath $path -Raw).Trim()
  }

  function Start-ReserveJob([string]$Root) {
    return Start-ThreadJob -ArgumentList $script:Script, $Root -ScriptBlock {
      param($ScriptPath, $Root)
      $output = & pwsh -NoProfile -File $ScriptPath -ProjectRoot $Root -Reserve 2>$null
      [pscustomobject]@{ ExitCode = $LASTEXITCODE; Id = ($output | Out-String).Trim() }
    }
  }

  function New-HeldLock([string]$Repo, [int]$OwnerPid) {
    $owner = @{ branch = 'feature/9999'; worktree = 'otra-sesion'; pid = $OwnerPid; host = [Environment]::MachineName; since = (Get-Date).ToString('o') } | ConvertTo-Json -Compress
    $stream = [System.IO.FileStream]::new((Join-Path $Repo '.git/sdd-ids.lock'), 'CreateNew', 'ReadWrite', [System.IO.FileShare]'Read, Delete')
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($owner)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Flush()
    return $stream
  }

  function Remove-HeldLock([System.IO.FileStream]$Stream, [string]$Repo) {
    $Stream.Dispose()
    Remove-Item -LiteralPath (Join-Path $Repo '.git/sdd-ids.lock') -ErrorAction SilentlyContinue
  }
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'Get-NextSddId.ps1' -Tag 'Slow' {
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

  Context 'histórico con sufijos anteriores a la secuencia' {
    It 'cuenta el id de una carpeta con sufijo alfabético' {
      (Invoke-NextId (Join-Path $script:Fixtures 'legacy-suffix')).Id | Should -Be '0007'
    }
  }

  Context 'carril proposal' {
    It 'cuenta el id de una carpeta de propuesta que no tiene fila en el roadmap' {
      (Invoke-NextId (Join-Path $script:Fixtures 'proposal-lane')).Id | Should -Be '0021'
    }

    It 'cuenta el id de una carpeta de propuesta con sufijo alfabético' {
      (Invoke-NextId (Join-Path $script:Fixtures 'proposal-suffix')).Id | Should -Be '0021'
    }
  }

  Context 'carril feature' {
    It 'cuenta las carpetas feature junto a las task y los patches' {
      (Invoke-NextId (Join-Path $script:Fixtures 'feature-lane')).Id | Should -Be '0081'
    }

    It 'cuenta una carpeta feature sin ninguna task' {
      (Invoke-NextId (Join-Path $script:Fixtures 'feature-only')).Id | Should -Be '0080'
    }

    It 'avisa del mismo id en una carpeta task y otra feature' {
      $result = Invoke-NextId (Join-Path $script:Fixtures 'mixed-duplicate')
      $result.Id | Should -BeNullOrEmpty
      $result.Error | Should -Match '0063'
      $result.ExitCode | Should -Be 1
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

    It 'avisa cuando omite las ramas porque el proyecto no es la raíz de su repositorio' {
      $result = Invoke-NextId (Join-Path $script:Fixtures 'sequence-project')
      $result.Id | Should -Be '0006'
      $result.Error | Should -Match 'rama'
    }

    It 'devuelve el id cuando la ruta del repositorio lleva caracteres no ASCII' {
      # git emite las rutas en UTF-8: con la codificación de consola por defecto, 'Estimación'
      # vuelve como 'EstimaciÃ³n' y la resolución de la raíz del repositorio falla.
      $repo = Copy-FixtureToRepo 'sequence-project' @('feature/0009-export') '0010-Estimación-con-tokens'
      $result = Invoke-NextId $repo
      $result.Id | Should -Be '0010'
      $result.ExitCode | Should -Be 0
    }

    It 'funciona en un directorio que no es repositorio git' {
      $plain = Join-Path (New-TempDirectory) 'project'
      Copy-Item -Recurse (Join-Path $script:Fixtures 'sequence-project') $plain
      (Invoke-NextId $plain).Id | Should -Be '0006'
    }
  }

  Context 'worktrees que parten en paralelo desde la misma base' {
    # Tres colisiones reales: cada worktree solo veía el roadmap y specs/ de su propia rama.
    # Las rutas llevan tildes a propósito (regla de la 0010).
    It 'cuenta una fila reservada en el roadmap de develop que la rama actual no ha integrado' {
      $repo = Copy-FixtureToRepo 'sequence-project' @('feature/partición-b') '0035-Partición-en-paralelo'
      Add-UnmergedCommit $repo 'develop' '.docs/sdd/roadmap.md' '| 0031 | Reservada por la partición | S |'
      Invoke-GitIsolated $repo @('switch', '-q', 'feature/partición-b') | Out-Null
      $result = Invoke-NextId $repo
      $result.Id | Should -Be '0032'
      $result.ExitCode | Should -Be 0
    }

    It 'cuenta una fila reservada en el roadmap de otra rama feature/ sin fusionar' {
      $repo = Copy-FixtureToRepo 'sequence-project' @() '0035-Partición-en-paralelo'
      Add-UnmergedCommit $repo 'feature/partición-a' '.docs/sdd/roadmap.md' '| 0019 | Reservada por la partición | S |'
      (Invoke-NextId $repo).Id | Should -Be '0020'
    }

    It 'cuenta la carpeta de specs/ de otra rama sin fusionar' {
      $repo = Copy-FixtureToRepo 'sequence-project' @() '0035-Partición-en-paralelo'
      Add-UnmergedCommit $repo 'feature/exportación' '.docs/sdd/specs/20260922-100000-task-0012-exportación/spec.md' '# Spec'
      (Invoke-NextId $repo).Id | Should -Be '0013'
    }

    It 'cuenta una fila reservada solo en el índice de otro worktree' {
      # Ticket de la task 0019 §1: la 0021 tenía la 0031 y la 0032 en staged y ninguna rama las mostraba.
      $repo = Copy-FixtureToRepo 'sequence-project' @() '0035-Partición-en-paralelo'
      $otherWorktree = Join-Path (Split-Path $repo) 'worktree-partición'
      Invoke-GitIsolated $repo @('worktree', 'add', '-qb', 'feature/partición', $otherWorktree) | Out-Null
      Add-Content -LiteralPath (Join-Path $otherWorktree '.docs/sdd/roadmap.md') -Value '| 0032 | Reservada en staged | S |'
      Invoke-GitIsolated $otherWorktree @('add', '-A') | Out-Null
      (Invoke-NextId $repo).Id | Should -Be '0033'
    }

    It 'cuenta la carpeta de specs/ sin commitear de otro worktree' {
      # Ticket del patch 0037 §1: un patch reserva su id con la carpeta, no con una fila del roadmap.
      $repo = Copy-FixtureToRepo 'sequence-project' @() '0035-Partición-en-paralelo'
      $otherWorktree = Join-Path (Split-Path $repo) 'worktree-patch'
      Invoke-GitIsolated $repo @('worktree', 'add', '-qb', 'feature/patch', $otherWorktree) | Out-Null
      New-Item -ItemType Directory -Path (Join-Path $otherWorktree '.docs/sdd/specs/20260923-070206-patch-0036-disparador') | Out-Null
      (Invoke-NextId $repo).Id | Should -Be '0037'
    }
  }

  Context 'rama actual con id' {
    It 'devuelve el id de la rama actual cuando no se usa en otro sitio' {
      $repo = Copy-FixtureToRepo 'sequence-project' @('feature/0027')
      Invoke-GitIsolated $repo @('switch', '-q', 'feature/0027') | Out-Null
      (Invoke-NextId $repo).Id | Should -Be '0027'
    }

    It 'no devuelve el id de la rama actual cuando otra rama ya lo usa en specs/' {
      $repo = Copy-FixtureToRepo 'sequence-project' @('feature/0027')
      Add-UnmergedCommit $repo 'feature/otra' '.docs/sdd/specs/20260922-100000-patch-0027-otro/patch.md' '# Patch'
      Invoke-GitIsolated $repo @('switch', '-q', 'feature/0027') | Out-Null
      (Invoke-NextId $repo).Id | Should -Be '0028'
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

Describe 'Get-NextSddId.ps1 -Reserve' -Tag 'Slow' {
  Context 'reserva en un repositorio' {
    It 'reserva el siguiente id y lo deja consumido en el contador del directorio común' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      $result = Invoke-NextId $repo @('-Reserve')
      $result.Id | Should -Be '0006'
      $result.ExitCode | Should -Be 0
      Get-Counter $repo | Should -Be '0006'
    }

    It 'no reutiliza un id reservado aunque el trabajo se abandone' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      (Invoke-NextId $repo @('-Reserve')).Id | Should -Be '0006'
      (Invoke-NextId $repo @('-Reserve')).Id | Should -Be '0007'
    }

    It 'devuelve ids consecutivos, uno por línea, con -Count' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      $result = Invoke-NextId $repo @('-Reserve', '-Count', '3')
      $result.Ids | Should -Be @('0006', '0007', '0008')
      Get-Counter $repo | Should -Be '0008'
    }

    It 'reserva en un contador propio cuando el proyecto está en una subcarpeta del repositorio' {
      $parent = Join-Path (New-TempDirectory) 'monorepo'
      $project = Join-Path $parent 'apps/proyecto'
      New-Item -ItemType Directory -Path (Split-Path $project) -Force | Out-Null
      Copy-Item -Recurse (Join-Path $script:Fixtures 'sequence-project') $project
      Invoke-GitIsolated $parent @('init', '-q', '-b', 'main') | Out-Null
      Set-Content -LiteralPath (Get-CounterPath $parent) -Value '0040'
      (Invoke-NextId $project @('-Reserve')).Id | Should -Be '0006'
      Get-Content -LiteralPath (Join-Path $parent '.git/sdd-ids-apps-proyecto') | Should -Be '0006'
      Get-Counter $parent | Should -Be '0040'
    }

    It 'deja el árbol de trabajo sin cambios' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Invoke-NextId $repo @('-Reserve') | Out-Null
      Invoke-GitIsolated $repo @('status', '--porcelain') | Should -BeNullOrEmpty
    }
  }

  Context 'sin -Reserve' {
    It 'propone contando el contador y no lo escribe' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Invoke-NextId $repo @('-Reserve') | Out-Null
      (Invoke-NextId $repo).Id | Should -Be '0007'
      Get-Counter $repo | Should -Be '0006'
    }

    It 'no crea el contador' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Invoke-NextId $repo | Out-Null
      Test-Path -LiteralPath (Get-CounterPath $repo) | Should -BeFalse
    }
  }

  Context 'el escaneo inicializa o corrige el contador' {
    It 'gana el escaneo cuando el contador es menor' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Set-Content -LiteralPath (Get-CounterPath $repo) -Value '0002'
      (Invoke-NextId $repo @('-Reserve')).Id | Should -Be '0006'
    }

    It 'gana el contador cuando es mayor que el escaneo' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Set-Content -LiteralPath (Get-CounterPath $repo) -Value '0040'
      (Invoke-NextId $repo @('-Reserve')).Id | Should -Be '0041'
    }

    It 'avisa de un contador ilegible y lo reinicializa con el escaneo' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Set-Content -LiteralPath (Get-CounterPath $repo) -Value 'basura'
      $result = Invoke-NextId $repo @('-Reserve')
      $result.Id | Should -Be '0006'
      $result.Error | Should -Match 'contador'
      Get-Counter $repo | Should -Be '0006'
    }
  }

  Context 'worktrees y procesos a la vez' {
    It 'comparte el contador entre los worktrees del repositorio' {
      $repo = Copy-FixtureToRepo 'sequence-project' @() '0059-Reserva-compartida'
      $otherWorktree = Join-Path (Split-Path $repo) 'worktree-reserva'
      Invoke-GitIsolated $repo @('worktree', 'add', '-qb', 'feature/otra', $otherWorktree) | Out-Null
      (Invoke-NextId $repo @('-Reserve')).Id | Should -Be '0006'
      (Invoke-NextId $otherWorktree @('-Reserve')).Id | Should -Be '0007'
    }

    It 'da ids distintos a dos procesos de dos worktrees que reservan a la vez' {
      # Los dos esperan al mismo cerrojo y compiten en cuanto se suelta.
      $repo = Copy-FixtureToRepo 'sequence-project' @() '0059-Reserva-simultánea'
      $otherWorktree = Join-Path (Split-Path $repo) 'worktree-simultáneo'
      Invoke-GitIsolated $repo @('worktree', 'add', '-qb', 'feature/otra', $otherWorktree) | Out-Null
      $lock = New-HeldLock $repo $PID
      try {
        $jobs = @((Start-ReserveJob $repo), (Start-ReserveJob $otherWorktree))
        Start-Sleep -Seconds 4
      }
      finally {
        Remove-HeldLock $lock $repo
      }
      $results = @($jobs | Wait-Job -Timeout 120 | Receive-Job)
      $results.ExitCode | Should -Be @(0, 0)
      ($results.Id | Sort-Object) | Should -Be @('0006', '0007')
      Get-Counter $repo | Should -Be '0007'
    }

    It 'falla sin reservar si el cerrojo no se libera a tiempo, nombrando al dueño' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      $lock = New-HeldLock $repo $PID
      try {
        $result = Invoke-NextId $repo @('-Reserve', '-LockTimeoutMinutes', '0.05')
      }
      finally {
        Remove-HeldLock $lock $repo
      }
      $result.ExitCode | Should -Not -Be 0
      $result.Id | Should -BeNullOrEmpty
      $result.Error | Should -Match 'feature/9999'
      Test-Path -LiteralPath (Get-CounterPath $repo) | Should -BeFalse
    }
  }

  Context 'casos en los que no reserva' {
    It 'falla sin repositorio git' {
      # El directorio temporal puede estar dentro de un repositorio (pasa en la máquina del dev-lead):
      # el techo de búsqueda impide que git lo encuentre subiendo.
      $plain = Join-Path (New-TempDirectory) 'project'
      Copy-Item -Recurse (Join-Path $script:Fixtures 'sequence-project') $plain
      try {
        $env:GIT_CEILING_DIRECTORIES = Split-Path $plain
        $result = Invoke-NextId $plain @('-Reserve')
      }
      finally {
        Remove-Item Env:\GIT_CEILING_DIRECTORIES -ErrorAction SilentlyContinue
      }
      $result.Id | Should -BeNullOrEmpty
      $result.Error | Should -Match 'git'
      $result.ExitCode | Should -Be 1
    }

    It 'no consume ningún id cuando hay ids duplicados' {
      $repo = Copy-FixtureToRepo 'duplicate-ids' @()
      $result = Invoke-NextId $repo @('-Reserve')
      $result.Id | Should -BeNullOrEmpty
      $result.ExitCode | Should -Be 1
      Test-Path -LiteralPath (Get-CounterPath $repo) | Should -BeFalse
    }

    It 'no crea el contador en modo tracker' {
      $repo = Copy-FixtureToRepo 'tracker-project' @()
      $result = Invoke-NextId $repo @('-Reserve')
      $result.ExitCode | Should -Be 1
      Test-Path -LiteralPath (Get-CounterPath $repo) | Should -BeFalse
    }

    It 'falla sin reservar si la reserva pasaría de 9999' {
      $repo = Copy-FixtureToRepo 'sequence-project' @()
      Set-Content -LiteralPath (Get-CounterPath $repo) -Value '9998'
      $result = Invoke-NextId $repo @('-Reserve', '-Count', '2')
      $result.Id | Should -BeNullOrEmpty
      $result.ExitCode | Should -Be 1
      Get-Counter $repo | Should -Be '9998'
    }
  }
}
