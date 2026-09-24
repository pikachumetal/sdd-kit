BeforeAll {
  $script:Script = (Resolve-Path (Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Invoke-SddMerge.ps1')).Path
  $script:LogBuilder = (Resolve-Path (Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Build-EstimationLog.ps1')).Path

  # Sin UTF-8 la salida de git y de los pwsh hijos se decodifica con la página de códigos de la consola
  # y las rutas con tildes de la fixture dejan de casar.
  $script:PreviousEncoding = [Console]::OutputEncoding
  [Console]::OutputEncoding = [Text.Encoding]::UTF8

  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv

  function Invoke-FixtureGit([string]$Dir, [string[]]$Arguments) {
    $output = & git -C $Dir @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) { throw "git $($Arguments -join ' ') en ${Dir}: $($output | Out-String)" }
    return @($output | Where-Object { $_ -isnot [System.Management.Automation.ErrorRecord] } | ForEach-Object { "$_" })
  }

  function Get-Sha([string]$Dir, [string]$Rev) {
    return @(Invoke-FixtureGit $Dir @('rev-parse', $Rev))[0]
  }

  function Write-FixtureFile([string]$Dir, [string]$RelativePath, [string]$Content) {
    $path = Join-Path $Dir $RelativePath
    New-Item -ItemType Directory -Path (Split-Path $path) -Force | Out-Null
    [System.IO.File]::WriteAllText($path, $Content, [System.Text.UTF8Encoding]::new($false))
  }

  function Save-All([string]$Dir, [string]$Message) {
    Invoke-FixtureGit $Dir @('add', '-A') | Out-Null
    Invoke-FixtureGit $Dir @('commit', '-q', '-m', $Message) | Out-Null
  }

  function Set-FixtureConfig([string]$Dir, [string]$HooksDir) {
    $settings = @{ 'user.name' = 'Fixture'; 'user.email' = 'fixture@example.com'; 'core.hooksPath' = $HooksDir; 'core.autocrlf' = 'false'; 'commit.gpgsign' = 'false' }
    foreach ($key in $settings.Keys) { Invoke-FixtureGit $Dir @('config', $key, $settings[$key]) | Out-Null }
  }

  function Write-PatchSpec([string]$Dir, [string]$Id) {
    $content = "---`ntask: $Id`n---`n## 5. Tiempo (ligero)`n`n- Estimación: 1h`n- Real: 1 h`n"
    Write-FixtureFile $Dir ".docs/sdd/specs/20260901-100000-patch-$Id-fixture/patch.md" $content
    & $script:LogBuilder -Root $Dir -WarningAction SilentlyContinue 6>$null | Out-Null
  }

  function New-SeedRepo([string]$Seed, [string]$HooksDir) {
    New-Item -ItemType Directory -Path $Seed -Force | Out-Null
    Invoke-FixtureGit $Seed @('init', '-q', '-b', 'develop') | Out-Null
    Set-FixtureConfig $Seed $HooksDir
    Write-FixtureFile $Seed '.docs/sdd/sdd-kit.json' '{"merge": {"into": "develop", "noFf": true, "removeWorktree": false}}'
    Write-FixtureFile $Seed 'README.md' "base`n"
    Write-PatchSpec $Seed '0100'
    Save-All $Seed 'chore: base'
    foreach ($id in '0001', '0002') {
      Invoke-FixtureGit $Seed @('checkout', '-q', '-b', "feature/$id", 'develop') | Out-Null
      Write-FixtureFile $Seed "feature-$id.txt" "$id`n"
      Save-All $Seed "feat: $id"
    }
    Invoke-FixtureGit $Seed @('checkout', '-q', 'develop') | Out-Null
  }

  # La forma del repo del equipo: un remoto, un clon bare y un worktree por rama en una carpeta hermana.
  function New-MergeFixture([string]$Name) {
    $root = Join-Path $TestDrive "Fusión ñ $Name"
    $hooks = Join-Path $root 'no-hooks'
    New-Item -ItemType Directory -Path $hooks -Force | Out-Null
    $seed = Join-Path $root 'seed'
    New-SeedRepo $seed $hooks
    $remote = Join-Path $root 'remote.git'
    Invoke-FixtureGit $root @('clone', '-q', '--bare', $seed, $remote) | Out-Null
    Invoke-FixtureGit $remote @('config', 'core.hooksPath', $hooks) | Out-Null
    $repo = Join-Path $root 'git/repo.git'
    Invoke-FixtureGit $root @('clone', '-q', '--bare', $remote, $repo) | Out-Null
    Set-FixtureConfig $repo $hooks
    Invoke-FixtureGit $repo @('config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*') | Out-Null
    Invoke-FixtureGit $repo @('fetch', '-q', 'origin') | Out-Null
    $wt = Join-Path $root 'wt'
    foreach ($id in '0001', '0002') { Invoke-FixtureGit $repo @('worktree', 'add', '-q', (Join-Path $wt $id), "feature/$id") | Out-Null }
    return [pscustomobject]@{ Root = $root; Seed = $seed; Remote = $remote; Repo = $repo; Wt = $wt; Lock = (Join-Path $repo 'sdd-merge.lock') }
  }

  function Push-RemoteCommit($Fixture, [string]$RelativePath, [string]$Content) {
    Write-FixtureFile $Fixture.Seed $RelativePath $Content
    Save-All $Fixture.Seed "chore: $RelativePath en el remoto"
    Invoke-FixtureGit $Fixture.Seed @('push', '-q', $Fixture.Remote, 'develop') | Out-Null
    return Get-Sha $Fixture.Seed 'HEAD'
  }

  function Invoke-Merge([string]$Worktree, [string[]]$Arguments = @()) {
    $output = & pwsh -NoProfile -File $script:Script -ProjectRoot $Worktree @Arguments 2>&1
    return [pscustomobject]@{ ExitCode = $LASTEXITCODE; Text = ($output | Out-String) }
  }

  function Start-MergeJob([string]$Worktree, [string[]]$Arguments) {
    return Start-ThreadJob -ArgumentList $script:Script, $Worktree, $Arguments -ScriptBlock {
      param($ScriptPath, $Worktree, $Arguments)
      [Console]::OutputEncoding = [Text.Encoding]::UTF8
      $output = & pwsh -NoProfile -File $ScriptPath -ProjectRoot $Worktree @Arguments 2>&1
      [pscustomobject]@{ ExitCode = $LASTEXITCODE; Text = ($output | Out-String) }
    }
  }

  function Wait-ForPath([string]$Path, [int]$Seconds) {
    $deadline = (Get-Date).AddSeconds($Seconds)
    while (-not (Test-Path -LiteralPath $Path)) {
      if ((Get-Date) -gt $deadline) { throw "No apareció $Path en $Seconds s" }
      Start-Sleep -Milliseconds 200
    }
  }

  function New-LockFile([string]$Path, [int]$OwnerPid, [string]$Branch) {
    $owner = @{ branch = $Branch; worktree = 'otra-sesion'; pid = $OwnerPid; host = [Environment]::MachineName; since = (Get-Date).ToString('o') } | ConvertTo-Json -Compress
    $stream = [System.IO.FileStream]::new($Path, 'CreateNew', 'ReadWrite', [System.IO.FileShare]'Read, Delete')
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($owner)
    $stream.Write($bytes, 0, $bytes.Length)
    $stream.Flush()
    return $stream
  }

  function Get-DeadPid {
    $process = Start-Process pwsh -ArgumentList '-NoProfile', '-Command', 'exit' -PassThru -WindowStyle Hidden
    $process.WaitForExit()
    return $process.Id
  }

  function Assert-CleanedUp($Fixture) {
    Test-Path -LiteralPath (Join-Path $Fixture.Wt 'merge-0001') | Should -BeFalse
    (Invoke-FixtureGit $Fixture.Repo @('worktree', 'list')) -join "`n" | Should -Not -Match 'merge-0001'
    Test-Path -LiteralPath $Fixture.Lock | Should -BeFalse
  }
}

AfterAll {
  [Console]::OutputEncoding = $script:PreviousEncoding
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'El merge del cierre espera su turno' -Tag 'Slow' {
  It 'el segundo proceso espera, dice quién tiene el cerrojo y fusiona sobre lo que dejó el primero' {
    $fx = New-MergeFixture 'turno'
    $first = Start-MergeJob (Join-Path $fx.Wt '0001') @('-Push', '-VerifyCommand', 'Start-Sleep -Seconds 6')
    Wait-ForPath $fx.Lock 60
    $second = Start-MergeJob (Join-Path $fx.Wt '0002') @('-Push')
    $results = @($first, $second) | Wait-Job -Timeout 180 | Receive-Job

    $results[0].ExitCode | Should -Be 0 -Because $results[0].Text
    $results[1].ExitCode | Should -Be 0 -Because $results[1].Text
    $results[1].Text | Should -Match 'Esperando el cerrojo de merge: lo tiene feature/0001'
    $results[1].Text | Should -Match 'desde \d{4}-\d{2}-\d{2} \d{2}:\d{2}'
    Invoke-FixtureGit $fx.Repo @('log', '--first-parent', '--format=%s', '-2', 'develop') | Should -Be @('merge: feature/0002 en develop', 'merge: feature/0001 en develop')
    Get-Sha $fx.Repo 'develop^1^2' | Should -Be (Get-Sha $fx.Repo 'feature/0001')
    Get-Sha $fx.Remote 'develop' | Should -Be (Get-Sha $fx.Repo 'develop')
  }

  It 'si el cerrojo no se libera a tiempo, falla nombrando al dueño y no toca develop' {
    $fx = New-MergeFixture 'timeout'
    $before = Get-Sha $fx.Repo 'develop'
    $lock = New-LockFile $fx.Lock $PID 'feature/9999'
    try {
      $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-LockTimeoutMinutes', '0.05')
    }
    finally {
      $lock.Dispose()
      Remove-Item -LiteralPath $fx.Lock -ErrorAction SilentlyContinue
    }

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'feature/9999'
    Get-Sha $fx.Repo 'develop' | Should -Be $before
  }

  It 'toma el cerrojo de un proceso que ya no existe y lo dice' {
    $fx = New-MergeFixture 'huerfano'
    (New-LockFile $fx.Lock (Get-DeadPid) 'feature/9998').Dispose()

    $result = Invoke-Merge (Join-Path $fx.Wt '0001')

    $result.ExitCode | Should -Be 0 -Because $result.Text
    $result.Text | Should -Match 'hu.+rfano'
    Test-Path -LiteralPath $fx.Lock | Should -BeFalse
  }
}

Describe 'El merge del cierre parte de la rama destino publicada' -Tag 'Slow' {
  It 'integra los commits del remoto antes de fusionar la feature' {
    $fx = New-MergeFixture 'base'
    $remoteSha = Push-RemoteCommit $fx 'otra-task.txt' "otra`n"

    $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-Push')

    $result.ExitCode | Should -Be 0 -Because $result.Text
    Get-Sha $fx.Repo 'develop^1' | Should -Be $remoteSha
    Get-Sha $fx.Repo 'develop^2' | Should -Be (Get-Sha $fx.Repo 'feature/0001')
    Get-Sha $fx.Remote 'develop' | Should -Be (Get-Sha $fx.Repo 'develop')
  }

  It 'regenera estimation-log.md cuando es el único conflicto' {
    $fx = New-MergeFixture 'log'
    $feature = Join-Path $fx.Wt '0001'
    Write-PatchSpec $feature '0001'
    Save-All $feature 'docs: cierre del patch 0001'
    Write-PatchSpec $fx.Seed '0003'
    Save-All $fx.Seed 'docs: cierre del patch 0003'
    Invoke-FixtureGit $fx.Seed @('push', '-q', $fx.Remote, 'develop') | Out-Null

    $result = Invoke-Merge $feature @('-Push')

    $result.ExitCode | Should -Be 0 -Because $result.Text
    $log = (Invoke-FixtureGit $fx.Repo @('show', 'develop:.docs/sdd/estimation-log.md')) -join "`n"
    $log | Should -Match '^<!-- AUTO-GENERADO'
    $log | Should -Match 'patch-0001-fixture'
    $log | Should -Match 'patch-0003-fixture'
    $log | Should -Not -Match '<<<<<<<'
  }

  It 'con otro conflicto falla con la lista de ficheros y deja develop en la base integrada' {
    $fx = New-MergeFixture 'conflicto'
    $remoteSha = Push-RemoteCommit $fx 'README.md' "remoto`n"
    $feature = Join-Path $fx.Wt '0001'
    Write-FixtureFile $feature 'README.md' "feature`n"
    Save-All $feature 'feat: README de la feature'

    $result = Invoke-Merge $feature @('-Push')

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'README\.md'
    Get-Sha $fx.Repo 'develop' | Should -Be $remoteSha
    Get-Sha $fx.Remote 'develop' | Should -Be $remoteSha
    Assert-CleanedUp $fx
  }
}

Describe 'El push del cierre publica la rama destino' -Tag 'Slow' {
  It 'con -Push fusiona --no-ff con el título acordado y deja local y remoto iguales' {
    $fx = New-MergeFixture 'push'

    $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-Push')

    $result.ExitCode | Should -Be 0 -Because $result.Text
    Get-Sha $fx.Repo 'develop^2' | Should -Be (Get-Sha $fx.Repo 'feature/0001')
    @(Invoke-FixtureGit $fx.Repo @('log', '-1', '--format=%s', 'develop'))[0] | Should -Be 'merge: feature/0001 en develop'
    (Invoke-FixtureGit $fx.Repo @('log', '-1', '--format=%b', 'develop')) -join '' | Should -Not -BeNullOrEmpty
    Get-Sha $fx.Remote 'develop' | Should -Be (Get-Sha $fx.Repo 'develop')
    Assert-CleanedUp $fx
  }

  It 'sin -Push fusiona en local y no toca el remoto' {
    $fx = New-MergeFixture 'local'
    $remoteBefore = Get-Sha $fx.Remote 'develop'

    $result = Invoke-Merge (Join-Path $fx.Wt '0001')

    $result.ExitCode | Should -Be 0 -Because $result.Text
    Get-Sha $fx.Repo 'develop^2' | Should -Be (Get-Sha $fx.Repo 'feature/0001')
    Get-Sha $fx.Remote 'develop' | Should -Be $remoteBefore
  }
}

Describe 'Un merge del cierre que falla deja la rama destino como estaba' -Tag 'Slow' {
  It 'con la verificación en rojo no fusiona, no empuja y limpia' {
    $fx = New-MergeFixture 'verificacion'
    $before = Get-Sha $fx.Repo 'develop'

    $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-Push', '-VerifyCommand', 'exit 1')

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'verificaci'
    Get-Sha $fx.Repo 'develop' | Should -Be $before
    Get-Sha $fx.Remote 'develop' | Should -Be $before
    Assert-CleanedUp $fx
  }

  It 'con el hook pre-merge-commit en rojo falla con verificación: y la salida del hook, no con conflicto' {
    $fx = New-MergeFixture 'hook'
    $before = Get-Sha $fx.Repo 'develop'
    $redHooks = Join-Path $fx.Root 'red-hooks'
    Write-FixtureFile $redHooks 'pre-merge-commit' "#!/bin/sh`necho 'Tests Failed: 3' >&2`nexit 1`n"
    Invoke-FixtureGit $fx.Repo @('config', 'core.hooksPath', $redHooks) | Out-Null

    $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-Push')

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'verificación: el hook rechazó el merge'
    $result.Text | Should -Match 'Tests Failed: 3'
    $result.Text | Should -Not -Match 'conflicto'
    Get-Sha $fx.Repo 'develop' | Should -Be $before
    Get-Sha $fx.Remote 'develop' | Should -Be $before
    Assert-CleanedUp $fx
  }

  It 'con -Push y sin remoto falla con push: en vez de saltarse el push' {
    $fx = New-MergeFixture 'sin-remoto'
    Invoke-FixtureGit $fx.Repo @('remote', 'remove', 'origin') | Out-Null
    $before = Get-Sha $fx.Repo 'develop'

    $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-Push')

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'push:'
    Get-Sha $fx.Repo 'develop' | Should -Be $before
    Assert-CleanedUp $fx
  }
  It 'con el push rechazado devuelve develop a su commit y limpia' {
    $fx = New-MergeFixture 'rechazo'
    $before = Get-Sha $fx.Repo 'develop'
    $rejectHooks = Join-Path $fx.Root 'reject-hooks'
    Write-FixtureFile $rejectHooks 'pre-receive' "#!/bin/sh`nexit 1`n"
    Invoke-FixtureGit $fx.Remote @('config', 'core.hooksPath', $rejectHooks) | Out-Null

    $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-Push')

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'push'
    Get-Sha $fx.Repo 'develop' | Should -Be $before
    Get-Sha $fx.Remote 'develop' | Should -Be $before
    Assert-CleanedUp $fx
  }

  It 'el worktree temporal va junto a los demás worktrees y se retira' {
    $fx = New-MergeFixture 'ruta'
    $marker = Join-Path $fx.Root 'cwd.txt'

    $result = Invoke-Merge (Join-Path $fx.Wt '0001') @('-VerifyCommand', "(Get-Location).Path | Set-Content -LiteralPath '$marker'")

    $result.ExitCode | Should -Be 0 -Because $result.Text
    [System.IO.Path]::GetFullPath((Get-Content -LiteralPath $marker).Trim()) | Should -Be ([System.IO.Path]::GetFullPath((Join-Path $fx.Wt 'merge-0001')))
    Assert-CleanedUp $fx
  }
}

Describe 'Rama destino sacada y política de merge' -Tag 'Slow' {
  It 'con develop sacada y con cambios falla con la lista y no la toca' {
    $fx = New-MergeFixture 'sucia'
    $dev = Join-Path $fx.Wt 'dev'
    Invoke-FixtureGit $fx.Repo @('worktree', 'add', '-q', $dev, 'develop') | Out-Null
    Write-FixtureFile $dev 'README.md' "cambio de otra sesión`n"
    $before = Get-Sha $fx.Repo 'develop'

    $result = Invoke-Merge (Join-Path $fx.Wt '0001')

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'README\.md'
    Get-Content -LiteralPath (Join-Path $dev 'README.md') -Raw | Should -Be "cambio de otra sesión`n"
    Get-Sha $fx.Repo 'develop' | Should -Be $before
    Test-Path -LiteralPath $fx.Lock | Should -BeFalse
  }

  It 'con develop sacada y limpia fusiona ahí y no retira ese worktree' {
    $fx = New-MergeFixture 'limpia'
    $dev = Join-Path $fx.Wt 'dev'
    Invoke-FixtureGit $fx.Repo @('worktree', 'add', '-q', $dev, 'develop') | Out-Null

    $result = Invoke-Merge (Join-Path $fx.Wt '0001')

    $result.ExitCode | Should -Be 0 -Because $result.Text
    Get-Sha $fx.Repo 'develop^2' | Should -Be (Get-Sha $fx.Repo 'feature/0001')
    Test-Path -LiteralPath (Join-Path $dev 'feature-0001.txt') | Should -BeTrue
    Test-Path -LiteralPath (Join-Path $fx.Wt 'merge-0001') | Should -BeFalse
  }

  It 'ignora el GIT_INDEX_FILE que hereda de un hook' {
    $fx = New-MergeFixture 'hook'
    $foreignIndex = Join-Path $fx.Root 'indice-ajeno'
    [Environment]::SetEnvironmentVariable('GIT_INDEX_FILE', $foreignIndex)
    try {
      $result = Invoke-Merge (Join-Path $fx.Wt '0001')
    }
    finally {
      Remove-Item -LiteralPath 'Env:\GIT_INDEX_FILE' -ErrorAction SilentlyContinue
    }

    $result.ExitCode | Should -Be 0 -Because $result.Text
    Test-Path -LiteralPath $foreignIndex | Should -BeFalse
    Get-Sha $fx.Repo 'develop^2' | Should -Be (Get-Sha $fx.Repo 'feature/0001')
  }

  It 'sin bloque merge en sdd-kit.json falla y no toca develop' {
    $fx = New-MergeFixture 'sin-politica'
    $feature = Join-Path $fx.Wt '0001'
    Write-FixtureFile $feature '.docs/sdd/sdd-kit.json' '{}'
    $before = Get-Sha $fx.Repo 'develop'

    $result = Invoke-Merge $feature

    $result.ExitCode | Should -Not -Be 0
    $result.Text | Should -Match 'pol.{1,2}tica'
    Get-Sha $fx.Repo 'develop' | Should -Be $before
  }
}
