<#
.SYNOPSIS
  Vigila un subagente o un comando en segundo plano y termina cuando se cuelga o cuando acaba.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Con -Description busca el transcript del subagente cuyo
  agent-<id>.meta.json lleva esa descripción, en <configuración>/projects/<carpeta del worktree>/*/subagents/.
  Con -Path vigila la última escritura de ese fichero: la salida de un comando. Ese modo no sabe cuándo acaba el comando:
  quien lo lanza lo para al terminar el comando. Sin -Worktree, toma la raíz del repo git del directorio actual.
  Solo cuentan los despachos de hasta 60 s antes de arrancar el vigía: un relanzado puede repetir la description.
  Los umbrales salen de control.silence en <worktree>/.docs/sdd/sdd-kit.json, con 8 y 20 minutos si falta la clave:
  longCommandMinutes si el subagente espera un Bash o un PowerShell, o con -Path; betweenStepsMinutes en cualquier otra espera.
  Mira cada 30 s y termina con una primera línea SILENCIO:, TERMINADO: o SIN TRANSCRIPT: (a los 2 min sin encontrarlo).
  Con -Once hace una sola comprobación, que también puede dar EN MARCHA:.
.EXAMPLE
  pwsh -NoProfile -File Watch-SubagentSilence.ps1 -Description "Revisor final 0095"
.EXAMPLE
  pwsh -NoProfile -File Watch-SubagentSilence.ps1 -Path C:\temp\pester.log
#>
[CmdletBinding(DefaultParameterSetName = 'Subagent')]
param(
  [Parameter(Mandatory, ParameterSetName = 'Subagent')][string]$Description,
  [Parameter(Mandatory, ParameterSetName = 'Command')][string]$Path,
  [string]$Worktree,
  [string[]]$ProjectsRoot,
  [switch]$Once
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'TranscriptPaths.ps1')
$script:ShellTools = @('Bash', 'PowerShell')
$script:PollSeconds = 30
$script:TranscriptGraceSeconds = 120
$script:DispatchMarginSeconds = 60
$script:StartedAt = [datetime]::UtcNow

function Read-JsonFile([string]$File) {
  try { return Get-Content -LiteralPath $File -Raw | ConvertFrom-Json -AsHashtable } catch { return $null }
}

function Test-ValidMinutes([object]$Value) {
  return $Value -is [ValueType] -and $Value -isnot [bool] -and [double]$Value -gt 0
}

function Read-Thresholds([string]$WorktreePath) {
  $thresholds = @{ betweenStepsMinutes = [double]8; longCommandMinutes = [double]20 }
  $configPath = Join-Path $WorktreePath '.docs/sdd/sdd-kit.json'
  if (-not (Test-Path -LiteralPath $configPath)) { return $thresholds }
  $config = Read-JsonFile $configPath
  $control = if ($config -is [System.Collections.IDictionary]) { $config.control } else { $null }
  $silence = if ($control -is [System.Collections.IDictionary]) { $control.silence } else { $null }
  if ($silence -isnot [System.Collections.IDictionary]) { return $thresholds }
  foreach ($key in @($thresholds.Keys)) {
    if (Test-ValidMinutes $silence[$key]) { $thresholds[$key] = [double]$silence[$key] }
  }
  return $thresholds
}

function Resolve-Worktree {
  $root = git rev-parse --show-toplevel 2>$null
  if ($LASTEXITCODE -eq 0 -and $root) { return [System.IO.Path]::GetFullPath($root) }
  return (Get-Location).Path
}

function Find-Transcript([string]$DispatchDescription, [string]$WorktreePath, [string[]]$Roots) {
  $metas = Get-TranscriptFolders $WorktreePath $Roots | ForEach-Object {
    Get-ChildItem -Path (Join-Path $_ '*/subagents/agent-*.meta.json') -File -ErrorAction SilentlyContinue
  }
  $notBefore = $script:StartedAt.AddSeconds(-$script:DispatchMarginSeconds)
  $match = $metas | Where-Object { $_.LastWriteTimeUtc -ge $notBefore -and (Read-JsonFile $_.FullName).description -eq $DispatchDescription } |
    Sort-Object LastWriteTimeUtc -Descending | Select-Object -First 1
  if ($null -eq $match) { return $null }
  $transcript = $match.FullName -replace '\.meta\.json$', '.jsonl'
  if (-not (Test-Path -LiteralPath $transcript)) { return $null }
  return $transcript
}

function Read-Events([string]$File) {
  return @(Get-Content -LiteralPath $File | ForEach-Object {
      try { $_ | ConvertFrom-Json -Depth 64 } catch { $null }
    } | Where-Object { $_ })
}

function Get-SilenceMinutes([string]$File) {
  return ([datetime]::UtcNow - (Get-Item -LiteralPath $File).LastWriteTimeUtc).TotalMinutes
}

function Get-ContentBlocks([object]$TranscriptEvent, [string]$BlockType) {
  return @(@($TranscriptEvent.message.content) | Where-Object { $_ -isnot [string] -and $_.type -eq $BlockType })
}

function Get-ToolUses([object[]]$Events) {
  for ($index = 0; $index -lt $Events.Count; $index++) {
    foreach ($call in Get-ContentBlocks $Events[$index] 'tool_use') {
      [pscustomobject]@{ Call = $call; Index = $index; Timestamp = $Events[$index].timestamp }
    }
  }
}

function Test-LaterEvent([object[]]$Events, [int]$Index, [scriptblock]$Predicate) {
  return [bool](@($Events | Select-Object -Skip ($Index + 1) | Where-Object $Predicate).Count)
}

function Test-Finished([object[]]$Events) {
  $lastAnswer = $Events | Where-Object { $_.type -eq 'assistant' } | Select-Object -Last 1
  return $null -ne $lastAnswer -and $lastAnswer.message.stop_reason -eq 'end_turn'
}

function Test-Pending([object[]]$Events, [object]$ToolUse) {
  $id = $ToolUse.Call.id
  return -not (Test-LaterEvent $Events $ToolUse.Index {
      @(Get-ContentBlocks $_ 'tool_result' | Where-Object { $_.tool_use_id -eq $id }).Count -gt 0
    })
}

function Select-WatchedToolUse([object[]]$ToolUses, [object[]]$Pending) {
  $shell = $Pending | Where-Object { $_.Call.name -in $script:ShellTools } | Select-Object -Last 1
  if ($shell) { return $shell }
  if ($Pending) { return $Pending[-1] }
  if ($ToolUses) { return $ToolUses[-1] }
  return $null
}

function Format-EventTime([object]$Timestamp) {
  try {
    $utc = if ($Timestamp -is [datetime]) { $Timestamp.ToUniversalTime() } else { ([datetimeoffset]$Timestamp).UtcDateTime }
    return $utc.ToString('HH:mm:ss', [System.Globalization.CultureInfo]::InvariantCulture) + 'Z'
  } catch { return 'hora desconocida' }
}

function Format-InputValue([string]$Name, [object]$Value) {
  $text = if ($Name -eq 'file_path') { ([string]$Value -split '[\\/]')[-1] } else { [string]$Value }
  if ($text.Length -le 60) { return $text }
  return $text.Substring(0, 57) + '...'
}

function Format-ToolInput([object]$ToolInput) {
  if ($null -eq $ToolInput) { return '' }
  $parts = $ToolInput.PSObject.Properties | Select-Object -First 3 | ForEach-Object { "$($_.Name) $(Format-InputValue $_.Name $_.Value)" }
  return $parts -join ', '
}

function Measure-OutputTokens([object[]]$Events) {
  $byMessage = @{}
  $Events | Where-Object { $_.type -eq 'assistant' -and $null -ne $_.message.usage } | ForEach-Object {
    $byMessage[[string]$_.message.id] = [long]$_.message.usage.output_tokens
  }
  return [long]($byMessage.Values | Measure-Object -Sum).Sum
}

function Test-HookAfter([object[]]$Events, [object]$LastToolUse, [string]$HookEvent) {
  $id = $LastToolUse.Call.id
  return Test-LaterEvent $Events $LastToolUse.Index {
    $_.type -eq 'attachment' -and $_.attachment.hookEvent -eq $HookEvent -and ($HookEvent -eq 'PermissionRequest' -or $_.attachment.toolUseID -eq $id)
  }
}

function Get-Diagnosis([object[]]$Events, [object]$LastToolUse, [bool]$Pending) {
  $tokens = "$(Measure-OutputTokens $Events) tokens de salida"
  if ($null -eq $LastToolUse) {
    return @("Último evento: $(Format-EventTime $Events[-1].timestamp) · sin llamada a herramienta", $tokens)
  }
  $result = if ($Pending) { 'sin tool_result' } else { 'con tool_result' }
  $preToolUse = if (Test-HookAfter $Events $LastToolUse 'PreToolUse') { 'PreToolUse: sí' } else { 'PreToolUse: sin PreToolUse' }
  $permission = if (Test-HookAfter $Events $LastToolUse 'PermissionRequest') { 'petición de permiso pendiente' } else { 'sin petición de permiso' }
  $call = "$($LastToolUse.Call.name) $(Format-ToolInput $LastToolUse.Call.input)".Trim()
  return @("Último evento: $(Format-EventTime $LastToolUse.Timestamp) · $call · $result", $preToolUse, "Petición de permiso: $permission", $tokens)
}

function New-Verdict([string]$Status, [string[]]$Lines) {
  return [pscustomobject]@{ Status = $Status; Lines = $Lines }
}

function Format-Head([string]$Label, [double]$Minutes, [string]$Key, [hashtable]$Thresholds) {
  $minutesText = [math]::Floor($Minutes)
  $limit = "(umbral $($Thresholds[$Key]) min, $Key)"
  if ($Minutes -gt $Thresholds[$Key]) { return New-Verdict 'SILENCIO' @("SILENCIO: $Label lleva $minutesText min sin escribir $limit") }
  return New-Verdict 'EN MARCHA' @("EN MARCHA: $Label escribió hace $minutesText min $limit")
}

function Get-SubagentVerdict([string]$File, [string]$Label, [hashtable]$Thresholds) {
  $events = Read-Events $File
  if (Test-Finished $events) { return New-Verdict 'TERMINADO' @("TERMINADO: $Label devolvió su resultado") }
  $toolUses = @(Get-ToolUses $events)
  $pendingUses = @($toolUses | Where-Object { Test-Pending $events $_ })
  $watched = Select-WatchedToolUse $toolUses $pendingUses
  $pending = $null -ne $watched -and $pendingUses -contains $watched
  $key = if ($pending -and $watched.Call.name -in $script:ShellTools) { 'longCommandMinutes' } else { 'betweenStepsMinutes' }
  $verdict = Format-Head $Label (Get-SilenceMinutes $File) $key $Thresholds
  if ($verdict.Status -eq 'SILENCIO' -and $events.Count -gt 0) { $verdict.Lines += Get-Diagnosis $events $watched $pending }
  return $verdict
}

function Get-Verdict([hashtable]$Thresholds, [bool]$GraceOver) {
  $label = if ($Path) { Split-Path -Leaf $Path } else { $Description }
  $file = if ($Path) { if (Test-Path -LiteralPath $Path) { $Path } } else { Find-Transcript $Description $Worktree $ProjectsRoot }
  if (-not $file) {
    if (-not $GraceOver) { return New-Verdict 'BUSCANDO' @() }
    return New-Verdict 'SIN TRANSCRIPT' @("SIN TRANSCRIPT: $label; el vigía de silencio no funciona en esta sesión")
  }
  if ($Path) { return Format-Head $label (Get-SilenceMinutes $file) 'longCommandMinutes' $Thresholds }
  return Get-SubagentVerdict $file $label $Thresholds
}

if (-not $PSBoundParameters.ContainsKey('Worktree')) { $Worktree = Resolve-Worktree }
if (-not $ProjectsRoot) { $ProjectsRoot = Get-DefaultProjectsRoots }
$thresholds = Read-Thresholds $Worktree
while ($true) {
  $graceOver = $Once -or ([datetime]::UtcNow - $script:StartedAt).TotalSeconds -ge $script:TranscriptGraceSeconds
  $verdict = Get-Verdict $thresholds $graceOver
  if ($Once -or $verdict.Status -notin @('EN MARCHA', 'BUSCANDO')) { break }
  Start-Sleep -Seconds $script:PollSeconds
}
$verdict.Lines | ForEach-Object { Write-Output $_ }
