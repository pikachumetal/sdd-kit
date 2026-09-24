<#
.SYNOPSIS
  Reserva (con -Reserve) o propone el siguiente id SDD (task/patch) para un proyecto en modo ids.mode=sequence.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). No se copia al proyecto: se ejecuta desde el kit con -ProjectRoot.
  Con -Reserve toma un cerrojo en el directorio común de git y consume los ids en el contador sdd-ids, que comparten
  todos los worktrees de la máquina: un id reservado no vuelve a salir aunque el trabajo se abandone. Sin -Reserve
  solo propone el id y no escribe nada.
  El escaneo inicializa o corrige el contador: lee specs/ y el roadmap del working tree y de cada rama del repo, y el
  roadmap y specs/ del disco de cada worktree de `git worktree list`. Nunca toca el roadmap, no crea ramas ni
  contacta con el remoto.
.EXAMPLE
  pwsh -NoProfile -File Get-NextSddId.ps1 -ProjectRoot D:\code\git\mi-proyecto -Reserve
.EXAMPLE
  pwsh -NoProfile -File Get-NextSddId.ps1 -ProjectRoot D:\code\git\mi-proyecto -Reserve -Count 3
#>
[CmdletBinding()]
param(
  [string]$ProjectRoot = '.',
  [switch]$Reserve,
  [ValidateRange(1, 99)]
  [int]$Count = 1,
  [double]$LockTimeoutMinutes = 2
)
$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'SddLock.ps1')

function Get-EffectiveIdsMode([string]$ProjectRoot) {
  $configPath = Join-Path $ProjectRoot '.docs/sdd/sdd-kit.json'
  if (-not (Test-Path -LiteralPath $configPath)) { return 'tracker' }
  $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
  $mode = $config.ids.mode
  if (@('tracker', 'sequence') -notcontains $mode) { return 'tracker' }
  return $mode
}

$script:SpecFolderIdPattern = '-(?:task|patch)-(\d{4})[a-z]*-'
$script:BranchIdPattern = '(?:^|/)(\d{4})(?:$|-)'

function Get-SpecArtifactIds([string]$ProjectRoot) {
  $specsPath = Join-Path $ProjectRoot '.docs/sdd/specs'
  if (-not (Test-Path -LiteralPath $specsPath)) { return @() }
  $folders = Get-ChildItem -LiteralPath $specsPath -Directory
  foreach ($folder in $folders) {
    if ($folder.Name -match $script:SpecFolderIdPattern) {
      [pscustomobject]@{ Id = $Matches[1]; Folder = $folder.Name }
    }
  }
}

function Get-RoadmapLineIds([string[]]$Lines) {
  foreach ($line in $Lines) {
    if ($line -match '^\|\s*(\d{4})\s*\|') { $Matches[1] }
  }
}

function Get-RoadmapIds([string]$ProjectRoot) {
  $roadmapPath = Join-Path $ProjectRoot '.docs/sdd/roadmap.md'
  if (-not (Test-Path -LiteralPath $roadmapPath)) { return @() }
  Get-RoadmapLineIds (Get-Content -LiteralPath $roadmapPath)
}

$script:GitEnvVars = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR')

function Invoke-GitUtf8([string]$ProjectRoot, [string[]]$Arguments) {
  # git emite las rutas en UTF-8. Con la codificación de consola por defecto (CP1252 en Windows),
  # una ruta con tildes vuelve mal decodificada y deja de resolverse.
  $previousEncoding = [System.Console]::OutputEncoding
  [System.Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
  try {
    return & git -C $ProjectRoot @Arguments 2>$null
  }
  finally {
    [System.Console]::OutputEncoding = $previousEncoding
  }
}

function Invoke-IsolatedGit([string]$ProjectRoot, [string[]]$Arguments) {
  $saved = @{}
  foreach ($name in $script:GitEnvVars) {
    $saved[$name] = [System.Environment]::GetEnvironmentVariable($name)
    Remove-Item "Env:\$name" -ErrorAction SilentlyContinue
  }
  try {
    return Invoke-GitUtf8 $ProjectRoot $Arguments
  }
  finally {
    foreach ($name in $script:GitEnvVars) {
      if ($null -ne $saved[$name]) { Set-Item "Env:\$name" $saved[$name] }
    }
  }
}

function Get-RepoToplevel([string]$ProjectRoot) {
  $topLevel = Invoke-IsolatedGit $ProjectRoot @('rev-parse', '--show-toplevel')
  if ($LASTEXITCODE -ne 0) { return $null }
  return (Resolve-Path -LiteralPath ($topLevel -replace '/', '\')).Path.TrimEnd('\')
}

function Get-BranchContentIds([string]$ProjectRoot, [string]$Branch) {
  # Otro worktree reserva filas o crea carpetas en su rama antes de fusionar: el working tree no las ve.
  # ponytail: dos procesos git por rama; con cientos de ramas, un único `git cat-file --batch`.
  Get-RoadmapLineIds @(Invoke-IsolatedGit $ProjectRoot @('show', "${Branch}:.docs/sdd/roadmap.md"))
  $folders = Invoke-IsolatedGit $ProjectRoot @('-c', 'core.quotePath=false', 'ls-tree', '-d', '--name-only', "${Branch}:.docs/sdd/specs")
  foreach ($folder in $folders) {
    if ($folder -match $script:SpecFolderIdPattern) { $Matches[1] }
  }
}

function Get-WorktreeDiskIds([string]$ProjectRoot) {
  # Una reserva sin commitear solo está en el disco de su worktree: la fila del roadmap en staged
  # (ticket de la task 0019 §1) o la carpeta de specs/ con la que un patch reserva su id (ticket del patch 0037 §1).
  $lines = Invoke-IsolatedGit $ProjectRoot @('worktree', 'list', '--porcelain')
  foreach ($line in $lines) {
    if ($line -notmatch '^worktree (.+)$') { continue }
    $worktree = $Matches[1]
    Get-RoadmapIds $worktree
    (Get-SpecArtifactIds $worktree).Id
  }
}

function Test-IsCurrentBranch([string]$Branch, [string]$CurrentBranch) {
  # La rama de seguimiento remota de la rama actual (origin/feature/0027) es la misma rama.
  return $CurrentBranch -and ($Branch -eq $CurrentBranch -or $Branch.EndsWith("/$CurrentBranch"))
}

function Get-GitIds([string]$ProjectRoot) {
  $none = [pscustomobject]@{ UsedIds = @(); CurrentBranchId = $null }
  $topLevel = Get-RepoToplevel $ProjectRoot
  if ($null -eq $topLevel) { return $none }
  if ($topLevel -ine $ProjectRoot.TrimEnd('\')) {
    Write-Error "Se omiten las ramas: la raíz del proyecto no es la raíz del repositorio (repositorio en '$topLevel')." -ErrorAction Continue
    return $none
  }
  $current = Invoke-IsolatedGit $ProjectRoot @('branch', '--show-current')
  $branches = Invoke-IsolatedGit $ProjectRoot @('branch', '--all', '--format=%(refname:short)')
  $usedIds = foreach ($branch in $branches) {
    if (-not (Test-IsCurrentBranch $branch $current) -and $branch -match $script:BranchIdPattern) { $Matches[1] }
    Get-BranchContentIds $ProjectRoot $branch
  }
  $usedIds = @($usedIds) + @(Get-WorktreeDiskIds $ProjectRoot)
  $currentId = if ($current -match $script:BranchIdPattern) { $Matches[1] } else { $null }
  return [pscustomobject]@{ UsedIds = @($usedIds); CurrentBranchId = $currentId }
}

function Assert-NoSharedIds([object[]]$SpecArtifacts) {
  foreach ($group in ($SpecArtifacts | Group-Object Id)) {
    $folders = $group.Group.Folder | Select-Object -Unique
    if ($folders.Count -gt 1) {
      throw "Dos artefactos distintos comparten el id $($group.Name): $($folders -join ', ')."
    }
  }
}

function Assert-SequenceMode([string]$ProjectRoot) {
  $mode = Get-EffectiveIdsMode $ProjectRoot
  if ($mode -ne 'sequence') {
    throw "El proyecto no está en modo 'sequence' (modo actual: '$mode'); asigna el id con el gestor de tickets, no con este script."
  }
}

function Get-IdScan([string]$ProjectRoot) {
  Assert-SequenceMode $ProjectRoot
  $specArtifacts = @(Get-SpecArtifactIds $ProjectRoot | Where-Object { $_.Id -ne '0000' })
  Assert-NoSharedIds $specArtifacts
  $gitIds = Get-GitIds $ProjectRoot
  $allIds = @($specArtifacts.Id) + @(Get-RoadmapIds $ProjectRoot) + $gitIds.UsedIds
  $usedIds = @($allIds | Where-Object { $_ -ne '0000' } | ForEach-Object { [int]$_ })
  $max = if ($usedIds.Count -gt 0) { [int]($usedIds | Measure-Object -Maximum).Maximum } else { 0 }
  return [pscustomobject]@{ UsedIds = $usedIds; Max = $max; CurrentBranchId = $gitIds.CurrentBranchId }
}

function Format-SddId([int]$Number) {
  return '{0:D4}' -f $Number
}

function Get-CounterName([string]$ProjectRoot, [string]$TopLevel) {
  # Un proyecto en una subcarpeta (monorepo o repositorio padre ajeno) no comparte secuencia con la raíz.
  if ($TopLevel -ieq $ProjectRoot.TrimEnd('\')) { return 'sdd-ids' }
  $relative = [System.IO.Path]::GetRelativePath($TopLevel, $ProjectRoot).TrimEnd('\', '/')
  return 'sdd-ids-' + ($relative -replace '[\\/:]+', '-')
}

function Get-CounterPath([string]$ProjectRoot) {
  $topLevel = Get-RepoToplevel $ProjectRoot
  if ($null -eq $topLevel) { return $null }
  $commonDir = @(Invoke-IsolatedGit $ProjectRoot @('rev-parse', '--git-common-dir'))[0]
  if (-not [System.IO.Path]::IsPathRooted($commonDir)) { $commonDir = Join-Path $ProjectRoot $commonDir }
  return Join-Path (Resolve-Path -LiteralPath $commonDir).Path (Get-CounterName $ProjectRoot $topLevel)
}

function Read-IdCounter([string]$CounterPath) {
  if (-not $CounterPath -or -not (Test-Path -LiteralPath $CounterPath)) { return 0 }
  $text = (Get-Content -LiteralPath $CounterPath -Raw).Trim()
  if ($text -match '^\d{1,4}$') { return [int]$text }
  Write-Error "El contador de ids '$CounterPath' no se puede leer ('$text'): se reinicializa con el escaneo." -ErrorAction Continue
  return 0
}

function Get-ProposedId([string]$ProjectRoot) {
  $scan = Get-IdScan $ProjectRoot
  # Una rama feature/<id> creada para esta sesión ya es su id: proponer otro la dejaría huérfana.
  if ($scan.CurrentBranchId -and $scan.UsedIds -notcontains [int]$scan.CurrentBranchId) {
    return $scan.CurrentBranchId
  }
  $base = [Math]::Max($scan.Max, (Read-IdCounter (Get-CounterPath $ProjectRoot)))
  return Format-SddId ($base + 1)
}

function Get-ReservedIds([string]$ProjectRoot, [string]$CounterPath, [int]$Count) {
  $base = [Math]::Max((Get-IdScan $ProjectRoot).Max, (Read-IdCounter $CounterPath))
  $last = $base + $Count
  if ($last -gt 9999) { throw "La reserva pasaría de 9999 (último id consumido: $(Format-SddId $base)); no se reserva nada." }
  Set-Content -LiteralPath $CounterPath -Value (Format-SddId $last)
  return ($base + 1)..$last | ForEach-Object { Format-SddId $_ }
}

function Invoke-IdReservation([string]$ProjectRoot, [int]$Count, [double]$TimeoutMinutes) {
  Assert-SequenceMode $ProjectRoot
  $counterPath = Get-CounterPath $ProjectRoot
  if (-not $counterPath) { throw "El proyecto no está en un repositorio git: no hay dónde reservar el id." }
  $lock = New-SddLock (Join-Path (Split-Path $counterPath) 'sdd-ids.lock') 'ids' ([Console]::Error)
  $branch = Invoke-IsolatedGit $ProjectRoot @('branch', '--show-current') | Select-Object -First 1
  $stream = Enter-SddLock $lock ([pscustomobject]@{ Branch = $branch; Worktree = $ProjectRoot }) $TimeoutMinutes
  try {
    return Get-ReservedIds $ProjectRoot $counterPath $Count
  }
  finally {
    Exit-SddLock $stream $lock
  }
}

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "No existe la ruta de proyecto '$ProjectRoot'."
}
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
if ($Reserve) {
  Write-Output (Invoke-IdReservation $ProjectRoot $Count $LockTimeoutMinutes)
}
else {
  Write-Output (Get-ProposedId $ProjectRoot)
}
