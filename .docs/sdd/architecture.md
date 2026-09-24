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
│   ├── sdd-feedback/SKILL.md
│   ├── add-to-changelog/SKILL.md
│   └── sdd-templates/           (SKILL.md índice + templates/*.md — fuente única, artefactos y documentos de anclaje + scripts/)
├── hooks/                       (hook SessionStart del plugin: hooks.json, session-start en bash con LF, router.md — solo canal plugin)
├── .claude/                     (settings.json del repo y hooks/Test-KitSessionSource.ps1: aviso de skills cargadas fuera de la rama)
├── tests/                       (evidencia RED/GREEN por skill + *.Tests.ps1 y fixtures/ de los scripts)
└── .docs/
    ├── workflow/                (documentación temprana del flujo: greenfield, brownfield, anexo de evidencia)
    └── sdd/                     (artefactos SDD del propio kit — dogfooding)
        └── capabilities/           (verdad viva por capacidad: un fichero por sustantivo del dominio, fusionado desde el delta de cada spec)
```

## Anatomía de una skill del kit

**Placeholders de una receta**: todo hueco de una plantilla o receta declara **su tipo con un ejemplo real del dominio del documento** ([walkthrough](specs/<carpeta>/walkthrough.md)), no solo su contenido semántico. Con <enlace> a secas, dos sujetos escribieron un enlace Markdown y dos la ruta suelta; con el tipo y el ejemplo, 2 de 2 (task 0018, 2026-09-22).

1. **Frontmatter**: `name` (inglés kebab) + `description` que SOLO describe cuándo usarla (nunca resume el workflow — los agentes seguirían la description y se saltarían el cuerpo). Opcionales en uso desde la task 0014: `argument-hint` en las skills de arranque y `user-invocable: false` en `sdd-templates`; descartados `paths` (oculta la `description` hasta tocar un fichero) y `disable-model-invocation`. `claude plugin validate --strict` los acepta; fuera de Claude Code no está verificado.
2. **Overview**: principio en 1-2 frases.
3. **Gates/checklist**: pasos numerados; los ⛔ marcan puntos de parada que requieren al usuario.
4. **Predicados**: los módulos opcionales se condicionan a ficheros observables, no a configuración — `estimation.md` (estimación y tiempo real), `changelog.md` (entrada al cerrar), `architecture.md` (se lee en el contexto), `capabilities/<capability>.md` (desde T5: verdad viva del comportamiento, fusionada desde el delta de cada spec al cerrar) y, desde T4, `environments.md` (entorno por worktree: `env:setup` tras crear el worktree, `env:clean` antes de borrarlo; el worktree en sí lo gestiona superpowers). Un predicado bien escrito no solo clasifica: **da forma al trabajo**. En el GREEN del modo lite, el agente acotó el alcance de la spec para dejar fuera un fichero de contrato público y así cumplir una de las condiciones — el predicado se usó como herramienta de diseño, no solo como filtro de entrada. Cuando el predicado habilita un atajo, quien lo activa es el usuario: **habilitar y activar son cosas distintas**, y esa separación es lo que impide que el agente se autoconceda el atajo.
5. **Red flags + tabla de racionalizaciones**: construidas con las frases textuales de los baselines (solo skills de disciplina; las de forma usan receta/contrato).
6. **Ficheros auxiliares (`references/`)**: un bloque baja a `references/<tema>.md` solo si **(a)** aplica a un subconjunto de invocaciones, no a todas, y **(b)** se necesita después de decidir, no para decidir. Cumplir (a)+(b) lo hace *candidato*; quien decide es el A/B (Art. I). Se referencia con enlace relativo en el punto exacto del flujo, nunca con `@`, que fuerza la carga y quema contexto. El harness inyecta `Base directory for this skill` al invocar y **no** carga los auxiliares por su cuenta: lo que gobierna la decisión se queda en el `SKILL.md`. Medido en la task 0013: con la regla del destino que falta solo en `sdd-end-task/references/aprendizajes-skills.md`, 0/2 sujetos leyeron el fichero; al subirla al paso 4 del `SKILL.md`, 3/3. Segunda medición en la task 0026: `overrides-superpowers.md`, que el paso 6 solo nombra al pie, no la abrió 1 de 2 sujetos, y los dos leyeron los auxiliares que el paso nombra donde se usan. Con un puntero en uno de esos (`encargo-revision.md`), 2/2. El estado del arte respalda ese reparto — en superpowers 6.3.0 las skills con auxiliares son las más largas (`subagent-driven-development` 4823 palabras con 6 auxiliares), y sus auxiliares son contenido condicional (mapeo por harness), no troceado del flujo; lo que se mantiene pequeño es lo cargado en toda sesión (`using-superpowers`, 485 palabras).

## Anatomía de la evidencia (tests/)

- `<skill>-red.md`: qué hizo el baseline sin la skill, con racionalizaciones citadas y positivos que no requieren guidance.
- `<skill>-green.md`: mismos escenarios con la skill; veredicto contra cada fallo del RED. El GREEN también puede exhibir huecos de la PROPIA skill (una instrucción que contradice la constitution, un caso sin cubrir): el REFACTOR y su re-verificación se documentan en el mismo fichero.
- `<skill>-ab.md`: campaña de no-regresión de un recorte (Art. I). Registra los cortes probados, los aceptados y **los descartados con su motivo** — el descarte es el dato caro: evita que la siguiente campaña repita el experimento.
- Las fixtures de las campañas de skills se construyen en el scratchpad de sesión; lo que se versiona, en la carpeta de la spec (`red/`, `green/`), es el molde, el lanzador y lo que produjo cada sujeto, para que la narrativa verificada de `tests/*.md` apunte a ficheros que se pueden abrir (desde la task 0002).
- `<script>.Tests.ps1`: tests Pester del código ejecutable del kit. Sus fixtures en `tests/fixtures/<tema>/` **sí se versionan**: son el contrato del formato que el script lee (líneas reales de walkthroughs y patches del kit y de Alybo). Todo `<script>.Tests.ps1` que ejecute git dot-sourcea `tests/Clear-GitEnv.ps1`, guarda `Clear-GitEnv` en `BeforeAll` y llama a `Restore-GitEnv` en `AfterAll`: dentro del pre-commit, git exporta `GIT_INDEX_FILE` y compañía, y una fixture de la task 0042 escribió en el índice del worktree real. Lo exige `tests/GitEnvConvention.Tests.ps1`.
- **Scripts portables**: el código ejecutable del kit es PowerShell 7 porque todo el equipo usa Windows, pero sin APIs exclusivas de Windows (rutas con `\` fijas, `cmd.exe`, el registro): llevarlo a macOS o Linux tiene que ser instalar `pwsh`, no reescribir (decisión del 2026-09-25 en el roadmap).

## Relación con los proyectos consumidores

El kit se instala (plugin o CLI); cada proyecto añade encima sus skills de nivel 2 (por stack) y nivel 3 (propias), y sus documentos de anclaje en `.docs/sdd/`. Las skills del kit leen el proyecto por predicados — el mismo kit sirve para un greenfield con TDD y un legacy sin tests sin tocar una línea.
