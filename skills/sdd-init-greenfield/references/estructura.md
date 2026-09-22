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
│       ├── capabilities/         (vacía: una capacidad por fichero, las crean las tasks)
│       ├── roadmap.md        (módulos identificados + deuda + tabla de patches · calca roadmap-template.md)
│       ├── estimation.md     (método · calca estimation-template.md) · estimation-log.md (lo genera Build-EstimationLog.ps1: cabecera y 0 filas)
│       ├── changelog.md      (opcional, según entrevista · calca changelog-template.md)
│       ├── sdd-kit.json      (versión del kit aplicada: { "version", "channel": "plugin"|"cli", "updated", "ids": { "mode" }, "control"?, "merge"? }, con `ids.mode` de la pregunta 14; `control` y `merge`, solo con lo respondido)
│       └── specs/            (vacía)
```

Sin carpeta `templates/`: las plantillas viven en el skill `sdd-templates` del kit y se calcan al crear cada documento. **Calcar** es seguir las secciones y las cabeceras de tabla de la plantilla con el contenido de la entrevista; nunca copiar el documento equivalente del `.docs/` del kit ni de otro proyecto, que arrastra notas y decisiones ajenas.

Nunca `docs/`, `docs/superpowers/` ni taxonomías propias (ADRs sueltos, glosarios aparte): las decisiones técnicas viven en constitution/architecture y el lenguaje del dominio en mission.

