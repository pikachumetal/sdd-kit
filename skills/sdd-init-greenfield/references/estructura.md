# Estructura objetivo de `.docs/sdd/` — la fija el kit, no se rediseña


```text
/
├── CLAUDE.md                 (corto: punteros + 3-5 reglas críticas)
├── .docs/
│   └── sdd/
│       ├── mission.md        (por qué existe, usuarios/roles, dominio)
│       ├── constitution.md   (principios no negociables)
│       ├── tech-stack.md     (tecnologías con versiones; decisiones abiertas, como abiertas)
│       ├── architecture.md   (cómo se construye)
│       ├── funcional/         (vacía: una capacidad por fichero, las crean las tasks)
│       ├── roadmap.md        (módulos identificados + deuda + tabla de patches)
│       ├── estimation.md     (método) · estimation-log.md (VACÍO: se llena con las tareas)
│       └── specs/            (vacía)
```

Sin carpeta `templates/`: las plantillas viven en el skill `sdd-templates` del kit y se calcan al crear cada artefacto.

Nunca `docs/`, `docs/superpowers/` ni taxonomías propias (ADRs sueltos, glosarios aparte): las decisiones técnicas viven en constitution/architecture y el lenguaje del dominio en mission.

