<#
.SYNOPSIS
Avisa en SessionStart si las skills del kit no salen de la rama.

.DESCRIPTION
Compara SDD_KIT_SESSION_ROOT con la carpeta del proyecto. Si no casan,
la sesión no se lanzó con Start-KitSession.ps1 (o desde otro worktree)
y las skills sdd-kit:* pueden venir de la caché del plugin.
#>

function Get-NormalizedPath([string]$Path) {
  try {
    $fullPath = [IO.Path]::GetFullPath($Path)
  }
  catch {
    return $null
  }
  return $fullPath.TrimEnd('\', '/').Replace('\', '/').ToLowerInvariant()
}

function New-SessionSourceMessage([string]$SessionRoot, [string]$ProjectDir) {
  if ([string]::IsNullOrEmpty($SessionRoot)) {
    return 'Las skills del kit de esta sesión no salen de la rama: se cargaron desde la caché del plugin. Si no lanzaste la sesión con ./Start-KitSession.ps1, sal y relánzala con él.'
  }
  return "Las skills del kit de esta sesión no salen de la rama: la sesión se lanzó con Start-KitSession.ps1 desde $SessionRoot, pero el proyecto es $ProjectDir. Relánzala con ./Start-KitSession.ps1 desde el proyecto."
}

function Write-SessionSourceWarning([string]$SystemMessage) {
  $additionalContext = 'Las skills sdd-kit:* de esta sesión no salen de la rama actual: vienen de la caché del plugin o de otra carpeta. Antes de ejecutar un paso de una skill cargada, contrasta su texto con skills/<nombre>/SKILL.md de la rama; si difieren, manda el de la rama.'
  $payload = @{
    systemMessage     = $SystemMessage
    hookSpecificOutput = @{
      hookEventName     = 'SessionStart'
      additionalContext = $additionalContext
    }
  }
  $payload | ConvertTo-Json -Compress -Depth 3 -EscapeHandling EscapeNonAscii
}

$sessionRoot = $env:SDD_KIT_SESSION_ROOT
$projectDir = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
$normalizedSessionRoot = if ($sessionRoot) { Get-NormalizedPath $sessionRoot } else { $null }

if ($normalizedSessionRoot -and $normalizedSessionRoot -eq (Get-NormalizedPath $projectDir)) {
  exit 0
}

Write-SessionSourceWarning (New-SessionSourceMessage $sessionRoot $projectDir)
exit 0
