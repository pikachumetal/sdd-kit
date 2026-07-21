# Architecture — sdd-kit

## Estructura del repo

```text
/
├── CLAUDE.md                    (punteros + reglas críticas)
├── README.md                    (instalación y catálogo)
├── .claude-plugin/
│   ├── plugin.json              (manifest del plugin, versión)
│   └── marketplace.json         (marketplace self-hosted, source ".")
├── skills/
│   ├── sdd-init-greenfield/SKILL.md
│   ├── sdd-init-brownfield/SKILL.md
│   ├── sdd-start-task/SKILL.md
│   ├── sdd-end-task/SKILL.md
│   ├── sdd-start-hotfix/SKILL.md
│   ├── sdd-end-hotfix/SKILL.md
│   ├── sdd-start-release/SKILL.md
│   ├── sdd-end-release/SKILL.md
│   ├── sdd-consult/SKILL.md
│   ├── add-to-changelog/SKILL.md
│   └── sdd-templates/           (SKILL.md índice + templates/*.md — fuente única)
├── tests/                       (evidencia RED/GREEN por skill)
└── .docs/
    ├── flux/                    (documentos de flujo del equipo, en catalán)
    └── sdd/                     (artefactos SDD del propio kit — dogfooding)
```

## Anatomía de una skill del kit

1. **Frontmatter**: `name` (inglés kebab) + `description` que SOLO describe cuándo usarla (nunca resume el workflow — los agentes seguirían la description y se saltarían el cuerpo).
2. **Overview**: principio en 1-2 frases.
3. **Gates/checklist**: pasos numerados; los ⛔ marcan puntos de parada que requieren al usuario.
4. **Predicados**: los módulos opcionales se condicionan a ficheros observables, no a configuración.
5. **Red flags + tabla de racionalizaciones**: construidas con las frases textuales de los baselines (solo skills de disciplina; las de forma usan receta/contrato).

## Anatomía de la evidencia (tests/)

- `<skill>-red.md`: qué hizo el baseline sin la skill, con racionalizaciones citadas y positivos que no requieren guidance.
- `<skill>-green.md`: mismos escenarios con la skill; veredicto contra cada fallo del RED. El GREEN también puede exhibir huecos de la PROPIA skill (una instrucción que contradice la constitution, un caso sin cubrir): el REFACTOR y su re-verificación se documentan en el mismo fichero.
- Las fixtures son desechables y viven en el scratchpad de sesión — no se versionan; lo durable es la narrativa verificada.

## Relación con los proyectos consumidores

El kit se instala (plugin o CLI); cada proyecto añade encima sus skills de nivel 2 (por stack) y nivel 3 (propias), y sus documentos de anclaje en `.docs/sdd/`. Las skills del kit leen el proyecto por predicados — el mismo kit sirve para un greenfield con TDD y un legacy sin tests sin tocar una línea.
