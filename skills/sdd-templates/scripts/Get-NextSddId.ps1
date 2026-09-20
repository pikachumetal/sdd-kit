<#
.SYNOPSIS
  Calcula el siguiente id SDD libre (task/patch) para un proyecto en modo ids.mode=sequence.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). No se copia al proyecto: se ejecuta desde el kit con -ProjectRoot.
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

function Get-SpecArtifactIds([string]$ProjectRoot) {
  $specsPath = Join-Path $ProjectRoot '.docs/sdd/specs'
  if (-not (Test-Path -LiteralPath $specsPath)) { return @() }
  $folders = Get-ChildItem -LiteralPath $specsPath -Directory
  foreach ($folder in $folders) {
    if ($folder.Name -match '-(?:task|patch)-(\d{4})-') {
      [pscustomobject]@{ Id = $Matches[1]; Folder = $folder.Name }
    }
  }
}

function Get-RoadmapIds([string]$ProjectRoot) {
  $roadmapPath = Join-Path $ProjectRoot '.docs/sdd/roadmap.md'
  if (-not (Test-Path -LiteralPath $roadmapPath)) { return @() }
  $lines = Get-Content -LiteralPath $roadmapPath
  foreach ($line in $lines) {
    if ($line -match '^\|\s*(\d{4})\s*\|') { $Matches[1] }
  }
}

$script:GitEnvVars = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR')

function Invoke-IsolatedGit([string]$ProjectRoot, [string[]]$Arguments) {
  $saved = @{}
  foreach ($name in $script:GitEnvVars) {
    $saved[$name] = [System.Environment]::GetEnvironmentVariable($name)
    Remove-Item "Env:\$name" -ErrorAction SilentlyContinue
  }
  try {
    return & git -C $ProjectRoot @Arguments 2>$null
  }
  finally {
    foreach ($name in $script:GitEnvVars) {
      if ($null -ne $saved[$name]) { Set-Item "Env:\$name" $saved[$name] }
    }
  }
}

function Test-IsRepoRoot([string]$ProjectRoot) {
  $topLevel = Invoke-IsolatedGit $ProjectRoot @('rev-parse', '--show-toplevel')
  if ($LASTEXITCODE -ne 0) { return $false }
  $topLevel = (Resolve-Path -LiteralPath ($topLevel -replace '/', '\')).Path.TrimEnd('\')
  return $topLevel -ieq $ProjectRoot.TrimEnd('\')
}

function Get-BranchIds([string]$ProjectRoot) {
  if (-not (Test-IsRepoRoot $ProjectRoot)) { return @() }
  $branches = Invoke-IsolatedGit $ProjectRoot @('branch', '--all', '--format=%(refname:short)')
  foreach ($branch in $branches) {
    if ($branch -match '(?:^|/)(\d{4})(?:$|-)') { $Matches[1] }
  }
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
  $allIds = @($specArtifacts.Id) + @(Get-RoadmapIds $ProjectRoot) + @(Get-BranchIds $ProjectRoot)
  $usedIds = @($allIds | Where-Object { $_ -ne '0000' } | ForEach-Object { [int]$_ })
  $max = if ($usedIds.Count -gt 0) { [int]($usedIds | Measure-Object -Maximum).Maximum } else { 0 }
  return '{0:D4}' -f ($max + 1)
}

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
  throw "No existe la ruta de proyecto '$ProjectRoot'."
}
$ProjectRoot = (Resolve-Path -LiteralPath $ProjectRoot).Path
Write-Output (Get-NextSddId $ProjectRoot)
