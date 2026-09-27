# Arranca Claude Code con las skills del working tree y el plugin publicado deshabilitado.
# Sin esto, el .claude/settings.json del repo activa sdd-kit@sdd-kit y las skills salen de la caché.
# Los argumentos extra pasan tal cual: ./Start-KitSession.ps1 --model sonnet
# SDD_KIT_SESSION_ROOT le dice al hook SessionStart del repo que la sesión salió de aquí; se restaura
# al salir para que un `claude` posterior en la misma terminal sí reciba el aviso.
$previousSessionRoot = $env:SDD_KIT_SESSION_ROOT
$env:SDD_KIT_SESSION_ROOT = $PSScriptRoot
try {
  claude --dangerously-skip-permissions --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir $PSScriptRoot @args
}
finally {
  if ($null -eq $previousSessionRoot) { Remove-Item -LiteralPath Env:\SDD_KIT_SESSION_ROOT -ErrorAction SilentlyContinue }
  else { $env:SDD_KIT_SESSION_ROOT = $previousSessionRoot }
}
