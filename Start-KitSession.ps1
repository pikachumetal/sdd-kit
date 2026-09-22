# Arranca Claude Code con las skills del working tree y el plugin publicado deshabilitado.
# Sin esto, el .claude/settings.json del repo activa sdd-kit@sdd-kit y las skills salen de la caché.
# Los argumentos extra pasan tal cual: ./Start-KitSession.ps1 --model sonnet
claude --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir $PSScriptRoot @args
