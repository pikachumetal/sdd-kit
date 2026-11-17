# Prueba de instalación (feature 0300)

Claude Code 2.1.317 (Claude Code), `CLAUDE_CONFIG_DIR` aislado y un marketplace git servido por HTTP en local. Generado por `install.mjs` el 2026-11-03.

| Escenario | Caché | Ficheros | Tamaño (suma de bytes) |
| --- | --- | --- | --- |
| 2.3.4 instalada con `"source": "."` | .agents, .claude, .claude-plugin, .docs, .gitattributes, .githooks, .github, .gitignore, .in_use, .moon, .orphaned_at, .prototools, CLAUDE.md, LICENSE, README.md, THIRD_PARTY_NOTICES.md, agents, cli, hooks, moon.yml, package.json, pnpm-lock.yaml, pnpm-workspace.yaml, skills, skills-lock.json, start-kit-session.mjs, tests | 20136 | 70,7 MB |
| Actualizada a 2.3.5 con `"./dist"` commiteado | .claude-plugin, .in_use, LICENSE, THIRD_PARTY_NOTICES.md, agents, cli, hooks, skills | 234 | 1,1 MB |

La rama `dist` autorreferenciada (fuente `url`, `ref: dist`) dio la misma caché en la apertura (234 ficheros; `du`, que cuenta bloques, dio 1,6 MB), con un `dist/` hecho a mano; no se repite porque se eligió `dist/` commiteado (ADR 0023). Versiones: 2.3.4 → 2.3.5.

| Comprobación | Cumple | Detalle |
| --- | --- | --- |
| Solo la lista blanca en la caché nueva | sí | nada más |
| Ninguna línea `<!-- kit:` en sus `.md` | sí | ninguna |
| La 2.3.4 queda con `.orphaned_at` | sí | sí |
| El hook `session-start` desde la caché entrega `using-sdd` sin stderr | sí | sí |
