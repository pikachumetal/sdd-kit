# Arranca Claude Code con las skills del working tree y el plugin publicado deshabilitado.
# Sin esto, el .claude/settings.json del repo activa sdd-kit@sdd-kit y las skills salen de la caché.
# Los argumentos extra pasan tal cual: ./Start-KitSession.ps1 --model sonnet
# SDD_KIT_SESSION_ROOT le dice al hook SessionStart del repo que la sesión salió de aquí; se restaura
# al salir para que un `claude` posterior en la misma terminal sí reciba el aviso.
function Restore-EnvVar([string]$Name, $Value) {
  if ($null -eq $Value) { Remove-Item -LiteralPath "Env:\$Name" -ErrorAction SilentlyContinue }
  else { Set-Item -LiteralPath "Env:\$Name" -Value $Value }
}

$previousSessionRoot = $env:SDD_KIT_SESSION_ROOT
$previousTmpDir = $env:CLAUDE_CODE_TMPDIR
$env:SDD_KIT_SESSION_ROOT = $PSScriptRoot
# CLAUDE_CODE_TMPDIR lleva el scratchpad y las salidas en segundo plano a .temp/, que muere con el worktree;
# Claude Code no lo borra nunca y en los settings del proyecto se ignora.
$env:CLAUDE_CODE_TMPDIR = Join-Path $PSScriptRoot '.temp'
try {
  claude --dangerously-skip-permissions --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir $PSScriptRoot @args
}
finally {
  Restore-EnvVar 'SDD_KIT_SESSION_ROOT' $previousSessionRoot
  Restore-EnvVar 'CLAUDE_CODE_TMPDIR' $previousTmpDir
}
