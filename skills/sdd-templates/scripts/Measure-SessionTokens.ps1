<#
.SYNOPSIS
  Mide los tokens y el coste de las sesiones de Claude Code de un worktree, el hilo y los subagentes por separado.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lee los transcripts que Claude Code guarda en
  ~/.claude/projects/<carpeta del worktree>/ y cuenta cada respuesta del modelo una sola vez por message.id.
  El coste sale de la tabla pricing de <worktree>/.docs/sdd/sdd-kit.json; sin tabla, o con un modelo que no
  está en ella, el coste es «sin precio». Imprime una tabla por ámbito y modelo, y las tres líneas de la
  sección de tiempo y coste del walkthrough. Sin transcripts (otro harness), las tres dicen «no medido».
.EXAMPLE
  pwsh -NoProfile -File Measure-SessionTokens.ps1 -Path D:\code\worktrees\mi-feature -Branch feature/0042
#>
[CmdletBinding()]
param(
  [string]$Path = (Get-Location).Path,
  [string]$Branch,
  [string]$ProjectsRoot = (Join-Path $HOME '.claude/projects')
)
$ErrorActionPreference = 'Stop'
$script:Categories = @('input', 'cacheWrite5m', 'cacheWrite1h', 'cacheRead', 'output')
$script:Invariant = [System.Globalization.CultureInfo]::InvariantCulture

function Get-TranscriptFolder([string]$WorktreePath, [string]$Root) {
  return Join-Path $Root ($WorktreePath -replace '[^A-Za-z0-9]', '-')
}

function ConvertFrom-JsonLine([string]$Text) {
  if ($Text -notlike '*"assistant"*') { return $null }
  try { return $Text | ConvertFrom-Json -Depth 64 } catch { return $null }
}

function Test-CountedLine([object]$Line, [string]$BranchName) {
  if ($Line.type -ne 'assistant' -or $null -eq $Line.message.usage) { return $false }
  if ($Line.message.model -eq '<synthetic>') { return $false }
  return [string]::IsNullOrEmpty($BranchName) -or $Line.gitBranch -eq $BranchName
}

function ConvertTo-Usage([object]$Usage) {
  $split = $Usage.cache_creation
  $write5m = if ($null -ne $split) { $split.ephemeral_5m_input_tokens } else { $Usage.cache_creation_input_tokens }
  $write1h = if ($null -ne $split) { $split.ephemeral_1h_input_tokens } else { 0 }
  return [ordered]@{
    input        = [long]$Usage.input_tokens
    cacheWrite5m = [long]$write5m
    cacheWrite1h = [long]$write1h
    cacheRead    = [long]$Usage.cache_read_input_tokens
    output       = [long]$Usage.output_tokens
  }
}

function Get-ModelKey([object]$Message) {
  if ($Message.usage.speed -eq 'fast') { return "$($Message.model):fast" }
  return [string]$Message.model
}

function Merge-Response([hashtable]$Responses, [object]$Line) {
  $key = if ($Line.message.id) { $Line.message.id } else { $Line.uuid }
  $usage = ConvertTo-Usage $Line.message.usage
  $existing = $Responses[$key]
  if ($null -eq $existing) {
    $Responses[$key] = [pscustomobject]@{ Model = Get-ModelKey $Line.message; Usage = $usage; Times = @($Line.timestamp) }
    return
  }
  foreach ($category in $script:Categories) {
    $existing.Usage[$category] = [math]::Max($existing.Usage[$category], $usage[$category])
  }
  $existing.Times += $Line.timestamp
}

function Read-Responses([string]$File, [string]$BranchName) {
  $responses = @{}
  foreach ($text in [System.IO.File]::ReadLines($File)) {
    $line = ConvertFrom-JsonLine $text
    if ($null -eq $line -or -not (Test-CountedLine $line $BranchName)) { continue }
    Merge-Response $responses $line
  }
  return @($responses.Values)
}

function Add-Usage([System.Collections.IDictionary]$Totals, [string]$Model, [System.Collections.IDictionary]$Usage) {
  if (-not $Totals.Contains($Model)) {
    $Totals[$Model] = [ordered]@{ input = 0L; cacheWrite5m = 0L; cacheWrite1h = 0L; cacheRead = 0L; output = 0L }
  }
  foreach ($category in $script:Categories) { $Totals[$Model][$category] += $Usage[$category] }
}

function Get-ModelTotals([object[]]$Responses) {
  $totals = [ordered]@{}
  foreach ($response in $Responses) { Add-Usage $totals $response.Model $response.Usage }
  return $totals
}

function Get-TokenSum([System.Collections.IDictionary]$Usage) {
  return ($script:Categories | ForEach-Object { $Usage[$_] } | Measure-Object -Sum).Sum
}

function Get-Minutes([object[]]$Responses) {
  $times = @($Responses | ForEach-Object { $_.Times } | Where-Object { $_ } | ForEach-Object { [datetimeoffset]$_ } | Sort-Object)
  if ($times.Count -lt 2) { return 0 }
  return [math]::Round(($times[-1] - $times[0]).TotalMinutes)
}

function Read-Dispatch([System.IO.FileInfo]$File, [string]$BranchName) {
  $responses = Read-Responses $File.FullName $BranchName
  if ($responses.Count -eq 0) { return $null }
  $metaPath = [System.IO.Path]::ChangeExtension($File.FullName, '.meta.json')
  $description = $File.BaseName
  if (Test-Path -LiteralPath $metaPath) {
    $meta = Get-Content -LiteralPath $metaPath -Raw | ConvertFrom-Json
    if ($meta.description) { $description = $meta.description }
  }
  return [pscustomobject]@{ Description = $description; Totals = Get-ModelTotals $responses; Minutes = Get-Minutes $responses }
}

function Read-Session([string]$Folder, [string]$BranchName) {
  $thread = @(Get-ChildItem -LiteralPath $Folder -Filter '*.jsonl' -File | ForEach-Object { Read-Responses $_.FullName $BranchName })
  $agentFiles = Get-ChildItem -Path (Join-Path $Folder '*/subagents/agent-*.jsonl') -File -ErrorAction SilentlyContinue
  $dispatches = @($agentFiles | Sort-Object FullName | ForEach-Object { Read-Dispatch $_ $BranchName } | Where-Object { $_ })
  return [pscustomobject]@{ Thread = Get-ModelTotals $thread; Dispatches = $dispatches }
}

function Read-Prices([string]$WorktreePath) {
  $configPath = Join-Path $WorktreePath '.docs/sdd/sdd-kit.json'
  if (-not (Test-Path -LiteralPath $configPath)) { return $null }
  $config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json -AsHashtable
  if ($null -eq $config.pricing) { return $null }
  return $config.pricing.usdPerMillionTokens
}

function Get-ModelCost([System.Collections.IDictionary]$Usage, [System.Collections.IDictionary]$ModelPrices) {
  if ($null -eq $ModelPrices) { return $null }
  $cost = 0.0
  foreach ($category in $script:Categories) {
    if ($Usage[$category] -eq 0) { continue }
    if ($null -eq $ModelPrices[$category]) { return $null }
    $cost += $Usage[$category] * [double]$ModelPrices[$category] / 1000000
  }
  return $cost
}

function Format-Tokens([long]$Count) {
  return $Count.ToString('#,0', $script:Invariant).Replace(',', '.')
}

function Format-Money([double]$Amount) {
  return $Amount.ToString('0.00', $script:Invariant).Replace('.', ',')
}

function Get-TableRows([string]$Scope, [System.Collections.IDictionary]$Totals, [object]$Prices) {
  foreach ($model in $Totals.Keys) {
    $usage = $Totals[$model]
    $cost = if ($null -ne $Prices) { Get-ModelCost $usage $Prices[$model] } else { $null }
    $costText = if ($null -ne $cost) { Format-Money $cost } else { 'sin precio' }
    $cells = @($script:Categories | ForEach-Object { Format-Tokens $usage[$_] })
    "| $Scope | $model | $($cells -join ' | ') | $(Format-Tokens (Get-TokenSum $usage)) | $costText |"
  }
}

function Merge-Totals([object[]]$Dispatches) {
  $merged = [ordered]@{}
  foreach ($dispatch in $Dispatches) {
    foreach ($model in $dispatch.Totals.Keys) { Add-Usage $merged $model $dispatch.Totals[$model] }
  }
  return $merged
}

function Get-TotalTokens([System.Collections.IDictionary]$Totals) {
  return [long](($Totals.Values | ForEach-Object { Get-TokenSum $_ } | Measure-Object -Sum).Sum)
}

function Get-MainModel([System.Collections.IDictionary]$Totals) {
  return $Totals.Keys | Sort-Object { - (Get-TokenSum $Totals[$_]) } | Select-Object -First 1
}

function Format-ThreadLine([System.Collections.IDictionary]$Totals) {
  $models = $Totals.Keys | Sort-Object { - (Get-TokenSum $Totals[$_]) } | ForEach-Object { "$_ $(Format-Tokens (Get-TokenSum $Totals[$_]))" }
  return "- Tokens del hilo: $(Format-Tokens (Get-TotalTokens $Totals)) — $($models -join '; ')"
}

function Format-DispatchLine([object[]]$Dispatches) {
  if ($Dispatches.Count -eq 0) { return '- Tokens de subagentes: no aplica' }
  $total = ($Dispatches | ForEach-Object { Get-TotalTokens $_.Totals } | Measure-Object -Sum).Sum
  $noun = if ($Dispatches.Count -eq 1) { 'despacho' } else { 'despachos' }
  $items = $Dispatches | ForEach-Object {
    "$($_.Description) $(Get-MainModel $_.Totals) $(Format-Tokens (Get-TotalTokens $_.Totals)) / $($_.Minutes) min"
  }
  return "- Tokens de subagentes: $(Format-Tokens $total) en $($Dispatches.Count) $noun — $($items -join '; ')"
}

function Get-ScopeCost([System.Collections.IDictionary]$Totals, [object]$Prices, [System.Collections.Generic.List[string]]$Missing) {
  $sum = 0.0
  foreach ($model in $Totals.Keys) {
    $cost = Get-ModelCost $Totals[$model] $Prices[$model]
    if ($null -eq $cost) { $Missing.Add($model) } else { $sum += $cost }
  }
  return $sum
}

function Format-CostLine([object]$Session, [object]$Prices) {
  if ($null -eq $Prices) { return '- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)' }
  $missing = [System.Collections.Generic.List[string]]::new()
  $threadCost = Get-ScopeCost $Session.Thread $Prices $missing
  $agentCost = Get-ScopeCost (Merge-Totals $Session.Dispatches) $Prices $missing
  if ($missing.Count -gt 0) { return "- Coste de la sesión: sin precio (modelos sin precio: $(($missing | Select-Object -Unique) -join ', '))" }
  if ($Session.Dispatches.Count -eq 0) { return "- Coste de la sesión: $(Format-Money $threadCost) `$ (hilo $(Format-Money $threadCost) `$)" }
  $parts = "hilo $(Format-Money $threadCost) `$ + subagentes $(Format-Money $agentCost) `$"
  return "- Coste de la sesión: $(Format-Money ($threadCost + $agentCost)) `$ ($parts)"
}

function Write-NotMeasured([string]$Reason) {
  foreach ($label in @('Tokens del hilo', 'Tokens de subagentes', 'Coste de la sesión')) {
    Write-Output "- ${label}: no medido ($Reason)"
  }
}

function Write-Report([object]$Session, [object]$Prices) {
  Write-Output '| Ámbito | Modelo | Entrada | Escritura 5m | Escritura 1h | Lectura | Salida | Total | Coste ($) |'
  Write-Output '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'
  Get-TableRows 'Hilo' $Session.Thread $Prices
  Get-TableRows 'Subagentes' (Merge-Totals $Session.Dispatches) $Prices
  Write-Output ''
  Write-Output (Format-ThreadLine $Session.Thread)
  Write-Output (Format-DispatchLine $Session.Dispatches)
  Write-Output (Format-CostLine $Session $Prices)
}

function Invoke-Measurement([string]$WorktreePath, [string]$Root, [string]$BranchName) {
  $folder = Get-TranscriptFolder $WorktreePath $Root
  if (-not (Test-Path -LiteralPath $folder)) {
    Write-NotMeasured "sin transcripts de Claude Code para $WorktreePath"
    return
  }
  $session = Read-Session $folder $BranchName
  if ($session.Thread.Count -eq 0 -and $session.Dispatches.Count -eq 0) {
    $subject = if ($BranchName) { $BranchName } else { 'ninguna rama' }
    Write-NotMeasured "sin respuestas de $subject en los transcripts"
    return
  }
  Write-Report $session (Read-Prices $WorktreePath)
}

$worktreePath = [System.IO.Path]::TrimEndingDirectorySeparator([System.IO.Path]::GetFullPath($Path, (Get-Location).Path))
# Llamado desde Git Bash, la consola hereda una página de códigos OEM y la raya y las tildes llegan corruptas.
$previousEncoding = [Console]::OutputEncoding
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
try { Invoke-Measurement $worktreePath $ProjectsRoot $Branch }
finally { [Console]::OutputEncoding = $previousEncoding }
