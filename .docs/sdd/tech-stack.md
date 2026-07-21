# Tech Stack — sdd-kit

- **Contenido**: Markdown puro (SKILL.md con frontmatter YAML según la spec de agentskills.io + plantillas + evidencia de tests). Sin código ejecutable, sin build, sin CI (por ahora).
- **Distribución dual**:
  - Plugin de Claude Code: `.claude-plugin/plugin.json` (manifest, versión SemVer) + `.claude-plugin/marketplace.json` (source: `.`). Instalación: `/plugin marketplace add <ruta-o-repo>` + `/plugin install sdd-kit@sdd-kit`. Las skills quedan namespaced `sdd-kit:<skill>`.
  - CLI de agent skills: `npx skills add <org>/sdd-kit [-a claude-code] [--skill <nombre>]` — escanea `skills/<nombre>/SKILL.md` e instala la carpeta completa (auxiliares incluidos).
- **Dependencia**: plugin **superpowers** en el entorno del consumidor — las skills invocan `brainstorming`, `writing-plans`, `executing-plans`, `systematic-debugging`, `writing-skills` y `finishing-a-development-branch`.
- **Tests**: subagentes (Sonnet) sobre fixtures desechables ("Acme Orders", "TimeTrack") en el scratchpad de sesión. Sin framework: la evidencia es narrativa verificada en disco (`tests/*.md`). Orquestación de los runs con workflows multi-agente: rutas absolutas incrustadas en el script (los `args` llegan serializados), fixtures con git local propio, una copia de fixture por run, y verificación en disco además del autoinforme del agente; operaciones git de subagentes con `cd` explícito (su cwd de PowerShell no persiste).
- **Git**: rama única `master` por ahora; sin remoto configurado (pendiente — ver roadmap).
