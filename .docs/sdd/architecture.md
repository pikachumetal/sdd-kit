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
│   ├── sdd-start-patch/SKILL.md
│   ├── sdd-end-patch/SKILL.md
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
4. **Predicados**: los módulos opcionales se condicionan a ficheros observables, no a configuración. Un predicado bien escrito no solo clasifica: **da forma al trabajo**. En el GREEN del modo lite, el agente acotó el alcance de la spec para dejar fuera un fichero de contrato público y así cumplir una de las condiciones — el predicado se usó como herramienta de diseño, no solo como filtro de entrada. Cuando el predicado habilita un atajo, quien lo activa es el usuario: **habilitar y activar son cosas distintas**, y esa separación es lo que impide que el agente se autoconceda el atajo.
5. **Red flags + tabla de racionalizaciones**: construidas con las frases textuales de los baselines (solo skills de disciplina; las de forma usan receta/contrato).
6. **Ficheros auxiliares (`references/`)**: un bloque baja a `references/<tema>.md` solo si **(a)** aplica a un subconjunto de invocaciones, no a todas, y **(b)** se necesita después de decidir, no para decidir. Cumplir (a)+(b) lo hace *candidato*; quien decide es el A/B (Art. I). Se referencia con enlace relativo en el punto exacto del flujo, nunca con `@`, que fuerza la carga y quema contexto. El harness inyecta `Base directory for this skill` al invocar y **no** carga los auxiliares por su cuenta: lo que gobierna la decisión se queda en el `SKILL.md`. El estado del arte respalda ese reparto — en superpowers 6.3.0 las skills con auxiliares son las más largas (`subagent-driven-development` 4823 palabras con 6 auxiliares), y sus auxiliares son contenido condicional (mapeo por harness), no troceado del flujo; lo que se mantiene pequeño es lo cargado en toda sesión (`using-superpowers`, 485 palabras).

## Anatomía de la evidencia (tests/)

- `<skill>-red.md`: qué hizo el baseline sin la skill, con racionalizaciones citadas y positivos que no requieren guidance.
- `<skill>-green.md`: mismos escenarios con la skill; veredicto contra cada fallo del RED. El GREEN también puede exhibir huecos de la PROPIA skill (una instrucción que contradice la constitution, un caso sin cubrir): el REFACTOR y su re-verificación se documentan en el mismo fichero.
- `<skill>-ab.md`: campaña de no-regresión de un recorte (Art. I). Registra los cortes probados, los aceptados y **los descartados con su motivo** — el descarte es el dato caro: evita que la siguiente campaña repita el experimento.
- Las fixtures son desechables y viven en el scratchpad de sesión — no se versionan; lo durable es la narrativa verificada.

## Relación con los proyectos consumidores

El kit se instala (plugin o CLI); cada proyecto añade encima sus skills de nivel 2 (por stack) y nivel 3 (propias), y sus documentos de anclaje en `.docs/sdd/`. Las skills del kit leen el proyecto por predicados — el mismo kit sirve para un greenfield con TDD y un legacy sin tests sin tocar una línea.
