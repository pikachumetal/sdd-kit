# Sondeo: qué ve un hook de arranque (2026-11-01, Claude Code 2.1.316, Windows)

Tres sesiones `claude -p` con Haiku, un plugin de prueba y un hook de proyecto, los dos volcando su entrada. `--setting-sources project`.

| Sesión | ¿Skill en `init.skills`? | Hook del proyecto | Hook del plugin |
| --- | --- | --- | --- |
| Con `--plugin-dir` | sí | corre | corre |
| Sin plugin | no | corre | **no corre** |
| Con `--plugin-dir` y `--disable-slash-commands` | no | corre | corre |

- Entrada de los dos hooks: `session_id`, `transcript_path`, `cwd`, `hook_event_name`, `source`. Ninguna lista de skills ni de plugins.
- `CLAUDE_PLUGIN_ROOT` y `CLAUDE_PLUGIN_DATA` solo llegan al hook del plugin.

Conclusión: el hook del plugin no puede avisar de que el plugin no cargó, y ningún hook ve la lista de skills.
