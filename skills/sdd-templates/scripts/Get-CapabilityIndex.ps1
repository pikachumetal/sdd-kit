<#
.SYNOPSIS
  Lista las capacidades de un proyecto SDD con su propósito: el índice, generado al vuelo y nunca guardado.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lee <Path>/capabilities/*.md y escribe, en orden de nombre, una
  línea Markdown por capacidad: «- `<nombre>` — <propósito>», con el propósito de su sección «## Propósito» en una
  sola línea y sin las líneas de ayuda «>». Una capacidad sin propósito sale con «(sin propósito)». Sin capacidades
  escribe «Sin capacidades». Sale siempre con 0: listar no valida; eso lo hace Test-Capabilities.ps1.
.EXAMPLE
  pwsh -NoProfile -File Get-CapabilityIndex.ps1 -Path .docs/sdd
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$Path
)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot 'CapabilitySections.ps1')

function Format-IndexLine([System.IO.FileInfo]$File) {
  $purpose = Get-CapabilityPurpose @(Get-Content -Encoding utf8 -Path $File.FullName)
  if (-not $purpose) { $purpose = '(sin propósito)' }
  return "- ``$($File.BaseName)`` — $purpose"
}

function Get-IndexLines([string]$SddPath) {
  $capabilitiesDir = Join-Path $SddPath 'capabilities'
  if (-not (Test-Path $capabilitiesDir)) { return @('Sin capacidades') }
  $files = @(Get-ChildItem -Path $capabilitiesDir -Filter '*.md' -File | Sort-Object Name)
  if (-not $files) { return @('Sin capacidades') }
  return @($files | ForEach-Object { Format-IndexLine $_ })
}

$previousEncoding = [Console]::OutputEncoding
try {
  [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  Get-IndexLines $Path | ForEach-Object { Write-Output $_ }
}
finally {
  [Console]::OutputEncoding = $previousEncoding
}
exit 0
