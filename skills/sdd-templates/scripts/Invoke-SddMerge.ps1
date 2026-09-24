<#
.SYNOPSIS
  Fusiona la rama del cierre en la rama destino, con cerrojo, base integrada y push opcional.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). No se copia al proyecto: se ejecuta desde el kit con -ProjectRoot.
  Toma un cerrojo de fichero en el directorio común del repositorio para que dos cierres no fusionen a la vez,
  integra en la rama destino los commits que el remoto haya publicado, fusiona la rama con --no-ff (si la
  política lo pide) en un worktree temporal junto a los demás, ejecuta una verificación opcional y publica la
  rama destino por su nombre si se pide. Si algo falla, deja la rama destino como estaba y no deja restos.
.EXAMPLE
  pwsh -NoProfile -File Invoke-SddMerge.ps1 -ProjectRoot D:\code\git\mi-proyecto -Push -VerifyCommand "pwsh -NoProfile -Command Invoke-Pester"
#>
[CmdletBinding()]
param(
  [string]$ProjectRoot = '.',
  [string]$Branch,
  [switch]$Push,
  [string]$VerifyCommand,
  [double]$LockTimeoutMinutes = 30
)
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'SddLock.ps1')
$script:LogBuilderPath = Join-Path $PSScriptRoot 'Build-EstimationLog.ps1'
$script:GitEnvVars = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY')

function Invoke-GitUtf8([string]$WorkingDirectory, [string[]]$Arguments) {
  # git emite las rutas en UTF-8. Con la codificación de consola por defecto (CP1252 en Windows),
  # una ruta con tildes vuelve mal decodificada y deja de resolverse.
  $previousEncoding = [System.Console]::OutputEncoding
  [System.Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
  try {
    return & git -C $WorkingDirectory @Arguments 2>$null
  }
  finally {
    [System.Console]::OutputEncoding = $previousEncoding
  }
}

function Invoke-IsolatedGit([string]$WorkingDirectory, [string[]]$Arguments) {
  $saved = @{}
  foreach ($name in $script:GitEnvVars) {
    $saved[$name] = [System.Environment]::GetEnvironmentVariable($name)
    Remove-Item "Env:\$name" -ErrorAction SilentlyContinue
  }
  try {
    return Invoke-GitUtf8 $WorkingDirectory $Arguments
  }
  finally {
    foreach ($name in $script:GitEnvVars) {
      if ($null -ne $saved[$name]) { Set-Item "Env:\$name" $saved[$name] }
    }
  }
}

function Resolve-MergePolicy([string]$ProjectRoot) {
  $configPath = Join-Path $ProjectRoot '.docs/sdd/sdd-kit.json'
  if (-not (Test-Path -LiteralPath $configPath)) { throw "política: no existe '$configPath'." }
  $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
  $into = $config.merge.into
  $noFf = $config.merge.noFf
  if ([string]::IsNullOrWhiteSpace($into) -or $null -eq $noFf) {
    throw "política: falta 'merge.into' o 'merge.noFf' en '$configPath'."
  }
  return [pscustomobject]@{ Into = $into; NoFf = [bool]$noFf }
}

function Resolve-MergeBranch([string]$ProjectRoot, [string]$Branch) {
  if (-not [string]::IsNullOrWhiteSpace($Branch)) { return $Branch }
  return (Invoke-IsolatedGit $ProjectRoot @('branch', '--show-current') | Select-Object -First 1)
}

function Resolve-GitPaths([string]$ProjectRoot) {
  $commonDir = Invoke-IsolatedGit $ProjectRoot @('rev-parse', '--git-common-dir') | Select-Object -First 1
  if (-not [System.IO.Path]::IsPathRooted($commonDir)) { $commonDir = Join-Path $ProjectRoot $commonDir }
  $commonDir = (Resolve-Path -LiteralPath $commonDir).Path
  $topLevel = Invoke-IsolatedGit $ProjectRoot @('rev-parse', '--show-toplevel') | Select-Object -First 1
  $worktreesParent = Split-Path -Parent (Resolve-Path -LiteralPath $topLevel).Path
  return [pscustomobject]@{ CommonDir = $commonDir; WorktreesParent = $worktreesParent }
}

function Write-MergeStatus([string]$Message) {
  [Console]::Out.WriteLine($Message)
}

function Find-BranchWorktree([string]$ProjectRoot, [string]$Into) {
  $lines = Invoke-IsolatedGit $ProjectRoot @('worktree', 'list', '--porcelain')
  $currentPath = $null
  foreach ($line in $lines) {
    if ($line -match '^worktree (.+)$') { $currentPath = $Matches[1]; continue }
    if ($line -match "^branch refs/heads/$([regex]::Escape($Into))$") { return $currentPath }
  }
  return $null
}

function Resolve-DestinationWorktree([string]$ProjectRoot, [pscustomobject]$Target, [string]$WorktreesParent) {
  $found = Find-BranchWorktree $ProjectRoot $Target.Into
  if ($null -ne $found) {
    $status = @(Invoke-IsolatedGit $found @('status', '--porcelain'))
    if ($status.Count -gt 0) {
      throw "destino sacado: '$($Target.Into)' tiene cambios sin guardar en '$found':`n$($status -join "`n")"
    }
    return [pscustomobject]@{ Path = $found; Temporary = $false }
  }
  $lastSegment = ($Target.Branch -split '/')[-1]
  $path = Join-Path $WorktreesParent "merge-$lastSegment"
  if (Test-Path -LiteralPath $path) { throw "destino sacado: ya existe '$path'." }
  Invoke-IsolatedGit $ProjectRoot @('worktree', 'add', $path, $Target.Into) | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "destino sacado: no se pudo crear el worktree de '$($Target.Into)' en '$path'." }
  return [pscustomobject]@{ Path = $path; Temporary = $true }
}

function Get-RemoteForBranch([string]$Worktree, [string]$Into) {
  $configured = Invoke-IsolatedGit $Worktree @('config', '--get', "branch.$Into.remote")
  $remote = if ($LASTEXITCODE -eq 0) { $configured | Select-Object -First 1 } else { $null }
  if (-not [string]::IsNullOrWhiteSpace($remote)) { return $remote }
  $remotes = @(Invoke-IsolatedGit $Worktree @('remote'))
  if ($remotes -contains 'origin') { return 'origin' }
  return $null
}

function Assert-PushableRemote([bool]$Push, [string]$Remote, [string]$Into) {
  if ($Push -and [string]::IsNullOrWhiteSpace($Remote)) {
    throw "push: no hay remoto configurado para '$Into'."
  }
}

function Complete-MergeAttempt([string]$Worktree, [int]$MergeExitCode, [string]$StepName) {
  if ($MergeExitCode -eq 0) { return }
  $conflicted = @(Invoke-IsolatedGit $Worktree @('diff', '--name-only', '--diff-filter=U'))
  if ($conflicted.Count -eq 1 -and $conflicted[0] -match 'sdd/estimation-log\.md$') {
    & $script:LogBuilderPath -Root $Worktree -WarningAction SilentlyContinue 6>$null | Out-Null
    Invoke-IsolatedGit $Worktree @('add', '--', $conflicted[0]) | Out-Null
    Invoke-IsolatedGit $Worktree @('commit', '--no-edit') | Out-Null
    return
  }
  Invoke-IsolatedGit $Worktree @('merge', '--abort') | Out-Null
  throw "${StepName}: conflicto en $($conflicted -join ', ')."
}

function Sync-BaseBranch([string]$Worktree, [string]$Into, [string]$Remote) {
  if ([string]::IsNullOrWhiteSpace($Remote)) { return }
  $refSpec = "+refs/heads/${Into}:refs/remotes/${Remote}/${Into}"
  Invoke-IsolatedGit $Worktree @('fetch', $Remote, $refSpec) | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "base: no se pudo hacer fetch de '$Remote'." }
  $remoteRef = "$Remote/$Into"
  Invoke-IsolatedGit $Worktree @('merge-base', '--is-ancestor', $remoteRef, 'HEAD') | Out-Null
  if ($LASTEXITCODE -eq 0) { return }
  Invoke-IsolatedGit $Worktree @('merge', '--ff-only', $remoteRef) | Out-Null
  if ($LASTEXITCODE -eq 0) { return }
  Invoke-IsolatedGit $Worktree @('merge', '--no-edit', $remoteRef) | Out-Null
  Complete-MergeAttempt $Worktree $LASTEXITCODE 'base'
}

function Invoke-FeatureMerge([string]$Worktree, [string]$Branch, [pscustomobject]$Policy) {
  $mergeArgs = @('merge')
  if ($Policy.NoFf) { $mergeArgs += '--no-ff' }
  $mergeArgs += @('-m', "merge: $Branch en $($Policy.Into)", '-m', 'Fusión hecha con Invoke-SddMerge.ps1 (sdd-kit).', $Branch)
  Invoke-IsolatedGit $Worktree $mergeArgs | Out-Null
  Complete-MergeAttempt $Worktree $LASTEXITCODE 'merge'
}

function Invoke-Verification([string]$Worktree, [string]$Command) {
  Push-Location -LiteralPath $Worktree
  try {
    & pwsh -NoProfile -Command $Command
    if ($LASTEXITCODE -ne 0) { throw "verificación: código de salida $LASTEXITCODE." }
  }
  finally {
    Pop-Location
  }
}

function Push-Destination([string]$Worktree, [string]$Remote, [string]$Into) {
  Invoke-IsolatedGit $Worktree @('push', $Remote, "refs/heads/${Into}:refs/heads/${Into}") | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "push: no se pudo publicar '$Into' en '$Remote'." }
}

function Undo-FailedMerge([string]$Worktree, [string]$Before) {
  Invoke-IsolatedGit $Worktree @('merge', '--abort') | Out-Null
  Invoke-IsolatedGit $Worktree @('reset', '--hard', $Before) | Out-Null
}

function Remove-MergeWorktree([string]$ProjectRoot, [string]$Path) {
  Invoke-IsolatedGit $ProjectRoot @('worktree', 'remove', $Path) | Out-Null
  if ($LASTEXITCODE -eq 0) { return }
  Invoke-IsolatedGit $ProjectRoot @('worktree', 'remove', '--force', $Path) | Out-Null
}

if (-not (Test-Path -LiteralPath $ProjectRoot)) { throw "No existe la ruta de proyecto '$ProjectRoot'." }
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
$policy = Resolve-MergePolicy $ProjectRoot
$branch = Resolve-MergeBranch $ProjectRoot $Branch
$paths = Resolve-GitPaths $ProjectRoot
$lock = New-SddLock (Join-Path $paths.CommonDir 'sdd-merge.lock') 'merge' ([Console]::Out)

$lockStream = Enter-SddLock $lock ([pscustomobject]@{ Branch = $branch; Worktree = $ProjectRoot }) $LockTimeoutMinutes
$destination = $null
$before = $null
try {
  $target = [pscustomobject]@{ Into = $policy.Into; Branch = $branch }
  $destination = Resolve-DestinationWorktree $ProjectRoot $target $paths.WorktreesParent
  $remote = Get-RemoteForBranch $destination.Path $policy.Into
  Assert-PushableRemote $Push $remote $policy.Into
  Sync-BaseBranch $destination.Path $policy.Into $remote

  $before = Invoke-IsolatedGit $destination.Path @('rev-parse', 'HEAD') | Select-Object -First 1
  Invoke-FeatureMerge $destination.Path $branch $policy
  if (-not [string]::IsNullOrWhiteSpace($VerifyCommand)) { Invoke-Verification $destination.Path $VerifyCommand }

  $pushed = $false
  if ($Push -and $remote) {
    Push-Destination $destination.Path $remote $policy.Into
    $pushed = $true
  }

  $shortHash = Invoke-IsolatedGit $destination.Path @('rev-parse', '--short', 'HEAD') | Select-Object -First 1
  Write-MergeStatus "Fusionado $branch en $($policy.Into): $shortHash"
  if ($pushed) { Write-MergeStatus "publicado en $remote" }
}
catch {
  if ($null -ne $before) { Undo-FailedMerge $destination.Path $before }
  throw
}
finally {
  if ($null -ne $destination -and $destination.Temporary) { Remove-MergeWorktree $ProjectRoot $destination.Path }
  Exit-SddLock $lockStream $lock
}
