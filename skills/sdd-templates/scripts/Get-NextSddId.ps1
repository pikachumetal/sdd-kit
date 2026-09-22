<#
.SYNOPSIS
  Calcula el siguiente id SDD libre (task/patch) para un proyecto en modo ids.mode=sequence.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). No se copia al proyecto: se ejecuta desde el kit con -ProjectRoot.
  Lee specs/ y el roadmap del working tree y de cada rama del repo, que es donde reservan ids los worktrees en paralelo.
  Solo lee: no crea carpetas ni ficheros, no toca el roadmap, no crea ramas ni contacta con el remoto.
.EXAMPLE
  pwsh -NoProfile -File Get-NextSddId.ps1 -ProjectRoot D:\code\git\mi-proyecto
#>
[CmdletBinding()]
param(
  [string]$ProjectRoot = '.'
)
$ErrorActionPreference = 'Stop'

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

function Get-NextSddId([string]$ProjectRoot) {
  $mode = Get-EffectiveIdsMode $ProjectRoot
  if ($mode -ne 'sequence') {
    throw "El proyecto no está en modo 'sequence' (modo actual: '$mode'); asigna el id con el gestor de tickets, no con este script."
  }
  $specArtifacts = @(Get-SpecArtifactIds $ProjectRoot | Where-Object { $_.Id -ne '0000' })
  Assert-NoSharedIds $specArtifacts
  $gitIds = Get-GitIds $ProjectRoot
  $allIds = @($specArtifacts.Id) + @(Get-RoadmapIds $ProjectRoot) + $gitIds.UsedIds
  $usedIds = @($allIds | Where-Object { $_ -ne '0000' } | ForEach-Object { [int]$_ })
  # Una rama feature/<id> creada para esta sesión reserva su id (ticket del patch 0027 §1).
  if ($gitIds.CurrentBranchId -and $usedIds -notcontains [int]$gitIds.CurrentBranchId) {
    return $gitIds.CurrentBranchId
  }
  $max = if ($usedIds.Count -gt 0) { [int]($usedIds | Measure-Object -Maximum).Maximum } else { 0 }
  return '{0:D4}' -f ($max + 1)
}

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "No existe la ruta de proyecto '$ProjectRoot'."
}
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
Write-Output (Get-NextSddId $ProjectRoot)
