# Estructura objetivo de `.docs/sdd/` — la fija el kit, no se rediseña


```text
/
├── CLAUDE.md                 (corto: punteros + 3-5 reglas críticas)
├── .claude/settings.json     ("autoMemoryEnabled": false, fusionado con lo que ya tenga)
├── .gitignore                (+ .playwright-mcp/ y .superpowers/)
├── .docs/
│   └── sdd/
│       ├── mission.md        (por qué existe, usuarios/roles, dominio · calca mission-template.md)
│       ├── constitution.md   (principios no negociables · calca constitution-template.md)
│       ├── tech-stack.md     (tecnologías con versiones; decisiones abiertas, como abiertas · calca tech-stack-template.md)
│       ├── architecture.md   (cómo se construye · calca architecture-template.md)
│       ├── capabilities/     (no se crea: nace con la primera task que declara una capacidad, o con el volcado inicial del paso 6)
│       ├── roadmap.md        (módulos identificados + deuda + tabla de patches · calca roadmap-template.md)
│       ├── estimation.md     (método · calca estimation-template.md) · estimation-log.md (lo genera Build-EstimationLog.ps1: cabecera y 0 filas)
│       ├── changelog.md      (opcional, según entrevista · calca changelog-template.md)
│       ├── sdd-kit.json      (versión del kit aplicada: { "version", "channel": "plugin"|"cli", "updated", "ids": { "mode" }, "control"?, "merge"?, "execution"? }, con `ids.mode` de la pregunta 14; `control`, `merge` y `execution`, solo con lo respondido)
│       ├── sources/          (opcional: el funcional que aporta el usuario, literal y sin editar · paso 3)
│       └── specs/            (no se crea: nace con la primera task o patch)
```

Git no versiona carpetas vacías: ninguna carpeta de `.docs/sdd/` se crea vacía ni con `.gitkeep`.

Sin carpeta `templates/`: las plantillas viven en el skill `sdd-templates` del kit y se calcan al crear cada documento. **Calcar** es seguir las secciones y las cabeceras de tabla de la plantilla con el contenido de la entrevista; nunca copiar el documento equivalente del `.docs/` del kit ni de otro proyecto, que arrastra notas y decisiones ajenas.

Nunca `docs/`, `docs/superpowers/` ni taxonomías propias (ADRs sueltos, glosarios aparte): las decisiones técnicas viven en constitution/architecture y el lenguaje del dominio en mission.

