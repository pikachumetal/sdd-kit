<#
.SYNOPSIS
Avisa en SessionStart si las skills y los agentes del kit no salen de la rama,
o si los hooks de git del repo no están activos.

.DESCRIPTION
Compara SDD_KIT_SESSION_ROOT con la carpeta del proyecto. Si no casan,
la sesión no se lanzó con Start-KitSession.ps1 (o desde otro worktree)
y las skills y los agentes sdd-kit:* pueden venir de la caché del plugin.
Aparte, si git config core.hooksPath no devuelve .githooks, el pre-commit
no corre y un commit creado no prueba nada (ticket del patch 0167 §1).
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
    return 'Las skills y los agentes del kit de esta sesión no salen de la rama: se cargaron desde la caché del plugin. Si no lanzaste la sesión con ./Start-KitSession.ps1, sal y relánzala con él; para reanudar esta, ./Start-KitSession.ps1 --resume o --continue con los mismos argumentos.'
  }
  return "Las skills y los agentes del kit de esta sesión no salen de la rama: la sesión se lanzó con Start-KitSession.ps1 desde $SessionRoot, pero el proyecto es $ProjectDir. Relánzala con ./Start-KitSession.ps1 desde el proyecto; para reanudar esta, --resume o --continue con los mismos argumentos."
}

$sourceContext = 'Las skills y los agentes sdd-kit:* de esta sesión no salen de la rama actual: vienen de la caché del plugin o de otra carpeta. Antes de ejecutar un paso de una skill cargada, contrasta su texto con skills/<nombre>/SKILL.md de la rama; si difieren, manda el de la rama. Si una skill no resuelve (Unknown skill), léela con Read de skills/<nombre>/SKILL.md de la rama y sigue su checklist.'
$hooksMessage = 'Los hooks de git de este clon no están activos: el pre-commit no corre. Actívalos una vez por clon con: git config core.hooksPath .githooks'
$hooksContext = 'git config core.hooksPath no devuelve .githooks: el pre-commit no corre en esta sesión, y un commit creado no prueba que pasó. No escribas «pre-commit en verde» sin haber ejecutado sus comprobaciones.'

function Write-SessionStartWarning([string[]]$SystemMessages, [string[]]$Contexts) {
  $payload = @{
    systemMessage     = $SystemMessages -join ' '
    hookSpecificOutput = @{
      hookEventName     = 'SessionStart'
      additionalContext = $Contexts -join ' '
    }
  }
  $payload | ConvertTo-Json -Compress -Depth 3 -EscapeHandling EscapeNonAscii
}

$sessionRoot = $env:SDD_KIT_SESSION_ROOT
$projectDir = if ($env:CLAUDE_PROJECT_DIR) { $env:CLAUDE_PROJECT_DIR } else { (Get-Location).Path }
$normalizedSessionRoot = if ($sessionRoot) { Get-NormalizedPath $sessionRoot } else { $null }

$messages = @()
$contexts = @()
if (-not ($normalizedSessionRoot -and $normalizedSessionRoot -eq (Get-NormalizedPath $projectDir))) {
  $messages += New-SessionSourceMessage $sessionRoot $projectDir
  $contexts += $sourceContext
}
if ((git -C $projectDir config --get core.hooksPath 2>$null) -ne '.githooks') {
  $messages += $hooksMessage
  $contexts += $hooksContext
}
if ($messages) { Write-SessionStartWarning $messages $contexts }
exit 0
